/**
 * Vercel Serverless Function - Create Solo Game
 * Endpoint: /api/createSoloGame
 * Method: POST
 *
 * Creates a single-player game session against AI/random target
 */

const { initializeApp, getApps } = require("firebase/app");
const {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
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

// Generate random game ID
const generateGameId = () => {
  return `SOLO_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

// Generate random secret
const generateRandomSecret = (length, mode, language) => {
  if (mode === "number") {
    let secret = "";
    for (let i = 0; i < length; i++) {
      secret += Math.floor(Math.random() * 10);
    }
    return secret;
  } else {
    // Word mode
    const enLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const mnLetters = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯӨҮ";
    const alphabet = language === "MN" ? mnLetters : enLetters;

    let secret = "";
    for (let i = 0; i < length; i++) {
      secret += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return secret;
  }
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
    const {
      username,
      mode = "number",
      language = "EN",
      digitCount = 4,
      wordLength = 5,
      difficulty = "medium", // easy, medium, hard
    } = req.body;

    // Validate input
    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Username is required" });
    }

    // Generate game ID
    const gameId = generateGameId();

    // Generate AI secret
    const secretLength = mode === "number" ? digitCount : wordLength;
    const aiSecret = generateRandomSecret(secretLength, mode, language);

    // Calculate time limit based on difficulty
    const timeLimits = { easy: 120, medium: 60, hard: 30 };
    const timeLimit = timeLimits[difficulty] || 60;

    // Create solo game document
    const gameRef = doc(db, "soloGames", gameId);

    const gameData = {
      gameId,
      username: username.trim(),
      mode,
      language: mode === "word" ? language : null,
      digitCount: mode === "number" ? digitCount : null,
      wordLength: mode === "word" ? wordLength : null,
      difficulty,
      timeLimit,
      aiSecret,
      guesses: [],
      status: "playing", // playing | finished
      completed: false,
      won: false,
      startedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      finishedAt: null,
    };

    await setDoc(gameRef, gameData);

    return res.status(200).json({
      success: true,
      message: "Solo game created successfully",
      data: {
        gameId,
        mode,
        language: mode === "word" ? language : null,
        digitCount: mode === "number" ? digitCount : null,
        wordLength: mode === "word" ? wordLength : null,
        difficulty,
        timeLimit,
      },
    });
  } catch (error) {
    console.error("Error creating solo game:", error);

    // Check for permission errors
    if (error.code === 7 || error.message.includes("PERMISSION_DENIED")) {
      return res.status(403).json({
        error: "Permission denied",
        message:
          "Firebase security rules need to be configured. Please check firestore.rules file or contact admin.",
        details: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
