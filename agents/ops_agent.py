from typing import Dict, Any, List

PERIOD_REASONS: Dict[str, str] = {
    "morning_rush": "Morgenrush – mange pendlere søger taxa",
    "mid_morning": "Formiddag – forretningsrejser og indkøb",
    "lunch": "Frokostpause – høj efterspørgsel i bymidten",
    "afternoon": "Eftermiddag – jævn efterspørgsel, lufthavn peak",
    "evening_rush": "Eftermiddagsrush – travl afgang fra kontor",
    "evening": "Aftentid – restauranter og underholdning",
    "late_night": "Senaften – natteliv og hjemture",
    "night": "Nat – primært lufthavn og langture",
}

ZONE_TIPS: Dict[str, str] = {
    "Lufthavn": "Stil dig ved Terminal 3 – hurtigste afhentning",
    "Nørreport": "Metro + S-tog giver konstant strøm af kunder",
    "Centrum": "Strøget-området: korte hurtige ture, høj rotation",
    "Nørrebro": "Nørrebrogade om natten = mange og korte ture",
    "Hovedbanegård": "Vent ved taxiholdepladsen – hurtig afgang",
    "Rådhuspladsen": "Centralt – let adgang til alle retninger",
    "Østerbro": "Parken-området og Østerbrogade = god efterspørgsel",
}


class OpsAgent:
    """Translates zone scores into a single clear driver instruction."""

    def generate_instruction(
        self, zone_scores: List[Dict], signals: Dict[str, Any]
    ) -> Dict[str, Any]:
        if not zone_scores:
            return self._fallback()

        top = zone_scores[0]
        second = zone_scores[1] if len(zone_scores) > 1 else None
        confidence = self._confidence(zone_scores)
        reason = self._reason(top, signals)

        return {
            "instruction": f"KØR TIL: {top['zone'].upper()}",
            "zone": top["zone"],
            "score": top["score"],
            "confidence": confidence,
            "reason": reason,
            "tip": ZONE_TIPS.get(top["zone"], ""),
            "backup_zone": second["zone"] if second else None,
            "time_period": signals["time_period"],
            "weekday_name": signals["weekday_name"],
            "is_weekend": signals["is_weekend"],
            "active_events": signals["active_events"],
            "updated_at": signals["timestamp"],
        }

    def _confidence(self, zone_scores: List[Dict]) -> int:
        if len(zone_scores) < 2:
            return 75
        gap = zone_scores[0]["score"] - zone_scores[1]["score"]
        # Gap of 0 → 55%, gap of 20+ → 95%
        return min(95, max(55, 55 + int(gap * 2)))

    def _reason(self, top: Dict, signals: Dict) -> str:
        if top.get("events"):
            return f"{top['events'][0]} – forhøjet efterspørgsel"
        if signals["is_friday_saturday_night"]:
            return f"Weekend nat – {top['zone']} er i højsæson"
        return PERIOD_REASONS.get(signals["time_period"], "Aktuel efterspørgsel")

    def _fallback(self) -> Dict[str, Any]:
        return {
            "instruction": "KØR TIL: CENTRUM",
            "zone": "Centrum",
            "score": 70,
            "confidence": 60,
            "reason": "Standard – bymidten har altid efterspørgsel",
            "tip": "",
            "backup_zone": "Nørreport",
            "time_period": "unknown",
            "weekday_name": "Ukendt",
            "is_weekend": False,
            "active_events": [],
            "updated_at": "",
        }
