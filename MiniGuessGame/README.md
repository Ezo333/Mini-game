# 🎮 Mini 1v1 Guessing Game

A fast-paced multiplayer number guessing game built with React Native, Phaser 3, and Firebase.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Expo CLI (`npm install -g expo-cli`)
- Firebase account (free tier works)
- Vercel account (for API deployment)

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Get your Firebase config from Project Settings
4. Create a `.env` file in the root directory:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

5. Set up Firestore rules (in Firebase Console):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### 3. Deploy API to Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Add environment variables in Vercel dashboard (Settings > Environment Variables)
5. Note your Vercel URL (e.g., `https://your-project.vercel.app`)

### 4. Update API URL

Update the API base URL in your app (create `constants/api.ts`):

```typescript
export const API_BASE_URL = 'https://your-project.vercel.app/api';
```

### 5. Run the App

```bash
# Start Expo dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## 📱 How to Play

1. Enter your username on the home screen
2. Click "Start Game" to begin
3. You'll get a secret number (3-5 digits)
4. Try to guess your opponent's number
5. Get feedback for each guess:
   - 🟢 **Green** = Correct digit in correct position
   - 🟡 **Yellow** = Correct digit in wrong position
   - 🔴 **Red** = Digit not in the number
6. Special emojis: 6 = 🔄, 9 = 🔁
7. Win within 60 seconds to increase your Elo!

## 🏗️ Project Structure

```
MiniGuessGame/
├── app/                    # React Native screens (Expo Router)
│   ├── (tabs)/
│   │   ├── index.tsx      # Home screen (username input)
│   │   └── explore.tsx    # Leaderboard screen
│   └── _layout.tsx        # Root layout
├── api/                    # Vercel serverless functions
│   ├── updateElo.js       # Update player Elo after game
│   └── getLeaderboard.js  # Fetch top players
├── game/                   # Phaser 3 game (WebView)
│   ├── index.html         # Game container
│   └── main.js            # Game logic & feedback engine
├── components/            # Reusable UI components
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── constants/
│   └── theme.ts          # Colors, fonts, spacing
└── package.json

```

## 🎨 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React Native + Expo | Cross-platform mobile app |
| **Game Engine** | Phaser 3 | Canvas rendering & animations |
| **Backend** | Vercel Serverless | API endpoints (no server!) |
| **Database** | Firebase Firestore | User data & leaderboard |
| **Communication** | WebView postMessage | React Native ↔ Phaser |
| **HTTP** | Axios | API requests |

## 🔧 Key Features

- ✅ Real-time feedback on guesses
- ✅ 60-second game timer
- ✅ Elo rating system
- ✅ Global leaderboard
- ✅ Dark/Light mode support
- ✅ Special 6/9 emoji easter egg
- ✅ Responsive design (works on all devices)
- ✅ Offline-friendly (game logic runs in WebView)

## 🎯 Game Logic

### Guess Evaluation Algorithm

```javascript
// Example: Secret = 1234, Guess = 2413
// Result: [yellow, correct, red, yellow]
// - 2: in secret, wrong position (yellow)
// - 4: in secret, correct position (green)
// - 1: in secret, wrong position (yellow)
// - 3: in secret, wrong position (yellow)
```

### Elo Calculation

```javascript
Expected = 1 / (1 + 10^((OpponentElo - PlayerElo) / 400))
EloChange = K * (ActualScore - Expected)
// K = 32 (standard chess rating constant)
```

## 🚢 Deployment

### Deploy to Vercel (Backend)

```bash
vercel --prod
```

### Deploy to Expo (Mobile App)

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Publish update (OTA)
expo publish
```

## 🐛 Debugging

### Test WebView Communication

Add this to your game screen:

```javascript
// In game/main.js
window.testMessage = () => {
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'test' }));
};
```

### Check Phaser Console

Open WebView inspector on device:
- iOS: Safari > Develop > [Device] > localhost
- Android: Chrome > chrome://inspect

### Firebase Logs

Check Firestore rules and indexes:
```bash
firebase firestore:indexes
```

## 📊 Firestore Schema

```javascript
// Collection: users
{
  "user_id": {
    username: "Player1",
    elo: 1500,
    wins: 10,
    losses: 5,
    gamesPlayed: 15,
    createdAt: Timestamp,
    lastPlayed: Timestamp,
    updatedAt: Timestamp
  }
}
```

## 🔐 Environment Variables

### For Vercel (API)

```
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
```

### For Expo (App)

Create `app.config.js`:

```javascript
export default {
  expo: {
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
    },
  },
};
```

## 🎓 Learning Resources

- [Expo Documentation](https://docs.expo.dev)
- [Phaser 3 Examples](https://phaser.io/examples)
- [Firebase Firestore Guide](https://firebase.google.com/docs/firestore)
- [Vercel Deployment](https://vercel.com/docs)
- [Elo Rating System](https://en.wikipedia.org/wiki/Elo_rating_system)

## 🤝 Contributing

This is a hackathon project! Feel free to fork and improve:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📝 TODO / Future Features

- [ ] Add sound effects
- [ ] Multiplayer matchmaking (Socket.io)
- [ ] Power-ups and special abilities
- [ ] Tournament mode
- [ ] Player profiles with avatars
- [ ] Achievement system
- [ ] Daily challenges
- [ ] Friend system
- [ ] Chat functionality
- [ ] Replay system

## 🐛 Known Issues

- WebView performance on older Android devices (<Android 8)
- Leaderboard refresh on iOS may require pull-down
- Timer sync between players (planned for multiplayer mode)

## 📄 License

MIT License - feel free to use this in your own projects!

## 💬 Support

Questions? Open an issue or reach out on Discord!

---

**Built with ❤️ for hackathons**

🎮 Happy Gaming! 🚀