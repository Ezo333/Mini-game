/**
 * Vercel Serverless Function - Update Elo Score
 * Endpoint: /api/updateElo
 * Method: POST
 *
 * Updates user's Elo rating and stats after a game
 */

const { initializeApp, getApps } = require("firebase/app");
const {
  getFirestore,
  doc,
  setDoc,
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

// Elo rating calculation
const calculateEloChange = (playerElo, opponentElo, didWin, kFactor = 32) => {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  const actualScore = didWin ? 1 : 0;
  const eloChange = Math.round(kFactor * (actualScore - expectedScore));
  return eloChange;
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
    const { username, didWin, opponentElo = 1500 } = req.body;

    // Validate input
    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Username is required" });
    }

    if (typeof didWin !== "boolean") {
      return res.status(400).json({ error: "didWin must be a boolean" });
    }

    // Sanitize username (use as document ID)
    const userId = username
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, "");

    if (!userId) {
      return res.status(400).json({ error: "Invalid username" });
    }

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let userData;
    let eloChange = 0;

    if (userDoc.exists()) {
      // User exists - update stats
      const currentData = userDoc.data();
      const currentElo = currentData.elo || 1500;

      // Calculate Elo change
      eloChange = calculateEloChange(currentElo, opponentElo, didWin);
      const newElo = Math.max(0, currentElo + eloChange); // Elo can't go below 0

      userData = {
        username: username.trim(),
        elo: newElo,
        wins: currentData.wins + (didWin ? 1 : 0),
        losses: currentData.losses + (didWin ? 0 : 1),
        gamesPlayed: currentData.gamesPlayed + 1,
        coins: (currentData.coins || 0) + (didWin ? 100 : 25), // Win: +100 coins, Loss: +25 coins
        totalCoinsEarned:
          (currentData.totalCoinsEarned || 0) + (didWin ? 100 : 25),
        lastPlayed: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userRef, userData);
    } else {
      // New user - create document
      const initialElo = 1500;
      eloChange = calculateEloChange(initialElo, opponentElo, didWin);
      const newElo = Math.max(0, initialElo + eloChange);

      userData = {
        username: username.trim(),
        elo: newElo,
        wins: didWin ? 1 : 0,
        losses: didWin ? 0 : 1,
        gamesPlayed: 1,
        coins: 500 + (didWin ? 100 : 25), // Starting bonus: 500 coins + match reward
        totalCoinsEarned: didWin ? 100 : 25,
        createdAt: serverTimestamp(),
        lastPlayed: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(userRef, userData);
    }

    return res.status(200).json({
      success: true,
      message: "Elo updated successfully",
      data: {
        username: userData.username,
        elo: userData.elo,
        eloChange,
        wins: userData.wins,
        losses: userData.losses,
        gamesPlayed: userData.gamesPlayed,
        coins: userData.coins,
        coinsEarned: didWin ? 100 : 25,
      },
    });
  } catch (error) {
    console.error("Error updating Elo:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
