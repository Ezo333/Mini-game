#!/bin/bash

# MiniGuessGame Quick Start Script
# This script helps you run the app with different modes

echo "🎮 MiniGuessGame - Quick Start"
echo "================================"
echo ""
echo "Choose how to run the app:"
echo ""
echo "1) 🌐 Tunnel Mode (test across different networks)"
echo "2) 📡 LAN Mode (test on same WiFi - fastest)"
echo "3) 💻 Localhost (development only)"
echo "4) 🧹 Clear cache + Tunnel"
echo "5) 🌍 Web only"
echo "6) 📱 Mobile Tunnel (Android/iOS)"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
  1)
    echo ""
    echo "🌐 Starting with TUNNEL mode..."
    echo "✓ Works across different networks"
    echo "✓ Share QR code with anyone"
    echo "✓ May be slower initially"
    echo ""
    npx expo start --tunnel
    ;;
  2)
    echo ""
    echo "📡 Starting with LAN mode..."
    echo "✓ Fast local network testing"
    echo "✓ All devices must be on same WiFi"
    echo ""
    npx expo start --lan
    ;;
  3)
    echo ""
    echo "💻 Starting with LOCALHOST mode..."
    echo "✓ Fastest for development"
    echo "✓ Only works on this computer"
    echo ""
    npx expo start --localhost
    ;;
  4)
    echo ""
    echo "🧹 Clearing cache and starting with TUNNEL..."
    echo ""
    npx expo start --tunnel --clear
    ;;
  5)
    echo ""
    echo "🌍 Starting WEB mode only..."
    echo "✓ Opens in browser"
    echo ""
    npx expo start --web
    ;;
  6)
    echo ""
    echo "Which platform?"
    echo "1) Android"
    echo "2) iOS"
    read -p "Enter choice (1-2): " platform_choice

    if [ "$platform_choice" = "1" ]; then
      echo "📱 Starting Android with TUNNEL..."
      npx expo start --android --tunnel
    elif [ "$platform_choice" = "2" ]; then
      echo "📱 Starting iOS with TUNNEL..."
      npx expo start --ios --tunnel
    else
      echo "❌ Invalid choice"
      exit 1
    fi
    ;;
  *)
    echo "❌ Invalid choice. Please run again and choose 1-6."
    exit 1
    ;;
esac

echo ""
echo "================================"
echo "📚 Quick Tips:"
echo "- Press 'w' for web browser"
echo "- Press 't' to toggle tunnel/LAN"
echo "- Press 'r' to reload"
echo "- Press '?' for all commands"
echo ""
echo "💡 Browser Extension Issues?"
echo "- Use incognito mode: Ctrl+Shift+N"
echo "- Or disable React DevTools"
echo "- See: BROWSER_EXTENSION_FIX.md"
echo "================================"
