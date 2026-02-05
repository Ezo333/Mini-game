# 🎮 MiniGuessGame - Tunnel Commands Cheat Sheet

## 🚀 Most Common Commands

```bash
# Start with tunnel (for multiplayer testing across networks)
npm run start:tunnel

# Start with LAN (for same WiFi - faster)
npm run start:lan

# Start web only
npm run web

# Clear cache and start
npm run start:clear
```

## 📱 Interactive Menu

```bash
# Make executable (first time)
chmod +x quick-start.sh

# Run interactive menu
./quick-start.sh
```

## 🔍 Check Setup Status

```bash
# Make executable (first time)
chmod +x check-setup.sh

# Check if everything is ready
./check-setup.sh
```

## ⌨️ Keyboard Shortcuts (While Running)

| Key | Action |
|-----|--------|
| `w` | Open in web browser |
| `a` | Open on Android |
| `i` | Open on iOS |
| `t` | Toggle tunnel/LAN/localhost |
| `r` | Reload all connected devices |
| `m` | Toggle developer menu |
| `?` | Show all commands |
| `Ctrl+C` | Stop server |

## 🎯 Quick Multiplayer Test

```bash
# 1. Start tunnel
npm run start:tunnel

# 2. Wait for "Tunnel ready" message

# 3. Test Player 1 (Web)
#    Press 'w' → Opens browser

# 4. Test Player 2 (Mobile)
#    Scan QR code with Expo Go

# 5. Create room on web
#    ✅ Room created! Code: ABCD1234

# 6. Join room on mobile
#    ✅ Joined room!

# 7. Both see: "🎮 Game Started!"
```

## 🐛 Quick Fixes

### Tunnel Won't Connect
```bash
npx expo login
npm run start:tunnel
```

### Browser Extension CORS Error
```bash
# Option 1: Use incognito (fastest)
Ctrl+Shift+N  # Open incognito window
# Then go to: http://localhost:8081

# Option 2: Restart with cache clear
npm run start:clear

# Option 3: Run fix script
chmod +x fix-extension-error.sh
./fix-extension-error.sh
```

### App Loads But API Fails
Check API_BASE_URL in code - must use Vercel URL, not localhost

### Cache Issues
```bash
npm run start:clear
```

### Can't Scan QR
Look for tunnel URL in terminal:
`exp://xxx.username.exp.direct:443`
Enter manually in Expo Go

## 📂 Project Structure

```
MiniGuessGame/
├── app/
│   ├── lobby.tsx         ← Create/Join rooms (UI feedback fixed!)
│   ├── game.tsx          ← Game screen (polling & notifications)
│   └── (tabs)/
├── api/                  ← Vercel serverless functions
├── constants/
│   └── api.ts           ← API_BASE_URL config
├── QUICK_START.md       ← Quick setup guide
├── TUNNEL_SETUP_GUIDE.md ← Full tunnel documentation
├── TESTING_CHECKLIST.md  ← Complete testing guide
├── UI_FEEDBACK_FIXES.md  ← Recent fixes explained
├── quick-start.sh       ← Interactive start menu
└── check-setup.sh       ← Setup status checker
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| `QUICK_START.md` | Get running in 30 seconds |
| `TUNNEL_SETUP_GUIDE.md` | Complete tunnel documentation |
| `TESTING_CHECKLIST.md` | Step-by-step testing guide |
| `UI_FEEDBACK_FIXES.md` | What was fixed and why |

## 🎓 Learning Path

1. **First time?** → Read `QUICK_START.md`
2. **Want details?** → Read `TUNNEL_SETUP_GUIDE.md`
3. **Ready to test?** → Use `TESTING_CHECKLIST.md`
4. **Curious about fixes?** → Read `UI_FEEDBACK_FIXES.md`

## 💡 Pro Tips

1. **Tunnel for demos** - Easy to share with anyone
2. **LAN for development** - Much faster when on same WiFi
3. **Keep terminal open** - Server stops when you close it
4. **Press 't' to switch** - Change modes without restarting
5. **Check logs** - Terminal shows all device activity

## 🎯 TL;DR

```bash
cd /home/user/Desktop/TokTok-game-project/Mini-game/MiniGuessGame
npm run start:tunnel
# Press 'w' for web OR scan QR for mobile
# Test multiplayer! 🎉
```

## 🆘 Need Help?

```bash
# Check status
./check-setup.sh

# See all expo commands
npx expo --help

# See all npm scripts
npm run
```

---

**Happy Testing! 🚀**
