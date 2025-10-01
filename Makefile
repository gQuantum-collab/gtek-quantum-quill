.PHONY: help install dev build clean docker-build docker-up docker-down docker-logs test-api test lint

help: ## Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'

install: ## Install dependencies
	pnpm install

dev: ## Run development servers
	pnpm run dev

build: ## Build all packages
	pnpm run build

clean: ## Clean all build artifacts and dependencies
	pnpm run clean
	rm -rf node_modules
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

docker-build: ## Build Docker images
	docker compose build

docker-up: ## Start Docker services
	docker compose up -d

docker-down: ## Stop Docker services
	docker compose down

docker-logs: ## View Docker logs
	docker compose logs -f

test-api: ## Test API endpoints
	./test-api.sh

test: ## Run tests
	pnpm run test

lint: ## Run linters
	pnpm run lint
