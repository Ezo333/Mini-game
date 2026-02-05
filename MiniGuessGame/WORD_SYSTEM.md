# Word Generation System Documentation

## Overview
The game now uses **real word dictionaries** for solo mode AI opponents, making the game fun and logical to play.

## How It Works

### Solo Mode (AI Opponent)
- **Uses Real Words** from curated word lists
- **English:** 300+ common words per length (4-6 letters)
- **Mongolian:** 200+ common words per length (4-6 letters)
- AI picks random word from appropriate list

### Multiplayer Mode (1v1)
- **Players Enter Their Own Words**
- Client-side validation ensures correct alphabet (EN/MN)
- No dictionary check (players can use any valid word they know)
- More strategic - you choose your own secret word

## Word Lists

### English Words (EN_WORDS)
- **4 letters:** 300 words (e.g., GAME, PLAY, WORD, BEST)
- **5 letters:** 300 words (e.g., APPLE, BRAIN, CHESS, DREAM)
- **6 letters:** 300 words (e.g., PLAYER, CASTLE, FRIEND, WINNER)

**Sources:** Common English vocabulary, high-frequency words

### Mongolian Words (MN_WORDS)
- **4 letters:** 200 words (e.g., АМЬД, БАЯР, ГЭРЭЛ, ДАРГА)
- **5 letters:** 143 words (e.g., АГААР, БАГАЖ, ГАЗАР, ЖАРГАЛ)
- **6 letters:** 90 words (e.g., АМЬДРАЛ, БАТАЛГАА, ГАЗРЫН, ЖАРГАЛ)

**Character Set:** Full Cyrillic including Mongolian-specific letters (Ө, Ү)

## Technical Implementation

### File: `/api/wordLists.js`
```javascript
const { getRandomWord } = require("./wordLists");

// Get a random word
const word = getRandomWord(5, "EN"); // 5-letter English word
const word = getRandomWord(4, "MN"); // 4-letter Mongolian word
```

### Integration Points

**Solo Mode AI:**
- `createSoloGame.js` - Generates AI secret word from lists
- Always uses real, valid words
- Players can guess logically

**Multiplayer:**
- Players type their own secret words
- Validation only checks alphabet (EN A-Z or MN Cyrillic)
- No dictionary requirement (strategic freedom)

## Validation Rules

### English (EN)
- **Allowed:** A-Z (uppercase only)
- **Not Allowed:** Numbers, symbols, spaces
- **Auto-convert:** Lowercase → Uppercase

### Mongolian (MN)
- **Allowed:** А-Я, Ё, Ө, Ү (Cyrillic only)
- **Not Allowed:** Latin letters, numbers, symbols, spaces
- **Auto-convert:** Lowercase → Uppercase

## Fallback Behavior

If a word list is missing or empty:
```javascript
// Falls back to random letters
// Ensures game always works even if lists incomplete
```

This prevents crashes but should rarely happen with our comprehensive lists.

## Word List Quality

### Selection Criteria
✅ Common, recognizable words
✅ Appropriate for all ages
✅ No proper nouns (names, places)
✅ No offensive/inappropriate words
✅ High-frequency vocabulary

### English Word Examples
- **Easy:** BOOK, PLAY, GAME, WORD, KING
- **Medium:** APPLE, CHAIR, HAPPY, MUSIC, TIGER
- **Hard:** FLIGHT, GOLDEN, BRIDGE, CASTLE, MASTER

### Mongolian Word Examples
- **Easy:** ГАЗАР (earth), АМЬД (alive), БАЯР (joy)
- **Medium:** БАГАЖ (tool), АГААР (air), ЖАРГАЛ (happiness)
- **Hard:** АМЬДРАЛ (life), БАТАЛГАА (guarantee), ГАЗРЫН (of earth)

## Adding More Words

To expand word lists, edit `/api/wordLists.js`:

```javascript
const EN_WORDS = {
  4: [
    // Add more 4-letter words here
    "YOUR", "NEW", "WORD", "HERE"
  ],
  // ... etc
};
```

**Recommendation:** Aim for 300-500 words per length/language for good variety.

## Benefits of This System

### For Players
✅ **Logical gameplay** - Can deduce words intelligently
✅ **Fair difficulty** - AI uses real words like human opponent
✅ **Educational** - Learn new words while playing
✅ **Engaging** - More satisfying than random letters

### For Development
✅ **Offline-ready** - No external API calls needed
✅ **Fast** - Instant word generation
✅ **Reliable** - No network dependencies
✅ **Customizable** - Easy to add themed word lists

## Future Enhancements

### Possible Additions
1. **Difficulty-based word selection**
   - Easy: Common 4-letter words
   - Medium: 5-letter words
   - Hard: Rare/complex 6-letter words

2. **Themed word lists**
   - Animals, colors, sports, etc.
   - Player can choose theme

3. **Word validation in multiplayer**
   - Optional: Check if player's word is in dictionary
   - Prevents "ZZZZZ" type entries

4. **Hint system**
   - Show word definition after game
   - Educational feature

5. **Leaderboard for vocabulary**
   - Track unique words used
   - Reward diverse vocabulary

## API Reference

### `getRandomWord(length, language)`
Returns a random word from the appropriate list.

**Parameters:**
- `length` (number): Word length (4, 5, or 6)
- `language` (string): "EN" or "MN"

**Returns:**
- (string): Random word in UPPERCASE

**Example:**
```javascript
const word = getRandomWord(5, "EN");
// Returns: "APPLE" or "CHESS" or "BRAIN" etc.
```

## Testing Words

To test the word lists:
1. Start solo game
2. Choose word mode
3. Select language (EN/MN)
4. Play and verify AI's word is real

**Expected:** AI always uses valid, recognizable words
**If not:** Check `/api/wordLists.js` - word may need review

## Conclusion

The word generation system provides:
- **Authentic gameplay** with real words
- **Bilingual support** (English + Mongolian)
- **Reliable performance** (offline word lists)
- **Easy maintenance** (simple JS arrays)

Perfect balance of functionality and simplicity! 🎮📚
