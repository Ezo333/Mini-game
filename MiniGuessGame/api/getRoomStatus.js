/**
 * Vercel Serverless Function - Get Room Status
 * Endpoint: /api/getRoomStatus
 * Method: GET
 *
 * Fetches current status of a game room including both players' progress
 */

const { initializeApp, getApps } = require("firebase/app");
const { getFirestore, doc, getDoc } = require("firebase/firestore");

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

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { roomCode } = req.query;

    // Validate input
    if (!roomCode || typeof roomCode !== "string") {
      return res.status(400).json({ error: "Room code is required" });
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

    // Prepare response data (hide secret numbers from opponent)
    const responseData = {
      roomCode,
      status: roomData.status,
      mode: roomData.mode || "number",
      language: roomData.language || null,
      digitCount: roomData.digitCount || null,
      wordLength: roomData.wordLength || null,
      entryFee: roomData.entryFee || 0,
      prizePool: roomData.prizePool || 0,
      createdAt: roomData.createdAt,
      startedAt: roomData.startedAt,
      finishedAt: roomData.finishedAt,
      winner: roomData.winner,
      player1: {
        username: roomData.player1.username,
        guesses: roomData.player1.guesses,
        correctGuess: roomData.player1.correctGuess,
        guessCount: roomData.player1.guesses.length,
      },
      player2: roomData.player2
        ? {
            username: roomData.player2.username,
            guesses: roomData.player2.guesses,
            correctGuess: roomData.player2.correctGuess,
            guessCount: roomData.player2.guesses.length,
          }
        : null,
    };

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error getting room status:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
