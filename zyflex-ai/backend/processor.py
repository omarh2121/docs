from typing import Any, Dict, List

from . import config

_TIME_MULT: Dict[str, Dict[str, float]] = {
    "morning_rush": {
        "Nørreport": 1.7, "Centrum": 1.4, "Rådhuspladsen": 1.3,
        "Lufthavn": 1.5, "Hovedbanegård": 1.6, "Nørrebro": 1.1,
        "Østerbro": 1.2, "Frederiksberg": 1.1, "Valby": 0.9, "Amager": 1.0,
    },
    "mid_morning": {
        "Centrum": 1.2, "Nørreport": 1.1, "Rådhuspladsen": 1.0,
        "Lufthavn": 1.4, "Hovedbanegård": 1.1, "Nørrebro": 0.9,
        "Østerbro": 0.9, "Frederiksberg": 1.0, "Valby": 0.8, "Amager": 0.8,
    },
    "lunch": {
        "Centrum": 1.4, "Rådhuspladsen": 1.3, "Frederiksberg": 1.2,
        "Nørreport": 1.1, "Lufthavn": 1.0, "Hovedbanegård": 1.2,
        "Nørrebro": 1.0, "Østerbro": 1.0, "Valby": 0.9, "Amager": 0.9,
    },
    "afternoon": {
        "Lufthavn": 1.5, "Centrum": 1.1, "Nørreport": 1.0,
        "Rådhuspladsen": 1.1, "Hovedbanegård": 1.1, "Nørrebro": 1.0,
        "Østerbro": 1.0, "Frederiksberg": 1.0, "Valby": 1.0, "Amager": 1.0,
    },
    "evening_rush": {
        "Nørreport": 1.8, "Centrum": 1.5, "Rådhuspladsen": 1.4,
        "Lufthavn": 1.3, "Hovedbanegård": 1.7, "Nørrebro": 1.2,
        "Østerbro": 1.3, "Frederiksberg": 1.2, "Valby": 1.1, "Amager": 1.1,
    },
    "evening": {
        "Centrum": 1.3, "Nørrebro": 1.2, "Rådhuspladsen": 1.1,
        "Nørreport": 1.1, "Østerbro": 1.1, "Frederiksberg": 1.1,
        "Lufthavn": 1.0, "Hovedbanegård": 1.1, "Valby": 0.9, "Amager": 0.9,
    },
    "late_night": {
        "Centrum": 1.6, "Nørrebro": 1.8, "Rådhuspladsen": 1.4,
        "Nørreport": 1.2, "Østerbro": 1.3, "Frederiksberg": 1.0,
        "Lufthavn": 1.5, "Hovedbanegård": 1.3, "Valby": 0.8, "Amager": 1.0,
    },
    "night": {
        "Lufthavn": 1.7, "Centrum": 0.9, "Nørrebro": 0.8,
        "Nørreport": 0.7, "Rådhuspladsen": 0.7, "Østerbro": 0.7,
        "Frederiksberg": 0.7, "Hovedbanegård": 0.9, "Valby": 0.6, "Amager": 0.7,
    },
}

_WEEKEND_BOOST: Dict[str, float] = {
    "Centrum": 1.3, "Nørrebro": 1.5, "Rådhuspladsen": 1.2,
    "Nørreport": 1.1, "Østerbro": 1.2, "Frederiksberg": 1.1,
    "Lufthavn": 1.1, "Hovedbanegård": 1.1, "Valby": 1.0, "Amager": 1.1,
}

# Max score representing peak conditions without events (rain evening_rush weekend).
# Event multipliers can push above this – capped at 100.
_MAX_RAW = 0.90 * 1.8 * 1.5 * 1.15 * 1.25  # ≈ 3.49


def score_zones(signals: Dict[str, Any]) -> List[Dict]:
    time_mults = _TIME_MULT.get(signals["time_period"], {})
    weather_boost = signals.get("weather", {}).get("demand_boost", 1.0)

    scored = []
    for zone, base in config.ZONE_BASE.items():
        score = base * time_mults.get(zone, 1.0) * weather_boost

        if signals["is_weekend"]:
            score *= _WEEKEND_BOOST.get(zone, 1.0)
        if signals["is_friday_saturday_night"]:
            score *= 1.15

        zone_events = [e for e in signals["active_events"] if e.get("zone") == zone]
        for event in zone_events:
            score *= event.get("demand_multiplier", 1.5)

        scored.append({
            "zone": zone,
            "score": min(100, round(score / _MAX_RAW * 100, 1)),
            "events": [e["name"] for e in zone_events],
            "weather_boosted": weather_boost > 1.0,
        })

    return sorted(scored, key=lambda x: x["score"], reverse=True)


def overall_demand(zone_scores: List[Dict]) -> int:
    if not zone_scores:
        return 50
    return round(sum(z["score"] for z in zone_scores[:3]) / 3)


def demand_label(score: int) -> str:
    if score >= 80:
        return "Meget høj"
    if score >= 65:
        return "Høj"
    if score >= 50:
        return "Moderat"
    if score >= 35:
        return "Lav"
    return "Meget lav"


def earning_potential(score: int) -> str:
    if score >= 80:
        return "Fremragende"
    if score >= 65:
        return "God"
    if score >= 50:
        return "Moderat"
    return "Lav"
