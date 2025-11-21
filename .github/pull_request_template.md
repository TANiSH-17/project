## Summary
Implement MVP for Creator Rewards Platform with web (Next.js), API (NestJS+Prisma), worker (BullMQ), and Docker infra. Includes campaigns, applications, approvals, tracking, accruals/locking, payouts (demo), and seed/demo UX.

## What changed
- apps/web: pages for campaigns, admin (new campaign, applications, participants), participant flows (apply, submit), My pages (dashboard, earnings, billing), demo page
- apps/api: campaigns/applications/participants/tracking/payouts/users/admin/stripe modules, DTO validation, Auth/roles scaffolding, scheduler, queues; Prisma schema and migrations
- apps/worker: accrual + locking processors; views simulation for VIEWS campaigns
- infra: Postgres+Redis docker-compose, app Dockerfiles and top-level compose
- packages: shared types, typed API client
- docs: architecture, data model, API outline, security/fraud, roadmap, test strategy, openapi.yaml

## How to run
- docker compose up --build
- Visit http://localhost:3000/demo and click "Seed demo data"
- Approve apps at /admin/applications; generate clicks via /t/<code>; see metrics at /dashboard and /me

## Notes / Follow-ups
- Replace header-based demo auth with real provider (Clerk/Auth0); wire JwtGuard
- Stripe webhook signature and account status flow
- Social metrics integrations (YouTube) and MetricSnapshot from API
- OpenAPI-driven client across web + tests + CI enhancements
- Anti-abuse hardening, budget pacing controls
