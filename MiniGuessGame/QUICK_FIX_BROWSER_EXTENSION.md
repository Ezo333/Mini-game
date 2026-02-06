# Quick Fix - Browser Extension Error

## The Problem
You're seeing: `Error: Unauthorized request from chrome-extension://...`

## The Solution (Pick One)

### ✅ FASTEST FIX - Use Incognito Mode
```
Press: Ctrl+Shift+N (or Cmd+Shift+N on Mac)
Then: Open your app in the Incognito window
Done! Browser extensions are disabled there.
```

### ✅ RECOMMENDED FIX - Disable Extension
1. Press `Ctrl+Shift+X` or go to `chrome://extensions/`
2. Find the extension (ID starts with `mpognobbkildjkofajifpdfhcoklimli`)
3. Click the toggle to disable it
4. Go back to your app
5. Refresh the page

### ✅ ALTERNATIVE FIX - Check Your Internet
Sometimes this error means a real network issue:
1. Open DevTools (F12)
2. Go to Network tab
3. Try to create a room
4. Check if requests fail with 0 or negative status
5. If yes, check your internet connection

## After the Fix

Your app should:
- ✅ Load your user profile correctly
- ✅ Show 500 starting coins
- ✅ Create rooms successfully
- ✅ Join rooms successfully
- ✅ Play games without issues

## Still Having Issues?

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Create or join a room**
4. **Share the error message** from console

Look for messages like:
- `HTTP 401` or `HTTP 403` = Permission error
- `Failed to fetch` = Network error
- `TypeError: ...response is not ok` = Server error

## Why This Happens

Browser extensions can intercept HTTP requests to:
- Block ads
- Protect privacy
- Monitor activity
- Modify web pages

During development, these can interfere with API calls. This is NOT a production issue - it only happens during local development with extensions enabled.

## Production Note

When you deploy to Vercel, **this problem disappears** because:
- HTTPS is enforced
- Extensions can't interfere with secure requests
- The API is properly configured for cross-origin requests
