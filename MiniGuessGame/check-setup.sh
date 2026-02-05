#!/bin/bash

# Project Status Checker
# Verifies everything is ready for tunnel testing

echo "🔍 MiniGuessGame - Setup Status Check"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Found: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Not found"
    echo "  Install from: https://nodejs.org"
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} Found: v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} Not found"
fi

# Check if node_modules exists
echo -n "Checking dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Installed"
else
    echo -e "${RED}✗${NC} Not installed"
    echo "  Run: npm install"
fi

# Check Expo CLI
echo -n "Checking Expo CLI... "
if npx expo --version &> /dev/null 2>&1; then
    EXPO_VERSION=$(npx expo --version 2>/dev/null)
    echo -e "${GREEN}✓${NC} Found: v$EXPO_VERSION"
else
    echo -e "${YELLOW}⚠${NC} Not found (will use npx)"
fi

# Check Expo login
echo -n "Checking Expo account... "
EXPO_USER=$(npx expo whoami 2>/dev/null)
if [ $? -eq 0 ] && [ ! -z "$EXPO_USER" ]; then
    echo -e "${GREEN}✓${NC} Logged in as: $EXPO_USER"
else
    echo -e "${YELLOW}⚠${NC} Not logged in"
    echo "  Run: npx expo login"
    echo "  (Required for tunnel mode)"
fi

# Check if API URL is set
echo -n "Checking API configuration... "
if grep -q "mini-guess-game.*vercel.app" app/lobby.tsx 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Using Vercel API"
elif grep -q "localhost" app/lobby.tsx 2>/dev/null; then
    echo -e "${YELLOW}⚠${NC} Using localhost (won't work with tunnel)"
    echo "  Update API_BASE_URL in app/lobby.tsx and app/game.tsx"
else
    echo -e "${YELLOW}⚠${NC} Could not verify"
fi

# Check for .env file
echo -n "Checking .env file... "
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Found"
else
    echo -e "${YELLOW}⚠${NC} Not found (might not be needed)"
fi

echo ""
echo "========================================"
echo "📊 Summary"
echo "========================================"
echo ""

# Count checks
READY=true

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗${NC} Node.js is required"
    READY=false
fi

if ! [ -d "node_modules" ]; then
    echo -e "${RED}✗${NC} Dependencies not installed"
    echo "   Run: npm install"
    READY=false
fi

EXPO_USER=$(npx expo whoami 2>/dev/null)
if [ $? -ne 0 ] || [ -z "$EXPO_USER" ]; then
    echo -e "${YELLOW}⚠${NC} Not logged into Expo (needed for tunnel)"
    echo "   Run: npx expo login"
fi

if $READY; then
    echo ""
    echo -e "${GREEN}✓ Ready to start!${NC}"
    echo ""
    echo "🚀 Quick Commands:"
    echo "   npm run start:tunnel  - Start with tunnel (for multiplayer)"
    echo "   npm run start:lan     - Start with LAN (same WiFi)"
    echo "   ./quick-start.sh      - Interactive menu"
    echo ""
else
    echo ""
    echo -e "${RED}⚠ Some setup required before starting${NC}"
    echo ""
fi

echo "========================================"
