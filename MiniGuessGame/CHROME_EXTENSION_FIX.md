# Chrome Extension Conflict Fix

## The Error
```
Error: Unauthorized request from chrome-extension://mpognobbkildjkofajifpdfhcoklimli. 
This may happen because of a conflicting browser extension to intercept HTTP requests.
```

## What's Happening
A Chrome extension (likely an ad blocker, privacy tool, or dev tool) is intercepting your API requests, causing Expo to block them for security reasons.

## Quick Fixes (Try in Order)

### Fix 1: Use Incognito Mode (Fastest)
1. Close the Expo app in your browser
2. Open a new **Incognito/Private window** (Ctrl+Shift+N or Cmd+Shift+N)
3. Navigate to your Expo app URL
4. Extensions are disabled in incognito by default

### Fix 2: Disable Specific Extensions
Common culprits:
- **React Developer Tools**
- **Redux DevTools**
- **ModHeader** (request interceptor)
- **Requestly** (request modifier)
- **Tampermonkey** (user scripts)
- **Privacy Badger**
- **uBlock Origin** (if aggressive)
- **Any HTTP interceptor/debugger**

**How to disable:**
1. Go to `chrome://extensions/`
2. Find and disable extensions one by one
3. Refresh your Expo app after each disable
4. When it works, you found the culprit

### Fix 3: Use a Different Browser
- Firefox (without extensions)
- Safari
- Edge
- Or use the mobile app directly (best option)

### Fix 4: Test on Mobile Device (Recommended)
Since this is a mobile game, test on actual device:

```bash
# Start Expo
npx expo start

# Then scan QR code with:
# - iPhone: Camera app
# - Android: Expo Go app
```

Mobile testing bypasses all browser extension issues!

### Fix 5: Add Exception to Extension
If you need the extension:
1. Find the extension causing the issue
2. Add your localhost/Expo URL to its whitelist
3. Example for ModHeader: Add `localhost:*` to exceptions

## Prevention

### For Development
```bash
# Use mobile device for testing
npx expo start

# Or use the mobile simulator
npx expo start --ios    # For Mac users
npx expo start --android # If Android emulator installed
```

### For Production
This error only happens in development (browser testing). Once deployed, users won't have this issue because:
- They use the actual mobile app (not browser)
- No dev tools/extensions interfering
- Clean production environment

## Check What Extension is Causing It

The extension ID in your error: `mpognobbkildjkofajifpdfhcoklimli`

To find which extension this is:
1. Go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Look for extension with ID `mpognobbkildjkofajifpdfhcoklimli`
4. Disable it

## Why This Happens

Expo's dev server has CORS protection that blocks:
- Unauthorized origins
- Browser extension injections
- Modified HTTP requests
- Intercepted fetch calls

This is **good security** - it prevents malicious extensions from tampering with your app during development.

## Recommended Solution

**Best practice for mobile app development:**

```bash
# 1. Start Expo
cd /home/user/Desktop/TokTok-game-project/Mini-game/MiniGuessGame
npx expo start

# 2. Test on real mobile device
# Scan the QR code with your phone

# 3. For quick browser testing
# Use incognito mode: Ctrl+Shift+N
```

This way:
- ✅ No extension conflicts
- ✅ Real mobile experience
- ✅ Accurate testing
- ✅ Faster development

## Already Fixed in Code

I've also updated the app to handle "User not found" errors gracefully:
- Shows default profile for new users
- No more crashes on first load
- 500 starting coins displayed
- Smooth onboarding experience

## Summary

**Quick fix:** Use incognito mode or test on mobile device
**Long-term:** Always test mobile apps on actual devices, not browser

The extension conflict only affects browser testing in development. Your deployed app works fine! 🚀
