import logging
import os
from datetime import datetime, timezone

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from agents.analysis_agent import AnalysisAgent
from agents.data_agent import DataAgent
from agents.ops_agent import OpsAgent

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Zyflex AI", description="Smart Taxi Intelligence System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

data_agent = DataAgent()
analysis_agent = AnalysisAgent()
ops_agent = OpsAgent()

# 5-minute recommendation cache to avoid re-computing every request
_cache: dict = {"data": None, "ts": None}
_CACHE_TTL = 300


def _get_recommendation() -> dict:
    now = datetime.now(timezone.utc)
    if _cache["ts"] and (now - _cache["ts"]).total_seconds() < _CACHE_TTL:
        return {**_cache["data"], "cached": True}

    signals = data_agent.get_signals()
    zone_scores = analysis_agent.score_zones(signals)
    result = ops_agent.generate_instruction(zone_scores, signals)
    _cache["data"] = result
    _cache["ts"] = now
    return {**result, "cached": False}


@app.get("/health")
def health():
    return {"status": "ok", "ts": datetime.now(timezone.utc).isoformat()}


@app.get("/api/recommendation")
def recommendation():
    try:
        return _get_recommendation()
    except Exception as exc:
        logger.error("recommendation error: %s", exc)
        raise HTTPException(status_code=500, detail="Kunne ikke generere anbefaling")


@app.get("/api/zones")
def zones():
    try:
        signals = data_agent.get_signals()
        scores = analysis_agent.score_zones(signals)
        return {"zones": scores, "signals": signals}
    except Exception as exc:
        logger.error("zones error: %s", exc)
        raise HTTPException(status_code=500, detail="Kunne ikke hente zone-data")


@app.get("/api/events")
def events():
    return {"events": data_agent.get_upcoming_events()}


@app.get("/", response_class=HTMLResponse)
def dashboard():
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "dashboard.html")
    try:
        with open(path, encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Dashboard ikke fundet")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
