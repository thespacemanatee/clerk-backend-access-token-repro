import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import type { LogEntry } from "../../components/LogEntryItem";

const LOGS_STORAGE_KEY = "@clerk_tiktok_logs";

export function useTokenLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const storedLogs = await AsyncStorage.getItem(LOGS_STORAGE_KEY);
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      }
    } catch (error) {
      console.error("Failed to load logs:", error);
    }
  };

  const saveLog = async (log: LogEntry) => {
    try {
      const newLogs = [log, ...logs].slice(0, 50); // Keep last 50 logs
      setLogs(newLogs);
      await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(newLogs));
    } catch (error) {
      console.error("Failed to save log:", error);
    }
  };

  const clearLogs = async () => {
    try {
      await AsyncStorage.removeItem(LOGS_STORAGE_KEY);
      setLogs([]);
      Alert.alert("Success", "Logs cleared");
    } catch (error) {
      console.error("Failed to clear logs:", error);
    }
  };

  return {
    logs,
    saveLog,
    clearLogs,
  };
}
