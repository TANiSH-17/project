# Data Model

This is a conceptual model; adapt the schema for the chosen ORM (Prisma/TypeORM).

## Entities
- User(id, email, handle, role, status, created_at)
- Profile(user_id, display_name, avatar_url, socials[], kyc_status)
- Brand(id, owner_user_id, name, description, verified, created_at)
- Campaign(id, brand_id, title, brief, guidelines, start_at, end_at, status, budget_total, budget_remaining, currency, metric_type, rate_per_thousand, daily_cap, per_user_cap, max_participants, approval_mode, created_at)
- CampaignCreative(campaign_id, asset_url, type, notes)
- Application(id, campaign_id, user_id, message, status, reviewed_by, created_at)
- Participation(id, campaign_id, user_id, application_id, status, tracking_link, slot_assigned_at)
- ContentSubmission(id, participation_id, platform, post_url, post_id, submitted_at, status, notes)
- MetricSnapshot(id, participation_id, platform, metric_type, value, observed_at, source, raw)
- EarningAccrual(id, participation_id, metric_type, value, amount, currency, status, hold_until, created_at)
- LedgerEntry(id, type, debit_account, credit_account, amount, currency, reference_type, reference_id, created_at)
- Payout(id, user_id, amount, currency, status, initiated_at, completed_at, processor_ref)
- AuditLog(id, actor_user_id, action, target_type, target_id, metadata, created_at)
- Denylist(id, user_id, reason, created_at) / Allowlist(id, user_id, reason, created_at)
- WebhookEndpoint(id, brand_id, url, secret, event_types[], created_at)
- ApiKey(id, brand_id, name, key_hash, scopes[], created_at)

## Status State Machines
- Campaign: draft → reviewing → published → paused → completed/closed
- Application: submitted → approved/rejected
- Participation: active → completed → paid (or rejected)
- ContentSubmission: pending_review → verified → rejected
- EarningAccrual: pending → locked → paid → clawed_back

## Derived Views
- CampaignPerformance(campaign_id, spend_to_date, participants_active, cpm_effective, budget_remaining)
- UserEarnings(user_id, pending, locked, paid)

## Constraints & Indexes (examples)
- Unique: (campaign_id, user_id) on Participation
- Indexes: MetricSnapshot(participation_id, metric_type, observed_at desc)
- Partial indexes on active campaigns and approved participations
- Foreign keys with cascade on delete where appropriate
