import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { Ionicons } from "@expo/vector-icons";
import { Href, router, useGlobalSearchParams, usePathname } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TabItem {
  route: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  badge?: number;
}

export default function BottomNav() {
  const pathname = usePathname();
  const searchParams = useGlobalSearchParams<{ tab?: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useStore();

  const isTabActive = (route: string) => {
    if (route === "/" || route === "/index") {
      return pathname === "/" || pathname === "/index";
    }
    if (route.startsWith("/admin")) {
      return pathname.startsWith("/admin");
    }
    if (route.includes("tab=login")) {
      return pathname === "/auth" && searchParams.tab !== "register";
    }
    if (route.includes("tab=register")) {
      return pathname === "/auth" && searchParams.tab === "register";
    }
    return pathname.startsWith(route);
  };

  // Requirement 14: Admin Bottom Tab gồm: Home của user, Home của admin, Signup, Login
  const adminTabs: TabItem[] = [
    {
      route: "/",
      label: "Home của user",
      icon: "home-outline",
      activeIcon: "home",
    },
    {
      route: "/admin",
      label: "Home của admin",
      icon: "shield-checkmark-outline",
      activeIcon: "shield-checkmark",
    },
    {
      route: "/auth?tab=register",
      label: "Signup",
      icon: "person-add-outline",
      activeIcon: "person-add",
    },
    {
      route: "/auth?tab=login",
      label: "Login",
      icon: "log-in-outline",
      activeIcon: "log-in",
    },
  ];

  // Requirement 5: Bottom Tab ở trang chủ gồm 3 nút: Home, Sign up, Login
  const userTabs: TabItem[] = [
    {
      route: "/",
      label: "Home",
      icon: "home-outline",
      activeIcon: "home",
    },
    {
      route: "/auth?tab=register",
      label: "Sign up",
      icon: "person-add-outline",
      activeIcon: "person-add",
    },
    {
      route: "/auth?tab=login",
      label: "Login",
      icon: "log-in-outline",
      activeIcon: "log-in",
    },
  ];

  const currentTabs = user?.role === "admin" ? adminTabs : userTabs;

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? 18 : 10),
        },
      ]}
    >
      <View style={styles.content}>
        {currentTabs.map((tab) => {
          const active = isTabActive(tab.route);
          return (
            <Pressable
              key={tab.route}
              onPress={() => {
                router.push(tab.route as Href);
              }}
              style={styles.tabItem}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={active ? tab.activeIcon : tab.icon}
                  size={22}
                  color={active ? CasioColors.accent : "#8a96a3"}
                />
                {!!tab.badge && tab.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {tab.badge > 99 ? "99+" : tab.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  active && styles.activeTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: CasioColors.primary,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: "#8a96a3",
    fontWeight: "600",
  },
  activeTabLabel: {
    color: CasioColors.accent,
    fontWeight: "800",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: CasioColors.crimson,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },
});
