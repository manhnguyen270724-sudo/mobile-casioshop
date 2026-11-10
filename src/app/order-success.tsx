import Header from "@/components/Header";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/database/products";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function OrderSuccessScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const { lastOrder } = useStore();

  const id = orderId || lastOrder?.id || "CASIO-928145";
  const items = lastOrder?.items || [];
  const total = lastOrder?.total || 4066400;

  return (
    <View style={styles.screen}>
      <Header title="ĐẶT HÀNG THÀNH CÔNG" showBack={false} showCart={false} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.celebrationCard}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={44} color="#ffffff" />
          </View>
          <Text style={styles.congratsTitle}>CẢM ƠN BẠN ĐÃ ĐẶT HÀNG!</Text>
          <Text style={styles.congratsDesc}>
            Đơn hàng của bạn đã được tiếp nhận và nhân viên chăm sóc khách hàng của Casio Store sẽ liên hệ xác nhận trong thời gian sớm nhất.
          </Text>

          <View style={styles.orderIdBadge}>
            <Text style={styles.orderIdLabel}>MÃ ĐƠN HÀNG:</Text>
            <Text style={styles.orderIdValue}>#{id}</Text>
          </View>
        </View>

        {/* Order Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardHeading}>Thông tin giao hàng</Text>

          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={18} color={CasioColors.accentDark} />
            <Text style={styles.infoText}>
              {lastOrder?.customerName || "Nguyễn Văn An"} ({lastOrder?.phone || "0908 123 456"})
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={CasioColors.accentDark} />
            <Text style={styles.infoText}>
              {lastOrder?.address || "123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color={CasioColors.accentDark} />
            <Text style={styles.infoText}>
              Dự kiến giao: 2 - 3 ngày làm việc (Được đồng kiểm khi nhận)
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="wallet-outline" size={18} color={CasioColors.accentDark} />
            <Text style={styles.infoText}>
              Phương thức:{" "}
              {lastOrder?.paymentMethod === "cod"
                ? "Thanh toán khi nhận hàng (COD)"
                : lastOrder?.paymentMethod === "bank"
                  ? "Chuyển khoản Ngân hàng"
                  : "Ví MoMo/VNPAY"}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.cardHeading}>Sản phẩm đã đặt ({items.length})</Text>

          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Image source={{ uri: item.img }} style={styles.orderItemImg} resizeMode="contain" />
              <View style={styles.orderItemInfo}>
                <Text numberOfLines={1} style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemQty}>Số lượng: x{item.quantity}</Text>
              </View>
              <Text style={styles.orderItemPrice}>
                {formatPrice(
                  (typeof item.price === "number"
                    ? item.price
                    : Number(String(item.price).replace(/[^0-9]/g, ""))) * item.quantity
                )}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        {/* Commitment Badge */}
        <View style={styles.promiseCard}>
          <View style={styles.promiseItem}>
            <Ionicons name="shield-checkmark-outline" size={24} color={CasioColors.accent} />
            <Text style={styles.promiseTitle}>Bảo hành 5 năm</Text>
            <Text style={styles.promiseSubtitle}>Chính hãng quốc tế</Text>
          </View>
          <View style={styles.promiseItem}>
            <Ionicons name="repeat-outline" size={24} color={CasioColors.accent} />
            <Text style={styles.promiseTitle}>Đổi trả 7 ngày</Text>
            <Text style={styles.promiseSubtitle}>Nếu có lỗi từ NSX</Text>
          </View>
        </View>

        {/* Actions */}
        <Pressable
          onPress={() => router.replace("/")}
          style={({ pressed }) => [styles.btnHome, pressed && styles.pressed]}
        >
          <Text style={styles.btnHomeText}>QUAY VỀ TRANG CHỦ</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/shop")}
          style={({ pressed }) => [styles.btnShop, pressed && styles.pressed]}
        >
          <Text style={styles.btnShopText}>Tiếp tục xem sản phẩm khác</Text>
        </Pressable>
      </ScrollView>
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
    paddingBottom: 40,
  },
  celebrationCard: {
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#0b1f33",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  congratsTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: CasioColors.text,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  congratsDesc: {
    fontSize: 13,
    color: CasioColors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  orderIdBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#faf9f6",
    borderColor: CasioColors.border,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  orderIdLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: CasioColors.textSecondary,
  },
  orderIdValue: {
    fontSize: 14,
    fontWeight: "900",
    color: CasioColors.crimson,
    letterSpacing: 1,
  },
  detailsCard: {
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  cardHeading: {
    fontSize: 14,
    fontWeight: "800",
    color: CasioColors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: CasioColors.text,
    lineHeight: 18,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: CasioColors.border,
    marginVertical: 12,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  orderItemImg: {
    width: 44,
    height: 44,
    backgroundColor: "#faf9f6",
    borderRadius: 6,
    marginRight: 10,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 12,
    fontWeight: "700",
    color: CasioColors.text,
  },
  orderItemQty: {
    fontSize: 11,
    color: CasioColors.textSecondary,
    marginTop: 2,
  },
  orderItemPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: CasioColors.text,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: CasioColors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "900",
    color: CasioColors.crimson,
  },
  promiseCard: {
    flexDirection: "row",
    backgroundColor: CasioColors.primary,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    justifyContent: "space-around",
  },
  promiseItem: {
    alignItems: "center",
  },
  promiseTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 6,
  },
  promiseSubtitle: {
    color: "#8a96a3",
    fontSize: 11,
    marginTop: 2,
  },
  btnHome: {
    backgroundColor: CasioColors.accent,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  btnHomeText: {
    color: CasioColors.primary,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
  btnShop: {
    borderColor: CasioColors.primary,
    borderWidth: 1.5,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  btnShopText: {
    color: CasioColors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.85,
  },
});
