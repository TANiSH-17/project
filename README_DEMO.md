# One-command local demo

Run everything with Docker, seed demo data, and open the browser.

## Start
- ./scripts/start_demo.sh
  - Builds and starts docker compose stack (db, redis, api, worker, web)
  - Waits for API to be healthy
  - Calls POST /admin/seed with x-admin-key
  - Opens http://localhost:3000/demo

(If you need to customize ports/keys)
- API_URL=http://localhost:4000 WEB_URL=http://localhost:3000 ADMIN_KEY=dev-admin ./scripts/start_demo.sh

## Stop
- ./scripts/stop_demo.sh
  - Stops containers and removes volumes

Notes
- Requires Docker and curl on your machine.
- First build can take a few minutes.
