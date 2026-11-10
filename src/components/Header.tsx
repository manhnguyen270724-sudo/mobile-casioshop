import { useToast } from "@/components/common/Toast";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
}

export default function Header({
  title = "CASIO STORE",
  showBack = false,
  showCart = true,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { user, logout, cartCount } = useStore();
  const { showToast } = useToast();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    showToast("Đã đăng xuất tài khoản thành công!", "success");
    router.replace("/auth");
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, Platform.OS === "ios" ? 14 : 10),
        },
      ]}
    >
      {/* Top Row: Back button / Brand Title / Cart & Actions */}
      <View style={styles.topRow}>
        <View style={styles.left}>
          {showBack ? (
            <Pressable
              hitSlop={10}
              onPress={() => router.back()}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            >
              <Ionicons name="chevron-back" size={24} color="#ffffff" />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push((user?.role === "admin" ? "/admin" : "/") as Href)}
              style={styles.logoWrap}
            >
              <Ionicons
                name={user?.role === "admin" ? "shield-checkmark" : "watch"}
                size={22}
                color={CasioColors.accent}
              />
              <Text style={styles.logoText}>CASIO</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.center}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>

        <View style={styles.right}>
          {showCart && user?.role !== "admin" && (
            <Pressable
              hitSlop={8}
              onPress={() => router.push("/cart")}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            >
              <Ionicons name="bag-handle-outline" size={22} color="#ffffff" />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartCount > 99 ? "99+" : cartCount}
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
      </View>

      {/* User Info & Logout Strip */}
      <View style={styles.userStatusStrip}>
        {user ? (
          <View style={styles.userLoggedRow}>
            <Pressable
              onPress={() => router.push(user.role === "admin" ? "/admin" as Href : "/profile" as Href)}
              style={({ pressed }) => [styles.userInfoBox, pressed && styles.pressed]}
            >
              <View
                style={[
                  styles.rolePill,
                  user.role === "admin" ? styles.adminPill : styles.userPill,
                ]}
              >
                <Text style={styles.rolePillText}>
                  {user.role === "admin" ? "ADMIN" : "MEMBER"}
                </Text>
              </View>
              <Text numberOfLines={1} style={styles.userNameText}>
                Xin chào, <Text style={styles.userNameHighlight}>{user.name || user.username}</Text>
              </Text>
              <Ionicons name="chevron-forward" size={13} color="#8a96a3" />
            </Pressable>

            <Pressable
              onPress={() => setShowLogoutModal(true)}
              style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}
            >
              <Ionicons name="log-out-outline" size={15} color="#ffffff" />
              <Text style={styles.logoutBtnText}>Đăng xuất</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.guestRow}>
            <Text style={styles.guestText}>Chưa đăng nhập tài khoản</Text>
            <View style={styles.guestActions}>
              <Pressable
                onPress={() => router.push("/auth?tab=login")}
                style={styles.guestBtn}
              >
                <Text style={styles.guestBtnText}>Đăng nhập</Text>
              </Pressable>
              <Text style={styles.guestDivider}>|</Text>
              <Pressable
                onPress={() => router.push("/auth?tab=register")}
                style={styles.guestBtn}
              >
                <Text style={styles.guestBtnText}>Đăng ký</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* Logout Confirmation Modal - 100% Cross-platform reliable */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="log-out-outline" size={28} color={CasioColors.crimson} />
            </View>
            <Text style={styles.modalTitle}>Xác nhận đăng xuất</Text>
            <Text style={styles.modalText}>
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản "{user?.name || user?.username}"?
            </Text>

            <View style={styles.modalBtnRow}>
              <Pressable
                onPress={() => setShowLogoutModal(false)}
                style={styles.btnCancel}
              >
                <Text style={styles.btnCancelText}>Hủy bỏ</Text>
              </Pressable>
              <Pressable
                onPress={confirmLogout}
                style={styles.btnConfirmLogout}
              >
                <Text style={styles.btnConfirmLogoutText}>Đăng xuất</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: CasioColors.primary,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    zIndex: 20,
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  left: {
    minWidth: 44,
    flexDirection: "row",
    alignItems: "center",
  },
  logoWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logoText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 15,
    letterSpacing: 1.5,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  title: {
    color: CasioColors.accent,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  right: {
    minWidth: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  iconBtn: {
    position: "relative",
    padding: 6,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: CasioColors.crimson,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: CasioColors.primary,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "800",
  },
  userStatusStrip: {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  userLoggedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfoBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 10,
  },
  rolePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminPill: {
    backgroundColor: CasioColors.crimson,
  },
  userPill: {
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    borderWidth: 1,
    borderColor: CasioColors.accent,
  },
  rolePillText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  userNameText: {
    color: "#cbd5e1",
    fontSize: 12,
    flexShrink: 1,
  },
  userNameHighlight: {
    color: "#ffffff",
    fontWeight: "700",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(239, 68, 68, 0.85)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  logoutBtnText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  guestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  guestText: {
    color: "#94a3b8",
    fontSize: 12,
  },
  guestActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  guestBtn: {
    paddingVertical: 2,
  },
  guestBtnText: {
    color: CasioColors.accent,
    fontSize: 12,
    fontWeight: "700",
  },
  guestDivider: {
    color: "#64748b",
    fontSize: 11,
  },
  // Logout Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalBox: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: CasioColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CasioColors.border,
    padding: 22,
    alignItems: "center",
  },
  modalIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8,
  },
  modalText: {
    color: "#94a3b8",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
  },
  btnCancelText: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "700",
  },
  btnConfirmLogout: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: CasioColors.crimson,
    alignItems: "center",
  },
  btnConfirmLogoutText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },
});
