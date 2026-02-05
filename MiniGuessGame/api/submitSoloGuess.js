/**
 * Vercel Serverless Function - Submit Solo Guess
 * Endpoint: /api/submitSoloGuess
 * Method: POST
 *
 * Submits a guess in single-player mode
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
  value
    .toString()
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();

const normalizeGuess = (guess, gameData) => {
  if (gameData.mode === "word") return normalizeWord(guess);
  return guess.toString();
};

// Evaluate guess against secret
const evaluateGuess = (guess, secret) => {
  const feedback = [];
  const secretChars = secret.split("");
  const guessChars = guess.split("");
  const usedSecretIndices = new Set();
  const usedGuessIndices = new Set();

  // First pass: find correct positions (green)
  for (let i = 0; i < guessChars.length; i++) {
    if (guessChars[i] === secretChars[i]) {
      feedback[i] = "correct";
      usedSecretIndices.add(i);
      usedGuessIndices.add(i);
    }
  }

  // Second pass: find wrong positions (yellow)
  for (let i = 0; i < guessChars.length; i++) {
    if (usedGuessIndices.has(i)) continue;

    const char = guessChars[i];
    let foundAt = -1;

    for (let j = 0; j < secretChars.length; j++) {
      if (!usedSecretIndices.has(j) && secretChars[j] === char) {
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
    const { gameId, guess } = req.body;

    // Validate input
    if (!gameId || typeof gameId !== "string") {
      return res.status(400).json({ error: "Game ID is required" });
    }

    if (!guess || typeof guess !== "string") {
      return res.status(400).json({ error: "Guess is required" });
    }

    // Get game document
    const gameRef = doc(db, "soloGames", gameId);
    const gameDoc = await getDoc(gameRef);

    if (!gameDoc.exists()) {
      return res.status(404).json({
        error: "Game not found",
        message: "Invalid game ID.",
      });
    }

    const gameData = gameDoc.data();

    // Check if game is still active
    if (gameData.status !== "playing") {
      return res.status(400).json({
        error: "Game not in progress",
        message: `Game status is: ${gameData.status}`,
      });
    }

    const normalizedGuess = normalizeGuess(guess, gameData);
    const normalizedSecret = normalizeGuess(gameData.aiSecret, gameData);

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
      guesses: arrayUnion(guessEntry),
      updatedAt: serverTimestamp(),
    };

    if (isCorrect) {
      updateData.status = "finished";
      updateData.completed = true;
      updateData.won = true;
      updateData.finishedAt = serverTimestamp();
    }

    // Update game with new guess
    await updateDoc(gameRef, updateData);

    return res.status(200).json({
      success: true,
      message: isCorrect ? "Correct! You won!" : "Guess submitted",
      data: {
        guess: normalizedGuess,
        feedback,
        isCorrect,
        gameStatus: isCorrect ? "finished" : "playing",
        totalGuesses: gameData.guesses.length + 1,
      },
    });
  } catch (error) {
    console.error("Error submitting solo guess:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
