from typing import Any, Dict, List

_PERIOD_REASONS = {
    "morning_rush": "Morgenrush – mange pendlere søger taxa",
    "mid_morning": "Formiddag – forretningsrejser og ærinder",
    "lunch": "Frokostpause – høj efterspørgsel i bymidten",
    "afternoon": "Eftermiddag – lufthavn-peak og indkøb",
    "evening_rush": "Eftermiddagsrush – travl afgangstid",
    "evening": "Aftentid – restauranter og underholdning",
    "late_night": "Senaften – natteliv og hjemture",
    "night": "Nat – primært lufthavn og langture",
}

_ZONE_TIPS = {
    "Lufthavn": "Stil dig ved Terminal 3 – hurtigste afhentning",
    "Nørreport": "Metro + S-tog = konstant strøm af passagerer",
    "Centrum": "Strøget-området: korte ture, høj rotation",
    "Nørrebro": "Nørrebrogade om natten = mange og hurtige ture",
    "Hovedbanegård": "Taxiholdepladsen: hurtig og stabil afhentning",
    "Rådhuspladsen": "Centralt – hurtig adgang til alle retninger",
    "Østerbro": "Parken + Østerbrogade – god efterspørgsel",
}


class OpsAgent:
    name = "Operations Agent"

    def run(self, zone_scores: List[Dict], signals: Dict[str, Any]) -> Dict[str, Any]:
        if not zone_scores:
            return self._fallback()

        top = zone_scores[0]
        second = zone_scores[1] if len(zone_scores) > 1 else None
        confidence = self._confidence(zone_scores)

        return {
            "instruction": f"KØR TIL: {top['zone'].upper()}",
            "zone": top["zone"],
            "score": top["score"],
            "confidence": confidence,
            "reason": self._reason(top, signals),
            "tip": _ZONE_TIPS.get(top["zone"], ""),
            "backup_zone": second["zone"] if second else None,
            "backup_score": second["score"] if second else None,
            "status": "ok",
            "last_result": f"→ {top['zone']} ({confidence}% sikkerhed)",
        }

    def _confidence(self, scores: List[Dict]) -> int:
        if len(scores) < 2:
            return 75
        gap = scores[0]["score"] - scores[1]["score"]
        return min(95, max(55, 55 + int(gap * 2)))

    def _reason(self, top: Dict, signals: Dict) -> str:
        if top.get("events"):
            return f"{top['events'][0]} – forhøjet efterspørgsel"
        if signals.get("is_friday_saturday_night"):
            return f"Weekend nat – {top['zone']} er i højsæson"
        if signals.get("weather", {}).get("is_rain"):
            return "Regn i København – øget efterspørgsel overalt"
        return _PERIOD_REASONS.get(signals.get("time_period", ""), "Aktuel efterspørgsel")

    def _fallback(self) -> Dict[str, Any]:
        return {
            "instruction": "KØR TIL: CENTRUM",
            "zone": "Centrum", "score": 70, "confidence": 60,
            "reason": "Standard – bymidten har altid efterspørgsel",
            "tip": "", "backup_zone": "Nørreport", "backup_score": 65,
            "status": "fallback", "last_result": "Fallback aktiveret",
        }
