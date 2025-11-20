FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/worker/package.json apps/worker/
COPY apps/api/prisma ./apps/api/prisma
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
RUN pnpm fetch
RUN pnpm install -r --prefer-offline
COPY apps/worker ./apps/worker
RUN pnpm --filter worker build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/apps/worker/dist ./dist
COPY --from=base /app/apps/worker/node_modules ./node_modules
COPY --from=base /app/apps/api/prisma ./prisma
EXPOSE 4001
CMD ["node", "dist/index.js"]
