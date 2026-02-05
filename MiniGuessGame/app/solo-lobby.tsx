import React, { useState } from "react";
import {
  StyleSheet,
  View,
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

export default function SoloLobbyScreen() {
  const [gameMode, setGameMode] = useState<"number" | "word">("number");
  const [language, setLanguage] = useState<"EN" | "MN">("EN");
  const [digitCount, setDigitCount] = useState(4);
  const [wordLength, setWordLength] = useState(5);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const router = useRouter();
  const params = useLocalSearchParams();
  const username = (params.username as string) || "Guest";
  const colorScheme = useColorScheme();
  const colors = Colors[(colorScheme ?? "light") as keyof typeof Colors];

  // Entry fees for solo mode
  const soloEntryFees = {
    easy: 5,
    medium: 10,
    hard: 15,
  };

  React.useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/getUserProfile?username=${encodeURIComponent(username)}`,
      );
      const data = await response.json();
      if (data.success) {
        setUserProfile(data.data);
      } else {
        // User not found - show default new user state
        setUserProfile({
          username,
          elo: 1500,
          wins: 0,
          losses: 0,
          gamesPlayed: 0,
          coins: 500,
          soloGamesPlayed: 0,
          soloWins: 0,
          isNewUser: true,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // On error, show default new user state
      setUserProfile({
        username,
        elo: 1500,
        wins: 0,
        losses: 0,
        gamesPlayed: 0,
        coins: 500,
        soloGamesPlayed: 0,
        soloWins: 0,
        isNewUser: true,
      });
    }
  };

  const spendCoins = async (amount: number, reason: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/spendCoins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          amount,
          reason,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchUserProfile();
        return true;
      } else {
        Alert.alert("Error", data.error || data.message);
        return false;
      }
    } catch (error) {
      console.error("Error spending coins:", error);
      Alert.alert("Error", "Failed to process coin payment");
      return false;
    }
  };

  const handleStartSoloGame = async () => {
    const entryFee = soloEntryFees[difficulty];

    // Check if user has enough coins
    if (!userProfile || userProfile.coins < entryFee) {
      Alert.alert(
        "Insufficient Coins",
        `You need ${entryFee} coins to play ${difficulty} mode. You have ${userProfile?.coins || 0} coins.\n\nPlay easier difficulty or earn more coins in multiplayer!`,
      );
      return;
    }

    // Spend coins for entry
    const success = await spendCoins(entryFee, `solo_${difficulty}_entry`);
    if (!success) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/createSoloGame`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          mode: gameMode,
          language: gameMode === "word" ? language : null,
          digitCount: gameMode === "number" ? digitCount : null,
          wordLength: gameMode === "word" ? wordLength : null,
          difficulty,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push({
          pathname: "/solo-game",
          params: {
            username,
            gameId: data.data.gameId,
            mode: gameMode,
            language: gameMode === "word" ? language : "EN",
            digitCount: gameMode === "number" ? digitCount.toString() : "4",
            wordLength: gameMode === "word" ? wordLength.toString() : "5",
            difficulty,
            timeLimit: data.data.timeLimit.toString(),
          },
        });
      } else {
        let errorMessage = data.error || "Failed to create solo game";
        if (data.message) {
          errorMessage += `\n\n${data.message}`;
        }
        if (data.message && data.message.includes("Firebase security rules")) {
          errorMessage +=
            "\n\nPlease update Firestore security rules in Firebase Console.";
        }
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Error creating solo game:", error);
      Alert.alert("Error", "Failed to create solo game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return colors.success;
      case "hard":
        return colors.danger;
      default:
        return colors.primary;
    }
  };

  const getDifficultyReward = (diff: string) => {
    switch (diff) {
      case "easy":
        return "30-50";
      case "medium":
        return "50-80";
      case "hard":
        return "80-110";
      default:
        return "50-80";
    }
  };

  const currentEntryFee = soloEntryFees[difficulty];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerPill}>
            <ThemedText style={styles.headerPillText}>Solo Mode</ThemedText>
          </View>
          <ThemedText style={styles.title}>Practice Mode</ThemedText>
          <ThemedText style={styles.subtitle}>
            Play against AI and earn coins!
          </ThemedText>
          {userProfile && (
            <View style={styles.coinDisplay}>
              <ThemedText style={styles.coinText}>
                {userProfile.coins} Coins
              </ThemedText>
            </View>
          )}
        </View>

        <View
          style={[
            styles.formContainer,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <View style={styles.section}>
            <ThemedText style={styles.label}>Game Type:</ThemedText>
            <View style={styles.modeButtons}>
              {(
                [
                  { key: "number", label: "Number" },
                  { key: "word", label: "Word" },
                ] as const
              ).map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.modeButton,
                    gameMode === item.key && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                  onPress={() => setGameMode(item.key)}
                >
                  <ThemedText
                    style={[
                      styles.modeButtonText,
                      gameMode === item.key && { color: "#fff" },
                    ]}
                  >
                    {item.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {gameMode === "word" && (
            <View style={styles.section}>
              <ThemedText style={styles.label}>Language:</ThemedText>
              <View style={styles.modeButtons}>
                {(
                  [
                    { key: "EN", label: "English" },
                    { key: "MN", label: "Mongolian" },
                  ] as const
                ).map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.modeButton,
                      language === item.key && {
                        backgroundColor: colors.primary,
                      },
                    ]}
                    onPress={() => setLanguage(item.key)}
                  >
                    <ThemedText
                      style={[
                        styles.modeButtonText,
                        language === item.key && { color: "#fff" },
                      ]}
                    >
                      {item.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {gameMode === "number" ? (
            <View style={styles.section}>
              <ThemedText style={styles.label}>Number of Digits:</ThemedText>
              <View style={styles.digitButtons}>
                {[3, 4, 5].map((count) => (
                  <TouchableOpacity
                    key={count}
                    style={[
                      styles.digitButton,
                      digitCount === count && {
                        backgroundColor: colors.primary,
                      },
                    ]}
                    onPress={() => setDigitCount(count)}
                  >
                    <ThemedText
                      style={[
                        styles.digitButtonText,
                        digitCount === count && { color: "#fff" },
                      ]}
                    >
                      {count}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <ThemedText style={styles.label}>Word Length:</ThemedText>
              <View style={styles.digitButtons}>
                {[4, 5, 6].map((count) => (
                  <TouchableOpacity
                    key={count}
                    style={[
                      styles.digitButton,
                      wordLength === count && {
                        backgroundColor: colors.primary,
                      },
                    ]}
                    onPress={() => setWordLength(count)}
                  >
                    <ThemedText
                      style={[
                        styles.digitButtonText,
                        wordLength === count && { color: "#fff" },
                      ]}
                    >
                      {count}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <ThemedText style={styles.label}>Difficulty:</ThemedText>
            <View style={styles.difficultyButtons}>
              {(
                [
                  { key: "easy", label: "Easy", time: "120s" },
                  { key: "medium", label: "Medium", time: "60s" },
                  { key: "hard", label: "Hard", time: "30s" },
                ] as const
              ).map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.difficultyButton,
                    difficulty === item.key && {
                      backgroundColor: getDifficultyColor(item.key),
                      borderColor: getDifficultyColor(item.key),
                    },
                  ]}
                  onPress={() => setDifficulty(item.key)}
                >
                  <ThemedText
                    style={[
                      styles.difficultyButtonLabel,
                      difficulty === item.key && { color: "#fff" },
                    ]}
                  >
                    {item.label}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.difficultyButtonTime,
                      difficulty === item.key && { color: "#fff" },
                    ]}
                  >
                    {item.time}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.difficultyButtonReward,
                      difficulty === item.key && { color: "#fff" },
                    ]}
                  >
                    {getDifficultyReward(item.key)} coins
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.difficultyButtonFee,
                      difficulty === item.key && { color: "#fff" },
                    ]}
                  >
                    Entry: {soloEntryFees[item.key]} coins
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.startButton,
              { backgroundColor: colors.primary },
              (loading ||
                !userProfile ||
                userProfile.coins < currentEntryFee) &&
                styles.buttonDisabled,
            ]}
            onPress={handleStartSoloGame}
            disabled={
              loading || !userProfile || userProfile.coins < currentEntryFee
            }
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <ThemedText style={styles.startButtonText}>
                  Start Solo Game
                </ThemedText>
                <ThemedText style={styles.startButtonSubtext}>
                  Pay {currentEntryFee} coins to play
                </ThemedText>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <ThemedText style={styles.infoTitle}>Solo Mode Info</ThemedText>
          <ThemedText style={styles.infoText}>
            - Entry fees: Easy 5 coins, Medium 10 coins, Hard 15 coins
          </ThemedText>
          <ThemedText style={styles.infoText}>
            - Win to earn 30-110 coins (profit possible!)
          </ThemedText>
          <ThemedText style={styles.infoText}>
            - Lose and earn 10 coins (you lose entry fee)
          </ThemedText>
          <ThemedText style={styles.infoText}>
            - Faster completion = bonus coins
          </ThemedText>
          <ThemedText style={styles.infoText}>
            - Fewer guesses = bonus coins
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: colors.buttonSecondary },
          ]}
          onPress={() => router.back()}
        >
          <ThemedText style={[styles.backButtonText, { color: colors.text }]}>
            Back to Home
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  headerPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(139, 92, 246, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.35)",
  },
  headerPillText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  coinDisplay: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.4)",
  },
  coinText: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: "#f59e0b",
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: "bold",
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSizes.md,
    opacity: 0.7,
    textAlign: "center",
  },
  formContainer: {
    gap: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  section: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: "600",
  },
  modeButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "center",
  },
  modeButton: {
    minWidth: 120,
    height: 44,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(99, 102, 241, 0.08)",
  },
  modeButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },
  digitButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "center",
  },
  digitButton: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: "rgba(99, 102, 241, 0.3)",
    backgroundColor: "rgba(99, 102, 241, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  digitButtonText: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
  },
  difficultyButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "center",
  },
  difficultyButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: "rgba(99, 102, 241, 0.3)",
    backgroundColor: "rgba(99, 102, 241, 0.08)",
    alignItems: "center",
    gap: Spacing.xs,
  },
  difficultyButtonLabel: {
    fontSize: FontSizes.md,
    fontWeight: "700",
  },
  difficultyButtonTime: {
    fontSize: FontSizes.xs,
    opacity: 0.8,
  },
  difficultyButtonReward: {
    fontSize: FontSizes.xs,
    fontWeight: "600",
  },
  difficultyButtonFee: {
    fontSize: FontSizes.xs,
    opacity: 0.9,
    fontWeight: "700",
    marginTop: Spacing.xs,
  },
  startButton: {
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  startButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: "#fff",
  },
  startButtonSubtext: {
    fontSize: FontSizes.xs,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: Spacing.xs,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  infoBox: {
    backgroundColor: "rgba(139, 92, 246, 0.08)",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.2)",
    marginTop: Spacing.lg,
  },
  infoTitle: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: FontSizes.sm,
    opacity: 0.8,
    marginBottom: Spacing.xs,
  },
  backButton: {
    height: 50,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  backButtonText: {
    fontSize: FontSizes.md,
    fontWeight: "600",
  },
});
