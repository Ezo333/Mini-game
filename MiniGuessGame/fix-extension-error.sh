#!/bin/bash

# Quick fix for browser extension CORS errors
# Run this if you see "Unauthorized request from chrome-extension://" error

echo "🔧 Browser Extension Fix Script"
echo "================================"
echo ""
echo "This error happens when browser extensions"
echo "(like React DevTools) interfere with Expo."
echo ""
echo "Choose a fix:"
echo ""
echo "1) 🧹 Restart server with cache clear (Recommended)"
echo "2) 🕵️  Open instructions for incognito mode"
echo "3) 📖 View full fix guide"
echo "4) ❌ Cancel"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
  1)
    echo ""
    echo "🧹 Restarting server with cache clear..."
    echo "This will apply the metro.config.js fix."
    echo ""
    echo "After starting, you can:"
    echo "  - Press 'w' for web (should work now)"
    echo "  - Or use incognito: Ctrl+Shift+N"
    echo ""
    read -p "Press Enter to restart server..."
    npx expo start --clear
    ;;
  2)
    echo ""
    echo "🕵️  INCOGNITO MODE INSTRUCTIONS"
    echo "================================"
    echo ""
    echo "1. Keep your terminal running"
    echo "2. Open incognito window:"
    echo "   - Windows/Linux: Ctrl+Shift+N"
    echo "   - Mac: Cmd+Shift+N"
    echo "3. Navigate to: http://localhost:8081"
    echo "4. Test your app!"
    echo ""
    echo "Why? Incognito disables extensions by default."
    echo ""
    ;;
  3)
    echo ""
    echo "📖 Opening full fix guide..."
    echo ""
    if [ -f "BROWSER_EXTENSION_FIX.md" ]; then
      cat BROWSER_EXTENSION_FIX.md
    else
      echo "Guide file not found. Here's a summary:"
      echo ""
      echo "QUICK FIXES:"
      echo "1. Use incognito mode (Ctrl+Shift+N)"
      echo "2. Disable React DevTools extension"
      echo "3. Restart server: npm run start:clear"
      echo ""
      echo "The metro.config.js file has been created"
      echo "to allow extension requests in development."
    fi
    echo ""
    ;;
  4)
    echo ""
    echo "❌ Cancelled"
    exit 0
    ;;
  *)
    echo ""
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "================================"
echo "Need more help?"
echo "Read: BROWSER_EXTENSION_FIX.md"
echo "================================"
