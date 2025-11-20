# Creator Rewards Platform (Performance-Based Campaigns)

A platform where large creators/brands publish performance-based campaigns with budgets and payout rules (e.g., CPM). Users (creators, micro-influencers, fans) can apply, produce content, and earn payouts when their content reaches engagement thresholds (views, clicks, conversions).

This project is a robust, scalable, and compliant blueprint with an implementation plan.

- Campaigns: budget, CPM/CPA rules, targeting, content guidelines, review rules
- Applications: apply/accept flows, slots/caps per user, allowlist/denylist
- Tracking & Attribution: unique links, post verification, social APIs, pixels, webhooks
- Payouts: real-time accruals, holds, KYC/Tax, payment via Stripe Connect (or PayPal/Tipalti)
- Anti-Fraud & Trust: automated checks, manual review, audit logs, rate limits
- Admin Ops: campaign QA, disputes, refunds, chargebacks, clawbacks
- Observability: analytics, dashboards, alerts

See docs/ for design details and the roadmap for the MVP → V1 → V2.

## Tech Stack (reference implementation)
- Frontend: Next.js (App Router) + TypeScript + Tailwind + React Query
- Backend: Node.js (TypeScript) with NestJS (or Fastify) + PostgreSQL + Prisma
- Background/Queue: BullMQ (Redis) for ingestion, verification, payouts
- Caching: Redis
- Object Storage: S3-compatible (e.g., AWS S3) for assets and evidence
- Auth: OAuth/OIDC (Clerk/Auth0/Cognito) + JWT session tokens
- Payments/KYC: Stripe Connect (Custom) + Stripe Identity for KYC; tax forms via Stripe Tax/TaxBit
- Observability: OpenTelemetry + Prometheus + Grafana + ELK; Sentry for errors
- Infra: Docker + Terraform; deploy on AWS (ECS/EKS) or Fly.io

## Getting Started (placeholder)
Implementation not yet generated. See docs/ROADMAP.md for milestones.

## License
TBD.
