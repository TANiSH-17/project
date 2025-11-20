# API Spec (Outline)

This is an outline suitable to expand into an OpenAPI spec.

## Auth
- POST /auth/login, POST /auth/callback — via OAuth provider
- GET /me — current user profile and roles

## Brands & Users
- POST /brands, GET /brands/:id, PATCH /brands/:id
- GET /users/me, PATCH /users/me

## Campaigns
- POST /campaigns — create draft (brand role)
- GET /campaigns — list (filters: status, brand, metric_type)
- GET /campaigns/:id
- PATCH /campaigns/:id — update (status transitions controlled)
- POST /campaigns/:id/publish — validate & publish
- POST /campaigns/:id/pause — pause
- GET /campaigns/:id/performance — KPIs

## Applications & Participation
- POST /campaigns/:id/applications — apply (user)
- GET /campaigns/:id/applications — list (brand/admin)
- POST /applications/:id/approve | /reject
- POST /campaigns/:id/participants — add participant (allowlist)
- GET /campaigns/:id/participants — list

## Content & Tracking
- POST /participants/:id/submissions — submit content (URL, platform)
- GET /participants/:id/submissions
- POST /tracking/click — record click with tracking_id
- GET /participants/:id/metrics — time series

## Earnings & Payouts
- GET /participants/:id/earnings — accruals and totals
- POST /payouts — request or trigger payout
- GET /payouts — list by user

## Admin
- GET /admin/audit-logs
- POST /admin/denylist, POST /admin/allowlist
- POST /admin/recompute-earnings — reprocess window

## Webhooks
- POST /webhooks/:source — receive events (e.g., Stripe)
- POST /webhooks/brands/:id — deliver events to brand webhooks (signed)

## Notes
- All mutating endpoints idempotent via Idempotency-Key
- Rate limits and pagination required
