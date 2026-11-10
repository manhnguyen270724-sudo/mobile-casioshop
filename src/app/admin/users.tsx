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
    fontSize: 18,
    fontWeight: "900",
    color: CasioColors.text,
  },
  subtitle: {
    fontSize: 11,
    color: CasioColors.textMuted,
    marginTop: 2,
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CasioColors.surface,
    borderWidth: 1,
    borderColor: CasioColors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: CasioColors.text,
    fontSize: 13,
  },
  summaryBar: {
    marginTop: 10,
    marginBottom: 4,
  },
  summaryText: {
    color: "#94a3b8",
    fontSize: 12,
  },
  summaryCount: {
    color: CasioColors.accent,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
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
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  selfBadge: {
    color: CasioColors.accent,
    fontSize: 11,
    fontWeight: "700",
  },
  userUsername: {
    color: CasioColors.accentDark,
    fontSize: 12,
    marginBottom: 4,
  },
  userMeta: {
    color: "#94a3b8",
    fontSize: 11,
    marginTop: 1,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleAdmin: {
    backgroundColor: CasioColors.crimson,
  },
  roleUser: {
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    borderWidth: 1,
    borderColor: CasioColors.accent,
  },
  roleText: {
    color: "#ffffff",
    fontSize: 9,
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
    borderTopColor: "rgba(255, 255, 255, 0.06)",
  },
  btnRole: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: CasioColors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnRoleText: {
    color: "#0b1f33",
    fontSize: 11,
    fontWeight: "800",
  },
  btnDelete: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(239, 68, 68, 0.85)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnDeleteText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 8,
  },
});

