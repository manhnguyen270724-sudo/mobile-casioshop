import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BottomNav() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { cartCount, favoritesCount, user } = useStore();

  const isTabActive = (route) => {
    if (route === "/" || route === "/index") {
      return pathname === "/" || pathname === "/index";
    }
    return pathname.startsWith(route);
  };

  const tabs = [
    {
      route: "/",
      label: "Trang chủ",
      icon: "home-outline",
      activeIcon: "home",
    },
    {
      route: "/shop",
      label: "Cửa hàng",
      icon: "grid-outline",
      activeIcon: "grid",
    },
    {
      route: "/favorites",
      label: "Yêu thích",
      icon: "heart-outline",
      activeIcon: "heart",
      badge: favoritesCount,
    },
    {
      route: "/cart",
      label: "Giỏ hàng",
      icon: "bag-handle-outline",
      activeIcon: "bag-handle",
      badge: cartCount,
    },
    {
      route: user ? "/profile" : "/auth",
      label: "Tài khoản",
      icon: "person-outline",
      activeIcon: "person",
    },
  ];

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
        {tabs.map((tab) => {
          const active = isTabActive(tab.route);
          return (
            <Pressable
              key={tab.route}
              onPress={() => {
                if (!active) {
                  router.push(tab.route);
                }
              }}
              style={styles.tabItem}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={active ? tab.activeIcon : tab.icon}
                  size={22}
                  color={active ? CasioColors.accent : "#8a96a3"}
                />
                {tab.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {tab.badge > 99 ? "99+" : tab.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  active && styles.activeLabel,
                ]}
              >
                {tab.label}
              </Text>
              {active && <View style={styles.activeDot} />}
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
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    borderTopWidth: 1,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 12,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 3,
  },
  iconContainer: {
    position: "relative",
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    color: "#8a96a3",
    marginTop: 3,
  },
  activeLabel: {
    color: CasioColors.accent,
    fontWeight: "800",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: CasioColors.accent,
    marginTop: 2,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    backgroundColor: CasioColors.crimson,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: CasioColors.primary,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },
});
