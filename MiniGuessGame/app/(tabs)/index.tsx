import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius, FontSizes } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function HomeScreen() {
  const [username, setUsername] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[(colorScheme ?? "light") as keyof typeof Colors];

  const API_BASE_URL =
    "https://mini-guess-game-iqveh3itl-ezo333s-projects.vercel.app/api";

  const fetchUserProfile = async (user: string) => {
    if (!user || user.length < 2) {
      setUserProfile(null);
      return;
    }
    try {
      setLoadingProfile(true);
      const response = await fetch(
        `${API_BASE_URL}/getUserProfile?username=${encodeURIComponent(user)}`,
      );
      const data = await response.json();
      if (data.success) {
        setUserProfile(data.data);
      } else {
        // User not found - show default new user state
        setUserProfile({
          username: user,
          elo: 1500,
          wins: 0,
          losses: 0,
          gamesPlayed: 0,
          coins: 500,
          isNewUser: true,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // On error, show default new user state
      setUserProfile({
        username: user,
        elo: 1500,
        wins: 0,
        losses: 0,
        gamesPlayed: 0,
        coins: 500,
        isNewUser: true,
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleStartGame = () => {
    if (username.trim().length < 2) {
      alert("Please enter a username (at least 2 characters)");
      return;
    }
    // Navigate to lobby screen with username
    router.push({
      pathname: "/lobby",
      params: { username: username.trim() },
    });
  };

  const handleViewLeaderboard = () => {
    // Navigate to explore tab (leaderboard)
    router.push("/(tabs)/explore");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.pill}>
              <ThemedText style={styles.pillText}>1v1 Live</ThemedText>
            </View>
            <ThemedText style={styles.title}>Guess Duel</ThemedText>
            <ThemedText style={styles.subtitle}>
              Fast, competitive number guessing
            </ThemedText>
          </View>

          {/* User Profile Stats */}
          {userProfile && (
            <View
              style={[
                styles.profileCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <View style={styles.profileRow}>
                <View style={styles.profileStat}>
                  <ThemedText style={styles.profileStatLabel}>Coins</ThemedText>
                  <ThemedText style={styles.profileStatValue}>
                    {userProfile.coins}
                  </ThemedText>
                </View>
                <View style={styles.profileStat}>
                  <ThemedText style={styles.profileStatLabel}>Elo</ThemedText>
                  <ThemedText style={styles.profileStatValue}>
                    {userProfile.elo}
                  </ThemedText>
                </View>
                <View style={styles.profileStat}>
                  <ThemedText style={styles.profileStatLabel}>W/L</ThemedText>
                  <ThemedText style={styles.profileStatValue}>
                    {userProfile.wins}/{userProfile.losses}
                  </ThemedText>
                </View>
              </View>
            </View>
          )}

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Enter Your Username</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                },
              ]}
              placeholder="Your username..."
              placeholderTextColor={colors.icon}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (text.length >= 2) {
                  fetchUserProfile(text.trim());
                }
              }}
              maxLength={20}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleStartGame}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>Multiplayer</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.soloButton,
                { backgroundColor: colors.secondary },
              ]}
              onPress={() => {
                if (username.trim().length < 2) {
                  alert("Please enter a username (at least 2 characters)");
                  return;
                }
                router.push({
                  pathname: "/solo-lobby",
                  params: { username: username.trim() },
                });
              }}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>Solo Mode</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                { backgroundColor: colors.buttonSecondary },
              ]}
              onPress={handleViewLeaderboard}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.buttonText, { color: colors.text }]}>
                View Leaderboard
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Game Info */}
          <View style={styles.infoContainer}>
            <ThemedText style={styles.infoTitle}>How to Play</ThemedText>
            <ThemedText style={styles.infoText}>
              - Guess your opponent's secret number
            </ThemedText>
            <ThemedText style={styles.infoText}>
              - 60 seconds per round
            </ThemedText>
            <ThemedText style={styles.infoText}>
              - Green = correct position, Yellow = wrong position, Red = not in
              number
            </ThemedText>
            <ThemedText style={styles.infoText}>
              - Win: +100 coins, Loss: +25 coins
            </ThemedText>
            <ThemedText style={styles.infoText}>
              - Solo mode: +30-80 coins (less than multiplayer)
            </ThemedText>
            <ThemedText style={styles.infoText}>
              - Solo entry fees: Easy 5, Medium 10, Hard 15 coins
            </ThemedText>
            <ThemedText style={styles.infoText}>
              - New players get 500 coins to start
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(99, 102, 241, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.35)",
  },
  pillText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
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
  inputContainer: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.lg,
  },
  buttonContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  button: {
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  soloButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  buttonText: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: "#ffffff",
  },
  infoContainer: {
    backgroundColor: "rgba(99, 102, 241, 0.08)",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
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
  profileCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  profileStat: {
    alignItems: "center",
  },
  profileStatLabel: {
    fontSize: FontSizes.xs,
    opacity: 0.7,
    marginBottom: Spacing.xs,
  },
  profileStatValue: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
  },
});
