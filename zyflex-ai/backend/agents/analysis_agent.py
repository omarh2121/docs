from typing import Any, Dict

from .. import processor

_PERIOD_LABELS = {
    "morning_rush": "Morgenrush",
    "mid_morning": "Formiddag",
    "lunch": "Frokosttid",
    "afternoon": "Eftermiddag",
    "evening_rush": "Eftermiddagsrush",
    "evening": "Aftentid",
    "late_night": "Senaften",
    "night": "Nat",
}


class AnalysisAgent:
    name = "Analysis Agent"

    def run(self, signals: Dict[str, Any]) -> Dict[str, Any]:
        zone_scores = processor.score_zones(signals)
        demand = processor.overall_demand(zone_scores)
        top = zone_scores[0] if zone_scores else {}

        return {
            "zone_scores": zone_scores,
            "overall_demand": demand,
            "demand_label": processor.demand_label(demand),
            "earning_potential": processor.earning_potential(demand),
            "time_label": _PERIOD_LABELS.get(signals.get("time_period", ""), ""),
            "status": "ok",
            "last_result": f"Top: {top.get('zone','–')} ({top.get('score','–')})",
        }
