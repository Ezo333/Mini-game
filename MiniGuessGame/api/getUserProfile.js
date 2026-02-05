/**
 * Vercel Serverless Function - Get User Profile
 * Endpoint: /api/getUserProfile
 * Method: GET
 *
 * Fetches user profile including coins, stats, and Elo
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
    const { username } = req.query;

    // Validate input
    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Username is required" });
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

    if (!userDoc.exists()) {
      // Return default profile for new user
      return res.status(200).json({
        success: true,
        data: {
          username: username.trim(),
          elo: 1500,
          wins: 0,
          losses: 0,
          gamesPlayed: 0,
          coins: 500, // Starting bonus
          totalCoinsEarned: 0,
          isNewUser: true,
        },
      });
    }

    const userData = userDoc.data();

    return res.status(200).json({
      success: true,
      data: {
        username: userData.username,
        elo: userData.elo || 1500,
        wins: userData.wins || 0,
        losses: userData.losses || 0,
        gamesPlayed: userData.gamesPlayed || 0,
        coins: userData.coins || 0,
        totalCoinsEarned: userData.totalCoinsEarned || 0,
        winRate:
          userData.gamesPlayed > 0
            ? ((userData.wins / userData.gamesPlayed) * 100).toFixed(1)
            : 0,
        isNewUser: false,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
