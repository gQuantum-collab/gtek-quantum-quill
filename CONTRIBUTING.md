# Contributing to QUILL Studio

## Development Setup

### Prerequisites
- Node.js 18+
- pnpm 9.0.0+
- Docker & Docker Compose (optional)

### Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Build all packages**
   ```bash
   pnpm run build
   ```

3. **Run in development mode**
   ```bash
   pnpm run dev
   ```

   This will start:
   - Web app on http://localhost:3000
   - API server on http://localhost:3001

### Project Structure

```
.
├── apps/
│   └── web/              # Next.js frontend
├── services/
│   └── api/              # Express API
├── workers/
│   └── render/           # Video rendering worker
└── packages/
    └── shared/           # Shared utilities
```

### Running Tests

```bash
# Build and start the API server
cd services/api
pnpm run build && pnpm run start

# In another terminal, run tests
./test-api.sh
```

### Making Changes

1. **Make changes to a specific package**
   - Navigate to the package directory
   - Edit the source files
   - Build: `pnpm run build`
   - Test your changes

2. **Shared package changes**
   - If you modify `packages/shared`, rebuild all dependent packages
   - Run `pnpm run build` from the root

3. **Lint your code**
   ```bash
   pnpm run lint
   ```

### Docker Development

**Development mode (with hot reload):**
```bash
docker compose -f docker-compose.dev.yml up
```

**Production mode:**
```bash
docker compose up
```

### API Endpoints

- `GET /health` - Health check
- `GET /v1/palette` - Generate 5-color palette
- `POST /v1/layout` - Validate layout
- `POST /v1/export` - Export design
- `POST /v1/publish/youtube` - Publish to YouTube
- `POST /hooks/justcall` - JustCall webhook (HMAC secured)

### Adding New Features

1. **New API endpoint**
   - Create route file in `services/api/src/routes/`
   - Register route in `services/api/src/index.ts`
   - Add Zod schema in `packages/shared/src/schemas.ts` if needed

2. **New page in web app**
   - Create page in `apps/web/app/`
   - Add navigation link in home page

3. **New shared utility**
   - Add to `packages/shared/src/`
   - Export from `packages/shared/src/index.ts`
   - Rebuild shared package

### Commit Guidelines

- Use clear, descriptive commit messages
- Keep commits focused and atomic
- Test your changes before committing

### CI/CD

The project uses GitHub Actions for CI:
- Builds all packages
- Runs linters
- Tests Docker builds
- Verifies API endpoints

Check `.github/workflows/ci.yml` for details.

## Questions?

Open an issue on GitHub for questions or suggestions.
