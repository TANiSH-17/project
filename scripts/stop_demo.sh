#!/usr/bin/env bash
set -euo pipefail

# Stop and remove the Docker stack
ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

echo "Stopping Docker stack..."
docker compose down -v

echo "Done."
