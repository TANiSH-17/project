# Architecture

This document describes the system architecture of the Creator Rewards Platform.

## High-Level Components
- Web App (Next.js): public marketing pages, campaign browsing, application flows, dashboards
- API Gateway + Backend (NestJS): REST/GraphQL API, auth, business logic, rate limiting
- Worker Services: async jobs for tracking ingestion, verification, payouts, emails/notifications
- Database: PostgreSQL (primary), Redis (cache/queue), S3 (evidence/exports)
- Third-Party Integrations: Stripe Connect, Stripe Identity, social APIs (YouTube, TikTok, Instagram, X), link shortener, email provider
- Admin Panel: internal tool (e.g., Next.js or Retool) for ops, QA, payouts review, disputes

## Data Flow (Text Diagram)
[Clients] → HTTP → [API] → [Postgres]
                           ↘︎ enqueue → [Redis/BullMQ] → [Workers] → [Social APIs/Stripe/S3]

## Tenants and Roles
- Tenants: single-tenant initially; support org-level accounts for brands/creators later
- Roles: Admin, Brand/Creator, Participant (user), Reviewer, Finance

## Key Services
1. Identity & Access
   - OAuth/OIDC, role-based access control, policy checks
   - KYC for payout eligibility; 2FA recommended

2. Campaign Service
   - Create/edit/publish campaigns: budget, CPM, targeting, slots, start/end, creative brief
   - Lifecycle: Draft → Reviewing → Published → Paused → Completed/Closed
   - Budget accounting and throttling by day/hour to avoid overspend

3. Application/Participation Service
   - Users apply to campaigns; optional allowlist/auto-approval
   - Participation lifecycle: Applied → Approved → Active → Completed → Paid (or Rejected)
   - Caps per user (max participants, per-user max earnings)

4. Tracking & Attribution
   - Unique tracking links per participant
   - Evidence submission: post URLs, screenshots, links to content
   - API/webhooks: ingest post metrics; verify via platforms where possible
   - Pixel/Link tracking for clicks; view counts via social APIs when available

5. Earnings & Ledger
   - Compute earnings as CPM/metric: earnings = metric * rate_per_thousand / 1000
   - Separate pending vs. locked (after hold period) vs. paid; support clawbacks
   - Double-entry ledger to ensure consistency and auditable history

6. Payments
   - Stripe Connect Payouts; eligibility checks (KYC, balances); mass pay batches
   - Currency support (settlement currency), FX if needed; fees transparency

7. Anti-Fraud & Trust
   - Heuristics: velocity caps, geo/device signals, duplicate content detection
   - ML-ready feature store later; manual review workflows; dispute handling

8. Observability & Ops
   - Metrics, logs, traces; dashboards for campaigns and platform KPIs
   - Alerts on spend spikes, fraud signals, payout failures

## Scaling Strategy
- Start with a monorepo; modular services with clean boundaries
- Vertical scaling for API; horizontal scale workers for bursty jobs
- Read replicas for reporting; partition heavy tables by campaign_id
- Idempotent workers with retries and dead-letter queues

## Data Retention & Privacy
- PII minimization; encrypt sensitive fields at rest
- GDPR/CCPA readiness: data export/delete flows
- Only store necessary social IDs and metrics; avoid raw credentials where possible
