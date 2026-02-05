/**
 * Vercel Serverless Function - Join Game Room
 * Endpoint: /api/joinRoom
 * Method: POST
 *
 * Allows a second player to join an existing game room
 */

const { initializeApp, getApps } = require("firebase/app");
const {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
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
      roomCode,
      username,
      secretNumber,
      secretWord,
      mode = "number",
      language = null,
      digitCount = null,
      wordLength = null,
    } = req.body;

    // Validate input
    if (!roomCode || typeof roomCode !== "string") {
      return res.status(400).json({ error: "Room code is required" });
    }

    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Username is required" });
    }

    // Get room document
    const roomRef = doc(db, "rooms", roomCode.toUpperCase());
    const roomDoc = await getDoc(roomRef);

    if (!roomDoc.exists()) {
      return res.status(404).json({
        error: "Room not found",
        message: "Invalid room code. Please check and try again.",
      });
    }

    const roomData = roomDoc.data();
    const roomMode = roomData.mode || "number";

    // Check if room is already full
    if (roomData.player2 !== null) {
      return res.status(400).json({
        error: "Room is full",
        message: "This room already has 2 players.",
      });
    }

    // Check if room is already finished
    if (roomData.status === "finished") {
      return res.status(400).json({
        error: "Game finished",
        message: "This game has already ended.",
      });
    }

    // Check if username is same as player1
    if (
      roomData.player1.username.toLowerCase() === username.trim().toLowerCase()
    ) {
      return res.status(400).json({
        error: "Username conflict",
        message: "This username is already taken in this room.",
      });
    }

    // Validate secret number length
    if (roomMode === "number") {
      if (!secretNumber || typeof secretNumber !== "string") {
        return res.status(400).json({ error: "Secret number is required" });
      }

      if (secretNumber.length !== roomData.digitCount) {
        return res.status(400).json({
          error: `Secret number must be ${roomData.digitCount} digits`,
        });
      }

      if (!/^\d+$/.test(secretNumber)) {
        return res.status(400).json({
          error: "Secret number must contain digits only",
        });
      }
    } else if (roomMode === "word") {
      if (!secretWord || typeof secretWord !== "string") {
        return res.status(400).json({ error: "Secret word is required" });
      }

      const normalizedWord = normalizeWord(secretWord);
      if (normalizedWord.length !== roomData.wordLength) {
        return res.status(400).json({
          error: `Secret word must be ${roomData.wordLength} letters`,
        });
      }

      if (!isValidWord(normalizedWord, roomData.language)) {
        return res.status(400).json({
          error:
            roomData.language === "EN"
              ? "Secret word must use English letters only"
              : "Secret word must use Mongolian Cyrillic letters only",
        });
      }
    }

    if (roomMode !== mode) {
      return res.status(400).json({
        error: "Game mode mismatch",
        message: "Selected mode does not match room settings.",
      });
    }

    if (roomMode === "word") {
      if (
        roomData.language !== language ||
        roomData.wordLength !== wordLength
      ) {
        return res.status(400).json({
          error: "Word settings mismatch",
          message: "Language or word length does not match room settings.",
        });
      }
    }

    if (roomMode === "number" && roomData.digitCount !== digitCount) {
      return res.status(400).json({
        error: "Digit count mismatch",
        message: "Digit count does not match room settings.",
      });
    }

    // Update room with player2
    await updateDoc(roomRef, {
      status: "playing",
      startedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      player2: {
        username: username.trim(),
        secretNumber: roomMode === "number" ? secretNumber : null,
        secretWord: roomMode === "word" ? normalizeWord(secretWord) : null,
        guesses: [],
        correctGuess: false,
        joinedAt: serverTimestamp(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Joined room successfully",
      data: {
        roomCode: roomCode.toUpperCase(),
        status: "playing",
        player1: roomData.player1.username,
        player2: username.trim(),
        digitCount: roomMode === "number" ? roomData.digitCount : null,
        wordLength: roomMode === "word" ? roomData.wordLength : null,
        mode: roomMode,
        language: roomMode === "word" ? roomData.language : null,
      },
    });
  } catch (error) {
    console.error("Error joining room:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
