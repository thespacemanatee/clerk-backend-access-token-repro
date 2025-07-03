import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { LogEntryItem, type LogEntry } from "./LogEntryItem";

interface LogsSectionProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export function LogsSection({ logs, onClearLogs }: LogsSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Retrieval History ({logs.length})</Text>
        {logs.length > 0 && (
          <TouchableOpacity onPress={onClearLogs} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {logs.length === 0 ? (
        <Text style={styles.emptyText}>No retrieval attempts yet</Text>
      ) : (
        <View style={styles.logsList}>
          {logs.map((log) => (
            <LogEntryItem key={log.id} log={log} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 12,
    color: "#6b7280",
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  logsList: {
    gap: 8,
  },
});