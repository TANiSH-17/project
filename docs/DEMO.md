# Demo Guide

## Quick start (Docker)
- docker compose up --build
- Open http://localhost:3000/demo and click "Seed demo data"
- Explore:
  - Campaigns: /campaigns
  - Approvals: /admin/applications (set localStorage role to ADMIN if needed)
  - Tracking: use shown /t/<code> links
  - Participant: /dashboard (enter Participation ID), /me, /me/earnings, /me/billing

## Local dev
- cp .env.example apps/api/.env and apps/web/.env.local
- docker compose -f infra/docker-compose.yml up -d
- pnpm install
- cd apps/api && pnpm exec prisma migrate dev --name init
- pnpm dev (web+api) and in another terminal cd apps/worker && pnpm dev

## Seeding
- Web one-click: /demo (calls POST /admin/seed)
- API:
  - curl -X POST http://localhost:4000/admin/seed -H 'x-admin-key: dev-admin' -H 'Content-Type: application/json' -d '{"campaigns":2}'
