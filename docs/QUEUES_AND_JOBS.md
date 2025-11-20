# Queues and Jobs

## Queues (BullMQ)
- ingestion: fetch metrics from social APIs
- verification: validate submissions, duplicates, policy compliance
- accruals: compute earnings and apply holds
- payouts: batch payouts, reconcile, retries
- notifications: email/push/in-app
- risk: anomaly detection, velocity checks, denylist enforcement

## Job Idempotency
- Use deterministic job IDs: `${type}:${participationId}:${window}`
- Record job status and last processed watermark per participation

## Scheduling
- Cron: every 10m fetch metrics for active submissions
- Daily: budget pacing, summary emails, payout batching
- Weekly: clean up old raw data, archive logs
