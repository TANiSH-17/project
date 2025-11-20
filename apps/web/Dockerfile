FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/web/package.json apps/web/
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
RUN pnpm fetch
RUN pnpm install -r --prefer-offline
COPY apps/web ./apps/web
RUN pnpm --filter web build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/apps/web/.next ./.next
COPY --from=base /app/apps/web/node_modules ./node_modules
COPY --from=base /app/apps/web/package.json ./package.json
EXPOSE 3000
CMD ["node_modules/.bin/next", "start", "-p", "3000"]
