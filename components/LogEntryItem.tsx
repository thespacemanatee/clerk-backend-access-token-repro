import { useState } from "react";
import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export interface LogEntry {
  id: string;
  timestamp: string;
  success: boolean;
  response: any;
  userId?: string;
}

interface LogEntryItemProps {
  log: LogEntry;
}

export function LogEntryItem({ log }: LogEntryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useSharedValue(0);
  const animatedChevron = useSharedValue(0);

  const toggleExpanded = () => {
    if (isExpanded) {
      animatedHeight.value = withTiming(0, { duration: 300 });
      animatedChevron.value = withTiming(0, { duration: 300 });
    } else {
      animatedHeight.value = withTiming(1, { duration: 300 });
      animatedChevron.value = withTiming(1, { duration: 300 });
    }
    setIsExpanded(!isExpanded);
  };

  const collapsibleStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animatedHeight.value,
      [0, 1],
      [0, Math.min(contentHeight, 400)]
    );
    return {
      height,
      opacity: animatedHeight.value,
    };
  });

  const chevronStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      animatedChevron.value,
      [0, 1],
      [0, 90]
    );
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  return (
    <Pressable
      onPress={toggleExpanded}
      style={[
        styles.container,
        log.success ? styles.successContainer : styles.errorContainer,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.timestamp}>
            {new Date(log.timestamp).toLocaleString()}
          </Text>
          <Text
            style={[
              styles.status,
              log.success ? styles.successStatus : styles.errorStatus,
            ]}
          >
            {log.success ? "✅ Success" : "❌ Failed"}
            {log.response?.code ? ` - ${log.response.code}` : ""}
          </Text>
        </View>
        <Animated.View style={chevronStyle}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={log.success ? "#0ea5e9" : "#f87171"}
          />
        </Animated.View>
      </View>
      <Animated.View style={[collapsibleStyle, styles.collapsible]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          nestedScrollEnabled
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}
        >
          <View
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setContentHeight(height + 24); // Add padding
            }}
          >
            <Text style={styles.jsonText}>
              {JSON.stringify(log.response, null, 2)}
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  successContainer: {
    backgroundColor: "#f0f9ff",
    borderColor: "#0ea5e9",
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    borderColor: "#f87171",
  },
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    gap: 2,
  },
  timestamp: {
    fontSize: 14,
    fontWeight: "600",
  },
  status: {
    fontSize: 12,
    fontWeight: "500",
  },
  successStatus: {
    color: "#059669",
  },
  errorStatus: {
    color: "#dc2626",
  },
  collapsible: {
    overflow: "hidden",
  },
  scrollView: {
    backgroundColor: "rgba(0,0,0,0.02)",
    maxHeight: 400,
  },
  scrollContent: {
    padding: 12,
  },
  jsonText: {
    fontSize: 11,
    fontFamily: "monospace",
  },
});