# Browser Extension Fix Guide

## Problem
Error: "Unauthorized request from chrome-extension://..."

This happens when browser extensions (like React DevTools) try to intercept Expo dev server requests.

## Solutions (Pick One)

### ✅ Solution 1: Use Incognito Mode (Easiest)

```bash
# Start the server
npm run start:tunnel

# Don't press 'w' automatically
# Instead, manually open an incognito window
# Navigate to: http://localhost:8081
```

**Why this works:** Incognito mode disables extensions by default

### ✅ Solution 2: Disable Specific Extension

1. Open Chrome and go to: `chrome://extensions/`
2. Find **React Developer Tools** (or similar debugging tools)
3. Toggle it OFF temporarily
4. Refresh your Expo app

**Extension causing issues:**
- ID: `mpognobbkildjkofajifpdfhcoklimli`
- Likely: React DevTools, Redux DevTools, or similar

### ✅ Solution 3: Allow Extensions (Development Only)

I've created a `metro.config.js` that allows extension requests.

**Restart the server:**
```bash
# Stop current server (Ctrl+C)
# Clear cache and restart
npm run start:clear
```

### ✅ Solution 4: Use Different Browser

```bash
# Start tunnel
npm run start:tunnel

# Press 'w' to open browser
# Or manually open in Firefox/Safari instead of Chrome
```

## Quick Fix Right Now

**Option A: Incognito Window**
```bash
# Keep server running
# Open Chrome incognito: Ctrl+Shift+N (Windows/Linux) or Cmd+Shift+N (Mac)
# Go to: http://localhost:8081
```

**Option B: Disable Extension**
1. `chrome://extensions/` 
2. Turn off React DevTools
3. Refresh page

**Option C: Restart with New Config**
```bash
# I created metro.config.js to fix this
# Stop server (Ctrl+C)
npm run start:clear
```

## Permanent Fix

### Method 1: Always Use Incognito for Development
Add this alias to your shell profile:

```bash
# Add to ~/.bashrc or ~/.zshrc
alias expo-dev="npm run start:tunnel && echo 'Open incognito window at http://localhost:8081'"
```

### Method 2: Create Browser Profile for Development
1. Create a new Chrome profile for development
2. Don't install any extensions in that profile
3. Use it for Expo development

### Method 3: Use the Metro Config (Already Done!)
The `metro.config.js` I created should allow extensions.

**To activate it:**
```bash
# Stop current server
Ctrl+C

# Clear cache and restart
npm run start:clear

# Or just restart normally
npm run start:tunnel
```

## Why This Happens

Browser extensions like React DevTools inject code into pages and make HTTP requests to inspect React components. Expo's dev server blocks these by default for security.

## Testing After Fix

```bash
# 1. Restart server
npm run start:tunnel

# 2. Open in browser (should work now)
# Press 'w' or open incognito

# 3. Verify no errors
# Check browser console - should be clean
```

## Additional Options

### Option 1: Browser Flag
Start Chrome with extension blocking disabled:
```bash
google-chrome --disable-web-security --user-data-dir=/tmp/chrome-dev
```

### Option 2: Use curl/Postman
If just testing API:
```bash
curl http://localhost:8081
```

### Option 3: Mobile Only Testing
Skip web entirely:
```bash
npm run start:tunnel
# Just scan QR code - no browser extension issues!
```

## Recommended Solution

**For immediate fix:**
```bash
# Keep server running
# Open incognito: Ctrl+Shift+N
# Go to: http://localhost:8081
```

**For permanent fix:**
```bash
# Restart with metro config (already created)
Ctrl+C  # Stop server
npm run start:clear  # Restart with cache clear
```

## Verify Fix Worked

You should see:
- ✅ No CORS errors in terminal
- ✅ Web page loads correctly
- ✅ Hot reload works
- ✅ Can test multiplayer

If still seeing errors:
1. Make sure metro.config.js exists (it does now!)
2. Restart server completely
3. Try incognito mode as backup

---

**Quick command to remember:**
```bash
Ctrl+Shift+N  # Open incognito
```
