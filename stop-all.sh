#!/bin/bash

# AIGuardian - Unified Stop Script
# Gracefully stops all services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directories
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_DIR="$PROJECT_ROOT/.pids"

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                     AI Guardian Platform                     ║"
    echo "║                   Stopping All Services                     ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

stop_service() {
    local service_name=$1
    local pid_file="$PID_DIR/${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            print_status "Stopping $service_name (PID: $pid)..."
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
                print_warning "Force killing $service_name..."
                kill -9 "$pid" 2>/dev/null || true
            fi
            
            print_status "$service_name stopped ✓"
        else
            print_warning "$service_name was not running"
        fi
        rm "$pid_file"
    else
        print_warning "No PID file found for $service_name"
    fi
}

stop_docker_services() {
    if command -v docker-compose &> /dev/null; then
        print_status "Stopping Docker services..."
        docker-compose down
        print_status "Docker services stopped ✓"
    else
        print_warning "Docker Compose not available, skipping Docker services"
    fi
}

kill_port_processes() {
    local ports=(3000 8000 8001)
    
    for port in "${ports[@]}"; do
        local pids=$(lsof -ti :$port 2>/dev/null || true)
        if [ -n "$pids" ]; then
            print_status "Killing processes on port $port..."
            echo "$pids" | xargs kill -9 2>/dev/null || true
        fi
    done
}

cleanup_files() {
    print_status "Cleaning up temporary files..."
    
    # Remove PID directory
    if [ -d "$PID_DIR" ]; then
        rm -rf "$PID_DIR"
    fi
    
    print_status "Cleanup complete ✓"
}

main() {
    print_header
    
    # Stop services in reverse order
    stop_service "web"
    stop_service "api"
    stop_service "ml"
    
    # Stop Docker services
    stop_docker_services
    
    # Kill any remaining processes on our ports
    kill_port_processes
    
    # Cleanup
    cleanup_files
    
    echo ""
    print_status "All services have been stopped successfully! 🛑"
    echo ""
}

# Run main function
main "$@"
