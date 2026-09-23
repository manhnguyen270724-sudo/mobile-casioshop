import BottomNav from "@/components/bottom-nav";
import StoreHeader from "@/components/store-header";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/data/products";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { user, logout, lastOrder, favoritesCount } = useStore();

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/auth");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.screen}>
        <StoreHeader title="TÀI KHOẢN" showBack={false} />
        <View style={styles.notLoggedContainer}>
          <View style={styles.notLoggedIconCircle}>
            <Ionicons name="person-outline" size={50} color={CasioColors.primary} />
          </View>
          <Text style={styles.notLoggedTitle}>Chưa đăng nhập tài khoản</Text>
          <Text style={styles.notLoggedSubtitle}>
            Đăng nhập hoặc đăng ký thành viên Casio Club để tích điểm bảo hành 5 năm, nhận voucher giảm giá và theo dõi đơn hàng.
          </Text>
          <Pressable
            onPress={() => router.push("/auth")}
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
      <StoreHeader title="HỒ SƠ CỦA TÔI" showBack={false} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* VIP Member Card */}
        <View style={styles.vipCard}>
          <View style={styles.vipTop}>
            <View>
              <Text style={styles.vipBadge}>CASIO CLUB</Text>
              <Text style={styles.vipName}>{user?.name || "Khách Hàng Casio"}</Text>
              <Text style={styles.vipEmail}>{user?.email || "Chưa đăng nhập"}</Text>
            </View>
            <View style={styles.tierWrap}>
              <Ionicons name="ribbon" size={24} color={CasioColors.accent} />
              <Text style={styles.tierText}>{user?.memberLevel || "VIP GOLD"}</Text>
            </View>
          </View>

          <View style={styles.vipDivider} />

          <View style={styles.vipBottom}>
            <View style={styles.pointWrap}>
              <Text style={styles.pointLabel}>Điểm thưởng Casio</Text>
              <Text style={styles.pointVal}>{user?.points || 1250} pts</Text>
            </View>
            <Pressable
              onPress={() => Alert.alert("Đặc quyền VIP", "Bạn được hưởng bảo hành ưu tiên 5 năm, miễn phí thay pin trọn đời và voucher 10% cho mỗi dịp sinh nhật.")}
              style={styles.privilegeBtn}
            >
              <Text style={styles.privilegeText}>Xem quyền lợi</Text>
              <Ionicons name="chevron-forward" size={14} color={CasioColors.primary} />
            </Pressable>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <Pressable onPress={() => router.push("/favorites")} style={styles.statBox}>
            <Ionicons name="heart-outline" size={22} color={CasioColors.crimson} />
            <Text style={styles.statNum}>{favoritesCount}</Text>
            <Text style={styles.statLabel}>Đã lưu</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/cart")} style={styles.statBox}>
            <Ionicons name="bag-handle-outline" size={22} color={CasioColors.primary} />
            <Text style={styles.statNum}>1</Text>
            <Text style={styles.statLabel}>Đơn chờ</Text>
          </Pressable>

          <Pressable onPress={() => Alert.alert("Voucher của bạn", "Bạn đang có 2 mã giảm giá khả dụng: CASIO10 (giảm 10%) và CASIO20 (giảm 20%).")} style={styles.statBox}>
            <Ionicons name="pricetag-outline" size={22} color={CasioColors.accentDark} />
            <Text style={styles.statNum}>2</Text>
            <Text style={styles.statLabel}>Mã giảm giá</Text>
          </Pressable>
        </View>

        {/* Recent Order Preview */}
        {lastOrder && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="cube-outline" size={20} color={CasioColors.primary} />
              <Text style={styles.cardTitle}>Đơn hàng gần nhất</Text>
            </View>
            <View style={styles.orderPreviewRow}>
              <View>
                <Text style={styles.orderIdText}>#{lastOrder.id}</Text>
                <Text style={styles.orderDateText}>Đang chuẩn bị hàng</Text>
              </View>
              <Text style={styles.orderTotalText}>{formatPrice(lastOrder.total)}</Text>
            </View>
            <Pressable
              onPress={() => router.push({ pathname: "/order-success", params: { orderId: lastOrder.id } })}
              style={styles.viewOrderBtn}
            >
              <Text style={styles.viewOrderText}>Xem chi tiết đơn hàng</Text>
              <Ionicons name="arrow-forward" size={14} color={CasioColors.accentDark} />
            </Pressable>
          </View>
        )}

        {/* Account Menu Items */}
        <View style={styles.card}>
          <Text style={styles.menuGroupTitle}>Cài đặt tài khoản</Text>

          <Pressable
            onPress={() => Alert.alert("Địa chỉ nhận hàng", user?.address || "123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh")}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="location-outline" size={20} color={CasioColors.primary} />
              <Text style={styles.menuLabel}>Địa chỉ giao hàng mặc định</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8a96a3" />
          </Pressable>

          <Pressable
            onPress={() => Alert.alert("Chính sách Casio", "Bảo hành quốc tế 5 năm, 1 đổi 1 trong 7 ngày đối với mọi lỗi kỹ thuật.")}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={CasioColors.primary} />
              <Text style={styles.menuLabel}>Chính sách bảo hành 5 năm</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8a96a3" />
          </Pressable>

          <Pressable
            onPress={() => Alert.alert("Hỗ trợ khách hàng", "Hotline: 1900 6868\nEmail: cskh@casiostore.vn\nGiờ làm việc: 8:00 - 21:00 hằng ngày.")}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="headset-outline" size={20} color={CasioColors.primary} />
              <Text style={styles.menuLabel}>Tổng đài tư vấn & CSKH</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8a96a3" />
          </Pressable>

          {user ? (
            <Pressable onPress={handleLogout} style={[styles.menuItem, { borderBottomWidth: 0 }]}>
              <View style={styles.menuLeft}>
                <Ionicons name="log-out-outline" size={20} color={CasioColors.crimson} />
                <Text style={[styles.menuLabel, { color: CasioColors.crimson }]}>Đăng xuất tài khoản</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={CasioColors.crimson} />
            </Pressable>
          ) : (
            <Pressable onPress={() => router.push("/auth")} style={[styles.menuItem, { borderBottomWidth: 0 }]}>
              <View style={styles.menuLeft}>
                <Ionicons name="log-in-outline" size={20} color={CasioColors.primary} />
                <Text style={styles.menuLabel}>Đăng nhập / Đăng ký</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8a96a3" />
            </Pressable>
          )}
        </View>
      </ScrollView>

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
  vipBadge: {
    color: CasioColors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 4,
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
    marginVertical: 16,
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
  privilegeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: CasioColors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  privilegeText: {
    color: CasioColors.primary,
    fontSize: 11,
    fontWeight: "800",
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
    paddingVertical: 14,
    alignItems: "center",
  },
  statNum: {
    fontSize: 16,
    fontWeight: "900",
    color: CasioColors.text,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: CasioColors.textSecondary,
    marginTop: 2,
    fontWeight: "600",
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
    fontSize: 14,
    fontWeight: "800",
    color: CasioColors.text,
  },
  orderPreviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#faf9f6",
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  orderIdText: {
    fontSize: 13,
    fontWeight: "800",
    color: CasioColors.text,
  },
  orderDateText: {
    fontSize: 11,
    color: "#16a34a",
    fontWeight: "700",
    marginTop: 2,
  },
  orderTotalText: {
    fontSize: 14,
    fontWeight: "900",
    color: CasioColors.crimson,
  },
  viewOrderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
    paddingVertical: 6,
  },
  viewOrderText: {
    fontSize: 12,
    fontWeight: "700",
    color: CasioColors.accentDark,
  },
  menuGroupTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: CasioColors.text,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeae1",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: CasioColors.text,
  },
  notLoggedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  notLoggedIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(11, 31, 51, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  notLoggedTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: CasioColors.text,
    marginBottom: 8,
  },
  notLoggedSubtitle: {
    fontSize: 13,
    color: CasioColors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  btnGoAuth: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: CasioColors.accent,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 8,
    shadowColor: CasioColors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  btnGoAuthText: {
    color: CasioColors.primary,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.88,
  },
});
