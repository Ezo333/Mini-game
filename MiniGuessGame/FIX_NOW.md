# ⚡ BROWSER EXTENSION ERROR - QUICK FIX

## 🚨 You're Seeing This Error:
```
Error: Unauthorized request from chrome-extension://mpognobbkildjkofajifpdfhcoklimli
```

## ✅ INSTANT FIX (Choose One)

### Fix 1: Incognito Mode (30 seconds) ⭐ RECOMMENDED
```bash
# 1. Keep terminal running (don't stop the server!)

# 2. Open incognito window
#    Windows/Linux: Ctrl+Shift+N
#    Mac: Cmd+Shift+N

# 3. Go to: http://localhost:8081

# 4. Done! ✅
```

### Fix 2: Disable Extension (2 minutes)
```bash
# 1. Go to: chrome://extensions/

# 2. Find "React Developer Tools"

# 3. Toggle OFF

# 4. Refresh your page
# Should work now! ✅
```

### Fix 3: Use Different Browser
```bash
# Try Firefox or Safari instead of Chrome
# They don't have the same extension conflict
```

## 🎯 Recommended Solution

**RIGHT NOW:**
```bash
Ctrl+Shift+N  # Open incognito window
# Go to: http://localhost:8081
```

This is the simplest and fastest solution!

## 🛠️ What I Fixed For You

1. ✅ Created `BROWSER_EXTENSION_FIX.md` - Full guide
2. ✅ Created `fix-extension-error.sh` - Helper script
3. ✅ Updated documentation with fix

**Best Solution:** Incognito mode works instantly without any server changes!

## 🔍 Why This Happened

Browser extensions (React DevTools, Redux DevTools, etc.) try to intercept HTTP requests to inspect your app. Expo blocks these for security. The easiest solution is to use incognito mode where extensions are disabled.

## ✅ Verify It's Fixed

After applying fix:
- ✅ No CORS errors in terminal
- ✅ Browser console is clean
- ✅ App loads normally
- ✅ Can test multiplayer

## 🆘 Still Having Issues?

Try all three fixes in order:
1. Incognito mode ← Start here
2. Restart with `npm run start:clear`
3. Disable extension in Chrome

## 💡 Pro Tip

**Create a Chrome profile just for development:**
1. Chrome → Settings → Add Person
2. Name it "Development"
3. Don't install any extensions
4. Use it for Expo dev work

---

## TL;DR - Do This Right Now:

```bash
# OPTION A: Incognito (fastest - RECOMMENDED)
Ctrl+Shift+N
# Go to: http://localhost:8081

# OPTION B: Disable extension
# Go to chrome://extensions/
# Turn off React Developer Tools
```

**Incognito mode is the easiest and works immediately!** 🚀
