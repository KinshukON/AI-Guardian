#!/bin/bash

# AIGuardian - Single Service Restart Script
# Restarts a specific service

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directories
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$PROJECT_ROOT/apps/api"
WEB_DIR="$PROJECT_ROOT/apps/web"
ML_DIR="$PROJECT_ROOT/apps/ml"
PID_DIR="$PROJECT_ROOT/.pids"
LOG_DIR="$PROJECT_ROOT/.logs"

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

usage() {
    echo "Usage: $0 <service>"
    echo ""
    echo "Available services:"
    echo "  web    - Web Frontend (React/Vite)"
    echo "  api    - API Backend (Node.js/Fastify)"
    echo "  ml     - ML Service (Python/FastAPI)"
    echo "  all    - All services"
    echo ""
    echo "Examples:"
    echo "  $0 web    # Restart just the web frontend"
    echo "  $0 api    # Restart just the API backend"
    echo "  $0 ml     # Restart just the ML service"
    echo "  $0 all    # Restart all services"
}

stop_service() {
    local service=$1
    local pid_file="$PID_DIR/${service}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            print_status "Stopping $service (PID: $pid)..."
            kill "$pid"
            
            # Wait for process to stop
            for i in {1..10}; do
                if ! kill -0 "$pid" 2>/dev/null; then
                    break
                fi
                sleep 1
            done
            
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                print_warning "Force killing $service..."
                kill -9 "$pid" 2>/dev/null || true
            fi
            
            print_status "$service stopped ✓"
        fi
        rm "$pid_file"
    else
        print_warning "Service $service was not running"
    fi
}

start_web() {
    print_status "Starting Web Frontend..."
    cd "$WEB_DIR"
    mkdir -p "$PID_DIR" "$LOG_DIR"
    nohup pnpm dev > "$LOG_DIR/web.log" 2>&1 &
    echo $! > "$PID_DIR/web.pid"
    
    # Wait for service to start
    for i in {1..30}; do
        if curl -s "http://localhost:3000" >/dev/null 2>&1; then
            print_status "Web Frontend is ready ✓"
            break
        fi
        sleep 1
    done
    cd "$PROJECT_ROOT"
}

start_api() {
    print_status "Starting API Backend..."
    cd "$API_DIR"
    mkdir -p "$PID_DIR" "$LOG_DIR"
    nohup pnpm dev > "$LOG_DIR/api.log" 2>&1 &
    echo $! > "$PID_DIR/api.pid"
    
    # Wait for service to start
    for i in {1..30}; do
        if curl -s "http://localhost:8000/health" >/dev/null 2>&1; then
            print_status "API Backend is ready ✓"
            break
        fi
        sleep 1
    done
    cd "$PROJECT_ROOT"
}

start_ml() {
    print_status "Starting ML Service..."
    cd "$ML_DIR"
    mkdir -p "$PID_DIR" "$LOG_DIR"
    
    # Activate virtual environment if it exists
    if [ -d "venv" ]; then
        source venv/bin/activate
    fi
    
    nohup python main.py > "$LOG_DIR/ml.log" 2>&1 &
    echo $! > "$PID_DIR/ml.pid"
    
    # Wait for service to start
    for i in {1..30}; do
        if curl -s "http://localhost:8001/health" >/dev/null 2>&1; then
            print_status "ML Service is ready ✓"
            break
        fi
        sleep 1
    done
    cd "$PROJECT_ROOT"
}

restart_service() {
    local service=$1
    
    print_status "Restarting $service service..."
    
    case $service in
        web)
            stop_service "web"
            start_web
            ;;
        api)
            stop_service "api"
            start_api
            ;;
        ml)
            stop_service "ml"
            start_ml
            ;;
        all)
            print_status "Restarting all services..."
            stop_service "web"
            stop_service "api"
            stop_service "ml"
            sleep 2
            start_ml
            sleep 3
            start_api
            sleep 3
            start_web
            ;;
        *)
            print_error "Unknown service: $service"
            usage
            exit 1
            ;;
    esac
    
    print_status "$service restart complete! ✅"
}

main() {
    if [ $# -eq 0 ]; then
        print_error "No service specified"
        usage
        exit 1
    fi
    
    local service=$1
    
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                     AI Guardian Platform                     ║"
    echo "║                   Restarting: $service"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    restart_service "$service"
    
    echo ""
    print_status "You can check the status with: ./status.sh"
    print_status "View logs with: tail -f .logs/${service}.log"
}

# Run main function
main "$@"
