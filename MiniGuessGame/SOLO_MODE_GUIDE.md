# Solo Mode Implementation Summary

## Overview
Added a complete single-player mode where players can practice against AI and earn coins (less than multiplayer).

## Coin Rewards

### Multiplayer (1v1)
- Win: **100 coins**
- Loss: **25 coins**
- Entry fees: Optional (0, 10, 50, 100 coins)
- Winner gets 2x entry fee + normal rewards

### Solo Mode (Practice)
- **Entry Fees (Cost to play):**
  - Easy (120s): **5 coins**
  - Medium (60s): **10 coins**
  - Hard (30s): **15 coins**
  
- **Rewards (What you can earn):**
  - Base rewards by difficulty:
    - Easy: **30 coins**
    - Medium: **50 coins**
    - Hard: **80 coins**
  - Bonus for fewer guesses: **up to +20 coins**
  - Time bonus: **up to +10 coins**
  - Loss/timeout: **10 coins** (participation)
  - **Maximum possible: ~110 coins (hard mode, fast solve)**

- **Profit/Loss Examples:**
  - Easy win (40 coins) - 5 entry = **+35 coins profit**
  - Medium win (70 coins) - 10 entry = **+60 coins profit**
  - Hard win (100 coins) - 15 entry = **+85 coins profit**
  - Easy loss (10 coins) - 5 entry = **-5 coins loss**
  - Hard loss (10 coins) - 15 entry = **-5 coins loss**

## New API Endpoints

### `/api/createSoloGame` (POST)
Creates a solo game session with AI-generated secret.
- Generates random secret (number or word)
- Supports all modes: number/word, EN/MN
- Three difficulty levels with time limits

### `/api/submitSoloGuess` (POST)
Submits a guess in solo mode.
- Same evaluation logic as multiplayer
- Tracks all guesses
- No opponent needed

### `/api/completeSoloGame` (POST)
Completes solo game and awards coins.
- Calculates coin reward based on performance
- Updates user stats (soloGamesPlayed, soloWins)
- Awards bonus for speed and efficiency

## New UI Screens

### `/app/solo-lobby.tsx`
Configuration screen for solo games:
- Game mode selector (number/word)
- Language selector (EN/MN)
- Length selector (3-6)
- Difficulty selector (easy/medium/hard)
- Shows coin rewards for each difficulty

### `/app/solo-game.tsx`
Solo game screen:
- Similar to multiplayer game UI
- Shows difficulty badge
- Timer based on difficulty
- Guess history with feedback
- Coin reward display on completion

## Home Screen Updates
- Added "Solo Mode" button
- Updated info to show solo rewards
- Profile card shows solo stats

## Leaderboard Updates
- Shows solo game stats (solo wins/games)
- Separate tracking from multiplayer stats

## User Stats Schema
New fields added to user documents:
```javascript
{
  // Existing fields
  elo: number,
  wins: number,
  losses: number,
  gamesPlayed: number,
  coins: number,
  totalCoinsEarned: number,
  
  // New solo mode fields
  soloGamesPlayed: number,
  soloWins: number,
}
```

## Key Features
✅ Practice without risking coins
✅ Three difficulty levels
✅ Performance-based rewards
✅ Supports all game modes (number/word, EN/MN)
✅ Time bonuses and guess bonuses
✅ Separate stats tracking
✅ AI opponent with random secrets

## Balance Philosophy
Solo mode now requires entry fees to:
- Prevent infinite free practice (you must manage coins)
- Make winning feel rewarding (profit potential)
- Add risk/reward decision making
- Keep multiplayer as the safer earning method
- Encourage skill improvement (better play = more profit)

Players can use solo mode to:
- Practice with real stakes (small entry fees)
- Potentially earn more than multiplayer (if skilled)
- Take calculated risks based on difficulty
- Build skills before expensive multiplayer matches