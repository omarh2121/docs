import csv
import json
from datetime import date
from typing import Any, Dict, List

import requests

from . import config


def get_weather() -> Dict[str, Any]:
    """Fetch current weather from Open-Meteo (free, no API key required)."""
    try:
        r = requests.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": config.WEATHER_LAT,
                "longitude": config.WEATHER_LON,
                "current": "temperature_2m,weather_code,wind_speed_10m,precipitation",
                "timezone": config.WEATHER_TZ,
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
            "description": _desc(code),
            "is_rain": code in range(51, 68) or code in range(80, 83),
            "is_snow": code in range(71, 78),
            "demand_boost": _boost(code),
            "available": True,
        }
    except Exception:
        return _weather_fallback()


def _desc(code: int) -> str:
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


def _boost(code: int) -> float:
    if code in range(61, 68) or code in range(80, 83):
        return 1.25
    if code in range(71, 78):
        return 1.15
    if code in (45, 48):
        return 1.10
    if code in (95, 96, 99):
        return 1.30
    return 1.0


def _weather_fallback() -> Dict[str, Any]:
    return {
        "temperature": None,
        "wind_speed": None,
        "precipitation": 0,
        "weather_code": 0,
        "description": "Vejrdata utilgængelig",
        "is_rain": False,
        "is_snow": False,
        "demand_boost": 1.0,
        "available": False,
    }


def get_events_local() -> List[Dict]:
    path = config.DATA_DIR / "events.json"
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f).get("events", [])
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def get_active_events(events: List[Dict], hour: int, today: date) -> List[Dict]:
    active = []
    for event in events:
        try:
            start = date.fromisoformat(event["start_date"])
            end = date.fromisoformat(event["end_date"])
            if start <= today <= end and hour in event.get("peak_hours", list(range(24))):
                active.append(event)
        except (KeyError, ValueError):
            continue
    return active


def get_upcoming_events(events: List[Dict], limit: int = 8) -> List[Dict]:
    today = date.today()
    upcoming = []
    for event in events:
        try:
            if date.fromisoformat(event["end_date"]) >= today:
                upcoming.append({
                    "name": event["name"],
                    "zone": event["zone"],
                    "start_date": event["start_date"],
                    "end_date": event["end_date"],
                    "demand_multiplier": event.get("demand_multiplier", 1.0),
                    "peak_hours": event.get("peak_hours", []),
                })
        except (KeyError, ValueError):
            continue
    return sorted(upcoming, key=lambda x: x["start_date"])[:limit]


def load_trips() -> List[Dict]:
    path = config.DATA_DIR / "trips.csv"
    trips = []
    try:
        with open(path, encoding="utf-8") as f:
            for row in csv.DictReader(f):
                trips.append(row)
    except FileNotFoundError:
        pass
    return trips
