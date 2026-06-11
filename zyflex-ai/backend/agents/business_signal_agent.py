import logging
import os
from typing import Any, Dict, List

import requests

log = logging.getLogger(__name__)

_STATIC: Dict[str, List[Dict]] = {
    "Horsens": [
        {"name": "Horsens Sygehus", "type": "Hospital", "opportunity": "Patienttransport-kontrakt", "priority": 88, "action": "Kontakt indkøbsafdelingen – tilbyd månedlig transportaftale"},
        {"name": "Horsens Kommune", "type": "Kommune", "opportunity": "Social transport & handicapkørsel", "priority": 85, "action": "Afgiv tilbud på næste udbud via Udbud.dk"},
        {"name": "Hotel Opus Horsens", "type": "Hotel", "opportunity": "Gæstetransport & airport-transfer", "priority": 80, "action": "Kontakt concierge-chef – forhandl fast transfer-rate"},
        {"name": "CASA Arena Horsens", "type": "Venue", "opportunity": "Event- og koncerttransport", "priority": 78, "action": "Kontakt event-koordinator – tilbyd sæsonaftale"},
        {"name": "CLEAN (Biogasklynge)", "type": "Virksomhed", "opportunity": "Medarbejdertransport", "priority": 74, "action": "Book møde med HR/facilities manager"},
        {"name": "VIA University College Horsens", "type": "Uddannelse", "opportunity": "Studerende & personaletransport", "priority": 70, "action": "Kontakt administrationen – tilbyd studiestarts-kørsel"},
        {"name": "Horsens Privatskole", "type": "Skole", "opportunity": "Skoletransport-aftale", "priority": 66, "action": "Kontakt skolelederen – tilbyd fast morgen/eftermiddagskørsel"},
        {"name": "Lægeklinik Horsens Centrum", "type": "Klinik", "opportunity": "Patient-kørsel & hjemtransport", "priority": 72, "action": "Kontakt klinikleder – tilbyd patient-hjemtransport"},
    ],
    "København": [
        {"name": "Rigshospitalet", "type": "Hospital", "opportunity": "Fast patienttransport-kontrakt", "priority": 92, "action": "Kontakt indkøbsafdelingen – tilbyd månedlig transportaftale"},
        {"name": "Frederiksberg Kommune", "type": "Kommune", "opportunity": "Social transport & handicapkørsel", "priority": 88, "action": "Afgiv tilbud på næste udbud via Udbud.dk"},
        {"name": "Mærsk HQ", "type": "Virksomhed", "opportunity": "Executive transport & lufthavn-transfers", "priority": 85, "action": "Book møde med facilities manager"},
        {"name": "Comwell Hotels", "type": "Hotel", "opportunity": "Airport transfer + gæstetransport", "priority": 80, "action": "Møde med F&B/concierge ansvarlig"},
        {"name": "Bella Center (MCH)", "type": "Venue", "opportunity": "Messekørsel og event-transport", "priority": 74, "action": "Kontakt event-koordinator – sæsonaftale"},
        {"name": "KU – Københavns Universitet", "type": "Uddannelse", "opportunity": "Studerende & personaletransport", "priority": 68, "action": "Kontakt administrationen – tilbyd studiestarts-kørsel"},
        {"name": "Hilton Copenhagen Airport", "type": "Hotel", "opportunity": "Hotel↔by transfer-aftale", "priority": 78, "action": "Kontakt concierge-chef – forhandl fast transfer-rate"},
        {"name": "Nørrebro Lægeklinik", "type": "Klinik", "opportunity": "Patient-kørsel", "priority": 70, "action": "Kontakt klinikleder – tilbyd patient-hjemtransport"},
    ],
    "Aarhus": [
        {"name": "Aarhus Universitetshospital", "type": "Hospital", "opportunity": "Patienttransport-kontrakt", "priority": 91, "action": "Kontakt indkøbsafdelingen – tilbyd månedlig transportaftale"},
        {"name": "Aarhus Kommune", "type": "Kommune", "opportunity": "Social transport & handicapkørsel", "priority": 87, "action": "Afgiv tilbud på næste udbud via Udbud.dk"},
        {"name": "Bestseller A/S", "type": "Virksomhed", "opportunity": "Medarbejdertransport", "priority": 80, "action": "Book møde med HR/facilities manager"},
        {"name": "Hotel Royal Aarhus", "type": "Hotel", "opportunity": "Gæstetransport & airport-transfer", "priority": 76, "action": "Kontakt concierge-chef – forhandl fast transfer-rate"},
        {"name": "Aarhus Universitet", "type": "Uddannelse", "opportunity": "Studerende & personaletransport", "priority": 72, "action": "Kontakt administrationen – tilbyd studiestarts-kørsel"},
        {"name": "Ceres Park (AGF)", "type": "Venue", "opportunity": "Event- og kampagnetransport", "priority": 75, "action": "Kontakt event-koordinator – tilbyd sæsonaftale"},
    ],
    "Odense": [
        {"name": "OUH Odense Universitetshospital", "type": "Hospital", "opportunity": "Patienttransport-kontrakt", "priority": 90, "action": "Kontakt indkøbsafdelingen – tilbyd månedlig transportaftale"},
        {"name": "Odense Kommune", "type": "Kommune", "opportunity": "Social transport & handicapkørsel", "priority": 86, "action": "Afgiv tilbud på næste udbud via Udbud.dk"},
        {"name": "Syddansk Universitet SDU", "type": "Uddannelse", "opportunity": "Studerende & personaletransport", "priority": 72, "action": "Kontakt administrationen – tilbyd studiestarts-kørsel"},
        {"name": "Odeon Odense", "type": "Venue", "opportunity": "Event- og koncerttransport", "priority": 76, "action": "Kontakt event-koordinator – tilbyd sæsonaftale"},
    ],
}

_DEFAULT: List[Dict] = [
    {"name": "Lokalt sygehus", "type": "Hospital", "opportunity": "Patienttransport-kontrakt", "priority": 85, "action": "Kontakt indkøbsafdelingen – tilbyd månedlig transportaftale"},
    {"name": "Kommunen", "type": "Kommune", "opportunity": "Social transport & handicapkørsel", "priority": 82, "action": "Afgiv tilbud på næste udbud via Udbud.dk"},
    {"name": "Nærliggende hotel", "type": "Hotel", "opportunity": "Gæstetransport", "priority": 75, "action": "Kontakt concierge-chef – forhandl fast transfer-rate"},
    {"name": "Lokalt venue", "type": "Venue", "opportunity": "Event-transport", "priority": 70, "action": "Kontakt event-koordinator – tilbyd sæsonaftale"},
    {"name": "Uddannelsesinstitution", "type": "Uddannelse", "opportunity": "Transport-aftale", "priority": 65, "action": "Kontakt administrationen – tilbyd studiestarts-kørsel"},
]


class BusinessSignalAgent:
    name = "Business Signal Agent"

    def run(self, city: str = "København") -> Dict[str, Any]:
        places = self._fetch_places(city)
        businesses = places if places else _STATIC.get(city, _DEFAULT)
        businesses = sorted(businesses, key=lambda x: x.get("priority", 0), reverse=True)

        return {
            "city": city,
            "businesses": businesses[:10],
            "contract_opportunities": [b for b in businesses if b.get("priority", 0) >= 78][:5],
            "by_type": _group_by_type(businesses),
            "top_priority": businesses[0] if businesses else None,
            "source": "google_places" if places else "static",
            "status": "ok",
        }

    def _fetch_places(self, city: str) -> List[Dict]:
        api_key = os.getenv("GOOGLE_PLACES_KEY", "")
        if not api_key:
            return []

        results: List[Dict] = []
        types = [
            ("hospital", "Hospital", "Patienttransport-kontrakt"),
            ("lodging", "Hotel", "Gæstetransport & airport-transfer"),
            ("school", "Skole", "Skoletransport-aftale"),
        ]

        for place_type, label, opp in types:
            try:
                r = requests.get(
                    "https://maps.googleapis.com/maps/api/place/textsearch/json",
                    params={"query": f"{place_type} i {city}", "key": api_key, "language": "da"},
                    timeout=6,
                )
                r.raise_for_status()
                for p in r.json().get("results", [])[:3]:
                    rating = float(p.get("rating", 3.5))
                    results.append({
                        "name": p.get("name", ""),
                        "type": label,
                        "opportunity": opp,
                        "priority": min(90, int(rating / 5.0 * 70 + 25)),
                        "action": _action_for_type(label),
                        "address": p.get("formatted_address", ""),
                    })
            except Exception as exc:
                log.warning("Google Places fejlede for %s/%s: %s", city, place_type, exc)

        return results


def _group_by_type(businesses: List[Dict]) -> Dict[str, List]:
    grouped: Dict[str, List] = {}
    for b in businesses:
        t = b.get("type", "Andet")
        grouped.setdefault(t, []).append({"name": b["name"], "priority": b.get("priority", 0)})
    return grouped


def _action_for_type(biz_type: str) -> str:
    actions = {
        "Hospital": "Kontakt indkøbsafdelingen – tilbyd månedlig transportaftale",
        "Hotel": "Kontakt concierge-chef – forhandl fast transfer-rate",
        "Virksomhed": "Book møde med HR/facilities manager",
        "Venue": "Kontakt event-koordinator – tilbyd sæsonaftale",
        "Uddannelse": "Kontakt administrationen – tilbyd studiestarts-kørsel",
        "Kommune": "Afgiv tilbud på næste udbud via Udbud.dk",
        "Skole": "Kontakt skolelederen – tilbyd fast morgen/eftermiddagskørsel",
        "Klinik": "Kontakt klinikleder – tilbyd patient-hjemtransport",
    }
    return actions.get(biz_type, "Kontakt beslutningstageren – tilbyd transportaftale")
