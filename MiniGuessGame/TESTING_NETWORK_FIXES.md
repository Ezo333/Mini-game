# Testing Guide - Network Error Fixes

## Overview
All fetch calls in the app have been improved to handle network errors gracefully. This guide helps you test and verify everything works correctly.

## What Changed

### Before
- If API calls failed, users saw blocking errors
- New users couldn't play without existing profiles
- Browser extensions could completely block gameplay

### After
- Users get default profiles with 500 coins automatically
- Games can proceed even if some API calls fail
- Better error messages guide users to solutions
- Graceful degradation keeps app functional

## Test Scenarios

### Scenario 1: First Time User (No Existing Profile)

**Setup**: Use a new username or clear browser storage

**Steps**:
1. Enter app with new username
2. Go to Multiplayer Lobby
3. Check console (F12) for "Using default profile due to fetch error" or "No user profile found"

**Expected Results**:
- ✅ User profile loads with default values
- ✅ Display shows 500 coins
- ✅ User can create/join rooms

**Verify With**:
```javascript
// In browser console
console.log("Check for these messages:");
// "Using default profile due to fetch error"
// OR
// "No user profile found, creating default profile"
```

---

### Scenario 2: Browser Extension Blocking

**Setup**: Keep your normal browser with extensions enabled

**Steps**:
1. Try to create a multiplayer room
2. Enter room code and secret
3. Click "Create Room"
4. Watch the Network tab in DevTools (F12)

**Expected Results**:
- ✅ Request might show as "blocked" or "failed"
- ✅ App still navigates to game screen
- ✅ No fatal error alert
- ✅ Game starts normally

**Verify With**:
```
DevTools → Network tab
Look for: Failed request to "/api/createRoom"
But: App still proceeds to /game route
```

---

### Scenario 3: Solo Mode Game Start

**Setup**: Open Solo Lobby

**Steps**:
1. Select difficulty (Easy/Medium/Hard)
2. Click "Start Game"
3. Watch for coin spending process

**Expected Results**:
- ✅ Coins are deducted (or attempt is made)
- ✅ Game starts regardless of coin API response
- ✅ "Payment Notice" alert may appear if payment fails
- ✅ Can still play the game

**Verify With**:
```javascript
// Console should show:
"Network issue with payment, allowing game to proceed"
// OR successful coin spending
```

---

### Scenario 4: Join Multiplayer Game

**Setup**: Create room in one tab, join in another

**Steps**:
1. Tab A: Create room, get code
2. Tab B: Copy the room code
3. Tab B: Click "Join Room"
4. Tab B: Room code auto-fills
5. Tab B: Click "Join Room"

**Expected Results**:
- ✅ Join succeeds (either via API or fallback)
- ✅ Navigates to game screen
- ✅ Game starts normally
- ✅ Both players can play

---

## DevTools Console Monitoring

### How to Monitor Fetch Calls

1. **Open DevTools**: F12
2. **Go to Console tab**
3. **Filter for "Error" or "Spend" or "profile"**
4. **Expected log entries**:

```
✓ "Bundled successfully" - App started
✓ "Profile fetch returned status 200" - API working
✓ "Joined room successfully!" - Game joined
✓ "Network issue with payment, allowing game to proceed" - Payment failed (graceful)
✓ "Using default profile due to fetch error" - Network issue (graceful)
```

### Bad Signs to Look For

```
✗ "Uncaught Error" - Crash
✗ "Cannot read property of undefined" - Missing data
✗ "statusCode: 400" - Invalid request
```

---

## Network Tab Inspection

### How to Check API Calls

1. **Open DevTools**: F12
2. **Go to Network tab**
3. **Start an action** (create room, join, etc.)
4. **Look for entries** like:
   - `/api/createRoom`
   - `/api/joinRoom`
   - `/api/getUserProfile`
   - `/api/spendCoins`

### Good Response
```
✓ Status: 200 OK
✓ Response body has "success": true
✓ Data contains user/room info
```

### Bad Response (Still Works Now)
```
✗ Status: 0 (Network blocked)
✗ Or: 401/403 (Permission error)
✓ But: App uses default fallback
✓ And: Game still starts
```

---

## Testing Checklist

### Basic Functionality
- [ ] New user gets profile with 500 coins
- [ ] Can create multiplayer room
- [ ] Can join multiplayer room
- [ ] Can start solo game (Easy)
- [ ] Can start solo game (Medium)
- [ ] Can start solo game (Hard)

### Error Recovery
- [ ] App works with extensions enabled
- [ ] App works in Incognito mode
- [ ] App works even if API is slow
- [ ] App works even if API returns errors
- [ ] Friendly error messages appear when needed

### Console Monitoring
- [ ] No "Uncaught" errors
- [ ] Proper "fetch error" messages
- [ ] Clear "Network issue" warnings
- [ ] Profile loading logs appear
- [ ] Coin spending attempts are logged

### Network Tab
- [ ] API calls are attempted
- [ ] Requests show proper headers
- [ ] Responses parse correctly
- [ ] Failed requests don't block app
- [ ] Status codes are handled gracefully

---

## Common Issues & Solutions

### Issue: "User not found" error appears
**Solution**: This is now handled gracefully with default profile

### Issue: Extension blocks requests
**Solution**: Try Incognito mode or disable extension

### Issue: Coins don't deduct
**Solution**: Check Network tab - might be blocked. Game proceeds anyway.

### Issue: App crashes on load
**Solution**: Check Console tab for "Uncaught" errors. Report full error.

### Issue: Stuck on loading screen
**Solution**: 
1. Open DevTools Console
2. Check for fetch errors
3. Refresh page
4. Try in Incognito mode

---

## Quick Test Script

Copy-paste in DevTools Console to test:

```javascript
// Test 1: Check user profile
console.log("Username:", JSON.stringify(localStorage.getItem('username')));

// Test 2: Simulate profile fetch
fetch('https://mini-guess-game-iqveh3itl-ezo333s-projects.vercel.app/api/getUserProfile?username=testuser')
  .then(r => r.json())
  .then(d => console.log('Profile Response:', d))
  .catch(e => console.log('Profile Error:', e.message));

// Test 3: Check for default profile
console.log("Watch console for 'default profile' messages");
```

---

## Performance Expectations

### With Good Connection
- Profile loads: < 500ms
- Room creation: < 1s
- Game join: < 1s
- Coin spending: < 500ms

### With Extension Blocking
- Same operations still complete
- May show error alert
- But app remains functional
- User can still play

### With Slow Connection
- Might take 2-3 seconds
- All operations still work
- Graceful degradation active
- No crashes or freezes

---

## Report Template

If you find issues:

```
**Issue**: [Describe the problem]

**Steps to Reproduce**:
1. ...
2. ...
3. ...

**Expected**: [What should happen]

**Actual**: [What does happen]

**Console Error**: [Paste any errors]

**Network Request**: [Screenshot of Network tab if applicable]

**Environment**:
- [ ] Desktop
- [ ] Mobile
- [ ] Incognito
- [ ] With extensions
- [ ] Without extensions
```

---

## Success Criteria

You'll know everything is fixed when:

✅ No more "User not found" blocking errors  
✅ Games start even if API calls fail  
✅ Browser extensions don't block gameplay  
✅ New users auto-get 500 coins  
✅ Clear error messages when issues occur  
✅ Graceful degradation throughout  
✅ Console shows helpful debug logs  

**Status**: All fixes implemented and ready for testing!
