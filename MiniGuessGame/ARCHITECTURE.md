# 🎮 Mini 1v1 Guessing Game - Architecture Diagram

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          MOBILE APP (React Native + Expo)                │
│                                                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────────┐   │
│  │  Home Screen    │  │  Game Screen    │  │  Leaderboard Screen  │   │
│  │  - Username     │  │  - WebView      │  │  - Top Players       │   │
│  │  - Start Game   │  │  - Timer (60s)  │  │  - Elo Scores        │   │
│  │  - View Board   │  │  - Input Field  │  │  - Win/Loss Stats    │   │
│  └─────────────────┘  └─────────────────┘  └──────────────────────┘   │
│                               │                        │                 │
│                               │                        │                 │
│                        postMessage()            Axios HTTP              │
│                               │                        │                 │
└───────────────────────────────┼────────────────────────┼─────────────────┘
                                │                        │
                                ▼                        ▼
                    ┌─────────────────────┐   ┌──────────────────────┐
                    │   PHASER 3 GAME     │   │   VERCEL FUNCTIONS   │
                    │   (WebView HTML)    │   │   (API Endpoints)    │
                    │                     │   │                      │
                    │  - Game Logic       │   │  /api/saveScore      │
                    │  - Guess Validation │   │  /api/getLeaderboard │
                    │  - Feedback Engine  │   │  /api/updateElo      │
                    │  - 6/9 Emoji Fun    │   │                      │
                    └─────────────────────┘   └──────────────────────┘
                                                          │
                                                          │ Firebase SDK
                                                          ▼
                                              ┌────────────────────────┐
                                              │  FIREBASE FIRESTORE    │
                                              │                        │
                                              │  Collection: users     │
                                              │  - username (string)   │
                                              │  - elo (number)        │
                                              │  - wins (number)       │
                                              │  - losses (number)     │
                                              │  - gamesPlayed (num)   │
                                              │  - timestamp (date)    │
                                              └────────────────────────┘
```

---

## 🔄 Data Flow - Complete Game Loop

### **1. Game Start**
```
User enters username on Home Screen
        │
        ▼
React Native generates random 3-5 digit secret number
        │
        ▼
Game Screen loads → WebView renders Phaser canvas
        │
        ▼
Timer starts (60 seconds countdown)
```

### **2. Gameplay Loop**
```
Player enters guess in React Native input field
        │
        ▼
RN sends guess to Phaser via WebView.postMessage({ type: 'guess', value: '1234' })
        │
        ▼
Phaser evaluates guess against secret number:
  - For each digit:
    ✅ Green (correct position + correct digit)
    ⚠️  Yellow (wrong position but digit exists)
    ❌ Red (digit not in secret)
    🔄 Special emoji for 6
    🔁 Special emoji for 9
        │
        ▼
Phaser sends feedback back via window.ReactNativeWebView.postMessage()
        │
        ▼
React Native displays colored feedback + emojis
        │
        ▼
If guess is fully correct → Player wins! → End game
If timer hits 0 → End game
```

### **3. Game End & Leaderboard Update**
```
Game ends (win/timeout)
        │
        ▼
React Native calculates:
  - Winner (most correct guesses or first to finish)
  - Elo adjustment (+/- based on win/loss)
        │
        ▼
React Native → Axios POST to /api/updateElo
        │
        ▼
Vercel Function receives data:
  {
    username: "Player1",
    didWin: true,
    eloChange: +25
  }
        │
        ▼
Vercel Function → Firebase Firestore
  - Update or create user document
  - Increment wins/losses
  - Update Elo score
        │
        ▼
Success response sent back to React Native
        │
        ▼
React Native navigates to Leaderboard Screen
        │
        ▼
Leaderboard Screen → Axios GET /api/getLeaderboard
        │
        ▼
Vercel Function fetches top 10 users from Firestore
        │
        ▼
Display leaderboard with rankings
```

---

## 🎯 Key Components Breakdown

### **React Native Layer** (`App.js` or screens)
| Component | Responsibility |
|-----------|---------------|
| `HomeScreen` | Username input, matchmaking |
| `GameScreen` | WebView container, input field, timer UI |
| `LeaderboardScreen` | Fetch & display top players |
| `Timer` | 60-second countdown, triggers game end |
| `GuessInput` | Number input field with submit button |
| `FeedbackDisplay` | Shows colored circles/emojis per digit |

### **Phaser 3 Game** (`/game/main.js`)
| Function | Purpose |
|----------|---------|
| `create()` | Initialize game scene, wait for messages |
| `evaluateGuess(guess, secret)` | Compare digits, return feedback array |
| `displayFeedback(feedback)` | Render colored sprites/text on canvas |
| `applyEmojiLogic(digit)` | Replace 6/9 with 🔄/🔁 |

### **Vercel API** (`/api/`)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/updateElo` | POST | Update user stats after game |
| `/api/getLeaderboard` | GET | Fetch top 10 players by Elo |
| `/api/createUser` | POST | Create new user (optional) |

### **Firebase Firestore** (Database)
```
users (collection)
  └─ {userId} (document)
       ├─ username: "Player1"
       ├─ elo: 1500
       ├─ wins: 10
       ├─ losses: 3
       ├─ gamesPlayed: 13
       └─ timestamp: 2024-01-15T10:30:00Z
```

---

## 🚀 Hackathon Implementation Phases

### ✅ **Phase 1: Core Game Mechanics** (2-3 hours)
- [x] Setup Phaser WebView
- [ ] Implement guess feedback logic
- [ ] Test postMessage communication
- [ ] Add 6/9 emoji easter egg

### ✅ **Phase 2: Timer & Game Flow** (1-2 hours)
- [ ] 60-second countdown timer
- [ ] End game logic (win condition or timeout)
- [ ] Display results screen

### ✅ **Phase 3: Backend Integration** (2-3 hours)
- [ ] Setup Firebase project
- [ ] Create Vercel serverless functions
- [ ] Implement Elo rating system
- [ ] Connect API to app

### ✅ **Phase 4: Polish & UI** (2-3 hours)
- [ ] Animations for feedback
- [ ] Sound effects (optional)
- [ ] Leaderboard styling
- [ ] Error handling

### ✅ **Phase 5: Deploy & Test** (1 hour)
- [ ] Deploy Vercel functions
- [ ] Test on real device via Expo Go
- [ ] Final bug fixes

---

## 🛠️ Tech Stack Summary

| Layer | Technology | Why? |
|-------|------------|------|
| **Mobile Framework** | React Native + Expo | Fast prototyping, runs on iOS/Android/Web |
| **Game Engine** | Phaser 3 | Lightweight canvas rendering, easy animations |
| **Backend** | Vercel Serverless | Free tier, instant deploy, no server management |
| **Database** | Firebase Firestore | Real-time updates, free tier, easy setup |
| **HTTP Client** | Axios | Clean API calls from React Native |
| **UI Components** | React Native built-in | No extra dependencies needed |

---

## 🎨 UI Mockup Flow

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   HOME SCREEN       │     │   GAME SCREEN       │     │  LEADERBOARD        │
│                     │     │                     │     │                     │
│  Enter Username:    │     │  Timer: 00:45       │     │  🏆 Top Players     │
│  [____________]     │────▶│                     │────▶│                     │
│                     │     │  Your Secret: ****  │     │  1. Alice - 1750    │
│  [Start Game]       │     │                     │     │  2. Bob - 1680      │
│  [View Leaderboard] │     │  Enter Guess:       │     │  3. Carol - 1620    │
│                     │     │  [____] [Submit]    │     │                     │
│                     │     │                     │     │  [Play Again]       │
│                     │     │  Feedback:          │     │                     │
│                     │     │  🟢 🟡 🔄 ⚠️        │     │                     │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

---

## 📝 Next Steps

1. **Create `/game` folder** with `index.html`, `main.js`, `style.css`
2. **Create `/api` folder** with Vercel functions
3. **Update screens** to implement game flow
4. **Configure Firebase** and add credentials
5. **Test locally** using Expo Go
6. **Deploy to Vercel** for production

---

## 🎯 Success Criteria

- ✅ Two players can play simultaneously
- ✅ Feedback shows correct colors/emojis
- ✅ Timer enforces 60-second rounds
- ✅ Leaderboard updates in real-time
- ✅ Elo system rewards winners
- ✅ App works on mobile devices

---

**Ready to build? Let's start with Phase 1! 🚀**