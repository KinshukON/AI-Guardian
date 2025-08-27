# AIGuardian Development Guide

## Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- pnpm (recommended) or npm
- Docker & Docker Compose (optional, for databases)

### Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd AIGuardian
   pnpm install
   ```

2. **Start all services:**
   ```bash
   # Using the unified start script (recommended)
   ./start-all.sh
   
   # Or using npm/pnpm
   pnpm start
   ```

3. **Access the application:**
   - 🌐 **Web Frontend**: http://localhost:3000
   - 🔧 **API Backend**: http://localhost:8000
   - 🤖 **ML Service**: http://localhost:8001
   - 📊 **API Documentation**: http://localhost:8000/docs
   - 🧠 **ML Documentation**: http://localhost:8001/docs

## Service Management Scripts

### Main Scripts

| Script | Description | Usage |
|--------|-------------|-------|
| `./start-all.sh` | Start all services in correct order | `./start-all.sh` |
| `./stop-all.sh` | Stop all services gracefully | `./stop-all.sh` |
| `./status.sh` | Check status of all services | `./status.sh` |
| `./restart-service.sh` | Restart a specific service | `./restart-service.sh <service>` |

### NPM/PNPM Scripts

```bash
# Start all services
pnpm start

# Stop all services  
pnpm stop

# Check service status
pnpm status

# Restart a specific service
pnpm restart <service>

# Development (parallel dev servers)
pnpm dev

# Build all apps
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

## Service Architecture

### Port Configuration
- **Web Frontend (React/Vite)**: Port 3000
- **API Backend (Node.js/Fastify)**: Port 8000  
- **ML Service (Python/FastAPI)**: Port 8001
- **PostgreSQL**: Port 5432
- **Redis**: Port 6379

### Service Dependencies
```
Web Frontend (3000) → API Backend (8000) → ML Service (8001)
                                        ↓
                               PostgreSQL (5432)
                                        ↓  
                                  Redis (6379)
```

## Development Workflow

### 1. Starting Development

```bash
# Quick start - everything in one command
./start-all.sh
```

The start script will:
- ✅ Check dependencies (Node.js, Python, pnpm)
- ✅ Verify ports are available
- ✅ Install dependencies automatically
- ✅ Set up environment files
- ✅ Start database services (Docker)
- ✅ Start ML service with virtual environment
- ✅ Run database migrations
- ✅ Start API service
- ✅ Start web frontend
- ✅ Display service URLs and status

### 2. Monitoring Services

```bash
# Check status of all services
./status.sh

# View logs in real-time
tail -f .logs/web.log     # Web frontend logs
tail -f .logs/api.log     # API backend logs  
tail -f .logs/ml.log      # ML service logs

# View all logs together
tail -f .logs/*.log
```

### 3. Restarting Services

```bash
# Restart specific service
./restart-service.sh web    # Restart web frontend
./restart-service.sh api    # Restart API backend
./restart-service.sh ml     # Restart ML service
./restart-service.sh all    # Restart all services

# Quick restart during development
pnpm restart api
```

### 4. Stopping Services

```bash
# Stop all services gracefully
./stop-all.sh

# Or using npm/pnpm
pnpm stop
```

## Database Management

### Using Docker (Recommended)
```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Stop database services
docker-compose down

# View database logs
docker-compose logs postgres
docker-compose logs redis
```

### Manual Database Setup
If you prefer not to use Docker:

1. **Install PostgreSQL and Redis locally**
2. **Create database:**
   ```sql
   CREATE DATABASE aiguardian;
   ```
3. **Update connection strings in `.env` files**

### Database Operations
```bash
# Run migrations
cd apps/api && pnpm db:migrate

# Reset database
cd apps/api && pnpm db:reset

# Seed with sample data
cd apps/api && pnpm seed
```

## Environment Configuration

### Auto-Generated Environment Files

The start script automatically creates `.env` files:

**apps/api/.env:**
```env
NODE_ENV=development
PORT=8000
DATABASE_URL=postgresql://postgres:password@localhost:5432/aiguardian
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ML_SERVICE_URL=http://localhost:8001
ML_SERVICE_API_KEY=dev-key-123
CORS_ORIGINS=http://localhost:3000
```

**apps/ml/.env:**
```env
PORT=8001
HOST=0.0.0.0
ML_API_KEY=dev-key-123
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
```

### Custom Configuration
Copy `env.example` to `.env` and modify as needed:
```bash
cp env.example .env
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8000  
lsof -i :8001

# Kill processes on specific ports
./stop-all.sh  # This handles port cleanup
```

#### 2. Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart database services
docker-compose restart postgres redis

# Check database logs
docker-compose logs postgres
```

#### 3. Python Virtual Environment Issues
```bash
# Recreate ML virtual environment
cd apps/ml
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 4. Node.js Dependency Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install

# Clear pnpm cache
pnpm store prune
```

### Service-Specific Debugging

#### Web Frontend (React/Vite)
```bash
# Check if Vite dev server is running
curl http://localhost:3000

# View web logs
tail -f .logs/web.log

# Restart just web service
./restart-service.sh web
```

#### API Backend (Node.js/Fastify)
```bash
# Check API health
curl http://localhost:8000/health

# View API documentation
open http://localhost:8000/docs

# Check API logs
tail -f .logs/api.log

# Test API endpoints
curl -H "Authorization: Bearer dev-key-123" \
     http://localhost:8000/health
```

#### ML Service (Python/FastAPI)
```bash
# Check ML service health
curl http://localhost:8001/health

# View ML documentation
open http://localhost:8001/docs

# Check ML logs
tail -f .logs/ml.log

# Test ML endpoints
curl -H "Authorization: Bearer dev-key-123" \
     -H "Content-Type: application/json" \
     -d '{"content":"test","content_type":"text","child_age":12}' \
     http://localhost:8001/analyze
```

## Development Features

### Hot Reload
All services support hot reload during development:
- **Web**: Vite hot module replacement
- **API**: tsx watch mode for TypeScript
- **ML**: Manual restart required (working on auto-reload)

### Enhanced Features
The platform includes enhanced patent-worthy features:
- 🧠 **Enhanced Bias Detection**: Cultural awareness and perspective synthesis
- ⚠️ **Predictive Risk Assessment**: Behavioral pattern recognition
- 💭 **Emotion-Aware KidGPT**: Crisis detection and intervention
- 🛡️ **Feature Flags**: Safe rollout system
- 📊 **Real-time Analytics**: Comprehensive monitoring

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific app
cd apps/api && pnpm test
cd apps/web && pnpm test
cd apps/ml && python -m pytest
```

## Production Deployment

### Docker Deployment
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale web=2 --scale api=2
```

### Manual Deployment
1. Build all applications: `pnpm build`
2. Set production environment variables
3. Use process manager (PM2, systemd) for service management
4. Configure reverse proxy (nginx) for routing
5. Set up SSL certificates
6. Configure monitoring and logging

## Support

For issues or questions:
1. Check this development guide
2. Review service logs in `.logs/` directory
3. Use `./status.sh` to diagnose service states
4. Check the main README.md for project overview

## Quick Reference

```bash
# Start everything
./start-all.sh

# Check status
./status.sh

# View logs
tail -f .logs/*.log

# Restart service
./restart-service.sh <service>

# Stop everything
./stop-all.sh
```
