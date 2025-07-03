import { ClerkProvider, useAuth, useSSO, useUser } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ActionButtons } from "../components/ActionButtons";
import type { LogEntry } from "../components/LogEntryItem";
import { LogsSection } from "../components/LogsSection";
import { SignInScreen } from "../components/SignInScreen";
import { UserStatusCard } from "../components/UserStatusCard";
import { useTokenLogs } from "./hooks/useTokenLogs";

WebBrowser.maybeCompleteAuthSession();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env.local file"
  );
}

function MainApp() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(false);

  const { user } = useUser();
  const { startSSOFlow } = useSSO();
  const { isSignedIn, signOut, getToken } = useAuth();
  const { logs, saveLog, clearLogs } = useTokenLogs();

  const { bottom: bottomInset } = useSafeAreaInsets();

  const hasTikTokConnected = Boolean(
    user?.externalAccounts?.some((account) => account.provider === "tiktok")
  );

  const signInWithTikTok = async () => {
    try {
      setIsConnecting(true);
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_tiktok",
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Failed to sign in with TikTok");
    } finally {
      setIsConnecting(false);
    }
  };

  const checkToken = async () => {
    if (!user?.id) return;

    setIsCheckingToken(true);
    try {
      const response = await fetch(`/api/oauth-token`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      const data = await response.json();

      const logEntry: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        success: data.success || false,
        response: data,
        userId: user.id,
      };
      await saveLog(logEntry);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to check token");

      const logEntry: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        success: false,
        response: { error: "Network error", details: error },
        userId: user?.id,
      };
      await saveLog(logEntry);
    } finally {
      setIsCheckingToken(false);
    }
  };

  if (!isSignedIn) {
    return (
      <SignInScreen isConnecting={isConnecting} onSignIn={signInWithTikTok} />
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: bottomInset },
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.title}>TikTok OAuth Token Bug Demo</Text>

          <UserStatusCard user={user} hasTikTokConnected={hasTikTokConnected} />

          <ActionButtons
            hasTikTokConnected={hasTikTokConnected}
            isConnecting={isConnecting}
            isCheckingToken={isCheckingToken}
            onConnectTikTok={signInWithTikTok}
            onCheckToken={checkToken}
            onSignOut={() => signOut()}
          />

          <LogsSection logs={logs} onClearLogs={clearLogs} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  content: {
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <MainApp />
    </ClerkProvider>
  );
}
