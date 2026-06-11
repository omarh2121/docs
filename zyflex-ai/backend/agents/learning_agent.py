import json
import logging
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, List, Optional, Protocol, runtime_checkable

from ..config import FEEDBACK_DATA_PATH as _FEEDBACK_PATH

log = logging.getLogger(__name__)


@runtime_checkable
class LearningBackend(Protocol):
    def get_accuracy(self, entity_type: str, city: str) -> float: ...
    def get_score_adjustment(self, entity_name: str) -> float: ...
    def get_report(self) -> Dict[str, Any]: ...


class StatisticsBackend:
    def __init__(self, path: Path):
        self._path = path

    def _load(self) -> List[dict]:
        if not self._path.exists():
            return []
        records: List[dict] = []
        try:
            for line in self._path.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if line:
                    records.append(json.loads(line))
        except Exception as exc:
            log.warning("feedback read error: %s", exc)
        return records

    def get_accuracy(self, entity_type: str, city: str) -> float:
        records = self._load()
        group = [r for r in records if r.get("entity_type") == entity_type and r.get("city") == city]
        if len(group) < 3:
            return 0.0
        pos = sum(1 for r in group if r.get("feedback") == "positive")
        return pos / len(group)

    def get_score_adjustment(self, entity_name: str) -> float:
        records = self._load()
        group = [r for r in records if r.get("entity_name") == entity_name]
        if len(group) < 3:
            return 0.0
        pos = sum(1 for r in group if r.get("feedback") == "positive")
        accuracy = pos / len(group)
        if accuracy > 0.75:
            return 5.0
        if accuracy < 0.40:
            return -10.0
        return 0.0

    def get_report(self) -> Dict[str, Any]:
        records = self._load()
        if not records:
            return {
                "total_feedback": 0,
                "positive_count": 0,
                "negative_count": 0,
                "accuracy_overall": None,
                "by_category": {},
                "by_city": {},
                "by_recommendation_type": {},
                "top_performing": [],
                "suggested_improvements": ["Ingen feedback endnu – brug 👍/👎 for at træne systemet"],
                "has_data": False,
                "status": "ok",
            }

        pos_total = sum(1 for r in records if r.get("feedback") == "positive")
        neg_total = len(records) - pos_total
        accuracy_overall = round(pos_total / len(records), 2)

        # By category
        by_cat: Dict[str, dict] = defaultdict(lambda: {"positive": 0, "negative": 0})
        for r in records:
            cat = r.get("entity_type", "Ukendt")
            if r.get("feedback") == "positive":
                by_cat[cat]["positive"] += 1
            else:
                by_cat[cat]["negative"] += 1

        by_category: Dict[str, Any] = {}
        for cat, counts in by_cat.items():
            total = counts["positive"] + counts["negative"]
            acc = round(counts["positive"] / total, 2) if total else 0.0
            label = "Excellent" if acc >= 0.80 else "Okay" if acc >= 0.60 else "Lav"
            by_category[cat] = {"accuracy": acc, "count": total, "label": label}

        # By city
        by_city_raw: Dict[str, dict] = defaultdict(lambda: {"positive": 0, "negative": 0})
        for r in records:
            city = r.get("city", "Ukendt")
            if r.get("feedback") == "positive":
                by_city_raw[city]["positive"] += 1
            else:
                by_city_raw[city]["negative"] += 1

        by_city: Dict[str, Any] = {}
        for city, counts in by_city_raw.items():
            total = counts["positive"] + counts["negative"]
            acc = round(counts["positive"] / total, 2) if total else 0.0
            by_city[city] = {"accuracy": acc, "count": total}

        # By recommendation_type
        by_rec_raw: Dict[str, dict] = defaultdict(lambda: {"positive": 0, "negative": 0})
        for r in records:
            rec_type = r.get("recommendation_type", "Ukendt")
            if r.get("feedback") == "positive":
                by_rec_raw[rec_type]["positive"] += 1
            else:
                by_rec_raw[rec_type]["negative"] += 1

        by_recommendation_type: Dict[str, Any] = {}
        for rec_type, counts in by_rec_raw.items():
            total = counts["positive"] + counts["negative"]
            acc = round(counts["positive"] / total, 2) if total else 0.0
            by_recommendation_type[rec_type] = {"accuracy": acc, "count": total}

        # Top performing entities (min 3 data points)
        entity_stats: Dict[str, dict] = defaultdict(lambda: {"positive": 0, "negative": 0, "city": ""})
        for r in records:
            name = r.get("entity_name", "Ukendt")
            entity_stats[name]["city"] = r.get("city", "")
            if r.get("feedback") == "positive":
                entity_stats[name]["positive"] += 1
            else:
                entity_stats[name]["negative"] += 1

        top_performing = []
        for name, counts in entity_stats.items():
            total = counts["positive"] + counts["negative"]
            if total >= 3:
                acc = round(counts["positive"] / total, 2)
                top_performing.append({"entity_name": name, "accuracy": acc, "count": total, "city": counts["city"]})
        top_performing.sort(key=lambda x: x["accuracy"], reverse=True)
        top_performing = top_performing[:5]

        # Suggested improvements
        improvements = []
        for cat, data in by_category.items():
            if data["count"] >= 3 and data["accuracy"] < 0.50:
                improvements.append(
                    f"{cat}-leads konverterer kun {round(data['accuracy'] * 100)}% – overvej at justere strategi"
                )
        for city, data in by_city.items():
            if data["count"] >= 3 and data["accuracy"] < 0.50:
                improvements.append(
                    f"Leads i {city} performer svagt ({round(data['accuracy'] * 100)}% konvertering)"
                )
        if not improvements:
            improvements = ["Systemet performer godt – fortsæt med at give feedback"]

        return {
            "total_feedback": len(records),
            "positive_count": pos_total,
            "negative_count": neg_total,
            "accuracy_overall": accuracy_overall,
            "by_category": by_category,
            "by_city": by_city,
            "by_recommendation_type": by_recommendation_type,
            "top_performing": top_performing,
            "suggested_improvements": improvements,
            "has_data": True,
            "status": "ok",
        }


class LearningAgent:
    name = "LearningAgent"

    def __init__(self, backend: Optional[LearningBackend] = None):
        self._backend = backend or StatisticsBackend(_FEEDBACK_PATH)

    def report(self) -> Dict[str, Any]:
        try:
            return self._backend.get_report()
        except Exception as exc:
            log.error("learning report error: %s", exc)
            return {
                "total_feedback": 0,
                "positive_count": 0,
                "negative_count": 0,
                "accuracy_overall": None,
                "by_category": {},
                "by_city": {},
                "by_recommendation_type": {},
                "top_performing": [],
                "suggested_improvements": ["Fejl ved hentning af læringsdata"],
                "has_data": False,
                "status": "error",
            }

    def get_score_adjustment(self, entity_name: str, entity_type: str, city: str) -> float:
        try:
            return self._backend.get_score_adjustment(entity_name)
        except Exception:
            return 0.0
