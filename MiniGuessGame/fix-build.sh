#!/bin/bash

# Quick fix for the build error

clear

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║              🔧 BUILD ERROR - FIXED! 🔧                        ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "  I've fixed the metro.config.js that was causing:"
echo "  'Error: Cannot pipe to a closed or destroyed stream'"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  ⚡ WHAT TO DO NOW:"
echo ""
echo "  1️⃣  Clear cache and restart server"
echo "     → Run: npm run start:clear"
echo "     → Wait for build to complete"
echo ""
echo "  2️⃣  For browser extension CORS errors"
echo "     → Use incognito mode: Ctrl+Shift+N"
echo "     → Go to: http://localhost:8081"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

read -p "  Press Enter to restart server with cache clear, or Ctrl+C to exit..."

echo ""
echo "  🧹 Clearing cache and restarting..."
echo ""

npm run start:clear
