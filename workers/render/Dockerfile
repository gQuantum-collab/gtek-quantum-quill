FROM node:20-alpine AS base

# Install FFmpeg
RUN apk add --no-cache ffmpeg

# Install pnpm
RUN npm install -g pnpm@8.15.0

FROM base AS builder

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages ./packages
COPY workers/render ./workers/render

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages
RUN pnpm --filter @quill/shared build
RUN pnpm --filter @quill/render-worker build

FROM base AS runner

WORKDIR /app

# Copy built files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/workers/render/dist ./workers/render/dist
COPY --from=builder /app/workers/render/package.json ./workers/render/package.json

WORKDIR /app/workers/render

ENV NODE_ENV=production

CMD ["node", "dist/render.js"]
