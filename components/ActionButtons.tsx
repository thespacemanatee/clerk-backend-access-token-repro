import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

interface ActionButtonsProps {
  hasTikTokConnected: boolean;
  isConnecting: boolean;
  isCheckingToken: boolean;
  onConnectTikTok: () => void;
  onCheckToken: () => void;
  onSignOut: () => void;
}

export function ActionButtons({
  hasTikTokConnected,
  isConnecting,
  isCheckingToken,
  onConnectTikTok,
  onCheckToken,
  onSignOut,
}: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.mainButtons}>
        {!hasTikTokConnected && (
          <TouchableOpacity
            onPress={onConnectTikTok}
            disabled={isConnecting}
            style={[styles.connectButton, isConnecting && styles.buttonDisabled]}
          >
            <Text style={styles.connectButtonText}>
              {isConnecting
                ? "Connecting..."
                : "Connect Another TikTok Account"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onCheckToken}
          disabled={!hasTikTokConnected || isCheckingToken}
          style={[
            styles.checkButton,
            hasTikTokConnected ? styles.checkButtonEnabled : styles.checkButtonDisabled,
            isCheckingToken && styles.buttonDisabled,
          ]}
        >
          <Text
            style={[
              styles.checkButtonText,
              hasTikTokConnected
                ? styles.checkButtonTextEnabled
                : styles.checkButtonTextDisabled,
            ]}
          >
            {isCheckingToken ? "Checking..." : "Retrieve OAuth Token (Backend)"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  mainButtons: {
    gap: 12,
  },
  connectButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 8,
  },
  checkButton: {
    paddingVertical: 15,
    borderRadius: 8,
  },
  checkButtonEnabled: {
    backgroundColor: "#007AFF",
  },
  checkButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  connectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  checkButtonTextEnabled: {
    color: "#fff",
  },
  checkButtonTextDisabled: {
    color: "#999",
  },
  signOutButton: {
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  signOutButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});