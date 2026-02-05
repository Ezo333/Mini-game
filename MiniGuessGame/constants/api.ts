/**
 * API Configuration
 * Contains all API endpoints and configuration for the Mini Guess Game
 */

// Your Vercel API Base URL
export const API_BASE_URL =
  "https://mini-guess-game-iqveh3itl-ezo333s-projects.vercel.app/api";

export const API_ENDPOINTS = {
  getLeaderboard: `${API_BASE_URL}/getLeaderboard`,
  updateElo: `${API_BASE_URL}/updateElo`,
};

// API Configuration
export const API_CONFIG = {
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
};

// Helper function to fetch leaderboard
export const fetchLeaderboard = async (limit = 10) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.getLeaderboard}?limit=${limit}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
};

// Helper function to update Elo
export const updatePlayerElo = async (
  username: string,
  didWin: boolean,
  opponentElo = 1500,
) => {
  try {
    const response = await fetch(API_ENDPOINTS.updateElo, {
      method: "POST",
      headers: API_CONFIG.headers,
      body: JSON.stringify({
        username,
        didWin,
        opponentElo,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating Elo:", error);
    throw error;
  }
};
