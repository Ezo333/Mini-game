# 🔥 FIREBASE PERMISSION ERROR FIX

## The Problem
```json
{
    "error": "Internal server error",
    "message": "7 PERMISSION_DENIED: Missing or insufficient permissions."
}
```

This happens because Firebase Firestore doesn't have security rules configured for the `soloGames` collection.

## Quick Fix (5 minutes)

### Option 1: Firebase Console (Easiest)

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Select your project

2. **Navigate to Firestore Rules**
   - Click "Firestore Database" in left sidebar
   - Click "Rules" tab at the top

3. **Update Rules**
   - Copy the rules below
   - Paste into the editor
   - Click "Publish"

```javascript
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
    
    // Solo games - THIS IS THE FIX!
    match /soloGames/{gameId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
    }
  }
}
```

4. **Test**
   - Try creating a solo game again
   - Should work now!

### Option 2: Firebase CLI (Advanced)

```bash
# 1. Install Firebase CLI (if needed)
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Navigate to project
cd /home/user/Desktop/TokTok-game-project/Mini-game/MiniGuessGame

# 4. Initialize (if first time)
firebase init firestore
# Select your project
# Accept default firestore.rules and firestore.indexes.json

# 5. Deploy rules
firebase deploy --only firestore:rules
```

### Option 3: Use Setup Script

```bash
cd /home/user/Desktop/TokTok-game-project/Mini-game/MiniGuessGame
chmod +x setup-firebase-rules.sh
./setup-firebase-rules.sh
```

## Verify the Fix

After deploying rules:

1. **Redeploy your Vercel API** (if needed)
   ```bash
   vercel --prod
   ```

2. **Test Solo Game**
   - Open app
   - Enter username
   - Click "Solo Mode"
   - Click "Start Solo Game"
   - Should create game successfully!

3. **Check Firebase Console**
   - Go to Firestore Database
   - Check "soloGames" collection
   - You should see new game documents

## What Changed?

**Before:** No rules for `soloGames` collection → Firebase blocks all access

**After:** Rules allow read/write → Solo games can be created

## Security Notes

⚠️ Current rules allow anyone to read/write (good for development)

For production, add authentication:
```javascript
match /soloGames/{gameId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow update: if request.auth != null && 
                 resource.data.username == request.auth.token.name;
}
```

## Still Having Issues?

1. **Check Firebase Project**
   - Make sure you're in the correct Firebase project
   - Check if Firestore is enabled

2. **Check Environment Variables**
   - Verify `.env` or Vercel env vars have correct Firebase config

3. **Check API Logs**
   - Go to Vercel dashboard → Your project → Functions
   - Check `createSoloGame` logs for details

4. **Contact Support**
   - Firebase Console shows rule validation errors
   - Check browser console for client-side errors

## Files Created
- `firestore.rules` - Security rules file
- `setup-firebase-rules.sh` - Auto-deployment script
- `FIREBASE_RULES_FIX.md` - This guide

## Need More Help?

Common errors:
- "Project not found" → Wrong Firebase project selected
- "Insufficient permissions" → Account doesn't have Firebase admin access
- "Rules syntax error" → Copy rules exactly as shown above

The solo game feature will work once Firestore rules are deployed! 🚀
