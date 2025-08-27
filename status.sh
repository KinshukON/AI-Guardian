#!/bin/bash

# AIGuardian - Service Status Script
# Shows the status of all services

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
PID_DIR="$PROJECT_ROOT/.pids"

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                     AI Guardian Platform                     ║"
    echo "║                     Service Status                           ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

check_service_status() {
    local service_name=$1
    local port=$2
    local url=${3:-"http://localhost:$port"}
    
    local status="❌ Down"
    local pid_status=""
    
    # Check if port is in use
    if lsof -i ":$port" >/dev/null 2>&1; then
        # Check if service responds with timeout
        if curl -s --connect-timeout 2 --max-time 3 "$url" >/dev/null 2>&1; then
            status="✅ Running"
        else
            status="⚠️  Starting up..."
        fi
        
        # Get PID info
        local pid=$(lsof -ti ":$port" 2>/dev/null | head -1)
        if [ -n "$pid" ]; then
            pid_status="(PID: $pid)"
        fi
    fi
    
    printf "│ %-20s │ %-8s │ %-30s │\n" "$service_name" "$port" "$status $pid_status"
}

check_docker_service() {
    local service_name=$1
    local container_name=$2
    
    local status="❌ Down"
    
    if command -v docker &> /dev/null; then
        # Add timeout to docker commands
        if timeout 3 docker ps --format "table {{.Names}}" 2>/dev/null | grep -q "^$container_name$"; then
            status="✅ Running"
        elif timeout 3 docker ps -a --format "table {{.Names}}" 2>/dev/null | grep -q "^$container_name$"; then
            status="⚠️  Stopped"
        fi
    else
        status="❓ Docker not available"
    fi
    
    printf "│ %-20s │ %-8s │ %-30s │\n" "$service_name" "-" "$status"
}

show_logs_info() {
    echo ""
    echo -e "${YELLOW}📋 Log Files:${NC}"
    echo "├─────────────────────────────────────────────────────────────┤"
    
    local log_dir="$PROJECT_ROOT/.logs"
    if [ -d "$log_dir" ]; then
        for log_file in "$log_dir"/*.log; do
            if [ -f "$log_file" ]; then
                local filename=$(basename "$log_file")
                local size=$(ls -lh "$log_file" | awk '{print $5}')
                echo "│ $filename: $size"
            fi
        done
    else
        echo "│ No log files found"
    fi
    echo "└─────────────────────────────────────────────────────────────┘"
}

show_quick_commands() {
    echo ""
    echo -e "${YELLOW}🚀 Quick Commands:${NC}"
    echo "├─────────────────────────────────────────────────────────────┤"
    echo "│ Start all services:    ./start-all.sh                      │"
    echo "│ Stop all services:     ./stop-all.sh                       │"
    echo "│ View logs:             tail -f .logs/<service>.log          │"
    echo "│ Check status:          ./status.sh                         │"
    echo "│ Restart single:        ./restart-service.sh <service>      │"
    echo "└─────────────────────────────────────────────────────────────┘"
}

main() {
    print_header
    
    echo ""
    echo "┌──────────────────────────────────────────────────────────────┐"
    echo "│ Service              │ Port     │ Status                     │"
    echo "├──────────────────────┼──────────┼────────────────────────────┤"
    
    # Check application services
    check_service_status "Web Frontend" "$WEB_PORT"
    check_service_status "API Backend" "$API_PORT" "http://localhost:$API_PORT/health"
    check_service_status "ML Service" "$ML_PORT" "http://localhost:$ML_PORT/health"
    
    echo "├──────────────────────┼──────────┼────────────────────────────┤"
    
    # Check infrastructure services
    check_service_status "PostgreSQL" "$POSTGRES_PORT"
    check_service_status "Redis" "$REDIS_PORT"
    
    echo "├──────────────────────┼──────────┼────────────────────────────┤"
    
    # Check Docker services
    check_docker_service "Docker PostgreSQL" "aiguardian-postgres"
    check_docker_service "Docker Redis" "aiguardian-redis"
    
    echo "└──────────────────────┴──────────┴────────────────────────────┘"
    
    show_logs_info
    show_quick_commands
    
    echo ""
}

# Run main function
main "$@"
