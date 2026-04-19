import os
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
DASHBOARD_DIR = BASE_DIR / "dashboard"

CITY = os.getenv("CITY", "København")
WEATHER_LAT = float(os.getenv("WEATHER_LAT", "55.6761"))
WEATHER_LON = float(os.getenv("WEATHER_LON", "12.5683"))
WEATHER_TZ = os.getenv("WEATHER_TZ", "Europe/Copenhagen")
CACHE_TTL = int(os.getenv("CACHE_TTL", "300"))  # seconds

ZONES = [
    "Centrum", "Nørreport", "Rådhuspladsen", "Lufthavn",
    "Hovedbanegård", "Nørrebro", "Østerbro", "Frederiksberg",
    "Valby", "Amager",
]

ZONE_BASE: dict = {
    "Centrum": 0.85,
    "Nørreport": 0.90,
    "Rådhuspladsen": 0.80,
    "Lufthavn": 0.75,
    "Hovedbanegård": 0.85,
    "Nørrebro": 0.70,
    "Østerbro": 0.65,
    "Frederiksberg": 0.70,
    "Valby": 0.45,
    "Amager": 0.50,
}

WEEKDAY_NAMES = [
    "Mandag", "Tirsdag", "Onsdag", "Torsdag",
    "Fredag", "Lørdag", "Søndag",
]
