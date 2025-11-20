# Security, Compliance, and Anti-Fraud

## Security
- JWT with short-lived access tokens and refresh rotation
- RBAC with per-resource policy checks (brand owns campaign)
- Encrypt sensitive columns (api keys, payout details)
- Secrets management via environment (Vault/SSM); never store raw access tokens unencrypted
- Audit logs for privileged actions

## Compliance
- KYC/AML for payout-eligible users via Stripe Identity/Connect
- Tax forms collection (W-9/W-8) and year-end reporting
- GDPR/CCPA: export/delete; clear privacy policy and consent for tracking

## Anti-Fraud Strategies
- Multi-signal risk scoring: device fingerprint, IP reputation, geo anomalies
- Velocity limits: per-user campaign joins, per-hour metric spikes
- Content similarity detection (hashing) to avoid duplicate spam
- Social verification: verify account ownership via OAuth or signed posts
- View authenticity checks: prefer platform-reported views; devalue self-reported
- Hold periods before locking earnings; clawback if metrics are later invalidated
- Manual review queues; dispute workflows; sample audits

## Abuse & Integrity Controls
- Per-campaign and global denylist/allowlist
- Default throttling of daily spend; hibernation on anomalies
- Idempotent accounting with double-entry ledger; immutable history
