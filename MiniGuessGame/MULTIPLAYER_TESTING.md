# 🎮 Multiplayer Testing Guide

## 🚀 Quick Start - Testing Room-Based Multiplayer

### Prerequisites
- API deployed to Vercel ✅
- Firebase configured ✅
- 2 devices OR 2 browser tabs ready

---

## 📱 Testing Flow

### Step 1: Player 1 Creates a Room

**On Device/Tab 1:**

1. Open the app
2. Enter username: `Player1`
3. Click "Start Game"
4. Click "Create Room"
5. Select number of digits (3, 4, or 5)
6. Enter secret number: `1234` (or click "Generate Random")
7. Click "Create Room"
8. **Copy the room code** (e.g., `ABCD1234`)

**Expected Result:**
- You see: "Room Created! 🎉"
- Room code is displayed
- You're waiting for Player 2

---

### Step 2: Player 2 Joins the Room

**On Device/Tab 2:**

1. Open the app
2. Enter username: `Player2`
3. Click "Start Game"
4. Click "Join Room"
5. Enter the room code: `ABCD1234`
6. Select digits (should match Player 1's choice)
7. Enter YOUR secret number: `5678`
8. Click "Join Room"

**Expected Result:**
- You see: "Joined Room! 🎮"
- Game starts for both players

---

### Step 3: Play the Game

**Both Players:**
- Try to guess each other's secret number
- Get feedback on each guess:
  - 🟢 Green = correct digit, correct position
  - 🟡 Yellow = correct digit, wrong position
  - 🔴 Red = digit not in number
- First to guess correctly wins!

---

## 🧪 API Testing (Manual)

### Test 1: Create Room

```bash
curl -X POST https://mini-guess-game-4jjauaefc-ezo333s-projects.vercel.app/api/createRoom \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Player1",
    "secretNumber": "1234",
    "digitCount": 4
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "roomCode": "ABCD1234",
    "status": "waiting",
    "player1": "Player1",
    "digitCount": 4
  }
}
```

---

### Test 2: Join Room

```bash
curl -X POST https://mini-guess-game-4jjauaefc-ezo333s-projects.vercel.app/api/joinRoom \
  -H "Content-Type: application/json" \
  -d '{
    "roomCode": "ABCD1234",
    "username": "Player2",
    "secretNumber": "5678"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Joined room successfully",
  "data": {
    "roomCode": "ABCD1234",
    "status": "playing",
    "player1": "Player1",
    "player2": "Player2",
    "digitCount": 4
  }
}
```

---

### Test 3: Check Room Status

```bash
curl "https://mini-guess-game-4jjauaefc-ezo333s-projects.vercel.app/api/getRoomStatus?roomCode=ABCD1234"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "roomCode": "ABCD1234",
    "status": "playing",
    "digitCount": 4,
    "player1": {
      "username": "Player1",
      "guesses": [],
      "correctGuess": false,
      "guessCount": 0
    },
    "player2": {
      "username": "Player2",
      "guesses": [],
      "correctGuess": false,
      "guessCount": 0
    }
  }
}
```

---

### Test 4: Submit a Guess

```bash
curl -X POST https://mini-guess-game-4jjauaefc-ezo333s-projects.vercel.app/api/submitGuess \
  -H "Content-Type: application/json" \
  -d '{
    "roomCode": "ABCD1234",
    "username": "Player1",
    "guess": "5678"
  }'
```

**Expected Response (if correct):**
```json
{
  "success": true,
  "message": "Correct! You won!",
  "data": {
    "guess": "5678",
    "feedback": ["correct", "correct", "correct", "correct"],
    "isCorrect": true,
    "gameStatus": "finished",
    "winner": "Player1"
  }
}
```

**Expected Response (if partially correct):**
```json
{
  "success": true,
  "message": "Guess submitted",
  "data": {
    "guess": "1568",
    "feedback": ["notInNumber", "correct", "wrongPosition", "wrongPosition"],
    "isCorrect": false,
    "gameStatus": "playing",
    "winner": null
  }
}
```

---

## 🔍 Debugging

### Check Firebase Console

1. Go to: https://console.firebase.google.com
2. Select your project
3. Click "Firestore Database"
4. You should see a `rooms` collection
5. Click on a room document (e.g., `ABCD1234`)
6. Verify the data:
   ```
   roomCode: "ABCD1234"
   status: "playing"
   player1:
     username: "Player1"
     secretNumber: "1234"
     guesses: []
   player2:
     username: "Player2"
     secretNumber: "5678"
     guesses: []
   ```

---

### Check Vercel Logs

```bash
vercel logs mini-guess-game-api --prod
```

Look for errors in:
- `/api/createRoom`
- `/api/joinRoom`
- `/api/getRoomStatus`
- `/api/submitGuess`

---

## 🐛 Common Issues

### Issue: "Room not found"
**Solution:** 
- Check room code is correct (case-sensitive)
- Room codes expire after games finish
- Create a new room

### Issue: "Room is full"
**Solution:**
- Room already has 2 players
- Create a new room

### Issue: "Username conflict"
**Solution:**
- Player 2 tried to use same username as Player 1
- Use different usernames

### Issue: "Secret number must be X digits"
**Solution:**
- Ensure secret number matches the digit count
- Player 1 sets digit count (3, 4, or 5)
- Player 2 must match it

---

## 🎯 Testing Scenarios

### Scenario 1: Normal Game Flow
1. Player 1 creates room with secret `1234`
2. Player 2 joins with secret `5678`
3. Player 1 guesses `5678` → Wins!
4. Check Firebase: room status = "finished", winner = "Player1"

### Scenario 2: Multiple Guesses
1. Player 1 creates room with secret `1234`
2. Player 2 joins with secret `5678`
3. Player 1 guesses `1111` → Gets feedback
4. Player 1 guesses `5555` → Gets feedback
5. Player 1 guesses `5678` → Wins!

### Scenario 3: Partial Matches
1. Secret: `1234`
2. Guess: `1243`
3. Expected feedback:
   - Position 0: `1` = GREEN (correct position)
   - Position 1: `2` = YELLOW (wrong position, exists in secret)
   - Position 2: `4` = YELLOW (wrong position, exists in secret)
   - Position 3: `3` = YELLOW (wrong position, exists in secret)

### Scenario 4: No Matches
1. Secret: `1234`
2. Guess: `5678`
3. Expected feedback: All RED (no digits match)

### Scenario 5: Easter Egg
1. Secret: `6969`
2. Guess should show: `🔄🔁🔄🔁` instead of numbers

---

## 📊 Firebase Data Structure

```
rooms (collection)
└─ ABCD1234 (document)
    ├─ roomCode: "ABCD1234"
    ├─ status: "playing"
    ├─ digitCount: 4
    ├─ createdAt: Timestamp
    ├─ updatedAt: Timestamp
    ├─ startedAt: Timestamp
    ├─ finishedAt: null
    ├─ winner: null
    ├─ player1:
    │   ├─ username: "Player1"
    │   ├─ secretNumber: "1234"
    │   ├─ guesses: []
    │   ├─ correctGuess: false
    │   └─ joinedAt: Timestamp
    └─ player2:
        ├─ username: "Player2"
        ├─ secretNumber: "5678"
        ├─ guesses: []
        ├─ correctGuess: false
        └─ joinedAt: Timestamp
```

---

## ✅ Success Checklist

- [ ] Can create a room
- [ ] Room code is displayed
- [ ] Can join a room with code
- [ ] Both players can see game screen
- [ ] Can submit guesses
- [ ] Feedback colors are correct
- [ ] Win condition triggers
- [ ] Firebase stores room data
- [ ] Leaderboard updates after game

---

## 🚀 Demo Script for Hackathon

**2-Minute Demo:**

1. **Intro (15 sec):**
   "This is a 1v1 multiplayer guessing game where players compete to guess each other's secret numbers."

2. **Create Room (20 sec):**
   - Show Player 1 creating a room
   - Display the room code
   - "Player 1 sets their secret number and gets a room code to share"

3. **Join Room (20 sec):**
   - Show Player 2 joining with code
   - "Player 2 enters the code and sets their secret number"

4. **Gameplay (45 sec):**
   - Show both players making guesses
   - Highlight the feedback colors
   - Show the 6/9 emoji easter egg
   - "Green means correct position, yellow means wrong position"

5. **Winner (20 sec):**
   - Show player winning
   - Show Elo update
   - Show leaderboard
   - "Winner gets Elo points and climbs the leaderboard!"

---

**Good luck with your hackathon! 🏆**