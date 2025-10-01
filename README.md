# QUILL Studio

AI-driven branding & ad studio for logos, ad creatives, and 30–60s videos with one-click publish to YouTube + Google Ads. Monorepo (Next.js + Express + FFmpeg), Docker, GCP Cloud Run, and non-repudiating audit logs.

## Architecture

This is a pnpm/Turborepo monorepo with the following structure:

```
.
├── apps/
│   └── web/              # Next.js 14 + Tailwind web application
├── services/
│   └── api/              # Express TypeScript API server
├── workers/
│   └── render/           # Node + FFmpeg video rendering worker
└── packages/
    └── shared/           # Shared types, schemas (Zod), and Result utilities
```

## Features

### Apps/Web (Next.js 14 + Tailwind)
- **Logo Designer**: Generate AI-assisted logos with color palettes
- **Ad Canvas**: Design compelling ad creatives
- **Video Generator**: Create 30-60s videos for YouTube and Google Ads

### Services/API (Express TypeScript)
- `GET /health` - Health check endpoint
- `GET /v1/palette` - Generate 5-color hex palette
- `POST /v1/layout` - Validate and process layout configurations
- `POST /v1/export` - Export designs in various formats
- `POST /v1/publish/youtube` - Publish videos to YouTube
- `POST /hooks/justcall` - Webhook with HMAC verification

### Workers/Render (Node + FFmpeg)
- Generates 30-60s MP4 videos using FFmpeg
- Configurable width, height, duration, and fps

### Packages/Shared
- Zod schemas for validation
- Result type for functional error handling
- Shared TypeScript types

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 9.0.0+
- Docker & Docker Compose (for containerized deployment)

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run development servers
pnpm run dev
```

### Docker Deployment

```bash
# Build and start all services
docker compose up

# Or using Make
make docker-build
make docker-up
```

The services will be available at:
- Web UI: http://localhost:3000
- API: http://localhost:3001

### Testing the API

```bash
# Health check
curl http://localhost:3001/health

# Generate color palette (returns 5 hex colors)
curl http://localhost:3001/v1/palette

# Layout validation
curl -X POST http://localhost:3001/v1/layout \
  -H "Content-Type: application/json" \
  -d '{"type":"logo","width":800,"height":600,"elements":[]}'

# Export
curl -X POST http://localhost:3001/v1/export \
  -H "Content-Type: application/json" \
  -d '{"format":"png","quality":90}'

# Publish to YouTube
curl -X POST http://localhost:3001/v1/publish/youtube \
  -H "Content-Type: application/json" \
  -d '{"title":"My Video","description":"Test","videoUrl":"https://example.com/video.mp4"}'
```

## Development

### Available Commands

```bash
pnpm run dev      # Start all services in dev mode
pnpm run build    # Build all packages
pnpm run lint     # Run linters
pnpm run clean    # Clean build artifacts
```

### Makefile Commands

```bash
make help         # Show available commands
make install      # Install dependencies
make dev          # Run development servers
make build        # Build all packages
make clean        # Clean everything
make docker-build # Build Docker images
make docker-up    # Start Docker services
make docker-down  # Stop Docker services
make docker-logs  # View Docker logs
```

## Project Structure

- **apps/web**: Next.js 14 frontend with App Router and Tailwind CSS
- **services/api**: Express API with TypeScript, CORS, Helmet, and Zod validation
- **workers/render**: FFmpeg-based video rendering worker
- **packages/shared**: Shared utilities and types

## Environment Variables

### API Service
- `PORT` - API server port (default: 3001)
- `JUSTCALL_SECRET` - Secret for HMAC webhook verification

### Web App
- `NEXT_PUBLIC_API_URL` - API server URL (default: http://localhost:3001)

## CI/CD

GitHub Actions workflow includes:
- Dependency installation with pnpm
- Build verification for all packages
- Linting
- Docker image building
- Integration tests with docker-compose

## License

MIT License - see [LICENSE](LICENSE) file for details
