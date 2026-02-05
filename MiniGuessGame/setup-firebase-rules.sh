#!/bin/bash

# Firebase Rules Setup Script
# This script helps you deploy Firestore security rules

echo "======================================"
echo "Firebase Firestore Rules Setup"
echo "======================================"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "⚠️  Firebase CLI is not installed."
    echo ""
    echo "Install it with:"
    echo "  npm install -g firebase-tools"
    echo ""
    read -p "Do you want to install it now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g firebase-tools
    else
        echo "Please install Firebase CLI and run this script again."
        exit 1
    fi
fi

echo "✅ Firebase CLI is installed"
echo ""

# Check if logged in
echo "Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo "⚠️  Not logged in to Firebase"
    echo ""
    firebase login
fi

echo "✅ Logged in to Firebase"
echo ""

# Check if firebase.json exists
if [ ! -f "firebase.json" ]; then
    echo "⚠️  firebase.json not found. Initializing Firestore..."
    echo ""
    firebase init firestore
fi

echo "✅ Firebase initialized"
echo ""

# Deploy rules
echo "Deploying Firestore security rules..."
echo ""
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================"
    echo "✅ SUCCESS!"
    echo "======================================"
    echo ""
    echo "Firestore rules have been deployed."
    echo "Your solo game should now work!"
    echo ""
    echo "Test it by:"
    echo "  1. Running: npx expo start"
    echo "  2. Click 'Solo Mode'"
    echo "  3. Create a game"
    echo ""
else
    echo ""
    echo "======================================"
    echo "❌ DEPLOYMENT FAILED"
    echo "======================================"
    echo ""
    echo "Please deploy manually:"
    echo "  1. Go to https://console.firebase.google.com/"
    echo "  2. Select your project"
    echo "  3. Go to Firestore Database > Rules"
    echo "  4. Copy content from firestore.rules"
    echo "  5. Click Publish"
    echo ""
fi
