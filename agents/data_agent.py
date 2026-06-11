import json
import os
from datetime import datetime, date
from zoneinfo import ZoneInfo
from typing import Dict, Any, List

CPH_TZ = ZoneInfo("Europe/Copenhagen")


class DataAgent:
    """Collects and processes demand signals for zone recommendations."""

    ZONES = [
        "Centrum",
        "Nørreport",
        "Rådhuspladsen",
        "Lufthavn",
        "Hovedbanegård",
        "Nørrebro",
        "Østerbro",
        "Frederiksberg",
        "Valby",
        "Amager",
    ]

    def __init__(self):
        self._events_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "..", "data", "events.json"
        )
        self._events_cache = None

    def _load_events(self) -> List[Dict]:
        if self._events_cache is None:
            try:
                with open(self._events_path, "r", encoding="utf-8") as f:
                    self._events_cache = json.load(f).get("events", [])
            except (FileNotFoundError, json.JSONDecodeError):
                self._events_cache = []
        return self._events_cache

    def get_signals(self) -> Dict[str, Any]:
        now = datetime.now(tz=CPH_TZ)
        hour = now.hour
        weekday = now.weekday()  # 0=Monday, 6=Sunday
        is_weekend = weekday >= 5
        is_fri_sat_night = weekday in (4, 5) and hour >= 20

        if 6 <= hour < 9:
            time_period = "morning_rush"
        elif 9 <= hour < 12:
            time_period = "mid_morning"
        elif 12 <= hour < 14:
            time_period = "lunch"
        elif 14 <= hour < 16:
            time_period = "afternoon"
        elif 16 <= hour < 19:
            time_period = "evening_rush"
        elif 19 <= hour < 22:
            time_period = "evening"
        elif hour >= 22 or hour < 3:
            time_period = "late_night"
        else:
            time_period = "night"

        active_events = self._get_active_events(now)

        return {
            "hour": hour,
            "weekday": weekday,
            "weekday_name": [
                "Mandag", "Tirsdag", "Onsdag", "Torsdag",
                "Fredag", "Lørdag", "Søndag"
            ][weekday],
            "is_weekend": is_weekend,
            "is_friday_saturday_night": is_fri_sat_night,
            "time_period": time_period,
            "active_events": active_events,
            "timestamp": now.isoformat(),
        }

    def _get_active_events(self, now: datetime) -> List[Dict]:
        today = now.date()
        hour = now.hour
        active = []
        for event in self._load_events():
            try:
                start = date.fromisoformat(event["start_date"])
                end = date.fromisoformat(event["end_date"])
                if start <= today <= end:
                    peak_hours = event.get("peak_hours", list(range(24)))
                    if hour in peak_hours:
                        active.append(event)
            except (KeyError, ValueError):
                continue
        return active

    def get_upcoming_events(self) -> List[Dict]:
        today = date.today()
        upcoming = []
        for event in self._load_events():
            try:
                end = date.fromisoformat(event["end_date"])
                if end >= today:
                    upcoming.append({
                        "name": event["name"],
                        "zone": event["zone"],
                        "start_date": event["start_date"],
                        "end_date": event["end_date"],
                    })
            except (KeyError, ValueError):
                continue
        return sorted(upcoming, key=lambda x: x["start_date"])[:10]
