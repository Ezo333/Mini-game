/**
 * Vercel Serverless Function - Create Game Room
 * Endpoint: /api/createRoom
 * Method: POST
 *
 * Creates a new multiplayer game room with a unique code
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

// Generate random room code (4 uppercase letters + 4 digits)
const generateRoomCode = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let code = "";

  // Add 4 random letters
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Add 4 random numbers
  for (let i = 0; i < 4; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return code;
};

const normalizeWord = (value) =>
  value.toString().trim().replace(/\s+/g, "").toUpperCase();

const isValidWord = (value, language) => {
  if (language === "EN") return /^[A-Z]+$/.test(value);
  if (language === "MN") return /^[А-ЯЁӨҮ]+$/.test(value);
  return false;
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
      secretNumber,
      secretWord,
      digitCount = 4,
      wordLength = 5,
      mode = "number",
      language = null,
    } = req.body;

    // Validate input
    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Username is required" });
    }

    if (mode === "number") {
      if (!secretNumber || typeof secretNumber !== "string") {
        return res.status(400).json({ error: "Secret number is required" });
      }

      if (secretNumber.length !== digitCount) {
        return res.status(400).json({
          error: `Secret number must be ${digitCount} digits`,
        });
      }

      if (!/^\d+$/.test(secretNumber)) {
        return res.status(400).json({
          error: "Secret number must contain digits only",
        });
      }
    } else if (mode === "word") {
      if (!secretWord || typeof secretWord !== "string") {
        return res.status(400).json({ error: "Secret word is required" });
      }

      const normalizedWord = normalizeWord(secretWord);
      if (normalizedWord.length !== wordLength) {
        return res.status(400).json({
          error: `Secret word must be ${wordLength} letters`,
        });
      }

      if (!isValidWord(normalizedWord, language)) {
        return res.status(400).json({
          error:
            language === "EN"
              ? "Secret word must use English letters only"
              : "Secret word must use Mongolian Cyrillic letters only",
        });
      }
    } else {
      return res.status(400).json({ error: "Invalid game mode" });
    }

    // Generate unique room code
    const roomCode = generateRoomCode();

    // Create room document in Firestore
    const roomRef = doc(db, "rooms", roomCode);

    const roomData = {
      roomCode,
      status: "waiting", // waiting | playing | finished
      mode,
      language: mode === "word" ? language : null,
      digitCount: mode === "number" ? digitCount : null,
      wordLength: mode === "word" ? wordLength : null,
      entryFee: req.body.entryFee || 0,
      prizePool: (req.body.entryFee || 0) * 2,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      startedAt: null,
      finishedAt: null,
      winner: null,
      player1: {
        username: username.trim(),
        secretNumber: mode === "number" ? secretNumber : null,
        secretWord: mode === "word" ? normalizeWord(secretWord) : null,
        guesses: [],
        correctGuess: false,
        joinedAt: serverTimestamp(),
      },
      player2: null,
    };

    await setDoc(roomRef, roomData);

    return res.status(200).json({
      success: true,
      message: "Room created successfully",
      data: {
        roomCode,
        status: "waiting",
        player1: username.trim(),
        digitCount: mode === "number" ? digitCount : null,
        wordLength: mode === "word" ? wordLength : null,
        mode,
        language: mode === "word" ? language : null,
      },
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
