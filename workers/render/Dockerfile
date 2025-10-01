FROM node:18-alpine AS base

# Install pnpm and ffmpeg
RUN apk add --no-cache ffmpeg
RUN npm config set strict-ssl false && npm install -g pnpm@9.0.0 && npm config set strict-ssl true

FROM base AS deps
WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY workers/render/package.json ./workers/render/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/workers/render/node_modules ./workers/render/node_modules

# Copy source
COPY packages/shared ./packages/shared
COPY workers/render ./workers/render
COPY turbo.json ./turbo.json

# Build shared package first
WORKDIR /app/packages/shared
RUN pnpm run build

# Build render worker
WORKDIR /app/workers/render
RUN pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/workers/render/dist ./workers/render/dist
COPY --from=builder /app/workers/render/package.json ./workers/render/package.json
COPY --from=deps /app/node_modules ./node_modules

USER nodejs

WORKDIR /app/workers/render

CMD ["node", "dist/index.js"]
