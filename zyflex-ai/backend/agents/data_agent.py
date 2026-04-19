from datetime import datetime
from zoneinfo import ZoneInfo
from typing import Any, Dict

from .. import config, fetchers

_CPH = ZoneInfo("Europe/Copenhagen")


class DataAgent:
    name = "Data Agent"

    def run(self) -> Dict[str, Any]:
        now = datetime.now(tz=_CPH)
        hour = now.hour
        weekday = now.weekday()
        is_weekend = weekday >= 5
        is_fri_sat_night = weekday in (4, 5) and hour >= 20

        weather = fetchers.get_weather()
        all_events = fetchers.get_events_local()
        active_events = fetchers.get_active_events(all_events, hour, now.date())
        upcoming_events = fetchers.get_upcoming_events(all_events)

        return {
            "hour": hour,
            "weekday": weekday,
            "weekday_name": config.WEEKDAY_NAMES[weekday],
            "is_weekend": is_weekend,
            "is_friday_saturday_night": is_fri_sat_night,
            "time_period": _classify(hour),
            "weather": weather,
            "active_events": active_events,
            "upcoming_events": upcoming_events,
            "timestamp": now.isoformat(),
            "status": "ok",
        }


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
