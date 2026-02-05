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
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius, FontSizes } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const API_BASE_URL =
  "https://mini-guess-game-iqveh3itl-ezo333s-projects.vercel.app/api";

interface GuessEntry {
  guess: string;
  feedback: string[];
  isCorrect: boolean;
  timestamp: string;
}

export default function SoloGameScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[(colorScheme ?? "light") as keyof typeof Colors];

  const username = (params.username as string) || "Guest";
  const gameId = (params.gameId as string) || "";
  const mode = (params.mode as string) || "number";
  const language = (params.language as string) || "EN";
  const digitCount = parseInt((params.digitCount as string) || "4");
  const wordLength = parseInt((params.wordLength as string) || "5");
  const difficulty = (params.difficulty as string) || "medium";
  const timeLimit = parseInt((params.timeLimit as string) || "60");

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<GuessEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState<"playing" | "finished">(
    "playing",
  );
  const [timer, setTimer] = useState(timeLimit);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [entryFee, setEntryFee] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Determine entry fee based on difficulty
    const fees = { easy: 5, medium: 10, hard: 15 };
    setEntryFee(fees[difficulty as keyof typeof fees] || 10);
  }, [difficulty]);

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

  const handleTimeUp = async () => {
    setGameStatus("finished");
    await completeGame(false);
    Alert.alert("Time's Up", "Better luck next time!");
  };

  const handleSubmitGuess = async () => {
    const expectedLength = mode === "word" ? wordLength : digitCount;

    if (guess.length !== expectedLength) {
      Alert.alert(
        "Error",
        mode === "word"
          ? `Please enter exactly ${expectedLength} letters`
          : `Please enter exactly ${expectedLength} digits`,
      );
      return;
    }

    if (mode === "number" && !/^\d+$/.test(guess)) {
      Alert.alert("Error", "Please enter only numbers");
      return;
    }

    if (mode === "word") {
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
      const response = await fetch(`${API_BASE_URL}/submitSoloGuess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          guess: mode === "word" ? guess.toUpperCase() : guess,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGuess("");
        setGuesses([...guesses, data.data]);

        if (data.data.isCorrect) {
          setGameStatus("finished");
          await completeGame(true);
          Alert.alert(
            "Victory!",
            `You guessed it in ${data.data.totalGuesses} tries!`,
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

  const completeGame = async (won: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/completeSoloGame`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          won,
          timeRemaining: timer,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCoinsEarned(data.data.coinReward);
      }
    } catch (error) {
      console.error("Error completing game:", error);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return colors.success;
      case "hard":
        return colors.danger;
      default:
        return colors.primary;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View
            style={[
              styles.difficultyPill,
              { backgroundColor: getDifficultyColor() },
            ]}
          >
            <ThemedText style={styles.difficultyText}>
              {difficulty.toUpperCase()}
            </ThemedText>
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
        </View>
        <ThemedText style={styles.modeText}>
          Solo Mode •{" "}
          {mode === "word"
            ? `${language} Word • ${wordLength}`
            : `Number • ${digitCount}`}
        </ThemedText>
        <ThemedText style={styles.entryFeeText}>
          Entry Fee Paid: {entryFee} coins
        </ThemedText>
        <ThemedText style={styles.guessCount}>
          Guesses: {guesses.length}
        </ThemedText>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.historySection}>
          <ThemedText style={styles.historyTitle}>Your Guesses</ThemedText>
          <ScrollView
            style={styles.historyScroll}
            contentContainerStyle={styles.historyContent}
          >
            {guesses.length === 0 ? (
              <ThemedText style={styles.emptyText}>
                No guesses yet. Start guessing!
              </ThemedText>
            ) : (
              guesses.map((entry, index) => (
                <View key={index} style={styles.guessEntry}>
                  <View style={styles.feedbackRow}>
                    {entry.guess.split("").map((char, i) => {
                      const bgColor = getFeedbackColor(entry.feedback[i]);
                      return (
                        <View
                          key={i}
                          style={[
                            styles.feedbackCircle,
                            { backgroundColor: bgColor },
                          ]}
                        >
                          <ThemedText style={styles.feedbackDigit}>
                            {char}
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

        {gameStatus === "playing" && (
          <View
            style={[
              styles.inputArea,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <ThemedText style={styles.inputLabel}>
              Enter your {mode === "word" ? "word" : "guess"} (
              {mode === "word" ? wordLength : digitCount}{" "}
              {mode === "word" ? "letters" : "digits"})
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
                placeholder={`${mode === "word" ? wordLength : digitCount} ${mode === "word" ? "letters" : "digits"}...`}
                placeholderTextColor={colors.icon}
                value={guess}
                onChangeText={(text) => {
                  if (mode === "number") {
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
                keyboardType={mode === "number" ? "number-pad" : "default"}
                maxLength={mode === "word" ? wordLength : digitCount}
                autoCapitalize={mode === "word" ? "characters" : "none"}
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: colors.primary },
                  (loading ||
                    guess.length !==
                      (mode === "word" ? wordLength : digitCount)) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleSubmitGuess}
                disabled={
                  loading ||
                  guess.length !== (mode === "word" ? wordLength : digitCount)
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
              {guesses[guesses.length - 1]?.isCorrect ? "You Won" : "Time's Up"}
            </ThemedText>
            {coinsEarned > 0 && (
              <View style={styles.rewardBanner}>
                <ThemedText style={styles.rewardText}>
                  +{coinsEarned} coins earned!
                </ThemedText>
              </View>
            )}
            {coinsEarned > entryFee ? (
              <ThemedText style={styles.profitText}>
                Profit: +{coinsEarned - entryFee} coins
              </ThemedText>
            ) : (
              <ThemedText style={styles.lossText}>
                Loss: -{entryFee - coinsEarned} coins
              </ThemedText>
            )}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/")}
            >
              <ThemedText style={styles.buttonText}>Play Again</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.buttonSecondary },
              ]}
              onPress={() => router.push("/(tabs)/explore")}
            >
              <ThemedText style={[styles.buttonText, { color: colors.text }]}>
                View Leaderboard
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
  header: {
    padding: Spacing.md,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    gap: Spacing.xs,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  difficultyPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  difficultyText: {
    fontSize: FontSizes.xs,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
  timerContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  timerText: {
    fontSize: FontSizes.lg,
    fontWeight: "bold",
  },
  modeText: {
    fontSize: FontSizes.xs,
    opacity: 0.6,
  },
  guessCount: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },
  entryFeeText: {
    fontSize: FontSizes.xs,
    opacity: 0.7,
  },
  gameArea: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.md,
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
  profitText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: "#10b981",
    marginTop: Spacing.xs,
  },
  lossText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: "#ef4444",
    marginTop: Spacing.xs,
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
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  legendCircle: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.full,
  },
  legendText: {
    fontSize: FontSizes.xs,
  },
});
