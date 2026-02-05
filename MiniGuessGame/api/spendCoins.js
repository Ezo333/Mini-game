/**
 * Vercel Serverless Function - Spend Coins
 * Endpoint: /api/spendCoins
 * Method: POST
 *
 * Deducts coins from user account (for entry fees, purchases, etc.)
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
    const { username, amount, reason = "purchase" } = req.body;

    // Validate input
    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Username is required" });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
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
      return res.status(404).json({
        error: "User not found",
        message: "Please play a game first to create your profile.",
      });
    }

    const userData = userDoc.data();
    const currentCoins = userData.coins || 0;

    // Check if user has enough coins
    if (currentCoins < amount) {
      return res.status(400).json({
        error: "Insufficient coins",
        message: `You need ${amount} coins but only have ${currentCoins}.`,
        currentCoins,
        required: amount,
      });
    }

    // Deduct coins
    const newCoins = currentCoins - amount;

    await updateDoc(userRef, {
      coins: newCoins,
      updatedAt: serverTimestamp(),
    });

    return res.status(200).json({
      success: true,
      message: `Successfully spent ${amount} coins`,
      data: {
        username: userData.username,
        previousCoins: currentCoins,
        spentAmount: amount,
        newCoins,
        reason,
      },
    });
  } catch (error) {
    console.error("Error spending coins:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
