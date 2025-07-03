import { useUser } from "@clerk/clerk-expo";
import { StyleSheet, Text, View } from "react-native";

interface UserStatusCardProps {
  user: ReturnType<typeof useUser>["user"];
  hasTikTokConnected: boolean;
}

export function UserStatusCard({
  user,
  hasTikTokConnected,
}: UserStatusCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Current Status:</Text>
      <View style={styles.statusItems}>
        <View style={styles.statusItem}>
          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>{user?.id}</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>
            {user?.primaryEmailAddress?.emailAddress || "N/A"}
          </Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.label}>TikTok Connected:</Text>
          <Text style={styles.value}>
            {hasTikTokConnected ? "✅ Yes" : "❌ No"}
          </Text>
        </View>
        {hasTikTokConnected && (
          <View style={styles.statusItem}>
            <Text style={styles.label}>External Account:</Text>
            <Text style={styles.value}>
              {user?.externalAccounts?.find((a) => a.provider === "tiktok")
                ?.username ||
                user?.externalAccounts?.find((a) => a.provider === "tiktok")
                  ?.emailAddress ||
                "Connected"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 12,
  },
  statusItems: {
    gap: 8,
  },
  statusItem: {
    gap: 2,
  },
  label: {
    fontSize: 13,
    color: "#666",
  },
  value: {
    fontSize: 14,
  },
});
