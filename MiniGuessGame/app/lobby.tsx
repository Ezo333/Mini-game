import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius, FontSizes } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function LobbyScreen() {
  const [mode, setMode] = useState<"select" | "create" | "join">("select");
  const [gameMode, setGameMode] = useState<"number" | "word">("number");
  const [language, setLanguage] = useState<"EN" | "MN">("EN");
  const [roomCode, setRoomCode] = useState("");
  const [secretNumber, setSecretNumber] = useState("");
  const [secretWord, setSecretWord] = useState("");
  const [digitCount, setDigitCount] = useState(4);
  const [wordLength, setWordLength] = useState(5);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [entryFee, setEntryFee] = useState(0);
  const [userProfile, setUserProfile] = useState<any>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const username = (params.username as string) || "Guest";
  const colorScheme = useColorScheme();
  const colors = Colors[(colorScheme ?? "light") as keyof typeof Colors];

  const API_BASE_URL =
    "https://mini-guess-game-iqveh3itl-ezo333s-projects.vercel.app/api";

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
        await fetchUserProfile(); // Refresh profile
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

  const generateRandomSecret = () => {
    if (gameMode !== "number") return;
    let secret = "";
    for (let i = 0; i < digitCount; i++) {
      secret += Math.floor(Math.random() * 10);
    }
    setSecretNumber(secret);
  };

  const sanitizeWord = (text: string) => {
    const trimmed = text.replace(/\s+/g, "").toUpperCase();
    if (language === "EN") {
      return trimmed.replace(/[^A-Z]/g, "");
    }
    return trimmed.replace(/[^А-ЯЁӨҮ]/g, "");
  };

  const isValidWord = (text: string, length: number) => {
    if (text.length !== length) return false;
    if (language === "EN") return /^[A-Z]+$/.test(text);
    return /^[А-ЯЁӨҮ]+$/.test(text);
  };

  const getSecretValue = () =>
    gameMode === "number" ? secretNumber : secretWord;

  const getExpectedLength = () =>
    gameMode === "number" ? digitCount : wordLength;

  const handleCreateRoom = async () => {
    const expectedLength = getExpectedLength();
    const secretValue = getSecretValue();

    if (!secretValue || secretValue.length !== expectedLength) {
      return Alert.alert(
        "Error",
        `Please enter a ${expectedLength}-character secret`,
      );
    }

    if (gameMode === "word" && !isValidWord(secretValue, expectedLength)) {
      return Alert.alert(
        "Error",
        language === "EN"
          ? "Please use English letters only"
          : "Please use Mongolian Cyrillic letters only",
      );
    }

    // Check if user has enough coins for entry fee
    if (entryFee > 0) {
      if (!userProfile || userProfile.coins < entryFee) {
        return Alert.alert(
          "Insufficient Coins",
          `You need ${entryFee} coins to create this room. You have ${userProfile?.coins || 0} coins.`,
        );
      }

      // Spend coins
      const success = await spendCoins(entryFee, "room_entry");
      if (!success) return;
    }

    setLoading(true);
    setSuccessMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}/createRoom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          mode: gameMode,
          language: gameMode === "word" ? language : null,
          digitCount: gameMode === "number" ? digitCount : null,
          wordLength: gameMode === "word" ? wordLength : null,
          secretNumber: gameMode === "number" ? secretNumber : null,
          secretWord: gameMode === "word" ? secretWord : null,
        }),
      });

      const data = await response.json();

      console.log("Create room response:", data);

      if (data.success) {
        const roomCode = data.data.roomCode;
        console.log("Room created successfully! Code:", roomCode);

        // Copy code to clipboard automatically
        try {
          await Clipboard.setStringAsync(roomCode);
          console.log("Code copied to clipboard:", roomCode);
        } catch (clipboardError) {
          console.error("Failed to copy to clipboard:", clipboardError);
        }

        // Show success message
        setSuccessMessage(
          `Room created. Code: ${roomCode} (copied to clipboard)`,
        );
        setLoading(false);

        // Navigate after a short delay to show success
        setTimeout(() => {
          console.log("Navigating to game with code:", roomCode);
          router.push({
            pathname: "/game",
            params: {
              username,
              roomCode: roomCode,
              playerNumber: "1",
              secretNumber,
            },
          });
        }, 1500);
      } else {
        console.error("Failed to create room:", data);
        setLoading(false);
        Alert.alert("Error", data.error || "Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      setLoading(false);
      Alert.alert("Error", `Failed to create room: ${error.message}`);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode || roomCode.length < 6) {
      Alert.alert("Error", "Please enter a valid room code");
      return;
    }

    const expectedLength = getExpectedLength();
    const secretValue = getSecretValue();

    if (!secretValue || secretValue.length !== expectedLength) {
      return Alert.alert(
        "Error",
        `Please enter a ${expectedLength}-character secret`,
      );
    }

    if (gameMode === "word" && !isValidWord(secretValue, expectedLength)) {
      return Alert.alert(
        "Error",
        language === "EN"
          ? "Please use English letters only"
          : "Please use Mongolian Cyrillic letters only",
      );
    }

    // Check if user has enough coins for entry fee
    if (entryFee > 0) {
      if (!userProfile || userProfile.coins < entryFee) {
        return Alert.alert(
          "Insufficient Coins",
          `You need ${entryFee} coins to join this room. You have ${userProfile?.coins || 0} coins.`,
        );
      }

      // Spend coins
      const success = await spendCoins(entryFee, "room_entry");
      if (!success) return;
    }

    setLoading(true);
    setSuccessMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}/joinRoom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode: roomCode.toUpperCase(),
          username,
          mode: gameMode,
          language: gameMode === "word" ? language : null,
          digitCount: gameMode === "number" ? digitCount : null,
          wordLength: gameMode === "word" ? wordLength : null,
          secretNumber: gameMode === "number" ? secretNumber : null,
          secretWord: gameMode === "word" ? secretWord : null,
        }),
      });

      const data = await response.json();

      console.log("Join room response:", data);

      if (data.success) {
        console.log("Joined room successfully!");

        // Show success message
        setSuccessMessage(
          `Joined room ${data.data.roomCode}. Starting game...`,
        );
        setLoading(false);

        // Navigate after a short delay to show success
        setTimeout(() => {
          router.push({
            pathname: "/game",
            params: {
              username,
              roomCode: data.data.roomCode,
              playerNumber: "2",
              secretNumber,
            },
          });
        }, 1500);
      } else {
        setLoading(false);
        Alert.alert("Error", data.error || "Failed to join room");
      }
    } catch (error) {
      console.error("Error joining room:", error);
      setLoading(false);
      Alert.alert("Error", "Failed to join room. Please try again.");
    }
  };

  if (mode === "select") {
    return (
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.headerPill}>
              <ThemedText style={styles.headerPillText}>Multiplayer</ThemedText>
            </View>
            <ThemedText style={styles.title}>Multiplayer Lobby</ThemedText>
            <ThemedText style={styles.subtitle}>
              Welcome, {username}!
            </ThemedText>
            {userProfile && (
              <View style={styles.coinDisplay}>
                <ThemedText style={styles.coinText}>
                  {userProfile.coins} Coins
                </ThemedText>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => setMode("create")}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>Create Room</ThemedText>
              <ThemedText style={styles.buttonSubtext}>
                Start a new game
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                { backgroundColor: colors.secondary },
              ]}
              onPress={() => setMode("join")}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>Join Room</ThemedText>
              <ThemedText style={styles.buttonSubtext}>
                Enter a room code
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <ThemedText style={styles.infoTitle}>How it works</ThemedText>
            <ThemedText style={styles.infoText}>
              1. Player 1 creates a room and gets a code
            </ThemedText>
            <ThemedText style={styles.infoText}>
              2. Player 2 joins using the code
            </ThemedText>
            <ThemedText style={styles.infoText}>
              3. Both players set their secret numbers
            </ThemedText>
            <ThemedText style={styles.infoText}>
              4. First to guess correctly wins
            </ThemedText>
            <ThemedText style={styles.infoText}>
              5. Set entry fee to make it competitive (winner gets 2x)
            </ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  if (mode === "create") {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ThemedView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View style={styles.headerPill}>
                <ThemedText style={styles.headerPillText}>
                  Create Room
                </ThemedText>
              </View>
              <ThemedText style={styles.title}>Create Room</ThemedText>
              <ThemedText style={styles.subtitle}>
                Set your secret number
              </ThemedText>
            </View>

            <View
              style={[
                styles.formContainer,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <View style={styles.digitSelector}>
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
                      onPress={() => {
                        setGameMode(item.key);
                        setSecretNumber("");
                        setSecretWord("");
                      }}
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
                <View style={styles.digitSelector}>
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
                        onPress={() => {
                          setLanguage(item.key);
                          setSecretWord("");
                        }}
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
                <View style={styles.digitSelector}>
                  <ThemedText style={styles.label}>
                    Number of Digits:
                  </ThemedText>
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
                        onPress={() => {
                          setDigitCount(count);
                          setSecretNumber("");
                        }}
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
                <View style={styles.digitSelector}>
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
                        onPress={() => {
                          setWordLength(count);
                          setSecretWord("");
                        }}
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
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>
                Your Secret {gameMode === "number" ? "Number" : "Word"} (
                {getExpectedLength()}{" "}
                {gameMode === "number" ? "digits" : "letters"}):
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.input,
                    borderColor: colors.inputBorder,
                    color: colors.text,
                  },
                ]}
                placeholder={
                  gameMode === "number"
                    ? `Enter ${getExpectedLength()} digits...`
                    : `Enter ${getExpectedLength()} letters...`
                }
                placeholderTextColor={colors.icon}
                value={gameMode === "number" ? secretNumber : secretWord}
                onChangeText={(text) =>
                  gameMode === "number"
                    ? setSecretNumber(text.replace(/[^0-9]/g, ""))
                    : setSecretWord(sanitizeWord(text))
                }
                maxLength={getExpectedLength()}
                keyboardType={gameMode === "number" ? "number-pad" : "default"}
                autoCapitalize={gameMode === "number" ? "none" : "characters"}
                autoCorrect={false}
                secureTextEntry
              />
              {gameMode === "number" && (
                <TouchableOpacity
                  style={[
                    styles.randomButton,
                    { backgroundColor: colors.buttonSecondary },
                  ]}
                  onPress={generateRandomSecret}
                >
                  <ThemedText style={styles.randomButtonText}>
                    Generate Random
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.entryFeeContainer}>
              <ThemedText style={styles.label}>
                Entry Fee (Optional):
              </ThemedText>
              <View style={styles.feeButtons}>
                {[0, 10, 50, 100].map((fee) => (
                  <TouchableOpacity
                    key={fee}
                    style={[
                      styles.feeButton,
                      entryFee === fee && {
                        backgroundColor: colors.primary,
                      },
                    ]}
                    onPress={() => setEntryFee(fee)}
                  >
                    <ThemedText
                      style={[
                        styles.feeButtonText,
                        entryFee === fee && { color: "#fff" },
                      ]}
                    >
                      {fee === 0 ? "Free" : `${fee}`}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
              {entryFee > 0 && (
                <ThemedText style={styles.feeNote}>
                  Winner gets {entryFee * 2} coins + match rewards
                </ThemedText>
              )}
            </View>

            {successMessage ? (
              <View
                style={[
                  styles.successBox,
                  { backgroundColor: "rgba(34, 197, 94, 0.15)" },
                ]}
              >
                <ThemedText style={styles.successText}>
                  {successMessage}
                </ThemedText>
              </View>
            ) : null}

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.cancelButton,
                  { backgroundColor: colors.buttonSecondary },
                ]}
                onPress={() => setMode("select")}
                disabled={loading}
              >
                <ThemedText
                  style={[styles.actionButtonText, { color: colors.text }]}
                >
                  Back
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.confirmButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleCreateRoom}
                disabled={
                  loading || getSecretValue().length !== getExpectedLength()
                }
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.actionButtonText}>
                    Create Room
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>
    );
  }

  if (mode === "join") {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ThemedView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View style={styles.headerPill}>
                <ThemedText style={styles.headerPillText}>Join Room</ThemedText>
              </View>
              <ThemedText style={styles.title}>Join Room</ThemedText>
              <ThemedText style={styles.subtitle}>
                Enter your friend's code
              </ThemedText>
            </View>

            <View
              style={[
                styles.formContainer,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Room Code:</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    styles.roomCodeInput,
                    {
                      backgroundColor: colors.input,
                      borderColor: colors.inputBorder,
                      color: colors.text,
                    },
                  ]}
                  placeholder="ABCD1234"
                  placeholderTextColor={colors.icon}
                  value={roomCode}
                  onChangeText={(text) =>
                    setRoomCode(text.toUpperCase().replace(/[^A-Z0-9]/g, ""))
                  }
                  maxLength={8}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>
                  Your Secret Number ({digitCount} digits):
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.input,
                      borderColor: colors.inputBorder,
                      color: colors.text,
                    },
                  ]}
                  placeholder={`Enter ${digitCount} digits...`}
                  placeholderTextColor={colors.icon}
                  value={secretNumber}
                  onChangeText={(text) =>
                    setSecretNumber(text.replace(/[^0-9]/g, ""))
                  }
                  maxLength={digitCount}
                  keyboardType="number-pad"
                  secureTextEntry
                />
                <TouchableOpacity
                  style={[
                    styles.randomButton,
                    { backgroundColor: colors.buttonSecondary },
                  ]}
                  onPress={generateRandomSecret}
                >
                  <ThemedText style={styles.randomButtonText}>
                    Generate Random
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {successMessage ? (
                <View
                  style={[
                    styles.successBox,
                    { backgroundColor: "rgba(34, 197, 94, 0.15)" },
                  ]}
                >
                  <ThemedText style={styles.successText}>
                    {successMessage}
                  </ThemedText>
                </View>
              ) : null}

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.cancelButton,
                    { backgroundColor: colors.buttonSecondary },
                  ]}
                  onPress={() => setMode("select")}
                  disabled={loading}
                >
                  <ThemedText
                    style={[styles.actionButtonText, { color: colors.text }]}
                  >
                    Back
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.confirmButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleJoinRoom}
                  disabled={
                    loading ||
                    roomCode.length < 6 ||
                    getSecretValue().length !== getExpectedLength()
                  }
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ThemedText style={styles.actionButtonText}>
                      Join Room
                    </ThemedText>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>
    );
  }

  return null;
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
    backgroundColor: "rgba(99, 102, 241, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.35)",
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
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSizes.md,
    opacity: 0.7,
    textAlign: "center",
  },
  buttonContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  button: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButton: {},
  secondaryButton: {},
  buttonText: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: Spacing.xs,
  },
  buttonSubtext: {
    fontSize: FontSizes.sm,
    color: "rgba(255,255,255,0.8)",
  },
  infoBox: {
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
    lineHeight: 20,
  },
  formContainer: {
    gap: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
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
  entryFeeContainer: {
    marginTop: Spacing.md,
  },
  feeButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  feeButton: {
    minWidth: 70,
    height: 44,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(99, 102, 241, 0.08)",
  },
  feeButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },
  feeNote: {
    fontSize: FontSizes.xs,
    opacity: 0.7,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  digitSelector: {
    marginBottom: Spacing.md,
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
  inputContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    textAlign: "center",
  },
  roomCodeInput: {
    letterSpacing: 4,
  },
  randomButton: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  randomButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },
  successBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.md,
    borderWidth: 2,
    borderColor: "rgba(34, 197, 94, 0.4)",
  },
  successText: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: "rgba(34, 197, 94, 1)",
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  confirmButton: {},
  actionButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: "#fff",
  },
});
