import BottomNav from "@/components/bottom-nav";
import { useToast } from "@/components/common/Toast";
import Header from "@/components/Header";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/database/products";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { user, logout, orders, favoritesCount, updateUserProfile } = useStore();
  const { showToast } = useToast();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // State for Edit Profile Modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [editAddress, setEditAddress] = useState(user?.address || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");

  const handleOpenEdit = () => {
    if (!user) return;
    setEditName(user.name);
    setEditPhone(user.phone);
    setEditAddress(user.address);
    setEditEmail(user.email);
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      showToast("Vui lòng nhập họ và tên", "warning");
      return;
    }
    if (!editPhone.trim()) {
      showToast("Vui lòng nhập số điện thoại", "warning");
      return;
    }
    if (!editAddress.trim()) {
      showToast("Vui lòng nhập địa chỉ nhận hàng", "warning");
      return;
    }

    updateUserProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      address: editAddress.trim(),
      email: editEmail.trim(),
    });

    setIsEditModalVisible(false);
    showToast("Đã cập nhật thông tin cá nhân!", "success");
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    showToast("Đã đăng xuất thành công!", "success");
    router.replace("/auth");
  };

  // Filter orders for this user
  const userOrders = orders.filter(
    (o) =>
      !user ||
      o.email?.toLowerCase() === user.email?.toLowerCase() ||
      o.customerName?.toLowerCase() === user.name?.toLowerCase(),
  );

  if (!user) {
    return (
      <View style={styles.screen}>
        <Header title="TÀI KHOẢN" showBack={false} />
        <View style={styles.notLoggedContainer}>
          <View style={styles.notLoggedIconCircle}>
            <Ionicons name="person-outline" size={50} color={CasioColors.primary} />
          </View>
          <Text style={styles.notLoggedTitle}>Chưa đăng nhập tài khoản</Text>
          <Text style={styles.notLoggedSubtitle}>
            Đăng nhập hoặc đăng ký thành viên Casio Club để tích điểm bảo hành 5 năm, nhận voucher giảm giá và theo dõi đơn hàng.
          </Text>
          <Pressable
            onPress={() => router.push("/auth?tab=login")}
            style={({ pressed }) => [styles.btnGoAuth, pressed && styles.pressed]}
          >
            <Text style={styles.btnGoAuthText}>ĐĂNG NHẬP / ĐĂNG KÝ NGAY</Text>
            <Ionicons name="arrow-forward" size={18} color={CasioColors.primary} />
          </Pressable>
        </View>
        <BottomNav />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="HỒ SƠ CỦA TÔI" showBack={false} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* VIP Member Card */}
        <View style={styles.vipCard}>
          <View style={styles.vipTop}>
            <View style={{ flex: 1 }}>
              <View style={styles.roleHeaderRow}>
                <Text style={styles.vipBadge}>CASIO CLUB</Text>
                <View
                  style={[
                    styles.roleBadge,
                    user.role === "admin" ? styles.adminBadge : styles.userBadge,
                  ]}
                >
                  <Text style={styles.roleBadgeText}>
                    {user.role === "admin" ? "QUẢN TRỊ VIÊN" : "THÀNH VIÊN"}
                  </Text>
                </View>
              </View>

              <Text style={styles.vipName}>{user?.name || user?.username}</Text>
              <Text style={styles.vipEmail}>{user?.email}</Text>
              <Text style={styles.vipPhone}>📞 {user?.phone || "Chưa cập nhật SĐT"}</Text>
              <Text style={styles.vipAddress} numberOfLines={2}>
                📍 {user?.address || "Chưa cập nhật địa chỉ"}
              </Text>
            </View>

            <View style={styles.tierWrap}>
              <Ionicons
                name={user.role === "admin" ? "shield-checkmark" : "ribbon"}
                size={24}
                color={CasioColors.accent}
              />
              <Text style={styles.tierText}>{user?.memberLevel || "VIP GOLD"}</Text>
            </View>
          </View>

          <View style={styles.vipDivider} />

          <View style={styles.vipBottom}>
            <View style={styles.pointWrap}>
              <Text style={styles.pointLabel}>Điểm thưởng Casio</Text>
              <Text style={styles.pointVal}>{user?.points || 1250} pts</Text>
            </View>

            {/* Requirement 18.4: Nút Cập nhật thông tin người dùng */}
            <Pressable onPress={handleOpenEdit} style={styles.editBtn}>
              <Ionicons name="create-outline" size={15} color={CasioColors.primary} />
              <Text style={styles.editBtnText}>Cập nhật thông tin</Text>
            </Pressable>
          </View>
        </View>

        {/* Shortcut to Admin if user is admin */}
        {user.role === "admin" && (
          <Pressable
            onPress={() => router.push("/admin" as Href)}
            style={styles.adminPortalCard}
          >
            <View style={styles.adminPortalLeft}>
              <Ionicons name="shield-checkmark" size={26} color={CasioColors.accent} />
              <View>
                <Text style={styles.adminPortalTitle}>TRANG CHỦ QUẢN TRỊ ADMIN</Text>
                <Text style={styles.adminPortalSub}>
                  Quản lý User, Loại SP, Sản phẩm & Đơn hàng
                </Text>
              </View>
            </View>
            <Ionicons name="arrow-forward-circle" size={26} color={CasioColors.accent} />
          </Pressable>
        )}

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <Pressable onPress={() => router.push("/favorites")} style={styles.statBox}>
            <Ionicons name="heart-outline" size={22} color={CasioColors.crimson} />
            <Text style={styles.statNum}>{favoritesCount}</Text>
            <Text style={styles.statLabel}>Đã lưu</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/cart")} style={styles.statBox}>
            <Ionicons name="bag-handle-outline" size={22} color={CasioColors.primary} />
            <Text style={styles.statNum}>{userOrders.length}</Text>
            <Text style={styles.statLabel}>Đơn hàng</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              showToast(
                "Mã CASIO10: Giảm 10% | Mã CASIO20: Giảm 20% đơn từ 5 triệu",
                "info"
              )
            }
            style={styles.statBox}
          >
            <Ionicons name="pricetag-outline" size={22} color={CasioColors.accentDark} />
            <Text style={styles.statNum}>2</Text>
            <Text style={styles.statLabel}>Mã giảm giá</Text>
          </Pressable>
        </View>

        {/* Requirement 18.3: Xem lịch sử mua hàng */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={20} color={CasioColors.accent} />
            <Text style={styles.cardTitle}>Lịch sử mua hàng ({userOrders.length})</Text>
          </View>

          {userOrders.length === 0 ? (
            <View style={styles.emptyOrders}>
              <Text style={styles.emptyOrdersText}>Bạn chưa có đơn hàng nào.</Text>
            </View>
          ) : (
            userOrders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderTopRow}>
                  <Text style={styles.orderId}>#{order.id}</Text>
                  <View
                    style={[
                      styles.orderStatusBadge,
                      order.status === "Đã giao"
                        ? styles.statusDone
                        : order.status === "Đã hủy"
                          ? styles.statusCancelled
                          : styles.statusPending,
                    ]}
                  >
                    <Text style={styles.orderStatusText}>{order.status}</Text>
                  </View>
                </View>

                <Text style={styles.orderDate}>
                  Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </Text>

                <View style={styles.orderItemsList}>
                  {order.items.map((item, idx) => (
                    <Text key={idx} style={styles.orderItemName} numberOfLines={1}>
                      • {item.quantity}x {item.name}
                    </Text>
                  ))}
                </View>

                <View style={styles.orderBottomRow}>
                  <Text style={styles.orderTotalLabel}>Tổng thanh toán:</Text>
                  <Text style={styles.orderTotalValue}>
                    {formatPrice(order.total || order.finalTotal || 0)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Account Menu Items */}
        <View style={styles.card}>
          <Text style={styles.menuGroupTitle}>Cài đặt tài khoản</Text>

          <Pressable onPress={handleOpenEdit} style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="person-outline" size={20} color={CasioColors.accent} />
              <Text style={styles.menuLabel}>Chỉnh sửa thông tin cá nhân</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8a96a3" />
          </Pressable>

          <Pressable
            onPress={() =>
              showToast(
                `Địa chỉ: ${user?.address || "123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"}`,
                "info"
              )
            }
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="location-outline" size={20} color={CasioColors.primary} />
              <Text style={styles.menuLabel}>Địa chỉ giao hàng mặc định</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8a96a3" />
          </Pressable>

          <Pressable
            onPress={() =>
              showToast(
                "Chính sách: Bảo hành quốc tế 5 năm, 1 đổi 1 trong 7 ngày đối với mọi lỗi kỹ thuật.",
                "info"
              )
            }
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={CasioColors.primary} />
              <Text style={styles.menuLabel}>Chính sách bảo hành 5 năm</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8a96a3" />
          </Pressable>

          <Pressable
            onPress={() => setShowLogoutModal(true)}
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="log-out-outline" size={20} color={CasioColors.crimson} />
              <Text style={[styles.menuLabel, { color: CasioColors.crimson }]}>
                Đăng xuất tài khoản
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={CasioColors.crimson} />
          </Pressable>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalBox}>
            <View style={styles.confirmModalIconWrap}>
              <Ionicons name="log-out-outline" size={28} color="#e53935" />
            </View>
            <Text style={styles.confirmModalTitle}>Xác nhận đăng xuất</Text>
            <Text style={styles.confirmModalMessage}>
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản "{user?.name || user?.username}"?
            </Text>
            <View style={styles.confirmModalActions}>
              <Pressable
                style={[styles.confirmModalBtn, styles.confirmModalBtnCancel]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.confirmModalBtnCancelText}>Hủy bỏ</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmModalBtn, styles.confirmModalBtnLogout]}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.confirmModalBtnLogoutText}>Đăng xuất</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Requirement 18.4: Modal Cập nhật thông tin người dùng */}
      <Modal visible={isEditModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cập Nhật Thông Tin</Text>
              <Pressable hitSlop={8} onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Họ và tên:</Text>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Nhập họ và tên..."
                  placeholderTextColor="#94a3b8"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số điện thoại:</Text>
                <TextInput
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="Nhập số điện thoại..."
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email:</Text>
                <TextInput
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Nhập địa chỉ email..."
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Địa chỉ giao hàng:</Text>
                <TextInput
                  value={editAddress}
                  onChangeText={setEditAddress}
                  placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  style={[styles.modalInput, styles.multilineInput]}
                />
              </View>

              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setIsEditModalVisible(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>Hủy</Text>
                </Pressable>
                <Pressable onPress={handleSaveProfile} style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>Lưu Thay Đổi</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  vipCard: {
    backgroundColor: CasioColors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#0b1f33",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  vipTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  roleHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  vipBadge: {
    color: CasioColors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminBadge: {
    backgroundColor: CasioColors.crimson,
  },
  userBadge: {
    backgroundColor: "rgba(245, 196, 81, 0.2)",
  },
  roleBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "900",
  },
  vipName: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "800",
  },
  vipEmail: {
    color: "#a0aec0",
    fontSize: 12,
    marginTop: 2,
  },
  vipPhone: {
    color: "#cbd5e1",
    fontSize: 12,
    marginTop: 4,
  },
  vipAddress: {
    color: "#94a3b8",
    fontSize: 11,
    marginTop: 2,
  },
  tierWrap: {
    alignItems: "center",
    backgroundColor: "rgba(245, 196, 81, 0.15)",
    borderColor: "rgba(245, 196, 81, 0.4)",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tierText: {
    color: CasioColors.accent,
    fontSize: 10,
    fontWeight: "900",
    marginTop: 2,
  },
  vipDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    marginVertical: 14,
  },
  vipBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointWrap: {},
  pointLabel: {
    color: "#a0aec0",
    fontSize: 11,
  },
  pointVal: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 2,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: CasioColors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editBtnText: {
    color: CasioColors.primary,
    fontSize: 11,
    fontWeight: "800",
  },
  adminPortalCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(11, 31, 51, 0.8)",
    borderWidth: 1.5,
    borderColor: CasioColors.accent,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  adminPortalLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  adminPortalTitle: {
    color: CasioColors.accent,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  adminPortalSub: {
    color: "#cbd5e1",
    fontSize: 11,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statNum: {
    color: CasioColors.text,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 4,
  },
  statLabel: {
    color: CasioColors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  card: {
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    color: CasioColors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  emptyOrders: {
    paddingVertical: 12,
    alignItems: "center",
  },
  emptyOrdersText: {
    color: "#94a3b8",
    fontSize: 12,
  },
  orderCard: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  orderTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  orderId: {
    color: CasioColors.accent,
    fontSize: 13,
    fontWeight: "800",
  },
  orderStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: "rgba(245, 196, 81, 0.2)",
  },
  statusDone: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  statusCancelled: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  orderStatusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  orderDate: {
    color: "#94a3b8",
    fontSize: 11,
    marginBottom: 6,
  },
  orderItemsList: {
    marginVertical: 4,
    gap: 2,
  },
  orderItemName: {
    color: "#cbd5e1",
    fontSize: 12,
  },
  orderBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  orderTotalLabel: {
    color: "#94a3b8",
    fontSize: 11,
  },
  orderTotalValue: {
    color: CasioColors.accent,
    fontSize: 13,
    fontWeight: "800",
  },
  menuGroupTitle: {
    color: CasioColors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: CasioColors.border,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuLabel: {
    color: CasioColors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  notLoggedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  notLoggedIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(245, 196, 81, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  notLoggedTitle: {
    color: CasioColors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  notLoggedSubtitle: {
    color: CasioColors.textMuted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 24,
  },
  btnGoAuth: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: CasioColors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  btnGoAuthText: {
    color: CasioColors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: CasioColors.surface,
    borderRadius: 16,
    padding: 20,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: CasioColors.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: CasioColors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: CasioColors.background,
    borderWidth: 1,
    borderColor: CasioColors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: CasioColors.text,
    fontSize: 13,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 10,
    paddingTop: 10,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  cancelBtnText: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "700",
  },
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: CasioColors.accent,
  },
  saveBtnText: {
    color: CasioColors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  // Confirm Logout Modal styles
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  confirmModalBox: {
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
  confirmModalIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  confirmModalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: CasioColors.text,
    marginBottom: 8,
  },
  confirmModalMessage: {
    fontSize: 13,
    color: CasioColors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 20,
  },
  confirmModalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  confirmModalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmModalBtnCancel: {
    backgroundColor: "#f3f4f6",
  },
  confirmModalBtnCancelText: {
    color: CasioColors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  confirmModalBtnLogout: {
    backgroundColor: "#e53935",
  },
  confirmModalBtnLogoutText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
});
