from collections import defaultdict
from typing import Any, Dict, List

from . import fetchers


def analyze() -> Dict[str, Any]:
    trips = fetchers.load_trips()
    if not trips:
        return _empty()

    zone_counts: Dict[str, int] = defaultdict(int)
    zone_fares: Dict[str, List[float]] = defaultdict(list)
    hour_counts: Dict[str, int] = defaultdict(int)
    weekday_counts: Dict[str, int] = defaultdict(int)

    for t in trips:
        zone = t.get("pickup_zone", "")
        if zone:
            zone_counts[zone] += 1
            try:
                zone_fares[zone].append(float(t["fare_dkk"]))
            except (KeyError, ValueError):
                pass
        try:
            hour_counts[str(int(t["hour"]))] += 1
        except (KeyError, ValueError):
            pass
        wd = t.get("weekday", "")
        if wd:
            weekday_counts[wd] += 1

    best_zones = sorted(zone_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    best_hours = sorted(hour_counts.items(), key=lambda x: x[1], reverse=True)[:3]
    avg_fares = {
        z: round(sum(f) / len(f)) for z, f in zone_fares.items() if f
    }

    return {
        "total_trips": len(trips),
        "best_zones": [{"zone": z, "trips": c} for z, c in best_zones],
        "best_hours": [{"hour": int(h), "trips": c} for h, c in best_hours],
        "avg_fare_dkk": round(sum(avg_fares.values()) / len(avg_fares)) if avg_fares else 0,
        "zone_avg_fares": avg_fares,
        "weekday_distribution": dict(weekday_counts),
    }


def _empty() -> Dict[str, Any]:
    return {
        "total_trips": 0,
        "best_zones": [],
        "best_hours": [],
        "avg_fare_dkk": 0,
        "zone_avg_fares": {},
        "weekday_distribution": {},
    }
