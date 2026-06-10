import logging
from datetime import date, datetime
from typing import Any, Dict, List
from zoneinfo import ZoneInfo

log = logging.getLogger(__name__)

_TZ = ZoneInfo("Europe/Copenhagen")

KNOWN_CITIES = {
    "København", "Kobenhavn", "Copenhagen",
    "Horsens", "Aarhus", "Odense", "Aalborg", "Vejle",
    "Randers", "Silkeborg", "Herning", "Esbjerg",
    "Kolding", "Fredericia", "Skanderborg", "Roskilde",
}


class VerificationAgent:
    name = "Verification Agent"

    def run(self, demand_data: Dict[str, Any]) -> Dict[str, Any]:
        checks: List[Dict[str, Any]] = []
        penalty = 0

        date_ok = self._check_date(demand_data, checks)
        if not date_ok:
            penalty += 15

        city_ok = self._check_city(demand_data, checks)
        if not city_ok:
            penalty += 10

        source_ok = self._check_sources(demand_data, checks)
        if not source_ok:
            penalty += 8

        self._check_events(demand_data, checks)

        original_conf = demand_data.get("confidence", 60)
        adjusted_conf = max(40, original_conf - penalty)

        relevance = "høj" if adjusted_conf >= 75 else "medium" if adjusted_conf >= 55 else "lav"

        return {
            **demand_data,
            "verified": True,
            "verification": {
                "checks": checks,
                "all_passed": date_ok and city_ok,
                "confidence_penalty": penalty,
                "relevance": relevance,
            },
            "confidence": adjusted_conf,
        }

    def _check_date(self, data: Dict, checks: List) -> bool:
        ts = data.get("timestamp", "")
        try:
            dt = datetime.fromisoformat(ts)
            today = date.today()
            ok = dt.date() == today
            checks.append({
                "name": "Dato",
                "passed": ok,
                "note": f"Data fra {dt.date()} – {'korrekt' if ok else 'forældet'}",
            })
            return ok
        except Exception:
            checks.append({"name": "Dato", "passed": False, "note": "Ugyldigt tidsstempel"})
            return False

    def _check_city(self, data: Dict, checks: List) -> bool:
        city = data.get("city", "")
        known = city in KNOWN_CITIES
        ok = len(city) > 2
        checks.append({
            "name": "By",
            "passed": ok,
            "note": f"'{city}' – {'præcise koordinater' if known else 'standardkoordinater bruges'}",
        })
        return ok

    def _check_sources(self, data: Dict, checks: List) -> bool:
        weather_available = data.get("signals", {}).get("weather", {}).get("available", False)
        checks.append({
            "name": "Vejrkilde",
            "passed": weather_available,
            "note": "Open-Meteo OK" if weather_available else "Vejrdata utilgængelig – fallback aktiv",
        })
        return weather_available

    def _check_events(self, data: Dict, checks: List) -> bool:
        events = data.get("signals", {}).get("events", [])
        checks.append({
            "name": "Events",
            "passed": True,
            "note": f"{len(events)} aktive events" if events else "Ingen aktive events – baserer på vejr og tid",
        })
        return True
