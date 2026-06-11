import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List
from zoneinfo import ZoneInfo

import requests

from ..config import DEMAND_LOG_PATH as _LOG_PATH

log = logging.getLogger(__name__)

CITY_COORDS: Dict[str, tuple] = {
    "København": (55.6761, 12.5683),
    "Kobenhavn": (55.6761, 12.5683),
    "Copenhagen": (55.6761, 12.5683),
    "Horsens": (55.8607, 9.8501),
    "Aarhus": (56.1629, 10.2039),
    "Odense": (55.3959, 10.3883),
    "Aalborg": (57.0488, 9.9217),
    "Vejle": (55.7094, 9.5350),
    "Randers": (56.4607, 10.0369),
    "Silkeborg": (56.1502, 9.8504),
    "Herning": (56.1393, 8.9754),
    "Esbjerg": (55.4761, 8.4592),
    "Kolding": (55.4909, 9.4720),
    "Fredericia": (55.5659, 9.7526),
    "Skanderborg": (56.0423, 9.9266),
    "Roskilde": (55.6420, 12.0874),
}

_TZ = ZoneInfo("Europe/Copenhagen")

_TIME_BASE: Dict[str, float] = {
    "morning_rush": 75,
    "mid_morning": 55,
    "lunch": 65,
    "afternoon": 58,
    "evening_rush": 78,
    "evening": 68,
    "late_night": 72,
    "night": 40,
}

_PERIOD_DA: Dict[str, str] = {
    "morning_rush": "Morgenrush",
    "mid_morning": "Formiddag",
    "lunch": "Frokosttid",
    "afternoon": "Eftermiddag",
    "evening_rush": "Eftermiddagsrush",
    "evening": "Aftentid",
    "late_night": "Senaften",
    "night": "Nat",
}


class DemandResearchAgent:
    name = "Demand Research Agent"

    def run(self, city: str = "København") -> Dict[str, Any]:
        now = datetime.now(tz=_TZ)
        hour = now.hour
        time_period = _classify(hour)
        coords = CITY_COORDS.get(city, CITY_COORDS["København"])

        weather = self._get_weather(coords[0], coords[1])
        events = self._get_events(city, now)
        history_sig = self._history_signal(hour)

        demand_now = self._score_demand(time_period, weather, events, history_sig, offset_min=0)
        demand_20 = self._score_demand(time_period, weather, events, history_sig, offset_min=20)

        result: Dict[str, Any] = {
            "zone": f"{city} Centrum",
            "city": city,
            "score": demand_now["score"],
            "demand_now": demand_now["label"],
            "demand_20_min": demand_20["label"],
            "reason_da": self._build_reason(time_period, weather, events, demand_now),
            "confidence": self._confidence(demand_now, weather, events),
            "signals": {
                "events": [{"name": e.get("name"), "zone": e.get("zone"), "multiplier": e.get("demand_multiplier", 1.0)} for e in events],
                "weather": {
                    "description": weather.get("description"),
                    "temperature": weather.get("temperature"),
                    "is_rain": weather.get("is_rain", False),
                    "demand_boost": weather.get("demand_boost", 1.0),
                    "available": weather.get("available", False),
                },
                "places": [],
                "history": history_sig,
            },
            "timestamp": now.isoformat(),
            "status": "ok",
        }

        self._log(result)
        return result

    def _get_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        try:
            r = requests.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "current": "temperature_2m,weather_code,wind_speed_10m,precipitation",
                    "timezone": "Europe/Copenhagen",
                },
                timeout=5,
            )
            r.raise_for_status()
            cur = r.json()["current"]
            code = cur.get("weather_code", 0)
            return {
                "temperature": cur.get("temperature_2m"),
                "wind_speed": cur.get("wind_speed_10m"),
                "precipitation": cur.get("precipitation", 0),
                "weather_code": code,
                "description": _weather_desc(code),
                "is_rain": code in range(51, 68) or code in range(80, 83),
                "demand_boost": _weather_boost(code),
                "available": True,
            }
        except Exception as exc:
            log.warning("Vejrhentning fejlede (%s, %s): %s", lat, lon, exc)
            return {
                "description": "Vejrdata utilgængelig",
                "temperature": None,
                "is_rain": False,
                "demand_boost": 1.0,
                "available": False,
            }

    def _get_events(self, city: str, now: datetime) -> List[Dict]:
        try:
            from .. import fetchers
            all_events = fetchers.get_events_local()
            active = fetchers.get_active_events(all_events, now.hour, now.date())
            city_lower = city.lower()
            relevant = [
                e for e in active
                if city_lower in e.get("zone", "").lower()
                or e.get("zone", "").lower() in city_lower
            ]
            # Fall back to all active events if none match city
            return relevant if relevant else active[:2]
        except Exception as exc:
            log.warning("Events-hentning fejlede: %s", exc)
            return []

    def _history_signal(self, hour: int) -> Dict[str, Any]:
        try:
            from .. import history
            hist = history.analyze()
            best_hours = hist.get("best_hours", [])
            return {
                "total_trips": hist.get("total_trips", 0),
                "avg_fare_dkk": hist.get("avg_fare_dkk", 0),
                "is_peak_hour": any(h["hour"] == hour for h in best_hours),
            }
        except Exception:
            return {"total_trips": 0, "avg_fare_dkk": 0, "is_peak_hour": False}

    def _score_demand(
        self,
        time_period: str,
        weather: Dict,
        events: List[Dict],
        history_sig: Dict,
        offset_min: int = 0,
    ) -> Dict[str, Any]:
        base = _TIME_BASE.get(time_period, 50)

        if offset_min > 0:
            now = datetime.now(tz=_TZ)
            projected_hour = (now.hour * 60 + now.minute + offset_min) // 60 % 24
            projected_period = _classify(projected_hour)
            base = (_TIME_BASE.get(time_period, 50) + _TIME_BASE.get(projected_period, 50)) / 2

        score = base * weather.get("demand_boost", 1.0)

        for event in events:
            score = min(score * event.get("demand_multiplier", 1.3), 100)

        if history_sig.get("is_peak_hour"):
            score = min(score * 1.10, 100)

        score = round(min(100.0, max(0.0, score)), 1)
        label = "high" if score >= 70 else "medium" if score >= 45 else "low"
        return {"score": score, "label": label}

    def _build_reason(
        self, time_period: str, weather: Dict, events: List[Dict], demand: Dict
    ) -> str:
        parts = []

        if events:
            parts.append(f"Event i nærheden: {events[0].get('name', '')}")
        else:
            parts.append(_PERIOD_DA.get(time_period, time_period))

        if weather.get("is_rain"):
            parts.append("regnvejr øger efterspørgslen")
        elif weather.get("available") and weather.get("temperature") is not None:
            temp = weather["temperature"]
            if temp < 5:
                parts.append("koldt vejr – folk foretrækker taxa")
            elif temp > 22:
                parts.append("fint vejr og god dag for kørsel")

        hist = _TIME_BASE.get(time_period, 50)
        if hist >= 70:
            parts.append("historisk høj efterspørgsel på dette tidspunkt")

        label = demand["label"]
        if label == "high":
            parts.append("efterspørgslen er HØJ")
        elif label == "low":
            parts.append("efterspørgslen er LAV")

        return ", ".join(parts).capitalize() + "."

    def _confidence(self, demand: Dict, weather: Dict, events: List[Dict]) -> int:
        base = 58
        if weather.get("available"):
            base += 12
        if events:
            base += 10
        if demand["label"] in ("high", "low"):
            base += 6
        return min(92, base)

    def _log(self, result: Dict[str, Any]) -> None:
        try:
            _LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
            with open(_LOG_PATH, "a", encoding="utf-8") as f:
                f.write(json.dumps(result, ensure_ascii=False) + "\n")
        except Exception as exc:
            log.warning("Kunne ikke skrive demand_research.jsonl: %s", exc)


def _classify(hour: int) -> str:
    if 6 <= hour < 9:
        return "morning_rush"
    if 9 <= hour < 12:
        return "mid_morning"
    if 12 <= hour < 14:
        return "lunch"
    if 14 <= hour < 16:
        return "afternoon"
    if 16 <= hour < 19:
        return "evening_rush"
    if 19 <= hour < 22:
        return "evening"
    if hour >= 22 or hour < 3:
        return "late_night"
    return "night"


def _weather_desc(code: int) -> str:
    if code == 0:
        return "Klar himmel"
    if code in (1, 2, 3):
        return "Let skyet"
    if code in (45, 48):
        return "Tåge"
    if code in range(51, 58):
        return "Støvregn"
    if code in range(61, 68):
        return "Regn"
    if code in range(71, 78):
        return "Sne"
    if code in range(80, 83):
        return "Byger"
    if code in (95, 96, 99):
        return "Tordenvejr"
    return "Variabelt"


def _weather_boost(code: int) -> float:
    if code in range(61, 68) or code in range(80, 83):
        return 1.25
    if code in range(71, 78):
        return 1.15
    if code in (45, 48):
        return 1.10
    if code in (95, 96, 99):
        return 1.30
    return 1.0
