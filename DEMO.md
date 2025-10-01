# QUILL Studio Demo Guide

This guide walks you through a complete demonstration of QUILL Studio's features.

## Prerequisites

- Docker and Docker Compose installed
- OR Node.js 18+, pnpm 8+, and FFmpeg installed

## Quick Demo (Docker - Recommended)

### 1. Start All Services

```bash
# Clone the repository
git clone https://github.com/gQuantum-collab/gtek-quantum.git
cd gtek-quantum

# Start services with Docker Compose
docker-compose up -d --build
```

Wait for all services to start (about 2-3 minutes on first build).

### 2. Access the Application

Open your browser and navigate to:
- **Web UI**: http://localhost:3000
- **API**: http://localhost:8787

### 3. Test the Features

#### Logo Generator (Color Palettes)

1. Navigate to http://localhost:3000/logo
2. Select a mood: Professional, Playful, Elegant, Bold, or Calm
3. Click "Generate Palette"
4. View 5 harmonious hex colors optimized for your brand

**API Endpoint:**
```bash
curl -X POST http://localhost:8787/v1/palette/generate \
  -H "Content-Type: application/json" \
  -d '{"mood":"professional"}'
```

**Expected Response:**
```json
{
  "colors": ["#2e5276", "#5c7ec1", "#4b83a0", "#769ec6", "#88a1d1"],
  "metadata": {
    "mood": "professional",
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Ad Canvas (Layout Solver)

1. Navigate to http://localhost:3000/ad
2. Set canvas size (default: 1920x1080)
3. Configure elements with type, content, and priority
4. Click "Solve Layout"
5. View the optimized layout preview

**API Endpoint:**
```bash
curl -X POST http://localhost:8787/v1/layout/solve \
  -H "Content-Type: application/json" \
  -d '{
    "elements": [
      {"type":"logo","content":"Brand Logo","priority":10},
      {"type":"text","content":"Headline","priority":9}
    ],
    "canvasWidth": 1920,
    "canvasHeight": 1080
  }'
```

#### Video Studio (Rendering & Publishing)

1. Navigate to http://localhost:3000/video
2. Select template: 30s or 60s
3. Enter your headline text
4. Customize colors using color pickers
5. Click "Render Video" to queue the job
6. Once rendered, click "Publish to YouTube" (requires OAuth setup)

**API Endpoints:**

Render Video:
```bash
curl -X POST http://localhost:8787/v1/export/render \
  -H "Content-Type: application/json" \
  -d '{
    "template": "30s",
    "headline": "QUILL Studio - AI Branding",
    "colors": ["#2563eb", "#ffffff", "#1e40af"]
  }'
```

Publish to YouTube:
```bash
curl -X POST http://localhost:8787/v1/publish/youtube \
  -H "Content-Type: application/json" \
  -d '{
    "videoPath": "/videos/video.mp4",
    "title": "My Brand Video",
    "description": "Created with QUILL Studio",
    "privacyStatus": "private"
  }'
```

#### Google Ads Export

**API Endpoint:**
```bash
curl -X POST http://localhost:8787/v1/ads/export \
  -H "Content-Type: application/json" \
  -d '{
    "campaignName": "Summer Campaign 2025",
    "adAssets": [
      {"type": "headline", "text": "Get Started Today"},
      {"type": "description", "text": "Transform your brand"},
      {"type": "image", "path": "/assets/hero.jpg"}
    ]
  }'
```

The exported JSON will be saved to `output/ads/` directory.

#### JustCall Webhook (with HMAC Verification)

**API Endpoint:**
```bash
# Generate HMAC signature
PAYLOAD='{"callId":"12345","from":"+1234567890","to":"+0987654321","status":"completed"}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "your-secret" | cut -d' ' -f2)

# Send webhook
curl -X POST http://localhost:8787/hooks/justcall \
  -H "Content-Type: application/json" \
  -H "X-JustCall-Signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

Check audit logs:
```bash
cat audit-logs/audit.jsonl
```

### 4. View Audit Logs

All webhook events are logged with non-repudiation:

```bash
# From repository root
cat audit-logs/audit.jsonl | jq
```

Example output:
```json
{
  "event": "justcall.webhook.received",
  "actor": "system",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "payload": {
    "callId": "12345",
    "from": "+1234567890",
    "to": "+0987654321",
    "status": "completed"
  },
  "sha256": "abc123...",
  "signatureKid": "key-v1"
}
```

## Local Development Demo (Without Docker)

### 1. Install Dependencies

```bash
# Install pnpm globally
npm install -g pnpm@8.15.0

# Install all dependencies
pnpm install

# Build all packages
pnpm run build
```

### 2. Start Services Manually

In separate terminals:

**Terminal 1 - API Server:**
```bash
cd services/api
CONFIG_PATH=../../config/app.yaml pnpm run dev
```

**Terminal 2 - Web Server:**
```bash
cd apps/web
API_URL=http://localhost:8787 pnpm run dev
```

**Terminal 3 - Render Worker (optional):**
```bash
cd workers/render
pnpm run dev
```

### 3. Test the Application

Follow the same testing steps as the Docker demo above.

## Cleanup

### Docker
```bash
docker-compose down
docker-compose down -v  # Also remove volumes
```

### Local
```bash
# Stop all terminals (Ctrl+C)
# Clean build artifacts
make clean
```

## Troubleshooting

### Port Already in Use
If ports 3000 or 8787 are already in use:
```bash
# Find process using the port
lsof -ti:3000
lsof -ti:8787

# Kill the process
kill -9 <PID>
```

### Docker Build Issues
```bash
# Clean Docker cache
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

### pnpm Installation Issues
```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Next Steps

1. Configure YouTube OAuth credentials in `.env`
2. Set up Google Ads API credentials
3. Configure JustCall webhook secrets
4. Deploy to Google Cloud Run (see README.md)
5. Customize templates and manifests in `packages/quantumes/`

## Support

For issues and questions:
- GitHub Issues: https://github.com/gQuantum-collab/gtek-quantum/issues
- Documentation: See README.md
