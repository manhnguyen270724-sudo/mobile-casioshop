import { CasioColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");

  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  }, [translateY, opacity]);

  const showToast = useCallback(
    (msg: string, toastType: ToastType = "info", duration = 3000) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      setMessage(msg);
      setType(toastType);
      setVisible(true);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 7,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    },
    [translateY, opacity, hideToast]
  );

  const getTheme = () => {
    switch (type) {
      case "success":
        return {
          bg: "#064e3b",
          border: "#10b981",
          icon: "checkmark-circle",
          iconColor: "#34d399",
          title: "Thành công",
        };
      case "error":
        return {
          bg: "#450a0a",
          border: "#ef4444",
          icon: "alert-circle",
          iconColor: "#f87171",
          title: "Thông báo lỗi",
        };
      case "warning":
        return {
          bg: "#451a03",
          border: "#f59e0b",
          icon: "warning",
          iconColor: "#fbbf24",
          title: "Lưu ý",
        };
      case "info":
      default:
        return {
          bg: "#0b1f33",
          border: CasioColors.accent,
          icon: "information-circle",
          iconColor: CasioColors.accent,
          title: "Casio Store",
        };
    }
  };

  const theme = getTheme();

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.toastWrapper,
            {
              top: Math.max(insets.top, Platform.OS === "ios" ? 14 : 10),
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <View
            style={[
              styles.toastContainer,
              { backgroundColor: theme.bg, borderColor: theme.border },
            ]}
          >
            <Ionicons
              name={theme.icon as keyof typeof Ionicons.glyphMap}
              size={24}
              color={theme.iconColor}
              style={styles.toastIcon}
            />
            <View style={styles.textWrap}>
              <Text style={[styles.title, { color: theme.iconColor }]}>{theme.title}</Text>
              <Text style={styles.message} numberOfLines={3}>
                {message}
              </Text>
            </View>
            <Pressable hitSlop={10} onPress={hideToast} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color="#94a3b8" />
            </Pressable>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a fallback logger if called outside provider
    return {
      showToast: (msg: string) => console.log("[Toast]:", msg),
      hideToast: () => {},
    };
  }
  return context;
}

const styles = StyleSheet.create({
  toastWrapper: {
    position: "absolute",
    left: 14,
    right: 14,
    zIndex: 99999,
    elevation: 99999,
  },
  toastContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    gap: 12,
  },
  toastIcon: {
    marginRight: 2,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  message: {
    color: "#f1f5f9",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  closeBtn: {
    padding: 4,
  },
});
