FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.15.0

FROM base AS builder

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages ./packages
COPY services/api ./services/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages
RUN pnpm --filter @quill/shared build
RUN pnpm --filter @quill/api build

FROM base AS runner

WORKDIR /app

# Copy built files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/api/dist ./services/api/dist
COPY --from=builder /app/services/api/package.json ./services/api/package.json
COPY config ./config

WORKDIR /app/services/api

ENV NODE_ENV=production

EXPOSE 8787

CMD ["node", "dist/index.js"]
