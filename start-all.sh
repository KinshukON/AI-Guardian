#!/bin/bash

# AIGuardian - Unified Start Script
# Starts all services in the correct order with port management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Service configuration
WEB_PORT=3002
API_PORT=8000
ML_PORT=8001
POSTGRES_PORT=5432
REDIS_PORT=6379

# Directories
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$PROJECT_ROOT/apps/api"
WEB_DIR="$PROJECT_ROOT/apps/web"
ML_DIR="$PROJECT_ROOT/apps/ml"

# PID files for tracking processes
PID_DIR="$PROJECT_ROOT/.pids"
mkdir -p "$PID_DIR"

# Logging
LOG_DIR="$PROJECT_ROOT/.logs"
mkdir -p "$LOG_DIR"

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                     AI Guardian Platform                     ║"
    echo "║                   Starting All Services                      ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_port() {
    local port=$1
    local service=$2
    if lsof -i ":$port" >/dev/null 2>&1; then
        print_error "Port $port is already in use (needed for $service)"
        echo "Please stop the process using port $port and try again:"
        lsof -i ":$port"
        return 1
    fi
    return 0
}

check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    # Check if pnpm is installed
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm is not installed. Please install pnpm and try again."
        echo "Run: npm install -g pnpm"
        exit 1
    fi
    
    # Check if Python is installed
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.8+ and try again."
        exit 1
    fi
    
    # Check Node.js version
    local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_status "Dependencies check passed ✓"
}

check_ports() {
    print_status "Checking if ports are available..."
    
    check_port $WEB_PORT "Web Frontend" || exit 1
    check_port $API_PORT "API Backend" || exit 1
    check_port $ML_PORT "ML Service" || exit 1
    
    print_status "All ports are available ✓"
}

install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    print_status "Installing root dependencies..."
    pnpm install
    
    # Install API dependencies
    print_status "Installing API dependencies..."
    cd "$API_DIR"
    pnpm install
    
    # Install Web dependencies
    print_status "Installing Web dependencies..."
    cd "$WEB_DIR"
    pnpm install
    
    # Install ML dependencies
    print_status "Installing ML dependencies..."
    cd "$ML_DIR"
    if [ ! -f "requirements.txt" ]; then
        print_error "requirements.txt not found in ML directory"
        exit 1
    fi
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment and install dependencies
    source venv/bin/activate
    pip install -r requirements.txt
    
    cd "$PROJECT_ROOT"
    print_status "Dependencies installed ✓"
}

setup_environment() {
    print_status "Setting up environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        if [ -f "$PROJECT_ROOT/env.example" ]; then
            cp "$PROJECT_ROOT/env.example" "$PROJECT_ROOT/.env"
            print_status "Created .env from env.example"
        else
            print_warning "No .env or env.example file found"
        fi
    fi
    
    # Setup API environment
    if [ ! -f "$API_DIR/.env" ]; then
        cat > "$API_DIR/.env" << EOF
NODE_ENV=development
PORT=8000
HOST=0.0.0.0
DATABASE_URL=postgresql://postgres:password@localhost:5432/aiguardian
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ML_SERVICE_URL=http://localhost:8001
ML_SERVICE_API_KEY=dev-key-123
CORS_ORIGINS=http://localhost:3002
EOF
        print_status "Created API .env file"
    fi
    
    # Setup ML environment
    if [ ! -f "$ML_DIR/.env" ]; then
        cat > "$ML_DIR/.env" << EOF
PORT=8001
HOST=0.0.0.0
ML_API_KEY=dev-key-123
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
EOF
        print_status "Created ML .env file"
    fi
    
    print_status "Environment setup complete ✓"
}

start_database_services() {
    print_status "Starting database services..."
    
    # Start PostgreSQL and Redis using Docker
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        print_status "Starting PostgreSQL and Redis with Docker..."
        docker-compose up -d postgres redis
        
        # Wait for services to be ready
        print_status "Waiting for database services to be ready..."
        sleep 5
        
        # Check PostgreSQL
        local pg_ready=false
        for i in {1..30}; do
            if docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
                pg_ready=true
                break
            fi
            sleep 1
        done
        
        if [ "$pg_ready" = true ]; then
            print_status "PostgreSQL is ready ✓"
        else
            print_warning "PostgreSQL may not be ready yet"
        fi
        
        # Check Redis
        if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
            print_status "Redis is ready ✓"
        else
            print_warning "Redis may not be ready yet"
        fi
    else
        print_warning "Docker not available. Please ensure PostgreSQL and Redis are running manually."
        print_warning "PostgreSQL: localhost:5432, Redis: localhost:6379"
    fi
}

start_ml_service() {
    print_status "Starting ML Service on port $ML_PORT..."
    
    cd "$ML_DIR"
    
    # Activate virtual environment
    if [ -d "venv" ]; then
        source venv/bin/activate
    fi
    
    # Start ML service in background
    nohup python main.py > "$LOG_DIR/ml.log" 2>&1 &
    echo $! > "$PID_DIR/ml.pid"
    
    # Wait for ML service to start
    print_status "Waiting for ML service to start..."
    for i in {1..30}; do
        if curl -s "http://localhost:$ML_PORT/health" >/dev/null 2>&1; then
            print_status "ML Service is ready ✓"
            break
        fi
        sleep 1
    done
    
    cd "$PROJECT_ROOT"
}

start_api_service() {
    print_status "Starting API Service on port $API_PORT..."
    
    cd "$API_DIR"
    
    # Run database migrations
    print_status "Running database migrations..."
    pnpm db:generate
    pnpm db:migrate
    
    # Start API service in background
    nohup pnpm dev > "$LOG_DIR/api.log" 2>&1 &
    echo $! > "$PID_DIR/api.pid"
    
    # Wait for API service to start
    print_status "Waiting for API service to start..."
    for i in {1..30}; do
        if curl -s "http://localhost:$API_PORT/health" >/dev/null 2>&1; then
            print_status "API Service is ready ✓"
            break
        fi
        sleep 1
    done
    
    cd "$PROJECT_ROOT"
}

start_web_service() {
    print_status "Starting Web Frontend on port $WEB_PORT..."
    
    cd "$WEB_DIR"
    
    # Start web service in background
    nohup pnpm dev > "$LOG_DIR/web.log" 2>&1 &
    echo $! > "$PID_DIR/web.pid"
    
    # Wait for web service to start
    print_status "Waiting for Web service to start..."
    for i in {1..30}; do
        if curl -s "http://localhost:$WEB_PORT" >/dev/null 2>&1; then
            print_status "Web Frontend is ready ✓"
            break
        fi
        sleep 1
    done
    
    cd "$PROJECT_ROOT"
}

show_status() {
    echo ""
    echo -e "${GREEN}🚀 All services are running!${NC}"
    echo ""
    echo "┌─────────────────────────────────────────────────────────────┐"
    echo "│                      Service URLs                           │"
    echo "├─────────────────────────────────────────────────────────────┤"
    echo "│ 🌐 Web Frontend:    http://localhost:$WEB_PORT                   │"
    echo "│ 🔧 API Backend:     http://localhost:$API_PORT                   │"
    echo "│ 🤖 ML Service:      http://localhost:$ML_PORT                   │"
    echo "│ 📊 API Docs:        http://localhost:$API_PORT/docs              │"
    echo "│ 🧠 ML Docs:         http://localhost:$ML_PORT/docs               │"
    echo "└─────────────────────────────────────────────────────────────┘"
    echo ""
    echo -e "${YELLOW}Logs:${NC}"
    echo "  • Web:  tail -f $LOG_DIR/web.log"
    echo "  • API:  tail -f $LOG_DIR/api.log"
    echo "  • ML:   tail -f $LOG_DIR/ml.log"
    echo ""
    echo -e "${YELLOW}To stop all services:${NC} ./stop-all.sh"
    echo ""
}

cleanup() {
    echo ""
    print_warning "Shutting down services..."
    
    # Kill all services
    if [ -f "$PID_DIR/web.pid" ]; then
        kill $(cat "$PID_DIR/web.pid") 2>/dev/null || true
        rm "$PID_DIR/web.pid"
    fi
    
    if [ -f "$PID_DIR/api.pid" ]; then
        kill $(cat "$PID_DIR/api.pid") 2>/dev/null || true
        rm "$PID_DIR/api.pid"
    fi
    
    if [ -f "$PID_DIR/ml.pid" ]; then
        kill $(cat "$PID_DIR/ml.pid") 2>/dev/null || true
        rm "$PID_DIR/ml.pid"
    fi
    
    print_status "Services stopped"
    exit 0
}

# Handle Ctrl+C
trap cleanup SIGINT SIGTERM

main() {
    print_header
    
    check_dependencies
    check_ports
    install_dependencies
    setup_environment
    
    start_database_services
    start_ml_service
    start_api_service
    start_web_service
    
    show_status
    
    # Keep script running
    print_status "Press Ctrl+C to stop all services"
    while true; do
        sleep 1
    done
}

# Run main function
main "$@"
