/**
 * Vercel Serverless Function - Get Leaderboard
 * Endpoint: /api/getLeaderboard
 * Method: GET
 *
 * Fetches top players sorted by Elo rating
 */

const { initializeApp, getApps } = require("firebase/app");
const {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
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
    // Get limit from query params (default 10, max 100)
    const limitParam = parseInt(req.query.limit) || 10;
    const limitValue = Math.min(Math.max(1, limitParam), 100);

    // Query Firestore for top players
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("elo", "desc"), limit(limitValue));

    const querySnapshot = await getDocs(q);

    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      leaderboard.push({
        id: doc.id,
        username: data.username,
        elo: data.elo,
        wins: data.wins,
        losses: data.losses,
        gamesPlayed: data.gamesPlayed,
        coins: data.coins || 0,
        soloGamesPlayed: data.soloGamesPlayed || 0,
        soloWins: data.soloWins || 0,
        winRate:
          data.gamesPlayed > 0
            ? ((data.wins / data.gamesPlayed) * 100).toFixed(1)
            : 0,
      });
    });

    return res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
