# Test Strategy

- Unit tests: business rules (accruals, state machines, budget checks)
- Integration tests: API endpoints, DB interactions, Stripe webhooks
- E2E tests: critical flows (apply → earn → payout) using Playwright
- Load tests: metric ingestion and payouts under scale
- Security tests: authZ, idempotency, rate limits
- QA checklists: release gates
