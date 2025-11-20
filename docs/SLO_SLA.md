# SLOs, SLAs, and Capacity Planning

## SLOs (targets)
- API availability: 99.9%
- P99 latency: < 400ms for read, < 800ms for write
- Metric ingestion freshness: 95% within 15 minutes
- Payout job success: 99.5% within 24h of request

## Error Budgets and Alerts
- Burn rate policies with multi-window alerts
- On-call runbooks per service

## Capacity
- Start with t-shirt sizing: API (2–3 instances), Workers (autoscale), Redis (managed), Postgres (managed)
