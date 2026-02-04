# 🚀 Hackathon Setup Checklist

## ✅ Pre-Hackathon Setup (Do This First!)

### 1. Install Required Tools
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

### 2. Create Firebase Project
- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Click "Add Project"
- [ ] Name your project (e.g., "mini-guess-game")
- [ ] Disable Google Analytics (optional, saves time)
- [ ] Click "Create Project"

### 3. Setup Firestore Database
- [ ] In Firebase Console, go to "Firestore Database"
- [ ] Click "Create database"
- [ ] Start in **Test Mode** (we'll secure it later)
- [ ] Choose location (us-central1 is fine)
- [ ] Wait for database to provision

### 4. Get Firebase Credentials
- [ ] Go to Project Settings (gear icon)
- [ ] Scroll to "Your apps" section
- [ ] Click "Web" icon (</>) to add web app
- [ ] Register app with nickname (e.g., "mini-guess-game-web")
- [ ] Copy the firebaseConfig object
- [ ] Save credentials somewhere safe

### 5. Create Vercel Account
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up with GitHub (easiest)
- [ ] Verify your email
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login: `vercel login`

---

## 🏗️ Project Setup (At Hackathon)

### Step 1: Clone & Install (5 minutes)
```bash
cd TokTok-game-project/Mini-game/MiniGuessGame
npm install
```

### Step 2: Configure Firebase (5 minutes)
Create `.env` file in project root:
```env
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 3: Deploy API to Vercel (10 minutes)
```bash
# From project root
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? mini-guess-game-api
# - Directory? ./
# - Override settings? No

# Add environment variables in Vercel dashboard
# Go to: vercel.com/your-username/mini-guess-game-api/settings/environment-variables
# Add all FIREBASE_* variables from your .env file
```

### Step 4: Test API (2 minutes)
Visit in browser:
- `https://your-project.vercel.app/api/getLeaderboard`
- Should return: `{"success":true,"count":0,"data":[]}`

### Step 5: Update API URL in App (2 minutes)
Create `constants/api.ts`:
```typescript
export const API_BASE_URL = 'https://your-project.vercel.app/api';
```

### Step 6: Test Local Development (5 minutes)
```bash
npm start

# Press:
# - 'a' for Android emulator
# - 'i' for iOS simulator
# - 'w' for web browser
# - Or scan QR code with Expo Go app
```

---

## 🎮 Testing Checklist

### Basic Functionality
- [ ] App launches without errors
- [ ] Can enter username on home screen
- [ ] "View Leaderboard" button works
- [ ] Leaderboard shows mock data
- [ ] Dark/light mode toggle works
- [ ] Navigation between tabs works

### Game Logic (When Game Screen is Built)
- [ ] WebView loads Phaser game
- [ ] Can input guess
- [ ] Feedback shows correct colors
- [ ] Timer counts down from 60
- [ ] Win condition triggers
- [ ] Elo updates after game

### API Integration
- [ ] `/api/getLeaderboard` returns data
- [ ] `/api/updateElo` accepts POST requests
- [ ] Firestore updates visible in Firebase Console
- [ ] CORS works (no errors in console)

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module '@/components/...'"
**Fix:** Run `npm install` and restart Expo dev server

### Issue: "Firebase Admin SDK error"
**Fix:** Double-check environment variables in Vercel dashboard

### Issue: "Network request failed"
**Fix:** 
1. Check API URL is correct
2. Check CORS headers in API functions
3. Check Vercel deployment logs

### Issue: "WebView not loading"
**Fix:**
1. Check `game/index.html` exists
2. Check WebView permissions in app.json
3. Try on real device instead of simulator

### Issue: "Firestore permission denied"
**Fix:** Update Firestore rules to test mode:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## 📱 Demo Preparation

### Before Demo
- [ ] Deploy latest version to Vercel
- [ ] Test on real device (not emulator)
- [ ] Prepare 2-3 test accounts with different Elo scores
- [ ] Take screenshots of key features
- [ ] Prepare 2-minute pitch

### Demo Script
1. **Show home screen** - "Enter username to start"
2. **Show game mechanics** - "Guess the number, get feedback"
3. **Show feedback colors** - "Green = correct, yellow = wrong position"
4. **Show easter egg** - "6 and 9 have special emojis"
5. **Show leaderboard** - "Elo ranking system"
6. **Show responsiveness** - "Works on any device"

### Backup Plan
- [ ] Have screenshots/video ready if live demo fails
- [ ] Know your Firebase/Vercel URLs by heart
- [ ] Have localhost version running as fallback

---

## 🚀 Hackathon Day Schedule

### Hour 1-2: Core Setup
- [ ] Get Firebase + Vercel working
- [ ] Deploy API
- [ ] Test basic API calls

### Hour 3-4: Game Logic
- [ ] Build game screen with WebView
- [ ] Implement guess validation
- [ ] Test feedback rendering

### Hour 5-6: Integration
- [ ] Connect game to API
- [ ] Test Elo updates
- [ ] Test leaderboard refresh

### Hour 7-8: Polish
- [ ] Add animations
- [ ] Improve UI/UX
- [ ] Fix bugs
- [ ] Test on real devices

### Hour 9: Final Testing
- [ ] End-to-end testing
- [ ] Create demo accounts
- [ ] Prepare presentation

### Hour 10: Demo Time! 🎉
- [ ] Present your game
- [ ] Show live gameplay
- [ ] Explain tech stack
- [ ] Win the hackathon! 🏆

---

## 📊 Success Metrics

### Minimum Viable Product (MVP)
- [x] ✅ User can enter username
- [x] ✅ Leaderboard displays top players
- [ ] 🔨 User can play guessing game
- [ ] 🔨 Feedback shows after each guess
- [ ] 🔨 Elo score updates after game

### Nice to Have
- [ ] Timer countdown animation
- [ ] Sound effects
- [ ] Particle effects on win
- [ ] Profile pictures
- [ ] Game history

### Stretch Goals
- [ ] Real-time multiplayer (Socket.io)
- [ ] Tournament brackets
- [ ] Power-ups
- [ ] Daily challenges

---

## 🆘 Emergency Contacts

### Resources
- **Expo Docs:** https://docs.expo.dev
- **Phaser Examples:** https://phaser.io/examples
- **Firebase Docs:** https://firebase.google.com/docs
- **Vercel Docs:** https://vercel.com/docs

### Quick Help
- **Stack Overflow:** Search for specific errors
- **ChatGPT/Claude:** Paste error messages for debugging
- **Discord:** Join Expo/Phaser Discord servers

---

## ✅ Final Pre-Demo Checklist

### 30 Minutes Before Demo
- [ ] Vercel deployment is live
- [ ] API endpoints respond correctly
- [ ] Firestore has sample data
- [ ] App loads on your phone via Expo Go
- [ ] Screenshots/video backup ready
- [ ] Laptop is charged
- [ ] Presentation slides ready (optional)

### 5 Minutes Before Demo
- [ ] Close all unnecessary apps
- [ ] Clear browser cache
- [ ] Test demo flow once more
- [ ] Deep breath 🧘
- [ ] You got this! 💪

---

## 🎉 Post-Hackathon

### If You Win
- [ ] Celebrate! 🎊
- [ ] Share on social media
- [ ] Add to portfolio
- [ ] Write blog post about experience

### If You Don't Win
- [ ] Celebrate anyway! 🎉
- [ ] You built something awesome
- [ ] Share your code on GitHub
- [ ] Continue improving the project

### Either Way
- [ ] Connect with other participants
- [ ] Get feedback from judges
- [ ] Document what you learned
- [ ] Plan next hackathon! 🚀

---

**Remember:** The goal is to learn and have fun! Even if things break, you're gaining valuable experience. Good luck! 🍀