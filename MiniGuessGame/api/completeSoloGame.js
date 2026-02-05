/**
 * Vercel Serverless Function - Complete Solo Game
 * Endpoint: /api/completeSoloGame
 * Method: POST
 *
 * Completes a solo game and awards coins
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

// Calculate coin reward based on performance
const calculateCoinReward = (won, difficulty, guessCount, timeRemaining) => {
  if (!won) return 10; // Participation reward (less than multiplayer)

  // Base rewards by difficulty
  const baseRewards = { easy: 30, medium: 50, hard: 80 };
  let reward = baseRewards[difficulty] || 50;

  // Bonus for fewer guesses (up to +20 coins)
  const guessBonus = Math.max(0, 20 - guessCount * 2);
  reward += guessBonus;

  // Time bonus (up to +10 coins)
  if (timeRemaining > 30) reward += 10;
  else if (timeRemaining > 15) reward += 5;

  return Math.floor(reward);
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
    const { gameId, won, timeRemaining = 0 } = req.body;

    // Validate input
    if (!gameId || typeof gameId !== "string") {
      return res.status(400).json({ error: "Game ID is required" });
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

    // Mark game as completed
    await updateDoc(gameRef, {
      status: "finished",
      completed: true,
      won: won || false,
      finishedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Calculate coin reward
    const coinReward = calculateCoinReward(
      won,
      gameData.difficulty,
      gameData.guesses.length,
      timeRemaining,
    );

    // Award coins to user
    const userId = gameData.username
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, "");

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      await updateDoc(userRef, {
        coins: (userData.coins || 0) + coinReward,
        totalCoinsEarned: (userData.totalCoinsEarned || 0) + coinReward,
        soloGamesPlayed: (userData.soloGamesPlayed || 0) + 1,
        soloWins: (userData.soloWins || 0) + (won ? 1 : 0),
        updatedAt: serverTimestamp(),
      });
    } else {
      // New user - create with solo stats
      await setDoc(userRef, {
        username: gameData.username,
        elo: 1500,
        wins: 0,
        losses: 0,
        gamesPlayed: 0,
        coins: 500 + coinReward, // Starting bonus + reward
        totalCoinsEarned: coinReward,
        soloGamesPlayed: 1,
        soloWins: won ? 1 : 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    return res.status(200).json({
      success: true,
      message: won
        ? `Victory! Earned ${coinReward} coins!`
        : `Game completed. Earned ${coinReward} coins.`,
      data: {
        gameId,
        won,
        coinReward,
        guessCount: gameData.guesses.length,
        difficulty: gameData.difficulty,
      },
    });
  } catch (error) {
    console.error("Error completing solo game:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
