# 🚀 Quick Start - Run with Tunnel

## Fastest Way to Start Testing

### Option 1: Use Quick Start Script (Recommended)

```bash
# Make script executable (first time only)
chmod +x quick-start.sh

# Run the interactive menu
./quick-start.sh
```

The script will ask you how you want to run:
1. **Tunnel Mode** - For testing across different networks ✨
2. **LAN Mode** - For same WiFi (fastest)
3. **Localhost** - Development only
4. **Clear Cache + Tunnel** - If having issues
5. **Web Only** - Browser testing
6. **Mobile Tunnel** - Android/iOS

### Option 2: Direct Commands

```bash
# For multiplayer testing across networks (RECOMMENDED)
npm run start:tunnel

# For same WiFi testing (faster)
npm run start:lan

# For web testing
npm run web

# Clear cache if having issues
npm run start:clear
```

## 📱 Testing Multiplayer Flow

### Step 1: Start the Server
```bash
npm run start:tunnel
```

Wait for:
```
✓ Tunnel ready
✓ QR code appears
```

### Step 2: Open on First Device (Player 1)
- **Web**: Press `w` in terminal
- **Mobile**: Scan QR code with Expo Go

### Step 3: Open on Second Device (Player 2)
- **Same QR code works for multiple devices!**
- **Different network? No problem - tunnel handles it!**

### Step 4: Test the Game
1. **Player 1**: Enter name → Create Room → Copy room code
2. **Player 2**: Enter name → Join Room → Paste code
3. **Both**: See "Game Started!" notification → Play!

## ✅ What You'll See

When it works correctly:

**Player 1 (Room Creator):**
```
✅ Room created! Code: ABCD1234 (copied to clipboard)
→ Navigates to waiting room
→ Shows: "🔄 Auto-refreshing... Last checked: 10:30:45"
→ When P2 joins: "🎮 Game Started! Opponent has joined!"
```

**Player 2 (Room Joiner):**
```
✅ Joined room ABCD1234! Starting game...
→ Navigates to game screen
→ Shows: "🎮 Game Started! Opponent has joined!"
→ Game begins immediately
```

## 🐛 Quick Troubleshooting

### Can't scan QR code?
- Look for the tunnel URL in terminal: `exp://xxx.username.exp.direct:443`
- Type it manually in Expo Go app

### Tunnel connection fails?
```bash
# Login to Expo (free)
npx expo login

# Then restart
npm run start:tunnel
```

### App loads but no API connection?
- Check that you're using the Vercel API URL, not localhost
- Look in `app/lobby.tsx` and `app/game.tsx` for `API_BASE_URL`

### Still having issues?
```bash
# Nuclear option - clear everything
npm run start:clear
```

## 📚 Full Documentation

- 📖 **[TUNNEL_SETUP_GUIDE.md](./TUNNEL_SETUP_GUIDE.md)** - Complete tunnel documentation
- ✅ **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Full testing guide
- 🔧 **[UI_FEEDBACK_FIXES.md](./UI_FEEDBACK_FIXES.md)** - Recent fixes

## 🎯 Common Testing Scenarios

### Test Locally (Same Room)
```bash
npm run start:lan
# Open web (press 'w') + scan QR on phone
```

### Test Remotely (Different Networks)
```bash
npm run start:tunnel
# Share QR/URL with friend anywhere in the world
```

### Test on Mobile Only
```bash
npm run start:tunnel
# Scan QR on two different phones
```

## 💡 Pro Tips

1. **Keep terminal open** - Server runs as long as terminal is open
2. **Press 't' to toggle** - Switch between tunnel/LAN without restarting
3. **Press 'r' to reload** - Refresh all connected devices at once
4. **Check logs** - Terminal shows logs from all connected devices
5. **Use tunnel for demos** - Easy way to show the game to others

## ⚡ TL;DR - Just Run This

```bash
# Navigate to project
cd /home/user/Desktop/TokTok-game-project/Mini-game/MiniGuessGame

# Start with tunnel (for multiplayer testing)
npm run start:tunnel

# Press 'w' for web OR scan QR for mobile
# Open on 2 devices and test multiplayer!
```

---

**That's it!** You're ready to test the multiplayer functionality with the UI feedback fixes! 🎉
