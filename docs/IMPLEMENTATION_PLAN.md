# Implementation Plan

## Milestones
1. Project setup (monorepo, CI/CD, IaC)
2. Auth & profiles (OAuth, RBAC)
3. Brands & campaigns (CRUD, publish flow)
4. Applications & participation
5. Tracking links & basic click tracking
6. Submissions & manual verification
7. Earnings accrual logic (pending)
8. Admin panel basics
9. Stripe Connect sandbox integration
10. Locking, payouts, and batch reconciliation
11. Social API integrations (YouTube first)
12. Analytics dashboards and alerts

## Tech Choices
- Monorepo with Turbo/PNPM; Next.js for web, NestJS for API, shared types
- Prisma + PostgreSQL; Redis + BullMQ

## CI/CD
- GitHub Actions: lint, typecheck, test, build, migrate
- Preview deployments for PRs

## Environments
- Dev, Staging, Prod with separate databases and keys
