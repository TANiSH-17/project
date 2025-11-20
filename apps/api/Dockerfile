FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY apps/api/prisma ./apps/api/prisma
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
RUN pnpm fetch
RUN pnpm install -r --prefer-offline
COPY apps/api ./apps/api
RUN pnpm --filter api build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/apps/api/dist ./dist
COPY --from=base /app/apps/api/node_modules ./node_modules
COPY --from=base /app/apps/api/package.json ./package.json
COPY apps/api/prisma ./prisma
EXPOSE 4000
CMD ["node", "dist/main.js"]
