FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.0.0

FROM base AS deps
WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY services/api/package.json ./services/api/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/services/api/node_modules ./services/api/node_modules

# Copy source
COPY packages/shared ./packages/shared
COPY services/api ./services/api

# Build shared package first
WORKDIR /app/packages/shared
RUN pnpm run build

# Build API service
WORKDIR /app/services/api
RUN pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/services/api/dist ./services/api/dist
COPY --from=builder /app/services/api/package.json ./services/api/package.json
COPY --from=deps /app/node_modules ./node_modules

USER nodejs

EXPOSE 3001

WORKDIR /app/services/api

CMD ["node", "dist/index.js"]
