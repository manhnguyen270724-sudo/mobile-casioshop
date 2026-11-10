import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import BottomNav from "@/components/bottom-nav";
import Header from "@/components/Header";
import { useToast } from "@/components/common/Toast";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { Ionicons } from "@expo/vector-icons";
import { Href, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type TabType = "login" | "register";

export default function AuthScreen() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const { user, logout } = useStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabType>(
    params.tab === "register" ? "register" : "login"
  );
  const [prefilledAccount, setPrefilledAccount] = useState<string>("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Sync tab with route parameter changes (e.g. BottomNav taps)
  useEffect(() => {
    if (params.tab === "register") {
      setActiveTab("register");
    } else if (params.tab === "login") {
      setActiveTab("login");
    }
  }, [params.tab]);

  // When user is already logged in, show Current Account Card
  if (user) {
    const isAdmin = user.role === "admin";

    const handleConfirmLogout = () => {
      setShowLogoutConfirm(false);
      logout();
      showToast("Đã đăng xuất thành công!", "success");
      setActiveTab("login");
    };

    return (
      <View style={styles.screen}>
        <Header title="TÀI KHOẢN CỦA BẠN" showBack={false} showCart={true} />

        <ScrollView contentContainerStyle={styles.loggedInContent}>
          {/* Status Badge */}
          <View style={styles.loggedInBadgeRow}>
            <View
              style={[
                styles.roleBadge,
                isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeUser,
              ]}
            >
              <Ionicons
                name={isAdmin ? "shield-checkmark" : "person"}
                size={14}
                color={isAdmin ? "#d4af37" : CasioColors.primary}
              />
              <Text
                style={[
                  styles.roleBadgeText,
                  isAdmin ? styles.roleBadgeTextAdmin : styles.roleBadgeTextUser,
                ]}
              >
                {isAdmin ? "QUẢN TRỊ VIÊN" : "THÀNH VIÊN CASIO"}
              </Text>
            </View>
          </View>

          {/* User Profile Card */}
          <View style={styles.userCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </Text>
            </View>

            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            {user.phone ? (
              <Text style={styles.userPhone}>
                <Ionicons name="call-outline" size={13} color={CasioColors.textSecondary} />{" "}
                {user.phone}
              </Text>
            ) : null}

            <View style={styles.cardDivider} />

            <View style={styles.userNoticeBox}>
              <Ionicons name="information-circle-outline" size={18} color="#0d5c9e" />
              <Text style={styles.userNoticeText}>
                Bạn hiện đang đăng nhập với tài khoản này. Không cần đăng ký mới. Để chuyển tài khoản khác, vui lòng đăng xuất trước.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsCol}>
            {isAdmin && (
              <Pressable
                onPress={() => router.push("/admin" as Href)}
                style={({ pressed }) => [styles.btnAdminPrimary, pressed && styles.btnPressed]}
              >
                <Ionicons name="speedometer-outline" size={18} color="#000" />
                <Text style={styles.btnAdminPrimaryText}>Vào trang Quản trị Admin</Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => router.push("/" as Href)}
              style={({ pressed }) => [styles.btnShopping, pressed && styles.btnPressed]}
            >
              <Ionicons name="cart-outline" size={18} color="#fff" />
              <Text style={styles.btnShoppingText}>Vào trang chủ mua sắm</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/profile" as Href)}
              style={({ pressed }) => [styles.btnProfile, pressed && styles.btnPressed]}
            >
              <Ionicons name="person-circle-outline" size={18} color={CasioColors.primary} />
              <Text style={styles.btnProfileText}>Xem hồ sơ & Lịch sử đơn hàng</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                logout();
                setActiveTab("register");
                showToast("Đã đăng xuất. Vui lòng nhập thông tin đăng ký tài khoản mới.", "info");
              }}
              style={({ pressed }) => [styles.btnSwitchTab, pressed && styles.btnPressed]}
            >
              <Ionicons name="person-add-outline" size={18} color={CasioColors.accentDark} />
              <Text style={styles.btnSwitchTabText}>Đăng ký tài khoản mới khác</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                logout();
                setActiveTab("login");
                showToast("Đã đăng xuất. Vui lòng đăng nhập tài khoản khác.", "info");
              }}
              style={({ pressed }) => [styles.btnSwitchTab, pressed && styles.btnPressed]}
            >
              <Ionicons name="log-in-outline" size={18} color={CasioColors.accentDark} />
              <Text style={styles.btnSwitchTabText}>Đăng nhập tài khoản khác</Text>
            </Pressable>

            <Pressable
              onPress={() => setShowLogoutConfirm(true)}
              style={({ pressed }) => [styles.btnLogout, pressed && styles.btnPressed]}
            >
              <Ionicons name="log-out-outline" size={18} color="#e53935" />
              <Text style={styles.btnLogoutText}>Đăng xuất tài khoản này</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Modal Confirm Logout */}
        <Modal
          visible={showLogoutConfirm}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLogoutConfirm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.modalIconWrap}>
                <Ionicons name="log-out-outline" size={28} color="#e53935" />
              </View>
              <Text style={styles.modalTitle}>Xác nhận đăng xuất</Text>
              <Text style={styles.modalMessage}>
                Bạn có chắc chắn muốn đăng xuất khỏi tài khoản "{user.name}"?
              </Text>
              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.modalBtn, styles.modalBtnCancel]}
                  onPress={() => setShowLogoutConfirm(false)}
                >
                  <Text style={styles.modalBtnCancelText}>Hủy bỏ</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalBtn, styles.modalBtnLogout]}
                  onPress={handleConfirmLogout}
                >
                  <Text style={styles.modalBtnLogoutText}>Đăng xuất</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <BottomNav />
      </View>
    );
  }

  // Not logged in: Show Login / Register tabs
  const handleRegisterSuccess = (newAccount: string) => {
    setPrefilledAccount(newAccount);
    setActiveTab("login");
    showToast("Đăng ký thành công! Hãy nhập mật khẩu để đăng nhập.", "success");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <Header title="TÀI KHOẢN CASIO" showBack={false} showCart={false} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandTitle}>CASIO OFFICIAL STORE</Text>
          <Text style={styles.brandSubtitle}>
            Đăng nhập để xem giá ưu đãi thành viên và bảo hành điện tử chính hãng 5 năm
          </Text>
        </View>

        {/* Flat Modern Tab Switcher */}
        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => setActiveTab("login")}
            style={[styles.tabBtn, activeTab === "login" && styles.tabBtnActive]}
          >
            <Ionicons
              name="log-in-outline"
              size={16}
              color={activeTab === "login" ? "#0b1f33" : CasioColors.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "login" && styles.tabTextActive,
              ]}
            >
              Đăng nhập
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("register")}
            style={[styles.tabBtn, activeTab === "register" && styles.tabBtnActive]}
          >
            <Ionicons
              name="person-add-outline"
              size={16}
              color={activeTab === "register" ? "#0b1f33" : CasioColors.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "register" && styles.tabTextActive,
              ]}
            >
              Đăng ký mới
            </Text>
          </Pressable>
        </View>

        {/* Clean Flat Form Card */}
        <View style={styles.formCard}>
          {activeTab === "login" ? (
            <LoginForm
              initialAccount={prefilledAccount}
              onSwitchToRegister={() => setActiveTab("register")}
            />
          ) : (
            <RegisterForm
              onSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setActiveTab("login")}
            />
          )}
        </View>
      </ScrollView>

      <BottomNav />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f7f6f2",
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  brandHeader: {
    alignItems: "center",
    marginVertical: 12,
  },
  logo: {
    width: 68,
    height: 42,
    marginBottom: 8,
  },
  brandTitle: {
    color: CasioColors.primary,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 2,
  },
  brandSubtitle: {
    color: CasioColors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#e8e5dc",
    borderRadius: 12,
    padding: 4,
    marginVertical: 12,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: CasioColors.textSecondary,
  },
  tabTextActive: {
    color: CasioColors.primary,
    fontWeight: "800",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e4dfd5",
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  // Logged-in screen styles
  loggedInContent: {
    padding: 20,
    paddingBottom: 48,
  },
  loggedInBadgeRow: {
    alignItems: "center",
    marginBottom: 16,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleBadgeAdmin: {
    backgroundColor: "#0b1f33",
    borderWidth: 1,
    borderColor: "#d4af37",
  },
  roleBadgeUser: {
    backgroundColor: "#e3effa",
    borderWidth: 1,
    borderColor: "#90caf9",
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  roleBadgeTextAdmin: {
    color: "#d4af37",
  },
  roleBadgeTextUser: {
    color: CasioColors.primary,
  },
  userCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e6e3da",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: CasioColors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#d4af37",
    fontSize: 26,
    fontWeight: "900",
  },
  userName: {
    fontSize: 18,
    fontWeight: "800",
    color: CasioColors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: CasioColors.textSecondary,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 12,
    color: CasioColors.textSecondary,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#f0ede6",
    width: "100%",
    marginVertical: 16,
  },
  userNoticeBox: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#f0f6fc",
    borderWidth: 1,
    borderColor: "#cce0f5",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  userNoticeText: {
    flex: 1,
    fontSize: 12,
    color: "#1d4ed8",
    lineHeight: 18,
  },
  actionButtonsCol: {
    gap: 12,
  },
  btnAdminPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#d4af37",
    paddingVertical: 14,
    borderRadius: 10,
  },
  btnAdminPrimaryText: {
    color: "#0b1f33",
    fontSize: 14,
    fontWeight: "800",
  },
  btnShopping: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: CasioColors.primary,
    paddingVertical: 14,
    borderRadius: 10,
  },
  btnShoppingText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  btnProfile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: CasioColors.primary,
    paddingVertical: 13,
    borderRadius: 10,
  },
  btnProfileText: {
    color: CasioColors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  btnSwitchTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: CasioColors.accentDark,
    paddingVertical: 13,
    borderRadius: 10,
  },
  btnSwitchTabText: {
    color: CasioColors.accentDark,
    fontSize: 14,
    fontWeight: "700",
  },
  btnLogout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff0f0",
    borderWidth: 1,
    borderColor: "#ffcdd2",
    paddingVertical: 13,
    borderRadius: 10,
  },
  btnLogoutText: {
    color: "#d32f2f",
    fontSize: 14,
    fontWeight: "700",
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalBox: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 24,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  modalIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: CasioColors.text,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 13,
    color: CasioColors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnCancel: {
    backgroundColor: "#f3f4f6",
  },
  modalBtnCancelText: {
    color: CasioColors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  modalBtnLogout: {
    backgroundColor: "#e53935",
  },
  modalBtnLogoutText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
});
