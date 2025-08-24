.PHONY: help install dev build test lint typecheck clean db-reset seed docker-up docker-down docker-logs

# Default target
help:
	@echo "AI Guardian - Development Commands"
	@echo ""
	@echo "Setup:"
	@echo "  install      Install all dependencies"
	@echo "  dev          Start all services in development mode"
	@echo "  build        Build all packages"
	@echo ""
	@echo "Development:"
	@echo "  test         Run all tests"
	@echo "  test:e2e     Run E2E tests"
	@echo "  lint         Lint all code"
	@echo "  typecheck    Type check all code"
	@echo ""
	@echo "Database:"
	@echo "  db-reset     Reset database (WARNING: destroys all data)"
	@echo "  seed         Seed database with sample data"
	@echo ""
	@echo "Docker:"
	@echo "  docker-up    Start all Docker services"
	@echo "  docker-down  Stop all Docker services"
	@echo "  docker-logs  Show Docker service logs"
	@echo ""
	@echo "Utilities:"
	@echo "  clean        Clean all build artifacts"
	@echo "  help         Show this help message"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	pnpm install
	@echo "✅ Dependencies installed"

# Start development servers
dev:
	@echo "🚀 Starting development servers..."
	pnpm dev

# Build all packages
build:
	@echo "🔨 Building packages..."
	pnpm build
	@echo "✅ Build completed"

# Run tests
test:
	@echo "🧪 Running tests..."
	pnpm test
	@echo "✅ Tests completed"

# Run E2E tests
test:e2e:
	@echo "🎭 Running E2E tests..."
	pnpm test:e2e
	@echo "✅ E2E tests completed"

# Lint code
lint:
	@echo "🔍 Linting code..."
	pnpm lint
	@echo "✅ Linting completed"

# Type check
typecheck:
	@echo "🔍 Type checking..."
	pnpm typecheck
	@echo "✅ Type checking completed"

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf apps/*/dist apps/*/build packages/*/dist
	rm -rf node_modules
	@echo "✅ Clean completed"

# Database operations
db-reset:
	@echo "⚠️  WARNING: This will destroy all data!"
	@read -p "Are you sure? Type 'yes' to continue: " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		echo "🗄️  Resetting database..."; \
		pnpm db:reset; \
		echo "✅ Database reset completed"; \
	else \
		echo "❌ Database reset cancelled"; \
	fi

seed:
	@echo "🌱 Seeding database..."
	pnpm seed
	@echo "✅ Database seeded"

# Docker operations
docker-up:
	@echo "🐳 Starting Docker services..."
	pnpm docker:up
	@echo "✅ Docker services started"

docker-down:
	@echo "🐳 Stopping Docker services..."
	pnpm docker:down
	@echo "✅ Docker services stopped"

docker-logs:
	@echo "📋 Showing Docker logs..."
	pnpm docker:logs

# Quick start for new developers
quickstart: install docker-up
	@echo ""
	@echo "🎉 AI Guardian is ready!"
	@echo ""
	@echo "Next steps:"
	@echo "1. Wait for all services to start (check with 'make docker-logs')"
	@echo "2. Seed the database: make seed"
	@echo "3. Open http://localhost:3000 in your browser"
	@echo "4. Use demo credentials: parent@example.com / demo123"
	@echo ""
	@echo "Services:"
	@echo "- Web App: http://localhost:3000"
	@echo "- API: http://localhost:8000"
	@echo "- ML Service: http://localhost:8001"
	@echo "- Database: localhost:5432"
	@echo "- Redis: localhost:6379"
	@echo "- MinIO: http://localhost:9000"

# Production build
prod-build: clean install build
	@echo "🏭 Production build completed"

# Health check
health:
	@echo "🏥 Checking service health..."
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo "✅ Web App: Healthy" || echo "❌ Web App: Unhealthy"
	@curl -f http://localhost:8000/health > /dev/null 2>&1 && echo "✅ API: Healthy" || echo "❌ API: Unhealthy"
	@curl -f http://localhost:8001/health > /dev/null 2>&1 && echo "✅ ML Service: Healthy" || echo "❌ ML Service: Unhealthy" 