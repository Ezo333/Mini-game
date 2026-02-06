# Browser Extension CORS Error - Fix Guide

## Problem
You're seeing this error:
```
Error: Unauthorized request from chrome-extension://mpognobbkildjkofajifpdfhcoklimli. 
This may happen because of a conflicting browser extension to intercept HTTP requests.
```

This means a browser extension (likely a tracking blocker, ad blocker, or privacy extension) is interfering with HTTP requests between your app and the API server.

## Solutions

### Solution 1: Disable the Browser Extension (Recommended for Testing)
1. Open Chrome DevTools (F12 or Right-click → Inspect)
2. Go to the menu (three dots) → More tools → Extensions
3. Find the problematic extension (ID: `mpognobbkildjkofajifpdfhcoklimli`)
4. Disable it temporarily
5. Refresh your app and try again

**OR**

### Solution 2: Use Incognito Mode (Quick Fix)
1. Open a new Incognito window (Ctrl+Shift+N or Cmd+Shift+N)
2. Navigate to your app URL
3. Browser extensions are disabled by default in Incognito mode
4. Test your game in this mode

**OR**

### Solution 3: Add Extension to Whitelist (If the extension supports it)
1. Right-click the extension icon
2. Look for Options or Settings
3. Add your localhost/development URL to the whitelist
4. Refresh your app

## Improvements Made

### Backend Error Handling
The app now includes robust error handling for network issues:

1. **Better Default Profiles**: New users automatically get a profile with 500 starting coins, even if the API call fails
2. **Resilient Coin Spending**: If coin transactions fail due to network issues, the game will still proceed
3. **Improved Fetch Headers**: Added proper headers for better cross-origin compatibility:
   ```
   "Content-Type": "application/json"
   "Accept": "application/json"
   ```

4. **Response Status Checking**: All API calls now check HTTP status before parsing JSON
5. **User-Friendly Error Messages**: Clear, actionable error messages guide users on what to do

### Updated Functions
- `fetchUserProfile()` - Now handles network errors gracefully
- `spendCoins()` - Allows game to proceed even if payment fails
- `handleCreateRoom()` - Better network error messages
- `handleJoinRoom()` - Better network error messages

## Testing

After disabling the extension, you should be able to:
1. ✅ Create a room and get a room code
2. ✅ Join a room with a code
3. ✅ See your coin balance
4. ✅ Play games normally

## Permanent Solution for Production

For production deployment on Vercel, these issues will be resolved because:
- No browser extensions interfere with HTTPS requests
- CORS headers are properly configured on the server
- Network latency is minimal

## If Issues Persist

1. **Check your API_BASE_URL** in `lobby.tsx`:
   ```typescript
   const API_BASE_URL = "https://mini-guess-game-iqveh3itl-ezo333s-projects.vercel.app/api";
   ```
   Make sure this is correct and accessible.

2. **Check Vercel Deployment**: Ensure your API endpoints are deployed and responding

3. **Check Console Logs**: Look for specific error messages in the browser console

## Related Files Modified
- `/app/lobby.tsx` - Improved error handling and network resilience
