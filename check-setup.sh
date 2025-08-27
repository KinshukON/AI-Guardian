#!/bin/bash

# AIGuardian - Setup Verification Script
# Checks if everything is ready for development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                     AI Guardian Platform                     ║"
    echo "║                    Setup Verification                        ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_check() {
    local name=$1
    local status=$2
    local details=$3
    
    if [ "$status" = "pass" ]; then
        echo -e "✅ ${GREEN}$name${NC} $details"
    elif [ "$status" = "warn" ]; then
        echo -e "⚠️  ${YELLOW}$name${NC} $details"
    else
        echo -e "❌ ${RED}$name${NC} $details"
    fi
}

check_node() {
    if command -v node &> /dev/null; then
        local version=$(node --version)
        local major_version=$(echo $version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$major_version" -ge 18 ]; then
            print_check "Node.js" "pass" "($version)"
        else
            print_check "Node.js" "fail" "($version - requires 18+)"
            return 1
        fi
    else
        print_check "Node.js" "fail" "(not installed)"
        return 1
    fi
}

check_pnpm() {
    if command -v pnpm &> /dev/null; then
        local version=$(pnpm --version)
        print_check "pnpm" "pass" "($version)"
    else
        print_check "pnpm" "fail" "(not installed - run: npm install -g pnpm)"
        return 1
    fi
}

check_python() {
    if command -v python3 &> /dev/null; then
        local version=$(python3 --version)
        print_check "Python 3" "pass" "($version)"
    else
        print_check "Python 3" "fail" "(not installed)"
        return 1
    fi
}

check_docker() {
    if command -v docker &> /dev/null; then
        if docker info &> /dev/null; then
            print_check "Docker" "pass" "(running)"
        else
            print_check "Docker" "warn" "(installed but not running)"
        fi
    else
        print_check "Docker" "warn" "(not installed - optional for development)"
    fi
}

check_ports() {
    local ports=(3000 8000 8001)
    local all_available=true
    
    for port in "${ports[@]}"; do
        if lsof -i ":$port" >/dev/null 2>&1; then
            print_check "Port $port" "fail" "(in use)"
            all_available=false
        else
            print_check "Port $port" "pass" "(available)"
        fi
    done
    
    if [ "$all_available" = true ]; then
        return 0
    else
        return 1
    fi
}

check_dependencies() {
    echo ""
    echo -e "${YELLOW}📦 Checking Dependencies...${NC}"
    
    local all_deps=true
    
    # Check if root node_modules exists
    if [ -d "node_modules" ]; then
        print_check "Root dependencies" "pass" "(installed)"
    else
        print_check "Root dependencies" "fail" "(run: pnpm install)"
        all_deps=false
    fi
    
    # Check API dependencies
    if [ -d "apps/api/node_modules" ]; then
        print_check "API dependencies" "pass" "(installed)"
    else
        print_check "API dependencies" "fail" "(run: cd apps/api && pnpm install)"
        all_deps=false
    fi
    
    # Check Web dependencies
    if [ -d "apps/web/node_modules" ]; then
        print_check "Web dependencies" "pass" "(installed)"
    else
        print_check "Web dependencies" "fail" "(run: cd apps/web && pnpm install)"
        all_deps=false
    fi
    
    # Check ML virtual environment
    if [ -d "apps/ml/venv" ]; then
        print_check "ML virtual env" "pass" "(created)"
        
        # Check if requirements are installed
        cd apps/ml
        if source venv/bin/activate && pip list | grep -q fastapi; then
            print_check "ML dependencies" "pass" "(installed)"
        else
            print_check "ML dependencies" "fail" "(run: cd apps/ml && source venv/bin/activate && pip install -r requirements.txt)"
            all_deps=false
        fi
        cd - >/dev/null
    else
        print_check "ML virtual env" "fail" "(run: cd apps/ml && python3 -m venv venv)"
        all_deps=false
    fi
    
    if [ "$all_deps" = true ]; then
        return 0
    else
        return 1
    fi
}

check_environment() {
    echo ""
    echo -e "${YELLOW}⚙️  Checking Environment...${NC}"
    
    # Check if .env files exist
    if [ -f "apps/api/.env" ]; then
        print_check "API .env" "pass" "(exists)"
    else
        print_check "API .env" "warn" "(will be created automatically)"
    fi
    
    if [ -f "apps/ml/.env" ]; then
        print_check "ML .env" "pass" "(exists)"
    else
        print_check "ML .env" "warn" "(will be created automatically)"
    fi
    
    # Check database connectivity (if Docker is running)
    if command -v docker &> /dev/null && docker info &> /dev/null; then
        if docker ps | grep -q "aiguardian-postgres"; then
            print_check "PostgreSQL" "pass" "(running in Docker)"
        else
            print_check "PostgreSQL" "warn" "(not running - will be started automatically)"
        fi
        
        if docker ps | grep -q "aiguardian-redis"; then
            print_check "Redis" "pass" "(running in Docker)"
        else
            print_check "Redis" "warn" "(not running - will be started automatically)"
        fi
    else
        print_check "Database services" "warn" "(Docker not running - ensure PostgreSQL and Redis are available)"
    fi
}

show_summary() {
    echo ""
    echo -e "${BLUE}📋 Summary${NC}"
    echo "├─────────────────────────────────────────────────────────────┤"
    
    if [ $overall_status -eq 0 ]; then
        echo -e "│ ${GREEN}✅ Setup looks good! Ready to start development.${NC}          │"
        echo "│                                                             │"
        echo "│ To start all services:                                      │"
        echo "│   ./start-all.sh                                           │"
        echo "│                                                             │"
        echo "│ Or use npm/pnpm:                                            │"
        echo "│   pnpm start                                                │"
    else
        echo -e "│ ${YELLOW}⚠️  Some issues found. Please review and fix.${NC}             │"
        echo "│                                                             │"
        echo "│ The start script will attempt to fix some issues           │"
        echo "│ automatically, but manual intervention may be needed.      │"
    fi
    
    echo "└─────────────────────────────────────────────────────────────┘"
    echo ""
    echo -e "${YELLOW}💡 Helpful commands:${NC}"
    echo "  • Check status:        ./status.sh"
    echo "  • Start all services:  ./start-all.sh"
    echo "  • Stop all services:   ./stop-all.sh"
    echo "  • View logs:           tail -f .logs/*.log"
    echo ""
}

main() {
    print_header
    
    echo ""
    echo -e "${YELLOW}🔧 Checking System Requirements...${NC}"
    
    overall_status=0
    
    # Check system requirements
    check_node || overall_status=1
    check_pnpm || overall_status=1
    check_python || overall_status=1
    check_docker
    
    echo ""
    echo -e "${YELLOW}🚪 Checking Ports...${NC}"
    check_ports || overall_status=1
    
    # Check dependencies
    check_dependencies || overall_status=1
    
    # Check environment
    check_environment
    
    # Show summary
    show_summary
    
    exit $overall_status
}

# Run main function
main "$@"
