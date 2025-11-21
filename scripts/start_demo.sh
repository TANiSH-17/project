#!/usr/bin/env bash
set -euo pipefail

# Start full stack with Docker and seed demo data, then open the site.
# Requirements: docker compose, curl

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

echo "[1/4] Building and starting Docker stack..."
docker compose up -d --build

# Wait for API to be up
API_URL=${API_URL:-http://localhost:4000}
WEB_URL=${WEB_URL:-http://localhost:3000}
ADMIN_KEY=${ADMIN_KEY:-dev-admin}

echo "[2/4] Waiting for API at $API_URL ..."
ATTEMPTS=60
until curl -s "$API_URL/health" >/dev/null || [ $ATTEMPTS -eq 0 ]; do
  ATTEMPTS=$((ATTEMPTS-1))
  sleep 1
  echo -n .
done
if [ $ATTEMPTS -eq 0 ]; then
  echo "\nAPI did not become ready in time." >&2
  exit 1
fi

echo "\n[3/4] Seeding demo data..."
curl -s -X POST "$API_URL/admin/seed" \
  -H "x-admin-key: $ADMIN_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"campaigns":2}' | sed 's/.*/[seed] &/' || true

# Try to open browser
open_url() {
  local url="$1"
  if command -v xdg-open >/dev/null 2>&1; then xdg-open "$url" >/dev/null 2>&1 || true
  elif command -v open >/dev/null 2>&1; then open "$url" >/dev/null 2>&1 || true
  elif command -v start >/dev/null 2>&1; then start "$url" >/dev/null 2>&1 || true
  fi
}

echo "[4/4] Opening web: $WEB_URL/demo"
open_url "$WEB_URL/demo"

echo "Done. Visit: $WEB_URL/demo"
