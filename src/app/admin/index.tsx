import BottomNav from "@/components/bottom-nav";
import Header from "@/components/Header";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function AdminDashboardScreen() {
  const { user, products, categories, users, orders } = useStore();

  return (
    <View style={styles.screen}>
      {/* Header with admin info & logout */}
      <Header title="QUẢN TRỊ VIÊN" showBack={false} showCart={false} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerText}>
            <View style={styles.badgeRow}>
              <View style={styles.adminBadge}>
                <Ionicons name="shield-checkmark" size={14} color="#ffffff" />
                <Text style={styles.adminBadgeText}>HỆ THỐNG QUẢN TRỊ</Text>
              </View>
            </View>
            <Text style={styles.bannerTitle}>Bảng Điều Khiển Casio</Text>
            <Text style={styles.bannerSubtitle}>
              Xin chào {user?.name || user?.username || "Admin"}, quản lý toàn bộ cơ sở dữ liệu hệ thống cửa hàng.
            </Text>
          </View>
        </View>

        {/* 4 Overview Statistics Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
              <Ionicons name="people" size={22} color="#3b82f6" />
            </View>
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>Người dùng</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
              <Ionicons name="grid" size={22} color="#10b981" />
            </View>
            <Text style={styles.statNumber}>{categories.length}</Text>
            <Text style={styles.statLabel}>Loại sản phẩm</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "rgba(245, 196, 81, 0.15)" }]}>
              <Ionicons name="watch" size={22} color={CasioColors.accent} />
            </View>
            <Text style={styles.statNumber}>{products.length}</Text>
            <Text style={styles.statLabel}>Sản phẩm</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}>
              <Ionicons name="cube" size={22} color={CasioColors.crimson} />
            </View>
            <Text style={styles.statNumber}>{orders.length}</Text>
            <Text style={styles.statLabel}>Đơn hàng</Text>
          </View>
        </View>

        {/* Requirement 13: Các nút chức năng Quản lý user, Quản lý loại SP, Quản lý sản phẩm + Đơn hàng */}
        <Text style={styles.sectionHeader}>DANH MỤC QUẢN TRỊ HỆ THỐNG</Text>

        <View style={styles.menuList}>
          {/* 1. Quản lý User */}
          <Pressable
            onPress={() => router.push("/admin/users" as Href)}
            style={({ pressed }) => [styles.menuCard, pressed && styles.pressed]}
          >
            <View style={[styles.menuIconBox, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
              <Ionicons name="people-outline" size={26} color="#3b82f6" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Quản lý user</Text>
              <Text style={styles.menuDesc}>
                Xem danh sách tài khoản, cập nhật vai trò (admin/user), xóa user
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8a96a3" />
          </Pressable>

          {/* 2. Quản lý Loại sản phẩm */}
          <Pressable
            onPress={() => router.push("/admin/categories" as Href)}
            style={({ pressed }) => [styles.menuCard, pressed && styles.pressed]}
          >
            <View style={[styles.menuIconBox, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
              <Ionicons name="pricetags-outline" size={26} color="#10b981" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Quản lý loại sản phẩm</Text>
              <Text style={styles.menuDesc}>
                Xem, thêm, sửa, xóa loại sản phẩm & thêm sản phẩm cho loại
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8a96a3" />
          </Pressable>

          {/* 3. Quản lý Sản phẩm */}
          <Pressable
            onPress={() => router.push("/admin/products" as Href)}
            style={({ pressed }) => [styles.menuCard, pressed && styles.pressed]}
          >
            <View style={[styles.menuIconBox, { backgroundColor: "rgba(245, 196, 81, 0.15)" }]}>
              <Ionicons name="watch-outline" size={26} color={CasioColors.accent} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Quản lý sản phẩm</Text>
              <Text style={styles.menuDesc}>
                Xem toàn bộ kho hàng, thêm sản phẩm mới, chỉnh sửa thông tin, xóa sản phẩm
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8a96a3" />
          </Pressable>

          {/* 4. Quản lý Đơn hàng (Requirement 19) */}
          <Pressable
            onPress={() => router.push("/admin/orders" as Href)}
            style={({ pressed }) => [styles.menuCard, pressed && styles.pressed]}
          >
            <View style={[styles.menuIconBox, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}>
              <Ionicons name="cart-outline" size={26} color={CasioColors.crimson} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Quản trị đơn hàng</Text>
              <Text style={styles.menuDesc}>
                Xem danh sách tất cả đơn hàng, cập nhật tình trạng giao hàng
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8a96a3" />
          </Pressable>

          {/* 5. Trình xem CSDL SQLite (Database Inspector) */}
          <Pressable
            onPress={() => router.push("/admin/database" as Href)}
            style={({ pressed }) => [styles.menuCard, pressed && styles.pressed]}
          >
            <View style={[styles.menuIconBox, { backgroundColor: "rgba(212, 175, 55, 0.15)" }]}>
              <Ionicons name="server-outline" size={26} color="#d4af37" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Trình xem CSDL SQLite (Inspector)</Text>
              <Text style={styles.menuDesc}>
                Xem trực tiếp 4 bảng: products, users, categories, orders và cấu trúc dữ liệu
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8a96a3" />
          </Pressable>
        </View>

        {/* Quick shortcut to user home */}
        <Pressable
          onPress={() => router.push("/")}
          style={styles.backToUserBtn}
        >
          <Ionicons name="storefront-outline" size={18} color={CasioColors.accent} />
          <Text style={styles.backToUserText}>Về trang người dùng (Home User)</Text>
        </Pressable>
      </ScrollView>

      {/* Requirement 14: Admin Bottom Tab gồm: Home của user, Home của admin, Signup, Login */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: CasioColors.background,
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  banner: {
    backgroundColor: CasioColors.primary,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(245, 196, 81, 0.2)",
  },
  bannerText: {},
  badgeRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: CasioColors.crimson,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  adminBadgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  bannerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: "#a0aec0",
    fontSize: 12,
    lineHeight: 17,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: CasioColors.surface,
    borderWidth: 1,
    borderColor: CasioColors.border,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  statNumber: {
    color: CasioColors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  statLabel: {
    color: CasioColors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  sectionHeader: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  menuList: {
    gap: 12,
    marginBottom: 20,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CasioColors.surface,
    borderWidth: 1,
    borderColor: CasioColors.border,
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  pressed: {
    opacity: 0.8,
  },
  menuIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    color: CasioColors.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 3,
  },
  menuDesc: {
    color: CasioColors.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  backToUserBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(245, 196, 81, 0.12)",
    borderWidth: 1,
    borderColor: CasioColors.accent,
    borderRadius: 12,
    paddingVertical: 12,
  },
  backToUserText: {
    color: CasioColors.accent,
    fontSize: 13,
    fontWeight: "800",
  },
});
