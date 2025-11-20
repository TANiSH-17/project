# Dev Setup

Prereqs: pnpm, Node 18+, Docker if using compose.

1. Copy .env.example to apps/web/.env.local and apps/api/.env
2. Start infra: docker compose -f infra/docker-compose.yml up -d (or use top-level docker-compose.yml to run full stack)
3. Install deps: pnpm i
4. Generate Prisma client and migrate:
   - cd apps/api
   - pnpm exec prisma migrate dev --name init
5. (Optional) Set admin key by adding ADMIN_KEY to apps/api/.env to protect admin endpoints
6. Run dev:
   - pnpm dev

Web runs on :3000, API on :4000.

Worker (local dev)
- In a separate terminal: cd apps/worker && pnpm dev

CI
- A basic GitHub Actions workflow builds all packages on push/PR to main
