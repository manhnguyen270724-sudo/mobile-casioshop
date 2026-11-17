// Màn hình quản trị user: xem danh sách tài khoản, cập nhật vai trò, xóa user khỏi CSDL

import BottomNav from "@/components/bottom-nav";
import Header from "@/components/Header";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { UserRole } from "@/types/store";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AdminUsersScreen() {
  const { users, user: currentUser, updateUserRole, deleteUser } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q),
    );
  }, [users, searchQuery]);

  // Cập nhật vai trò (admin <-> user)
  const handleChangeRole = (username: string, currentRole: UserRole) => {
    const targetRole: UserRole = currentRole === "admin" ? "user" : "admin";
    Alert.alert(
      "Cập nhật vai trò",
      `Bạn có muốn đổi vai trò của "${username}" từ [${currentRole.toUpperCase()}] thành [${targetRole.toUpperCase()}] không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: () => {
            updateUserRole(username, targetRole);
            Alert.alert("Thành công", `Đã cập nhật vai trò của ${username} thành ${targetRole.toUpperCase()}`);
          },
        },
      ],
    );
  };

  // Xóa user khỏi hệ thống (chặn xóa chính mình)
  const handleDeleteUser = (username: string) => {
    if (currentUser?.username.toLowerCase() === username.toLowerCase()) {
      Alert.alert("Lỗi", "Bạn không thể tự xóa tài khoản quản trị của chính mình!");
      return;
    }

    Alert.alert(
      "Xác nhận xóa tài khoản",
      `Bạn có chắc chắn muốn xóa vĩnh viễn người dùng "${username}" không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa vĩnh viễn",
          style: "destructive",
          onPress: () => {
            deleteUser(username);
            Alert.alert("Đã xóa", `Đã xóa người dùng "${username}" thành công.`);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <Header title="QUẢN TRỊ USER" showBack={true} />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.username}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Danh Sách Người Dùng</Text>
            <Text style={styles.subtitle}>
              Xem thông tin, cập nhật vai trò (admin/user) hoặc xóa tài khoản.
            </Text>

            {/* Search Input */}
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#8a96a3" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Tìm theo username, tên, email, SĐT..."
                placeholderTextColor="#9aa0a6"
                style={styles.searchInput}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color="#8a96a3" />
                </Pressable>
              )}
            </View>

            <View style={styles.summaryBar}>
              <Text style={styles.summaryText}>
                Tổng cộng: <Text style={styles.summaryCount}>{filteredUsers.length}</Text> tài khoản
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const isSelf = currentUser?.username.toLowerCase() === item.username.toLowerCase();
          const isAdmin = item.role === "admin";

          return (
            <View style={styles.userCard}>
              <View style={styles.cardTop}>
                <View style={styles.avatarWrap}>
                  <Ionicons
                    name={isAdmin ? "shield-checkmark" : "person"}
                    size={22}
                    color={isAdmin ? CasioColors.crimson : CasioColors.accent}
                  />
                </View>

                <View style={styles.userInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName}>{item.name || item.username}</Text>
                    {isSelf && <Text style={styles.selfBadge}>(Bạn)</Text>}
                  </View>
                  <Text style={styles.userUsername}>@{item.username}</Text>
                  <Text style={styles.userMeta}>✉️ {item.email}</Text>
                  <Text style={styles.userMeta}>📞 {item.phone || "Chưa có SĐT"}</Text>
                </View>

                {/* Role Badge */}
                <View style={[styles.roleBadge, isAdmin ? styles.roleAdmin : styles.roleUser]}>
                  <Text style={styles.roleText}>{isAdmin ? "ADMIN" : "USER"}</Text>
                </View>
              </View>

              {/* Action Buttons: Cập nhật vai trò & Xóa */}
              <View style={styles.actionRow}>
                <Pressable
                  onPress={() => handleChangeRole(item.username, item.role)}
                  style={styles.btnRole}
                >
                  <Ionicons name="sync-outline" size={14} color="#0b1f33" />
                  <Text style={styles.btnRoleText}>
                    {isAdmin ? "Hạ xuống User" : "Nâng lên Admin"}
                  </Text>
                </Pressable>

                {!isSelf && (
                  <Pressable
                    onPress={() => handleDeleteUser(item.username)}
                    style={styles.btnDelete}
                  >
                    <Ionicons name="trash-outline" size={14} color="#ffffff" />
                    <Text style={styles.btnDeleteText}>Xóa User</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={44} color="#64748b" />
            <Text style={styles.emptyText}>Không tìm thấy người dùng nào phù hợp</Text>
          </View>
        }
      />

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: CasioColors.background,
    flex: 1,
  },
  list: {
    padding: 14,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: CasioColors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: "#475569",
    marginTop: 2,
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CasioColors.surface,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#0f172a",
    fontSize: 15,
  },
  summaryBar: {
    marginTop: 10,
    marginBottom: 4,
  },
  summaryText: {
    color: "#475569",
    fontSize: 13.5,
  },
  summaryCount: {
    color: CasioColors.accentDark,
    fontWeight: "800",
  },
  userCard: {
    backgroundColor: CasioColors.surface,
    borderWidth: 1,
    borderColor: CasioColors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userName: {
    color: CasioColors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  selfBadge: {
    color: CasioColors.accentDark,
    fontSize: 12,
    fontWeight: "700",
  },
  userUsername: {
    color: CasioColors.accentDark,
    fontSize: 13.5,
    marginBottom: 4,
    fontWeight: "600",
  },
  userMeta: {
    color: "#475569",
    fontSize: 13,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleAdmin: {
    backgroundColor: CasioColors.crimson,
  },
  roleUser: {
    backgroundColor: "rgba(245, 196, 81, 0.25)",
    borderWidth: 1,
    borderColor: CasioColors.accentDark,
  },
  roleText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: CasioColors.borderLight,
  },
  btnRole: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: CasioColors.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnRoleText: {
    color: "#0b1f33",
    fontSize: 13,
    fontWeight: "800",
  },
  btnDelete: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnDeleteText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 8,
  },
});

