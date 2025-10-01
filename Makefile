.PHONY: init dev test build clean cloudrun help

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

init: ## Initialize project (install dependencies)
	@echo "Installing pnpm..."
	@npm install -g pnpm@8.15.0
	@echo "Installing dependencies..."
	@pnpm install
	@echo "Creating output directories..."
	@mkdir -p output/videos output/ads audit-logs
	@echo "Copying .env.example to .env..."
	@cp -n .env.example .env || true
	@echo "✓ Project initialized"

dev: ## Start development servers (requires pnpm install first)
	@echo "Starting development servers..."
	@pnpm run dev

test: ## Run tests
	@echo "Running tests..."
	@pnpm run test

build: ## Build all packages
	@echo "Building all packages..."
	@pnpm run build
	@echo "✓ Build complete"

clean: ## Clean build artifacts and dependencies
	@echo "Cleaning build artifacts..."
	@pnpm run clean
	@find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
	@rm -rf .turbo
	@echo "✓ Clean complete"

docker-build: ## Build Docker images
	@echo "Building Docker images..."
	@docker-compose build
	@echo "✓ Docker images built"

docker-up: ## Start Docker containers
	@echo "Starting Docker containers..."
	@docker-compose up -d
	@echo "✓ Containers started"
	@echo ""
	@echo "Services available at:"
	@echo "  Web:  http://localhost:3000"
	@echo "  API:  http://localhost:8787"
	@echo ""

docker-down: ## Stop Docker containers
	@echo "Stopping Docker containers..."
	@docker-compose down
	@echo "✓ Containers stopped"

docker-logs: ## Show Docker logs
	@docker-compose logs -f

cloudrun: ## Deploy to Google Cloud Run (requires gcloud CLI)
	@echo "Deploying to Cloud Run..."
	@echo "Building and pushing API image..."
	@gcloud builds submit --tag gcr.io/$(GCP_PROJECT)/quill-api services/api
	@gcloud run deploy quill-api \
		--image gcr.io/$(GCP_PROJECT)/quill-api \
		--platform managed \
		--region us-central1 \
		--allow-unauthenticated \
		--port 8787
	@echo "Building and pushing Web image..."
	@gcloud builds submit --tag gcr.io/$(GCP_PROJECT)/quill-web apps/web
	@gcloud run deploy quill-web \
		--image gcr.io/$(GCP_PROJECT)/quill-web \
		--platform managed \
		--region us-central1 \
		--allow-unauthenticated \
		--port 3000
	@echo "✓ Deployment complete"

lint: ## Run linters
	@echo "Running linters..."
	@pnpm run lint
	@echo "✓ Lint complete"

format: ## Format code
	@echo "Formatting code..."
	@pnpm run format
	@echo "✓ Format complete"
