from typing import Any, Dict, List


def generate(signals: Dict[str, Any], zone_scores: List[Dict], weather: Dict[str, Any]) -> List[Dict]:
    alerts = []
    top_zone = zone_scores[0]["zone"] if zone_scores else "Centrum"

    if signals["time_period"] == "morning_rush":
        alerts.append(_alert("high", "Morgenrush aktiv",
                             f"Høj efterspørgsel – kør til {top_zone} nu", "rush_hour", top_zone))
    elif signals["time_period"] == "evening_rush":
        alerts.append(_alert("high", "Eftermiddagsrush aktiv",
                             f"Travl afgangstid – {top_zone} er bedste zone", "rush_hour", top_zone))

    if weather.get("is_rain"):
        alerts.append(_alert("medium", "Regn i København",
                             f"{weather.get('description')} – op til +25% efterspørgsel", "weather", None))
    elif weather.get("is_snow"):
        alerts.append(_alert("high", "Sne – forhøjet efterspørgsel",
                             "Snevejr medfører øget taxekørsel og forsinkelser", "weather", None))

    for event in signals.get("active_events", []):
        alerts.append(_alert("high", f"Event nu: {event['name']}",
                             f"Forhøjet efterspørgsel i {event['zone']}-området", "event", event["zone"]))

    if signals["is_friday_saturday_night"] and signals["time_period"] == "late_night":
        alerts.append(_alert("medium", "Weekendnat – høj indtjening",
                             "Natteliv-peak: Nørrebro og Centrum er bedste zoner", "opportunity", None))

    if not alerts and zone_scores and zone_scores[0]["score"] < 40:
        alerts.append(_alert("low", "Lav aktivitet",
                             "Rolig periode – overvej Lufthavnen for stabile ture", "low_demand", "Lufthavn"))

    return alerts


def _alert(severity: str, title: str, message: str, type_: str, zone) -> Dict[str, Any]:
    return {"severity": severity, "title": title, "message": message, "type": type_, "zone": zone}
