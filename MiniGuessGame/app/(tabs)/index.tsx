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
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[(colorScheme ?? "light") as keyof typeof Colors];

  const handleStartGame = () => {
    if (username.trim().length < 2) {
      alert("Please enter a username (at least 2 characters)");
      return;
    }
    // Navigate to game screen with username
    // TODO: Create game screen
    alert(`Game starting for ${username.trim()}! (Game screen coming soon)`);
    // router.push({
    //   pathname: "/game",
    //   params: { username: username.trim() },
    // });
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
            <ThemedText style={styles.title}>🎮 Guess Game</ThemedText>
            <ThemedText style={styles.subtitle}>
              1v1 Number Guessing Challenge
            </ThemedText>
          </View>

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
              onChangeText={setUsername}
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
              <ThemedText style={styles.buttonText}>🚀 Start Game</ThemedText>
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
                🏆 View Leaderboard
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Game Info */}
          <View style={styles.infoContainer}>
            <ThemedText style={styles.infoTitle}>How to Play:</ThemedText>
            <ThemedText style={styles.infoText}>
              • Guess your opponent's secret number
            </ThemedText>
            <ThemedText style={styles.infoText}>
              • 60 seconds per round
            </ThemedText>
            <ThemedText style={styles.infoText}>
              • 🟢 = correct position | 🟡 = wrong position | 🔴 = not in number
            </ThemedText>
            <ThemedText style={styles.infoText}>
              • Special emojis for 6 (🔄) and 9 (🔁)
            </ThemedText>
            <ThemedText style={styles.infoText}>
              • Win to increase your Elo score!
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
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: "bold",
    marginBottom: Spacing.sm,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  buttonText: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: "#ffffff",
  },
  infoContainer: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
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
});
