import json
import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path

import uvicorn
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from .config import CACHE_TTL, DASHBOARD_DIR
from .agents.data_agent import DataAgent
from .agents.analysis_agent import AnalysisAgent
from .agents.ops_agent import OpsAgent
from .agents.sales_agent import SalesAgent
from .agents.demand_research_agent import DemandResearchAgent
from .agents.verification_agent import VerificationAgent
from .agents.business_signal_agent import BusinessSignalAgent
from .agents.contract_hunter_agent import ContractHunterAgent
from .agents.learning_agent import LearningAgent
from . import alerts, history

_FEEDBACK_PATH = Path(__file__).parent.parent / "data" / "feedback.jsonl"


class FeedbackIn(BaseModel):
    city: str
    entity_name: str
    entity_type: str
    recommendation_type: str
    score: int
    feedback: str

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

# ── Agents ────────────────────────────────────────────────────────
_data_agent = DataAgent()
_analysis_agent = AnalysisAgent()
_ops_agent = OpsAgent()
_sales_agent = SalesAgent()
_demand_agent = DemandResearchAgent()
_verification_agent = VerificationAgent()
_business_agent = BusinessSignalAgent()
_contract_agent = ContractHunterAgent()
_learning_agent = LearningAgent()

_cache: dict = {"data": None, "ts": None}


def _build() -> dict:
    signals = _data_agent.run()
    analysis = _analysis_agent.run(signals)
    ops = _ops_agent.run(analysis["zone_scores"], signals)
    sales = _sales_agent.run(signals, analysis)
    hist = history.analyze()
    alert_list = alerts.generate(signals, analysis["zone_scores"], signals.get("weather", {}))

    return {
        "overview": {
            "predicted_demand": analysis["overall_demand"],
            "demand_label": analysis["demand_label"],
            "top_zone": analysis["zone_scores"][0]["zone"] if analysis["zone_scores"] else "–",
            "earning_potential": analysis["earning_potential"],
            "active_alerts": len(alert_list),
            "new_leads": sales["new_leads"],
            "time_label": analysis["time_label"],
            "weekday_name": signals["weekday_name"],
        },
        "agents": {
            "data": {
                "name": _data_agent.name, "status": signals["status"],
                "last_result": f"Vejr: {signals['weather']['description']} · {len(signals['active_events'])} aktive events",
            },
            "analysis": {
                "name": _analysis_agent.name, "status": analysis["status"],
                "last_result": analysis["last_result"],
            },
            "ops": {
                "name": _ops_agent.name, "status": ops["status"],
                "last_result": ops["last_result"],
            },
            "sales": {
                "name": _sales_agent.name, "status": sales["status"],
                "last_result": sales["last_result"],
            },
        },
        "zones": analysis["zone_scores"],
        "recommendation": ops,
        "events": signals["upcoming_events"],
        "active_events": signals["active_events"],
        "alerts": alert_list,
        "leads": sales["leads"],
        "history": hist,
        "weather": signals["weather"],
        "timestamp": signals["timestamp"],
    }


def _cached() -> dict:
    now = datetime.now(timezone.utc)
    if _cache["ts"] and (now - _cache["ts"]).total_seconds() < CACHE_TTL:
        return {**_cache["data"], "cached": True}
    data = _build()
    _cache["data"] = data
    _cache["ts"] = now
    return {**data, "cached": False}


def _html(filename: str) -> HTMLResponse:
    path = DASHBOARD_DIR / filename
    try:
        return HTMLResponse(content=path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"{filename} ikke fundet")


# ── App lifecycle ─────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("Zyflex AI Command Center starting up")
    log.info("Dashboard dir: %s | Data dir: %s | Cache TTL: %ss", DASHBOARD_DIR, DASHBOARD_DIR.parent / "data", CACHE_TTL)
    try:
        _build()
        log.info("Cache pre-warmed successfully")
    except Exception as exc:
        log.warning("Cache pre-warm failed (non-fatal): %s", exc)
    yield
    log.info("Zyflex AI shutting down")


# ── FastAPI app ───────────────────────────────────────────────────
app = FastAPI(title="Zyflex AI Command Center", version="2.0.0", lifespan=lifespan)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["GET", "POST"], allow_headers=["*"])

if DASHBOARD_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(DASHBOARD_DIR)), name="static")


# ── Routes ────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "ts": datetime.now(timezone.utc).isoformat(), "version": "2.0.0"}


@app.get("/api/dashboard")
def get_dashboard():
    try:
        return _cached()
    except Exception as exc:
        log.error("dashboard error: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Intern serverfejl")


@app.get("/api/recommendation")
def get_recommendation():
    """Single call for driver earnings view — includes zones, fares, events, alerts."""
    try:
        data = _cached()
        return {
            **data["recommendation"],
            "weather":          data["weather"],
            "active_events":    data["active_events"],
            "top_zones":        data["zones"][:3],
            "zone_fares":       data["history"]["zone_avg_fares"],
            "upcoming_events":  data["events"][:4],
            "alerts":           data["alerts"],
            "demand_label":     data["overview"]["demand_label"],
        }
    except Exception as exc:
        log.error("recommendation error: %s", exc)
        raise HTTPException(status_code=500, detail="Fejl ved anbefaling")


@app.get("/api/alerts")
def get_alerts():
    try:
        return {"alerts": _cached()["alerts"]}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ── Phase 1: Demand Research AI endpoints ────────────────────────

@app.get("/ai/demand-research")
def ai_demand_research(city: str = Query(default="København", description="Dansk bynavn")):
    """Finder efterspørgselssignaler nu og de næste 20-60 min."""
    try:
        return _demand_agent.run(city=city)
    except Exception as exc:
        log.error("demand-research error: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Fejl ved efterspørgselsanalyse")


@app.get("/ai/verified-demand")
def ai_verified_demand(city: str = Query(default="København", description="Dansk bynavn")):
    """Efterspørgselsanalyse med verificering af dato, by, kilde og relevans."""
    try:
        raw = _demand_agent.run(city=city)
        return _verification_agent.run(raw)
    except Exception as exc:
        log.error("verified-demand error: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Fejl ved verificeret efterspørgsel")


@app.get("/ai/business-signals")
def ai_business_signals(city: str = Query(default="København", description="Dansk bynavn")):
    """Finder B2B-signaler: hoteller, hospitaler, virksomheder, venues, skoler, klinikker."""
    try:
        return _business_agent.run(city=city)
    except Exception as exc:
        log.error("business-signals error: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Fejl ved virksomhedssignaler")


@app.get("/ai/contracts")
def ai_contracts(city: str = Query(default="København", description="Dansk bynavn")):
    """Kontraktmuligheder – top 10 virksomheder med fuld kontaktinfo og potential score."""
    try:
        return _contract_agent.run(city=city)
    except Exception as exc:
        log.error("contracts error: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Fejl ved kontraktanalyse")


# ── Phase 3: Learning Agent endpoints ────────────────────────────

@app.post("/ai/feedback")
def ai_feedback(body: FeedbackIn):
    """Gem 👍/👎 feedback til feedback.jsonl."""
    try:
        if body.feedback not in ("positive", "negative"):
            raise HTTPException(status_code=422, detail="feedback skal være 'positive' eller 'negative'")
        record = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "city": body.city,
            "entity_name": body.entity_name,
            "entity_type": body.entity_type,
            "recommendation_type": body.recommendation_type,
            "score": body.score,
            "feedback": body.feedback,
        }
        _FEEDBACK_PATH.parent.mkdir(parents=True, exist_ok=True)
        with _FEEDBACK_PATH.open("a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
        log.info("feedback saved: %s / %s / %s", body.entity_name, body.city, body.feedback)
        return {"status": "ok", "saved": True}
    except HTTPException:
        raise
    except Exception as exc:
        log.error("feedback error: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Fejl ved gemning af feedback")


@app.get("/ai/learning/report")
def ai_learning_report():
    """Læringsrapport – mønstre, accuracy og forbedringer baseret på feedback."""
    try:
        return _learning_agent.report()
    except Exception as exc:
        log.error("learning report error: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Fejl ved læringsrapport")


@app.get("/", response_class=HTMLResponse)
def admin():
    return _html("index.html")


@app.get("/driver", response_class=HTMLResponse)
def driver():
    return _html("driver.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False)
