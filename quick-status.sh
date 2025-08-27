#!/bin/bash

# AIGuardian - Quick Status Check (No Timeouts)
# Fast status check without hanging

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Service ports
WEB_PORT=3002
API_PORT=8000
ML_PORT=8001

print_quick_status() {
    echo -e "${BLUE}🚀 AIGuardian Quick Status${NC}"
    echo "=========================="
    
    # Check processes by port (fast)
    check_port_quick() {
        local service=$1
        local port=$2
        
        if lsof -i ":$port" >/dev/null 2>&1; then
            local pid=$(lsof -ti ":$port" 2>/dev/null | head -1)
            echo -e "✅ ${GREEN}$service${NC} running on port $port (PID: $pid)"
            return 0
        else
            echo -e "❌ ${RED}$service${NC} not running on port $port"
            return 1
        fi
    }
    
    # Check all services
    local running=0
    
    if check_port_quick "Web Frontend" $WEB_PORT; then ((running++)); fi
    if check_port_quick "API Backend" $API_PORT; then ((running++)); fi
    if check_port_quick "ML Service" $ML_PORT; then ((running++)); fi
    
    echo ""
    
    # Docker services (quick check)
    if command -v docker &> /dev/null; then
        # Check PostgreSQL
        if docker ps --format "{{.Names}}" 2>/dev/null | grep -q "postgres"; then
            echo -e "✅ ${GREEN}PostgreSQL${NC} running in Docker (port 5432)"
            ((running++))
        else
            echo -e "❌ ${RED}PostgreSQL${NC} not running"
        fi
        
        # Check Redis  
        if docker ps --format "{{.Names}}" 2>/dev/null | grep -q "redis"; then
            echo -e "✅ ${GREEN}Redis${NC} running in Docker (port 6379)"
            ((running++))
        else
            echo -e "❌ ${RED}Redis${NC} not running"
        fi
    else
        echo -e "⚠️  ${YELLOW}Docker${NC} not available"
    fi
    
    echo ""
    echo "=========================="
    
    if [ $running -ge 3 ]; then
        echo -e "🎉 ${GREEN}System is running!${NC} ($running/5 services)"
        echo ""
        echo -e "${YELLOW}Access URLs:${NC}"
        echo "• Web:  http://localhost:$WEB_PORT"
        echo "• API:  http://localhost:$API_PORT"
        echo "• ML:   http://localhost:$ML_PORT"
    elif [ $running -gt 0 ]; then
        echo -e "⚠️  ${YELLOW}Partially running${NC} ($running/5 services)"
        echo "• Run: ./start-all.sh to start missing services"
    else
        echo -e "❌ ${RED}No services running${NC}"
        echo "• Run: ./start-all.sh to start all services"
    fi
    
    echo ""
}

print_quick_status
