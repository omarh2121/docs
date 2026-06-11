from typing import Dict, Any, List


class AnalysisAgent:
    """Scores zones based on time, day, and event signals."""

    # Base popularity (0–1): how often passengers request from this zone
    ZONE_BASE = {
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

    # Per-zone multiplier by time period
    TIME_MULT: Dict[str, Dict[str, float]] = {
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

    WEEKEND_BOOST: Dict[str, float] = {
        "Centrum": 1.3, "Nørrebro": 1.5, "Rådhuspladsen": 1.2,
        "Nørreport": 1.1, "Østerbro": 1.2, "Frederiksberg": 1.1,
        "Lufthavn": 1.1, "Hovedbanegård": 1.1, "Valby": 1.0, "Amager": 1.1,
    }

    def score_zones(self, signals: Dict[str, Any]) -> List[Dict]:
        time_period = signals["time_period"]
        is_weekend = signals["is_weekend"]
        is_fri_sat_night = signals["is_friday_saturday_night"]
        active_events = signals["active_events"]
        time_mults = self.TIME_MULT.get(time_period, {})

        scored = []
        for zone, base in self.ZONE_BASE.items():
            score = base * time_mults.get(zone, 1.0)

            if is_weekend:
                score *= self.WEEKEND_BOOST.get(zone, 1.0)

            if is_fri_sat_night:
                score *= 1.15

            zone_events = [e for e in active_events if e.get("zone") == zone]
            for event in zone_events:
                score *= event.get("demand_multiplier", 1.5)

            scored.append({
                "zone": zone,
                # Normalise to 0–100 relative to realistic max (~1.8 * 0.9 * 1.5 * 1.15 ≈ 2.8)
                "score": min(100, round(score / 2.8 * 100, 1)),
                "events": [e["name"] for e in zone_events],
            })

        return sorted(scored, key=lambda x: x["score"], reverse=True)
