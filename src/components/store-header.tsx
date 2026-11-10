import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface StoreHeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showWishlist?: boolean;
  showCart?: boolean;
  showUser?: boolean;
}

export default function StoreHeader({
  title = "CASIO STORE",
  showBack = false,
  showSearch = false,
  showWishlist = true,
  showCart = true,
  showUser = true,
}: StoreHeaderProps) {
  const insets = useSafeAreaInsets();
  const { cartCount, favoritesCount, user } = useStore();

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: Math.max(insets.top, Platform.OS === "ios" ? 14 : 10),
        },
      ]}
    >
      <View style={styles.left}>
        {showBack ? (
          <Pressable
            hitSlop={12}
            onPress={() => router.back()}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={26} color="#ffffff" />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => router.push("/")}
            style={styles.logoContainer}
          >
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>

      <View style={styles.right}>
        {showSearch && (
          <Pressable
            hitSlop={8}
            onPress={() => router.push("/shop")}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Ionicons name="search-outline" size={21} color="#ffffff" />
          </Pressable>
        )}

        {showWishlist && (
          <Pressable
            hitSlop={8}
            onPress={() => router.push("/favorites")}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Ionicons name="heart-outline" size={21} color="#ffffff" />
            {favoritesCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {favoritesCount > 99 ? "99+" : favoritesCount}
                </Text>
              </View>
            )}
          </Pressable>
        )}

        {showCart && (
          <Pressable
            hitSlop={8}
            onPress={() => router.push("/cart")}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Ionicons name="bag-handle-outline" size={21} color="#ffffff" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {cartCount > 99 ? "99+" : cartCount}
                </Text>
              </View>
            )}
          </Pressable>
        )}

        {showUser && (
          <Pressable
            hitSlop={8}
            onPress={() => router.push(user ? "/profile" : "/auth")}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Ionicons
              name={user ? "person-circle" : "person-circle-outline"}
              size={23}
              color={user ? CasioColors.accent : "#ffffff"}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: CasioColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    zIndex: 20,
    elevation: 4,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 44,
  },
  logoContainer: {
    paddingVertical: 2,
  },
  logo: {
    height: 28,
    width: 46,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  title: {
    color: CasioColors.accent,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    minWidth: 44,
  },
  iconButton: {
    position: "relative",
    padding: 5,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
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
