import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius, FontSizes } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface LeaderboardEntry {
  id: string;
  username: string;
  elo: number;
  wins: number;
  losses: number;
  gamesPlayed: number;
  coins: number;
  soloGamesPlayed?: number;
  soloWins?: number;
}

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[(colorScheme ?? "light") as keyof typeof Colors];

  const fetchLeaderboard = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get('/api/getLeaderboard');
      // setLeaderboard(response.data);

      // Mock data for now
      const mockData: LeaderboardEntry[] = [
        {
          id: "1",
          username: "Player1",
          elo: 1850,
          wins: 45,
          losses: 12,
          gamesPlayed: 57,
          coins: 1500,
        },
        {
          id: "2",
          username: "GuessGod",
          elo: 1720,
          wins: 38,
          losses: 15,
          gamesPlayed: 53,
          coins: 1200,
        },
        {
          id: "3",
          username: "NumberNinja",
          elo: 1680,
          wins: 32,
          losses: 18,
          gamesPlayed: 50,
          coins: 1100,
        },
        {
          id: "4",
          username: "CodeMaster",
          elo: 1620,
          wins: 28,
          losses: 22,
          gamesPlayed: 50,
          coins: 1000,
        },
        {
          id: "5",
          username: "ProGuesser",
          elo: 1580,
          wins: 25,
          losses: 20,
          gamesPlayed: 45,
          coins: 900,
        },
        {
          id: "6",
          username: "DigitKing",
          elo: 1520,
          wins: 22,
          losses: 25,
          gamesPlayed: 47,
          coins: 800,
        },
        {
          id: "7",
          username: "QuickThinker",
          elo: 1480,
          wins: 18,
          losses: 27,
          gamesPlayed: 45,
          coins: 700,
        },
        {
          id: "8",
          username: "BrainBox",
          elo: 1450,
          wins: 15,
          losses: 30,
          gamesPlayed: 45,
          coins: 600,
        },
      ];

      setLeaderboard(mockData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
  };

  const getEloColor = (elo: number) => {
    if (elo >= 1800) return "#fbbf24"; // Gold
    if (elo >= 1600) return "#c0c0c0"; // Silver
    if (elo >= 1400) return "#cd7f32"; // Bronze
    return colors.text;
  };

  const renderLeaderboardItem = ({
    item,
    index,
  }: {
    item: LeaderboardEntry;
    index: number;
  }) => {
    const rank = index + 1;
    const winRate =
      item.gamesPlayed > 0
        ? ((item.wins / item.gamesPlayed) * 100).toFixed(0)
        : 0;

    return (
      <View
        style={[
          styles.itemContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View style={styles.rankContainer}>
          <View style={styles.rankBadge}>
            <ThemedText style={styles.rankBadgeText}>#{rank}</ThemedText>
          </View>
          <ThemedText style={styles.rankNumber}>Rank</ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedText style={styles.username}>{item.username}</ThemedText>
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <ThemedText style={styles.statsText}>
                {item.gamesPlayed} games
              </ThemedText>
            </View>
            <View style={styles.statChip}>
              <ThemedText style={styles.statsText}>{item.wins}W</ThemedText>
            </View>
            <View style={styles.statChip}>
              <ThemedText style={styles.statsText}>{item.losses}L</ThemedText>
            </View>
            <View style={styles.statChip}>
              <ThemedText style={styles.statsText}>{winRate}% win</ThemedText>
            </View>
            <View style={[styles.statChip, styles.coinChip]}>
              <ThemedText style={[styles.statsText, styles.coinText]}>
                {item.coins} coins
              </ThemedText>
            </View>
            {item.soloGamesPlayed && item.soloGamesPlayed > 0 && (
              <View style={styles.statChip}>
                <ThemedText style={styles.statsText}>
                  {item.soloWins}/{item.soloGamesPlayed} solo
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        <View style={styles.eloContainer}>
          <ThemedText style={[styles.elo, { color: getEloColor(item.elo) }]}>
            {item.elo}
          </ThemedText>
          <ThemedText style={styles.eloLabel}>ELO</ThemedText>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={styles.loadingText}>
            Loading leaderboard...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerPill}>
          <ThemedText style={styles.headerPillText}>Season Rankings</ThemedText>
        </View>
        <ThemedText style={styles.title}>Leaderboard</ThemedText>
        <ThemedText style={styles.subtitle}>Top Players</ThemedText>
      </View>

      <FlatList
        data={leaderboard}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No players yet. Be the first.
            </ThemedText>
          </View>
        }
      />

      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Win games to climb the ranks.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSizes.md,
    opacity: 0.7,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    alignItems: "center",
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
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: "bold",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    opacity: 0.7,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rankContainer: {
    width: 60,
    alignItems: "center",
    marginRight: Spacing.md,
  },
  rankBadge: {
    minWidth: 44,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(99, 102, 241, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.35)",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  rankBadgeText: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
  },
  rankNumber: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    opacity: 0.6,
  },
  infoContainer: {
    flex: 1,
  },
  username: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    flexWrap: "wrap",
  },
  statChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(99, 102, 241, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
  },
  coinChip: {
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    borderColor: "rgba(251, 191, 36, 0.4)",
  },
  statsText: {
    fontSize: FontSizes.xs,
    opacity: 0.8,
    fontWeight: "600",
  },
  coinText: {
    color: "#f59e0b",
  },
  eloContainer: {
    alignItems: "center",
    marginLeft: Spacing.md,
  },
  elo: {
    fontSize: FontSizes.xxl,
    fontWeight: "bold",
  },
  eloLabel: {
    fontSize: FontSizes.xs,
    opacity: 0.6,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: Spacing.xxl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: FontSizes.md,
    opacity: 0.5,
    textAlign: "center",
  },
  footer: {
    padding: Spacing.md,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  footerText: {
    fontSize: FontSizes.sm,
    opacity: 0.6,
  },
});
