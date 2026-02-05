# 🌐 Running MiniGuessGame with Tunnel

This guide shows you how to run the app with tunnel support, allowing you to test multiplayer functionality across different devices and networks.

## 🎯 Why Use Tunnel?

- **Test on different networks**: Your phone and computer can be on different WiFi networks
- **Test with friends remotely**: Share the URL with anyone to test multiplayer
- **No network configuration needed**: No port forwarding or firewall rules
- **Works anywhere**: Coffee shop, office, home - doesn't matter!

## 🚀 Quick Start - Using Expo Tunnel

### Method 1: Start with Tunnel Flag (Recommended)

```bash
# Navigate to project directory
cd /home/user/Desktop/TokTok-game-project/Mini-game/MiniGuessGame

# Start Expo with tunnel
npx expo start --tunnel
```

### Method 2: Enable Tunnel After Starting

```bash
# Start normally
npx expo start

# Then press 't' in the terminal to switch to tunnel mode
# Or scan the QR code that appears
```

## 📱 Access Options

Once tunnel is running, you'll see multiple URLs:

```
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or Camera (iOS)

› Tunnel ready.
› exp://ab-cde.username.exp.direct:443
```

### 1. **Mobile Devices (Expo Go)**

#### iOS:
1. Install **Expo Go** from App Store
2. Open Camera app
3. Scan the QR code from terminal
4. App opens in Expo Go automatically

#### Android:
1. Install **Expo Go** from Play Store
2. Open Expo Go app
3. Tap "Scan QR Code"
4. Scan the QR code from terminal

### 2. **Web Browser**

```bash
# Press 'w' in the terminal
# Or visit the web URL shown
```

### 3. **Another Computer/Device**

Share the tunnel URL: `exp://ab-cde.username.exp.direct:443`
- Anyone with Expo Go can open this URL
- Works even if they're on a different network!

## 🎮 Testing Multiplayer with Tunnel

### Scenario 1: Phone + Computer (Local Testing)

```bash
# Terminal
npx expo start --tunnel

# Press 'w' for web (Player 1 on computer)
# Scan QR with phone (Player 2 on mobile)
```

**Test Flow:**
1. On computer browser: Enter name → Create Room → Get code "ABCD1234"
2. On phone: Enter name → Join Room → Enter "ABCD1234"
3. Both devices should connect and start the game!

### Scenario 2: Two Phones (Different Networks)

```bash
# Start tunnel
npx expo start --tunnel

# Share the QR code or tunnel URL with both phones
```

**Test Flow:**
1. Phone 1: Scan QR → Enter name → Create Room
2. Phone 2: Scan QR → Enter name → Join Room with code
3. Game starts!

### Scenario 3: Remote Testing (Different Locations)

```bash
# Start tunnel
npx expo start --tunnel

# Copy the tunnel URL (e.g., exp://ab-cde.username.exp.direct:443)
# Share this URL via message/email
```

**Friend's Steps:**
1. Install Expo Go
2. Open the shared URL in their browser
3. Opens in Expo Go automatically
4. Join your game room!

## 🔧 Tunnel Configuration

### Package.json Scripts (Add These)

```json
{
  "scripts": {
    "start": "expo start",
    "start:tunnel": "expo start --tunnel",
    "start:local": "expo start --localhost",
    "start:lan": "expo start --lan",
    "android:tunnel": "expo start --android --tunnel",
    "ios:tunnel": "expo start --ios --tunnel",
    "web": "expo start --web"
  }
}
```

Now you can run:
```bash
npm run start:tunnel
```

### Environment Variables for Tunnel

Create or update `.env`:
```env
# Your existing Firebase config...
EXPO_PUBLIC_USE_TUNNEL=true
```

## 🐛 Troubleshooting

### Issue: Tunnel Connection Times Out

**Solution 1: Restart Expo**
```bash
# Press Ctrl+C to stop
# Clear cache and restart
npx expo start --tunnel --clear
```

**Solution 2: Check Expo Account**
```bash
# Login to Expo (free account required)
npx expo login

# Then restart with tunnel
npx expo start --tunnel
```

### Issue: QR Code Not Scanning

**Solution:**
```bash
# Use the URL directly instead
# Look for: exp://ab-cde.username.exp.direct:443
# Type this URL in Expo Go app manually
```

### Issue: "Unable to Connect to Tunnel"

**Checklist:**
- [ ] Are you logged into Expo? (`npx expo whoami`)
- [ ] Is your internet connection stable?
- [ ] Try restarting: `npx expo start --tunnel --clear`
- [ ] Check firewall isn't blocking Expo

### Issue: App Loads But API Calls Fail

**Problem:** The app is using localhost API URL which doesn't work with tunnel.

**Solution:** Update API URL in `constants/api.ts`:
```typescript
// Use your deployed Vercel API URL, NOT localhost
export const API_BASE_URL = 'https://mini-guess-game-o60asolq5-ezo333s-projects.vercel.app/api';
```

### Issue: Slow Loading with Tunnel

**This is normal!** Tunnel routes through Expo's servers:
- First load might be slow
- Subsequent loads are faster
- For production, use LAN mode or deployed version

## 📊 Connection Modes Comparison

| Mode | Command | Use Case | Speed | Network Requirement |
|------|---------|----------|-------|-------------------|
| **Tunnel** | `expo start --tunnel` | Remote testing, different networks | Slower | Any network |
| **LAN** | `expo start --lan` | Local network testing | Fast | Same WiFi |
| **Localhost** | `expo start --localhost` | Development on same machine | Fastest | Localhost only |

## 🎯 Best Practices

### For Development (Same Network)
```bash
# Use LAN mode - fastest
npx expo start --lan
```

### For Testing with Remote Users
```bash
# Use tunnel mode
npx expo start --tunnel
```

### For Production Testing
```bash
# Build and deploy to stores
eas build --platform all
```

## 🔐 Security Note

**Tunnel URLs are temporary and semi-public:**
- URLs expire when you stop the dev server
- Anyone with the URL can access your dev app
- Don't share sensitive data through tunnel
- Use environment variables for secrets
- API keys should be in Vercel environment variables

## 💡 Pro Tips

### Tip 1: Keep Terminal Open
```bash
# The tunnel stays active as long as the terminal is running
# Don't close the terminal during testing!
```

### Tip 2: Use Multiple Devices
```bash
# Start tunnel
npx expo start --tunnel

# Scan QR on multiple devices simultaneously
# All devices will connect to the same dev server
```

### Tip 3: Monitor Logs
```bash
# Terminal shows logs from all connected devices
# Watch for errors from both Player 1 and Player 2
```

### Tip 4: Reload App
- **iOS**: Shake device → "Reload"
- **Android**: Shake device → "Reload"
- **Web**: Press Ctrl+R (Cmd+R on Mac)

### Tip 5: Open Developer Menu
- **iOS**: Shake device or press Cmd+D
- **Android**: Shake device or press Cmd+M
- **Web**: Press Ctrl+Shift+I (Chrome DevTools)

## 🚀 Complete Testing Workflow

```bash
# 1. Start tunnel
npx expo start --tunnel

# 2. Wait for QR code to appear
# ✓ Terminal shows: "Tunnel ready"

# 3. Test on web (Player 1)
# Press 'w' in terminal

# 4. Test on mobile (Player 2)
# Scan QR with Expo Go

# 5. Create room on web
# - Enter username
# - Click "Create Room"
# - Get room code

# 6. Join room on mobile
# - Enter username
# - Click "Join Room"
# - Enter room code

# 7. Play the game!
# - Both see "Game Started!" notification
# - Take turns guessing
# - Check console for real-time updates

# 8. Monitor both consoles
# - Web: Browser DevTools (F12)
# - Mobile: Terminal logs
```

## 📞 Need Help?

### Check Expo Status
```bash
npx expo whoami          # Check login status
npx expo doctor          # Check project health
npx expo start --help    # See all options
```

### Common Commands
```bash
npx expo start --tunnel --clear    # Clear cache and restart
npx expo login                      # Login to Expo
npx expo logout                     # Logout
npx expo register                   # Create Expo account
```

### Keyboard Shortcuts (in Terminal)
- **a** - Open on Android device/emulator
- **i** - Open on iOS simulator
- **w** - Open in web browser
- **t** - Toggle between tunnel/LAN/localhost
- **r** - Reload app on all devices
- **m** - Toggle menu
- **?** - Show all commands

## ✅ Quick Checklist

Before testing with tunnel:
- [ ] Expo CLI installed: `npm install -g expo-cli`
- [ ] Logged into Expo: `npx expo login`
- [ ] API deployed to Vercel (not using localhost)
- [ ] API URL updated in `constants/api.ts`
- [ ] Expo Go installed on test devices
- [ ] Stable internet connection
- [ ] Terminal window stays open during testing

## 🎉 You're Ready!

Now you can test the multiplayer game with anyone, anywhere! Start the tunnel and share the fun! 🎮

---

**Pro Tip:** For the smoothest experience during development, use LAN mode when testing on the same network, and only use tunnel when you need to test across different networks or with remote users.
