import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius, FontSizes } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const API_BASE_URL =
  "https://mini-guess-game-inp9mrf1u-ezo333s-projects.vercel.app/api";

interface GuessEntry {
  guess: string;
  feedback: string[];
  isCorrect: boolean;
  timestamp: string;
}

export default function GameScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[(colorScheme ?? "light") as keyof typeof Colors];

  const username = (params.username as string) || "Guest";
  const roomCode = (params.roomCode as string) || "";
  const playerNumber = (params.playerNumber as string) || "1";
  const mySecret = (params.secretNumber as string) || "";

  const [guess, setGuess] = useState("");
  const [myGuesses, setMyGuesses] = useState<GuessEntry[]>([]);
  const [opponentGuesses, setOpponentGuesses] = useState<GuessEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState<
    "waiting" | "playing" | "finished"
  >("waiting");
  const [winner, setWinner] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [digitCount, setDigitCount] = useState(4);
  const [gameMode, setGameMode] = useState<"number" | "word">("number");
  const [language, setLanguage] = useState<"EN" | "MN" | null>(null);
  const [wordLength, setWordLength] = useState(5);
  const [opponentUsername, setOpponentUsername] = useState("");
  const [showGameStarted, setShowGameStarted] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const webViewRef = useRef<WebView>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch room status periodically
  useEffect(() => {
    console.log("Game screen mounted with params:", {
      username,
      roomCode,
      playerNumber,
      mySecret,
    });
    fetchRoomStatus();
    const interval = setInterval(fetchRoomStatus, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, [roomCode]);

  // Timer countdown
  useEffect(() => {
    if (gameStatus === "playing" && timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0 && gameStatus === "playing") {
      handleTimeUp();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timer, gameStatus]);

  const fetchRoomStatus = async () => {
    try {
      console.log("Fetching room status for:", roomCode);
      const response = await fetch(
        `${API_BASE_URL}/getRoomStatus?roomCode=${roomCode}`,
      );

      console.log("Room status response status:", response.status);

      const data = await response.json();
      console.log("Room status response:", JSON.stringify(data, null, 2));

      if (data.success) {
        const room = data.data;
        console.log("Room data:", JSON.stringify(room, null, 2));
        console.log("Room status:", room.status);

        // Update last fetch time
        setLastUpdated(new Date());

        // Detect game starting
        if (gameStatus === "waiting" && room.status === "playing") {
          console.log("Game is starting!");
          setShowGameStarted(true);
          setTimeout(() => setShowGameStarted(false), 3000);
        }

        setGameStatus(room.status);
        setWinner(room.winner);
        setDigitCount(room.digitCount || 4);
        setGameMode(room.mode || "number");
        setLanguage(room.language || null);
        setWordLength(room.wordLength || 5);

        // Determine which player we are and get opponent info
        if (playerNumber === "1") {
          console.log("I am Player 1");
          setMyGuesses(room.player1.guesses || []);
          setOpponentGuesses(room.player2?.guesses || []);
          setOpponentUsername(
            room.player2?.username || "Waiting for player 2...",
          );
          console.log("Player 2 status:", room.player2 ? "Joined" : "Not yet");
        } else {
          console.log("I am Player 2");
          setMyGuesses(room.player2.guesses || []);
          setOpponentGuesses(room.player1?.guesses || []);
          setOpponentUsername(room.player1?.username || "Opponent");
        }

        // Check if game finished
        if (room.status === "finished") {
          handleGameEnd(room.winner);
        }
      } else {
        console.error("Failed to fetch room status:", data.error);
      }
    } catch (error) {
      console.error("Error fetching room status:", error);
      console.error("Error details:", error.message);
    }
  };

  const handleSubmitGuess = async () => {
    const expectedLength = gameMode === "word" ? wordLength : digitCount;

    if (guess.length !== expectedLength) {
      Alert.alert(
        "Error",
        gameMode === "word"
          ? `Please enter exactly ${expectedLength} letters`
          : `Please enter exactly ${expectedLength} digits`,
      );
      return;
    }

    if (gameMode === "number" && !/^\d+$/.test(guess)) {
      Alert.alert("Error", "Please enter only numbers");
      return;
    }

    if (gameMode === "word") {
      const upperGuess = guess.toUpperCase();
      const isValid =
        language === "MN"
          ? /^[А-ЯЁӨҮ]+$/.test(upperGuess)
          : /^[A-Z]+$/.test(upperGuess);
      if (!isValid) {
        Alert.alert(
          "Error",
          language === "MN"
            ? "Please use Mongolian Cyrillic letters only"
            : "Please use English letters only",
        );
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/submitGuess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode,
          username,
          guess: gameMode === "word" ? guess.toUpperCase() : guess,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGuess("");
        fetchRoomStatus(); // Refresh room status immediately

        if (data.data.isCorrect) {
          Alert.alert(
            "You Won!",
            "Congratulations! You guessed the number correctly!",
            [
              {
                text: "View Leaderboard",
                onPress: () => router.push("/(tabs)/explore"),
              },
            ],
          );
        }
      } else {
        Alert.alert("Error", data.error || "Failed to submit guess");
      }
    } catch (error) {
      console.error("Error submitting guess:", error);
      Alert.alert("Error", "Failed to submit guess. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    Alert.alert(
      "Time's Up",
      winner
        ? `${winner} wins!`
        : "Game ended. No one guessed correctly in time.",
      [
        {
          text: "View Leaderboard",
          onPress: () => router.push("/(tabs)/explore"),
        },
      ],
    );
  };

  const handleGameEnd = (winnerName: string | null) => {
    if (winnerName) {
      // Update Elo for both players
      updatePlayerElo(username, winnerName === username);
      updatePlayerElo(opponentUsername, winnerName === opponentUsername);
    }
  };

  const updatePlayerElo = async (playerUsername: string, didWin: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/updateElo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: playerUsername,
          didWin,
          opponentElo: 1500,
        }),
      });

      const data = await response.json();

      if (data.success && didWin && playerUsername === username) {
        // Show coin reward notification
        Alert.alert(
          "Victory!",
          `You earned ${data.data.coinsEarned} coins! Total: ${data.data.coins}`,
        );
      }
    } catch (error) {
      console.error("Error updating Elo:", error);
    }
  };

  const getFeedbackColor = (feedback: string) => {
    switch (feedback) {
      case "correct":
        return colors.correctPosition;
      case "wrongPosition":
        return colors.wrongPosition;
      case "notInNumber":
        return colors.notInNumber;
      default:
        return colors.icon;
    }
  };

  const getFeedbackDisplay = (digit: string, feedback: string) => {
    const bgColor = getFeedbackColor(feedback);
    return { displayDigit: digit, bgColor };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderGuessHistory = (guesses: GuessEntry[], title: string) => {
    return (
      <View style={styles.historySection}>
        <ThemedText style={styles.historyTitle}>{title}</ThemedText>
        <ScrollView
          style={styles.historyScroll}
          contentContainerStyle={styles.historyContent}
        >
          {guesses.length === 0 ? (
            <ThemedText style={styles.emptyText}>No guesses yet...</ThemedText>
          ) : (
            guesses.map((entry, index) => (
              <View key={index} style={styles.guessEntry}>
                <View style={styles.feedbackRow}>
                  {entry.guess.split("").map((digit, i) => {
                    const { displayDigit, bgColor } = getFeedbackDisplay(
                      digit,
                      entry.feedback[i],
                    );
                    return (
                      <View
                        key={i}
                        style={[
                          styles.feedbackCircle,
                          { backgroundColor: bgColor },
                        ]}
                      >
                        <ThemedText style={styles.feedbackDigit}>
                          {displayDigit}
                        </ThemedText>
                      </View>
                    );
                  })}
                </View>
                {entry.isCorrect && (
                  <ThemedText style={styles.correctLabel}>Correct</ThemedText>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  };

  if (gameStatus === "waiting") {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.waitingContainer}>
          <View style={styles.waitingHeader}>
            <View style={styles.statusPill}>
              <ThemedText style={styles.statusPillText}>Waiting</ThemedText>
            </View>
            <ThemedText style={styles.title}>Waiting Room</ThemedText>
            <ThemedText style={styles.waitingSubtitle}>
              Share the code to start the match
            </ThemedText>
          </View>

          <View
            style={[
              styles.roomCodeDisplay,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <ThemedText style={styles.roomCodeLabel}>Room Code</ThemedText>
            <ThemedText style={styles.roomCodeText}>{roomCode}</ThemedText>
            <ThemedText style={styles.infoTextSmall}>
              Auto-refreshing. Last checked: {lastUpdated.toLocaleTimeString()}
            </ThemedText>
          </View>

          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginVertical: Spacing.lg }}
          />

          <ThemedText style={styles.waitingText}>
            Waiting for opponent to join
          </ThemedText>

          <View
            style={[
              styles.instructionsBox,
              {
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              },
            ]}
          >
            <ThemedText style={styles.instructionTitle}>
              Instructions
            </ThemedText>
            <ThemedText style={styles.instructionText}>
              1. Share the room code above with your friend
            </ThemedText>
            <ThemedText style={styles.instructionText}>
              2. They should enter the code in "Join Room"
            </ThemedText>
            <ThemedText style={styles.instructionText}>
              3. Game starts automatically when they join
            </ThemedText>
          </View>

          <View style={styles.waitingActions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.secondary }]}
              onPress={() => {
                console.log("Manual refresh requested");
                fetchRoomStatus();
              }}
            >
              <ThemedText style={styles.buttonText}>Refresh Status</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.buttonSecondary },
              ]}
              onPress={() => router.back()}
            >
              <ThemedText style={[styles.buttonText, { color: colors.text }]}>
                Cancel & Go Back
              </ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.infoTextSmall}>
            You: {username} (Player {playerNumber})
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {showGameStarted && (
        <View
          style={[
            styles.gameStartedBanner,
            { backgroundColor: colors.correctPosition },
          ]}
        >
          <ThemedText style={styles.gameStartedText}>
            Game Started. Opponent has joined.
          </ThemedText>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.playerInfo}>
          <ThemedText style={styles.playerName}>You: {username}</ThemedText>
          <ThemedText style={styles.vsText}>VS</ThemedText>
          <ThemedText style={styles.playerName}>{opponentUsername}</ThemedText>
        </View>
        <View
          style={[
            styles.timerContainer,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
            },
            timer < 10 && { backgroundColor: colors.danger },
          ]}
        >
          <ThemedText style={styles.timerText}>
            Time {formatTime(timer)}
          </ThemedText>
        </View>
        <View style={styles.roomCodePill}>
          <ThemedText style={styles.roomCodeSmall}>Room {roomCode}</ThemedText>
        </View>
        <ThemedText style={styles.modeText}>
          {gameMode === "word"
            ? `Word • ${language ?? "EN"} • ${wordLength}`
            : `Number • ${digitCount}`}
        </ThemedText>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.historyContainer}>
          {renderGuessHistory(myGuesses, "Your Guesses")}
          {renderGuessHistory(opponentGuesses, "Opponent's Guesses")}
        </View>

        {gameStatus === "playing" && (
          <View
            style={[
              styles.inputArea,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <ThemedText style={styles.inputLabel}>
              Enter your {gameMode === "word" ? "word" : "guess"} (
              {gameMode === "word" ? wordLength : digitCount}{" "}
              {gameMode === "word" ? "letters" : "digits"})
            </ThemedText>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.input,
                    borderColor: colors.inputBorder,
                    color: colors.text,
                  },
                ]}
                placeholder={`${gameMode === "word" ? wordLength : digitCount} ${gameMode === "word" ? "letters" : "digits"}...`}
                placeholderTextColor={colors.icon}
                value={guess}
                onChangeText={(text) => {
                  if (gameMode === "number") {
                    setGuess(text.replace(/[^0-9]/g, "").slice(0, digitCount));
                    return;
                  }

                  const normalized = text
                    .replace(/\s+/g, "")
                    .toUpperCase()
                    .slice(0, wordLength);

                  const filtered =
                    language === "MN"
                      ? normalized.replace(/[^А-ЯЁӨҮ]/g, "")
                      : normalized.replace(/[^A-Z]/g, "");

                  setGuess(filtered);
                }}
                keyboardType={gameMode === "number" ? "number-pad" : "default"}
                maxLength={gameMode === "word" ? wordLength : digitCount}
                autoCapitalize={gameMode === "word" ? "characters" : "none"}
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: colors.primary },
                  (loading ||
                    guess.length !==
                      (gameMode === "word" ? wordLength : digitCount)) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleSubmitGuess}
                disabled={
                  loading ||
                  guess.length !==
                    (gameMode === "word" ? wordLength : digitCount)
                }
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.submitButtonText}>Guess</ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {gameStatus === "finished" && (
          <View style={styles.gameOverContainer}>
            <ThemedText style={styles.gameOverText}>
              {winner === username ? "You Won" : "You Lost"}
            </ThemedText>
            <ThemedText style={styles.winnerText}>Winner: {winner}</ThemedText>
            {winner === username && (
              <View style={styles.rewardBanner}>
                <ThemedText style={styles.rewardText}>
                  +{winner === username ? 100 : 25} coins earned!
                </ThemedText>
              </View>
            )}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/(tabs)/explore")}
            >
              <ThemedText style={styles.buttonText}>
                View Leaderboard
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.buttonSecondary },
              ]}
              onPress={() => router.push("/")}
            >
              <ThemedText style={[styles.buttonText, { color: colors.text }]}>
                New Game
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View
        style={[
          styles.legend,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendCircle,
              { backgroundColor: colors.correctPosition },
            ]}
          />
          <ThemedText style={styles.legendText}>Correct</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendCircle,
              { backgroundColor: colors.wrongPosition },
            ]}
          />
          <ThemedText style={styles.legendText}>Wrong Position</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendCircle,
              { backgroundColor: colors.notInNumber },
            ]}
          />
          <ThemedText style={styles.legendText}>Not in Number</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameStartedBanner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    zIndex: 1000,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameStartedText: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: "bold",
    marginBottom: Spacing.md,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  waitingHeader: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  statusPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(99, 102, 241, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.35)",
  },
  statusPillText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  waitingSubtitle: {
    fontSize: FontSizes.md,
    opacity: 0.7,
    textAlign: "center",
  },
  waitingText: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    textAlign: "center",
  },
  roomCodeDisplay: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    alignItems: "center",
    marginVertical: Spacing.md,
    width: "100%",
  },
  roomCodeLabel: {
    fontSize: FontSizes.sm,
    opacity: 0.7,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  roomCodeText: {
    fontSize: FontSizes.xxxl,
    fontWeight: "bold",
    letterSpacing: 4,
  },
  shareText: {
    fontSize: FontSizes.md,
    opacity: 0.7,
    textAlign: "center",
  },
  infoTextSmall: {
    fontSize: FontSizes.sm,
    opacity: 0.6,
    marginTop: Spacing.sm,
  },
  instructionsBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginVertical: Spacing.md,
    width: "100%",
  },
  instructionTitle: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  instructionText: {
    fontSize: FontSizes.sm,
    opacity: 0.8,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  header: {
    padding: Spacing.md,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    gap: Spacing.xs,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  playerName: {
    fontSize: FontSizes.md,
    fontWeight: "600",
  },
  vsText: {
    fontSize: FontSizes.sm,
    fontWeight: "bold",
    opacity: 0.5,
  },
  timerContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginBottom: Spacing.xs,
  },
  timerText: {
    fontSize: FontSizes.lg,
    fontWeight: "bold",
  },
  roomCodePill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(99, 102, 241, 0.12)",
  },
  roomCodeSmall: {
    fontSize: FontSizes.xs,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  modeText: {
    fontSize: FontSizes.xs,
    opacity: 0.6,
  },
  gameArea: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  historyContainer: {
    flex: 1,
    flexDirection: "row",
    gap: Spacing.sm,
  },
  historySection: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  historyTitle: {
    fontSize: FontSizes.sm,
    fontWeight: "bold",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  historyScroll: {
    flex: 1,
  },
  historyContent: {
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.xs,
    opacity: 0.5,
    textAlign: "center",
    marginTop: Spacing.md,
  },
  guessEntry: {
    marginBottom: Spacing.sm,
  },
  feedbackRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  feedbackCircle: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackDigit: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: "#fff",
  },
  correctLabel: {
    fontSize: FontSizes.xs,
    textAlign: "center",
    marginTop: Spacing.xs,
    color: "#10b981",
    fontWeight: "600",
  },
  inputArea: {
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  inputRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    textAlign: "center",
  },
  submitButton: {
    width: 80,
    height: 50,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  gameOverContainer: {
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.md,
  },
  gameOverText: {
    fontSize: FontSizes.xxxl,
    fontWeight: "bold",
    textAlign: "center",
  },
  winnerText: {
    fontSize: FontSizes.lg,
    opacity: 0.7,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: "#fff",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  waitingActions: {
    width: "100%",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  legendText: {
    fontSize: FontSizes.xs,
  },
  rewardBanner: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.4)",
    marginVertical: Spacing.sm,
  },
  rewardText: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: "#f59e0b",
  },
});
