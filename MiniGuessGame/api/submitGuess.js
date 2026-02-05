/**
 * Vercel Serverless Function - Submit Guess
 * Endpoint: /api/submitGuess
 * Method: POST
 *
 * Submits a player's guess and evaluates it against opponent's secret number
 */

const { initializeApp, getApps } = require("firebase/app");
const {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} = require("firebase/firestore");

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase (only once)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const db = getFirestore(app);

const normalizeWord = (value) =>
  value.toString().trim().replace(/\s+/g, "").toUpperCase();

const isValidWord = (value, language) => {
  if (language === "EN") return /^[A-Z]+$/.test(value);
  if (language === "MN") return /^[А-ЯЁӨҮ]+$/.test(value);
  return false;
};

const normalizeGuess = (guess, roomData) => {
  if (roomData.mode === "word") return normalizeWord(guess);
  return guess.toString();
};

// Evaluate guess against secret number
const evaluateGuess = (guess, secret) => {
  const feedback = [];
  const secretDigits = secret.split("");
  const guessDigits = guess.split("");
  const usedSecretIndices = new Set();
  const usedGuessIndices = new Set();

  // First pass: find correct positions (green)
  for (let i = 0; i < guessDigits.length; i++) {
    if (guessDigits[i] === secretDigits[i]) {
      feedback[i] = "correct";
      usedSecretIndices.add(i);
      usedGuessIndices.add(i);
    }
  }

  // Second pass: find wrong positions (yellow)
  for (let i = 0; i < guessDigits.length; i++) {
    if (usedGuessIndices.has(i)) continue;

    const digit = guessDigits[i];
    let foundAt = -1;

    // Look for this digit in unused positions of secret
    for (let j = 0; j < secretDigits.length; j++) {
      if (!usedSecretIndices.has(j) && secretDigits[j] === digit) {
        foundAt = j;
        break;
      }
    }

    if (foundAt !== -1) {
      feedback[i] = "wrongPosition";
      usedSecretIndices.add(foundAt);
    } else {
      feedback[i] = "notInNumber";
    }
  }

  return feedback;
};

module.exports = async function handler(req, res) {
  // Comprehensive CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Origin, Authorization",
  );
  res.setHeader("Access-Control-Max-Age", "86400");

  // Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { roomCode, username, guess } = req.body;

    // Validate input
    if (!roomCode || typeof roomCode !== "string") {
      return res.status(400).json({ error: "Room code is required" });
    }

    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Username is required" });
    }

    if (!guess || typeof guess !== "string") {
      return res.status(400).json({ error: "Guess is required" });
    }

    // Get room document
    const roomRef = doc(db, "rooms", roomCode.toUpperCase());
    const roomDoc = await getDoc(roomRef);

    if (!roomDoc.exists()) {
      return res.status(404).json({
        error: "Room not found",
        message: "Invalid room code.",
      });
    }

    const roomData = roomDoc.data();
    const roomMode = roomData.mode || "number";

    const expectedLength =
      roomMode === "word" ? roomData.wordLength : roomData.digitCount;

    const normalizedGuess = normalizeGuess(guess, roomData);

    if (roomMode === "word") {
      if (!isValidWord(normalizedGuess, roomData.language)) {
        return res.status(400).json({
          error:
            roomData.language === "EN"
              ? "Guess must use English letters only"
              : "Guess must use Mongolian Cyrillic letters only",
        });
      }
    }

    if (roomMode === "number" && !/^\d+$/.test(normalizedGuess)) {
      return res.status(400).json({
        error: "Guess must contain digits only",
      });
    }

    if (normalizedGuess.length !== expectedLength) {
      return res.status(400).json({
        error:
          roomMode === "word"
            ? `Guess must be ${expectedLength} letters`
            : `Guess must be ${expectedLength} digits`,
      });
    }

    // Determine which player is making the guess
    let isPlayer1 = false;
    let isPlayer2 = false;
    let opponentSecret = null;

    if (
      roomData.player1.username.toLowerCase() === username.trim().toLowerCase()
    ) {
      isPlayer1 = true;
      opponentSecret =
        roomMode === "word"
          ? roomData.player2?.secretWord
          : roomData.player2?.secretNumber;
    } else if (
      roomData.player2 &&
      roomData.player2.username.toLowerCase() === username.trim().toLowerCase()
    ) {
      isPlayer2 = true;
      opponentSecret =
        roomMode === "word"
          ? roomData.player1.secretWord
          : roomData.player1.secretNumber;
    } else {
      return res.status(403).json({
        error: "Not a player in this room",
        message: "You are not part of this game.",
      });
    }

    if (!opponentSecret) {
      return res.status(400).json({
        error: "Waiting for opponent",
        message: "Opponent has not joined yet.",
      });
    }

    const normalizedSecret =
      roomMode === "word" ? normalizeWord(opponentSecret) : opponentSecret;

    // Evaluate the guess
    const feedback = evaluateGuess(normalizedGuess, normalizedSecret);
    const isCorrect = feedback.every((f) => f === "correct");

    // Create guess entry
    const guessEntry = {
      guess: normalizedGuess,
      feedback,
      isCorrect,
      timestamp: new Date().toISOString(),
    };

    // Prepare update object
    const updateData = {
      updatedAt: serverTimestamp(),
    };

    if (isPlayer1) {
      updateData["player1.guesses"] = arrayUnion(guessEntry);
      if (isCorrect) {
        updateData["player1.correctGuess"] = true;
        updateData.status = "finished";
        updateData.winner = roomData.player1.username;
        updateData.finishedAt = serverTimestamp();
      }
    } else if (isPlayer2) {
      updateData["player2.guesses"] = arrayUnion(guessEntry);
      if (isCorrect) {
        updateData["player2.correctGuess"] = true;
        updateData.status = "finished";
        updateData.winner = roomData.player2.username;
        updateData.finishedAt = serverTimestamp();
      }
    }

    // Update room with new guess
    await updateDoc(roomRef, updateData);

    return res.status(200).json({
      success: true,
      message: isCorrect ? "Correct! You won!" : "Guess submitted",
      data: {
        guess,
        feedback,
        isCorrect,
        gameStatus: isCorrect ? "finished" : "playing",
        winner: isCorrect ? username.trim() : null,
      },
    });
  } catch (error) {
    console.error("Error submitting guess:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
