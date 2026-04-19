from typing import Any, Dict, List

_LEADS = [
    {
        "name": "Rigshospitalet",
        "type": "Hospital",
        "city": "København Ø",
        "opportunity": "Fast patienttransport-kontrakt",
        "base_priority": 92,
        "best_periods": ["morning_rush", "mid_morning", "afternoon"],
        "action": "Send tilbud på månedlig transportaftale",
    },
    {
        "name": "Hvidovre Hospital",
        "type": "Hospital",
        "city": "Hvidovre",
        "opportunity": "Daglig patienttransport",
        "base_priority": 82,
        "best_periods": ["morning_rush", "mid_morning"],
        "action": "Kontakt indkøbsafdeling – tilbud på daglig kørsel",
    },
    {
        "name": "Frederiksberg Kommune",
        "type": "Kommune",
        "city": "Frederiksberg",
        "opportunity": "Social transport & handicapkørsel",
        "base_priority": 88,
        "best_periods": ["mid_morning", "afternoon"],
        "action": "Afgiv tilbud på næste udbud via Udbud.dk",
    },
    {
        "name": "Mærsk HQ",
        "type": "Virksomhed",
        "city": "Centrum",
        "opportunity": "Executive transport & lufthavn-transfers",
        "base_priority": 85,
        "best_periods": ["morning_rush", "evening_rush"],
        "action": "Book møde med facilities manager",
    },
    {
        "name": "Novo Nordisk (Bagsværd)",
        "type": "Virksomhed",
        "city": "Bagsværd",
        "opportunity": "Medarbejder-shuttle & business kørsel",
        "base_priority": 83,
        "best_periods": ["morning_rush", "evening_rush"],
        "action": "Kontakt HR / travel manager",
    },
    {
        "name": "Hilton Copenhagen Airport",
        "type": "Hotel",
        "city": "Lufthavn",
        "opportunity": "Hotel↔by transfer-aftale",
        "base_priority": 78,
        "best_periods": ["morning_rush", "afternoon", "evening"],
        "action": "Kontakt concierge-chef – forhandl fast transfer-rate",
    },
    {
        "name": "Bella Center (MCH)",
        "type": "Event Venue",
        "city": "Amager",
        "opportunity": "Messekørsel og event-transport",
        "base_priority": 74,
        "best_periods": ["evening", "late_night"],
        "action": "Kontakt event-koordinator – sæsonaftale",
    },
    {
        "name": "Comwell Hotels (3 lokationer)",
        "type": "Hotel",
        "city": "København",
        "opportunity": "Airport transfer + gæstetransport",
        "base_priority": 80,
        "best_periods": ["morning_rush", "afternoon"],
        "action": "Møde med F&B/concierge ansvarlig",
    },
]


class SalesAgent:
    name = "Sales Agent"

    def run(self, signals: Dict[str, Any], analysis: Dict[str, Any]) -> Dict[str, Any]:
        time_period = signals.get("time_period", "")
        is_rain = signals.get("weather", {}).get("is_rain", False)

        scored = []
        for lead in _LEADS:
            priority = lead["base_priority"]
            if time_period in lead["best_periods"]:
                priority = min(100, priority + 8)
            if is_rain:
                priority = min(100, priority + 5)
            scored.append({
                **lead,
                "priority": priority,
                "status": _status(priority),
            })

        scored.sort(key=lambda x: x["priority"], reverse=True)
        hot_leads = sum(1 for l in scored if l["priority"] >= 85)

        return {
            "leads": scored[:6],
            "new_leads": hot_leads,
            "status": "ok",
            "last_result": f"{hot_leads} høj-prioritets leads identificeret",
        }


def _status(p: int) -> str:
    if p >= 90:
        return "Kritisk"
    if p >= 80:
        return "Høj"
    if p >= 70:
        return "Medium"
    return "Lav"
