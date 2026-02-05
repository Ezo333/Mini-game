# Firebase Security Rules Deployment Guide

## Issue
Getting "7 PERMISSION_DENIED: Missing or insufficient permissions" error when creating solo games.

## Solution
You need to update your Firestore security rules to allow read/write access to the `soloGames` collection.

## Method 1: Deploy via Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on "Firestore Database" in the left sidebar
4. Click on the "Rules" tab at the top
5. Replace the existing rules with the content from `firestore.rules` file
6. Click "Publish"

## Method 2: Deploy via Firebase CLI

If you have Firebase CLI installed:

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not done)
cd /home/user/Desktop/TokTok-game-project/Mini-game/MiniGuessGame
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## Quick Fix Rules

Copy and paste these rules into your Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Multiplayer rooms
    match /rooms/{roomCode} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
    }
    
    // Solo games
    match /soloGames/{gameId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
    }
  }
}
```

## Security Note

The current rules allow anyone to read/write. For production, you should:
1. Add authentication checks
2. Validate user ownership
3. Add rate limiting

Example secure rules:
```
match /soloGames/{gameId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow update: if request.auth != null && 
                 resource.data.username == request.auth.token.name;
}
```

## After Deploying Rules

Once rules are deployed, test the solo game creation:
1. Go to home screen
2. Enter username
3. Click "Solo Mode"
4. Configure game settings
5. Click "Start Solo Game"

Should work without permission errors!
