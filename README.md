# QUILL Studio

> AI-assisted branding and ad engine that produces logos, static ads, and 30–60s videos, then publishes to YouTube and prepares Google Ads assets.

[![CI](https://github.com/gQuantum-collab/gtek-quantum/workflows/CI/badge.svg)](https://github.com/gQuantum-collab/gtek-quantum/actions)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

## 🎨 Overview

QUILL Studio is a comprehensive AI-driven branding and advertising platform built as a modern monorepo. It combines intelligent design generation with professional video rendering and seamless publishing capabilities.

**Key Features:**
- 🎨 **Logo Generator**: AI-powered color palette generation based on brand mood
- 📐 **Ad Canvas**: Intelligent layout optimization for static ads
- 🎬 **Video Studio**: 30s and 60s video rendering with FFmpeg (1080p)
- 📺 **YouTube Publishing**: One-click upload with OAuth integration
- 📊 **Google Ads Export**: Campaign asset export in Google Ads format
- 🔒 **Security**: HMAC webhook verification and non-repudiation audit logs
- 🔌 **Integrations**: JustCall webhooks and Copper CRM stubs

## 🏗️ Architecture

```
quill-studio/
├── apps/
│   └── web/                    # Next.js 14 frontend (Tailwind + shadcn/ui)
├── services/
│   └── api/                    # Express API server
├── workers/
│   └── render/                 # FFmpeg video rendering worker
├── packages/
│   ├── shared/                 # Shared types, utilities, and helpers
│   └── quantumes/              # AI model configuration manifests
└── config/                     # YAML configuration and policies
```

## 🚀 Quick Start (30-60 min)

### Prerequisites

- **Node.js** 18+ and **pnpm** 8+
- **Docker** and **Docker Compose**
- **Make** (optional, but recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gQuantum-collab/gtek-quantum.git
   cd gtek-quantum
   ```

2. **Initialize the project:**
   ```bash
   make init
   # or manually:
   pnpm install
   cp .env.example .env
   mkdir -p output/videos output/ads audit-logs
   ```

3. **Configure environment variables:**
   Edit `.env` with your API keys and configuration.

4. **Start with Docker Compose:**
   ```bash
   docker-compose up -d --build
   ```

   This will start:
   - **Web UI**: http://localhost:3000
   - **API Server**: http://localhost:8787
   - **Redis**: localhost:6379
   - **Render Worker**: Background service

5. **Verify installation:**
   ```bash
   curl http://localhost:8787/health
   ```

   Expected response:
   ```json
   {
     "status": "healthy",
     "timestamp": "2025-01-01T00:00:00.000Z",
     "service": "quill-api",
     "version": "1.0.0"
   }
   ```

### Alternative: Local Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Start development servers
pnpm run dev
```

## 📚 API Endpoints

### Health Check
```bash
GET /health
```

### Generate Color Palette
```bash
POST /v1/palette/generate
Content-Type: application/json

{
  "mood": "professional"
}
```

Returns 5 hex colors optimized for the specified mood.

### Solve Layout
```bash
POST /v1/layout/solve
Content-Type: application/json

{
  "elements": [
    { "type": "logo", "content": "Brand Logo", "priority": 10 },
    { "type": "text", "content": "Headline", "priority": 9 }
  ],
  "canvasWidth": 1920,
  "canvasHeight": 1080
}
```

### Render Video
```bash
POST /v1/export/render
Content-Type: application/json

{
  "template": "30s",
  "headline": "Your Brand Message",
  "colors": ["#2563eb", "#ffffff", "#1e40af"]
}
```

### Publish to YouTube
```bash
POST /v1/publish/youtube
Content-Type: application/json

{
  "videoPath": "/videos/video.mp4",
  "title": "My Video",
  "description": "Created with QUILL Studio",
  "privacyStatus": "private"
}
```

Returns `{"status": "queued"}` (OAuth authentication required).

### Export Google Ads Assets
```bash
POST /v1/ads/export
Content-Type: application/json

{
  "campaignName": "Summer Campaign",
  "adAssets": [
    { "type": "headline", "text": "Get Started Today" },
    { "type": "image", "path": "/assets/hero.jpg" }
  ]
}
```

### JustCall Webhook
```bash
POST /hooks/justcall
X-JustCall-Signature: <hmac-signature>
Content-Type: application/json

{
  "callId": "12345",
  "from": "+1234567890",
  "to": "+0987654321",
  "status": "completed"
}
```

Verifies HMAC signature and logs to audit trail.

## 🛠️ Development

### Workspace Structure

The monorepo uses **pnpm workspaces** and **Turbo** for efficient builds:

```bash
# Run commands in specific workspace
pnpm --filter @quill/api dev
pnpm --filter @quill/web build

# Run commands across all workspaces
pnpm run lint
pnpm run build
pnpm run test
```

### Makefile Targets

```bash
make init          # Initialize project
make dev           # Start development servers
make build         # Build all packages
make test          # Run tests
make lint          # Run linters
make docker-build  # Build Docker images
make docker-up     # Start Docker containers
make docker-down   # Stop Docker containers
make cloudrun      # Deploy to Google Cloud Run
```

## 🔒 Security & Compliance

### Non-Repudiation Audit Logs

All critical operations are logged to an append-only JSONL audit log:

```jsonl
{"event":"justcall.webhook.received","actor":"system","timestamp":"2025-01-01T00:00:00.000Z","payload":{...},"sha256":"abc123...","signatureKid":"key-v1"}
```

Fields:
- `event`: Action identifier
- `actor`: User or system identifier
- `timestamp`: ISO 8601 timestamp
- `payload`: Event data
- `sha256`: SHA-256 hash of event data
- `signatureKid`: Signature key identifier

### HMAC Verification

JustCall webhooks are verified using HMAC-SHA256:

```typescript
const hmac = createHmac('sha256', secret);
hmac.update(payload);
const signature = hmac.digest('hex');
```

### Rate Limiting

Configured per endpoint in `config/rate_limits.json`:
- Global: 100 requests/minute
- Palette generation: 30 requests/minute
- Video rendering: 10 requests/minute
- YouTube publishing: 5 requests/minute

## 🎬 Video Rendering

QUILL Studio uses **FFmpeg** to generate high-quality videos:

**Specifications:**
- Resolution: 1920x1080 (1080p)
- Frame Rate: 30 FPS
- Format: MP4 (H.264)
- Codec: libx264
- Preset: medium
- CRF: 23

**Templates:**
- `30s`: 30-second promotional video
- `60s`: 60-second extended video

Both templates feature:
- Customizable background color
- Centered headline text
- Contrasting text color
- Optional music bed (placeholder)

## 🌐 Deployment

### Docker

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Google Cloud Run

1. **Set up GCP project:**
   ```bash
   export GCP_PROJECT=your-project-id
   gcloud config set project $GCP_PROJECT
   ```

2. **Deploy:**
   ```bash
   make cloudrun
   ```

   Or use the GitHub Actions workflow with secrets:
   - `GCP_PROJECT`: Your GCP project ID
   - `GCP_SA_KEY`: Service account key JSON

## 📋 Environment Variables

See `.env.example` for all configuration options:

**Required:**
- `NODE_ENV`: Environment (development/production)
- `API_PORT`: API server port (default: 8787)
- `WEB_PORT`: Web server port (default: 3000)

**Optional Integrations:**
- YouTube API credentials
- Google Ads credentials
- JustCall webhook secrets
- Copper CRM API key

## 🧪 Testing

```bash
# Run all tests
pnpm run test

# Run tests for specific package
pnpm --filter @quill/api test

# Run with coverage
pnpm run test -- --coverage
```

## 📦 Project Structure

```
.
├── apps/
│   └── web/                    # Next.js 14 application
│       ├── pages/              # Page routes
│       │   ├── index.tsx       # Home page
│       │   ├── logo.tsx        # Logo generator
│       │   ├── ad.tsx          # Ad canvas
│       │   └── video.tsx       # Video studio
│       ├── components/         # React components
│       ├── lib/                # Utilities and API client
│       └── styles/             # Global styles
├── services/
│   └── api/                    # Express API
│       ├── src/
│       │   ├── routes/         # API routes
│       │   ├── config.ts       # Configuration loader
│       │   └── index.ts        # Server entry point
│       └── Dockerfile
├── workers/
│   └── render/                 # Video rendering worker
│       ├── src/
│       │   └── render.ts       # FFmpeg wrapper
│       └── Dockerfile
├── packages/
│   ├── shared/                 # Shared utilities
│   │   └── src/
│   │       ├── result.ts       # Result<T> helper
│   │       ├── logger.ts       # Structured logging
│   │       ├── types.ts        # Zod schemas
│   │       └── audit.ts        # Audit logger
│   └── quantumes/              # AI configurations
│       ├── palette.generate.json
│       └── layout.solve.json
├── config/
│   ├── app.yaml                # Application configuration
│   ├── policy.json             # Security policies
│   └── rate_limits.json        # Rate limit rules
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI pipeline
│       └── cloudrun-deploy.yml # Cloud Run deployment
├── docker-compose.yml          # Docker orchestration
├── Makefile                    # Build automation
├── turbo.json                  # Turbo configuration
└── pnpm-workspace.yaml         # Workspace configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/), [Express](https://expressjs.com/), and [FFmpeg](https://ffmpeg.org/)
- UI powered by [Tailwind CSS](https://tailwindcss.com/)
- Validation with [Zod](https://zod.dev/)
- Monorepo tooling by [Turbo](https://turbo.build/)

---

**QUILL Studio** - Empowering brands with AI-driven creative tools.
