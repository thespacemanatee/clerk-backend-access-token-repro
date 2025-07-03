import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

interface SignInScreenProps {
  isConnecting: boolean;
  onSignIn: () => void;
}

export function SignInScreen({ isConnecting, onSignIn }: SignInScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Clerk TikTok OAuth Bug Repro</Text>
        <Text style={styles.subtitle}>
          Sign in with TikTok to test the OAuth token retrieval bug
        </Text>
        <TouchableOpacity
          onPress={onSignIn}
          disabled={isConnecting}
          style={[styles.button, isConnecting && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {isConnecting ? "Signing in..." : "Sign in with TikTok"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  content: {
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#000",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});