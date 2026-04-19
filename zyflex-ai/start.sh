#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "⚡ Zyflex AI – Starting..."
echo ""

# Install dependencies if needed
pip install -r requirements.txt -q

# Export defaults if not already set
export TZ="${TZ:-Europe/Copenhagen}"
export PORT="${PORT:-8000}"
export CACHE_TTL="${CACHE_TTL:-300}"

echo "  URL:      http://localhost:${PORT}"
echo "  Admin:    http://localhost:${PORT}/"
echo "  Driver:   http://localhost:${PORT}/driver"
echo "  Health:   http://localhost:${PORT}/health"
echo ""

uvicorn backend.main:app --host 0.0.0.0 --port "${PORT}" --reload
