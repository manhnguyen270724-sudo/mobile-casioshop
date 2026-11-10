import BottomNav from "@/components/bottom-nav";
import Header from "@/components/Header";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/database/products";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function CartScreen() {
  const {
    cart,
    cartSubtotal,
    cartTotal,
    discountCode,
    discountAmount,
    shippingFee,
    changeQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = () => {
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    if (res.success) {
      setCouponError("");
      setInputCoupon("");
      Alert.alert("Thành công", res.message);
    } else {
      setCouponError(res.message);
    }
  };

  return (
    <View style={styles.screen}>
      <Header title="GIỎ HÀNG" showBack={true} />

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="bag-handle-outline" size={54} color={CasioColors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
          <Text style={styles.emptySubtitle}>
            Bạn chưa chọn mẫu đồng hồ nào. Hãy khám phá bộ sưu tập Casio chính hãng ngay hôm nay!
          </Text>
          <Pressable
            onPress={() => router.push("/shop")}
            style={({ pressed }) => [styles.exploreButton, pressed && styles.pressed]}
          >
            <Text style={styles.exploreButtonText}>KHÁM PHÁ BỘ SƯU TẬP</Text>
            <Ionicons name="arrow-forward" size={18} color="#0b1f33" />
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {/* Cart items list */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Sản phẩm đã chọn ({cart.reduce((s, i) => s + i.quantity, 0)})
            </Text>
          </View>

          {cart.map((item) => {
            const rawPrice =
              typeof item.price === "number"
                ? item.price
                : Number(String(item.price).replace(/[^0-9]/g, ""));

            return (
              <View key={item.id} style={styles.cartCard}>
                <Pressable
                  onPress={() =>
                    router.push({ pathname: "/product", params: { id: item.id } })
                  }
                  style={styles.itemImageContainer}
                >
                  <Image
                    source={{ uri: item.img }}
                    style={styles.itemImage}
                    resizeMode="contain"
                  />
                </Pressable>

                <View style={styles.itemDetails}>
                  <View style={styles.itemTopRow}>
                    <Text style={styles.itemBrand}>{item.brand}</Text>
                    <Pressable
                      hitSlop={8}
                      onPress={() => removeFromCart(item.id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash-outline" size={18} color="#e53e3e" />
                    </Pressable>
                  </View>

                  <Pressable
                    onPress={() =>
                      router.push({ pathname: "/product", params: { id: item.id } })
                    }
                  >
                    <Text numberOfLines={2} style={styles.itemName}>
                      {item.name}
                    </Text>
                  </Pressable>

                  <Text style={styles.itemPrice}>{formatPrice(rawPrice)}</Text>

                  <View style={styles.quantityRow}>
                    <View style={styles.counter}>
                      <Pressable
                        onPress={() => changeQuantity(item.id, -1)}
                        style={styles.counterBtn}
                      >
                        <Ionicons name="remove" size={16} color={CasioColors.primary} />
                      </Pressable>
                      <Text style={styles.counterValue}>{item.quantity}</Text>
                      <Pressable
                        onPress={() => changeQuantity(item.id, 1)}
                        style={styles.counterBtn}
                      >
                        <Ionicons name="add" size={16} color={CasioColors.primary} />
                      </Pressable>
                    </View>

                    <Text style={styles.itemSubtotal}>
                      {formatPrice(rawPrice * item.quantity)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Coupon Section */}
          <View style={styles.couponCard}>
            <View style={styles.couponHeader}>
              <Ionicons name="pricetag-outline" size={18} color={CasioColors.primary} />
              <Text style={styles.couponTitle}>Mã ưu đãi / Khuyến mãi</Text>
            </View>

            {discountCode ? (
              <View style={styles.appliedCoupon}>
                <View style={styles.appliedTextWrap}>
                  <Text style={styles.appliedBadge}>{discountCode}</Text>
                  <Text style={styles.appliedDesc}>Đã giảm {formatPrice(discountAmount)}</Text>
                </View>
                <Pressable onPress={removeCoupon} style={styles.removeCouponBtn}>
                  <Ionicons name="close-circle" size={20} color="#718096" />
                </Pressable>
              </View>
            ) : (
              <View>
                <View style={styles.couponInputRow}>
                  <TextInput
                    value={inputCoupon}
                    onChangeText={(val) => {
                      setInputCoupon(val);
                      setCouponError("");
                    }}
                    placeholder="Nhập mã (Gợi ý: CASIO10 hoặc CASIO20)"
                    placeholderTextColor="#9aa0a6"
                    style={styles.couponInput}
                    autoCapitalize="characters"
                  />
                  <Pressable onPress={handleApplyCoupon} style={styles.applyCouponBtn}>
                    <Text style={styles.applyCouponText}>Áp dụng</Text>
                  </Pressable>
                </View>
                {couponError ? <Text style={styles.errorText}>{couponError}</Text> : null}
              </View>
            )}
          </View>

          {/* Price Breakdown */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tạm tính:</Text>
              <Text style={styles.summaryValue}>{formatPrice(cartSubtotal)}</Text>
            </View>

            {discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Mã giảm giá:</Text>
                <Text style={styles.discountValue}>-{formatPrice(discountAmount)}</Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí giao hàng:</Text>
              <Text style={shippingFee === 0 ? styles.freeShipping : styles.summaryValue}>
                {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
              </Text>
            </View>

            {shippingFee > 0 && (
              <Text style={styles.freeShipHint}>
                * Miễn phí giao hàng cho đơn từ 2.000.000₫
              </Text>
            )}

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalValue}>{formatPrice(cartTotal)}</Text>
            </View>
          </View>

          {/* Checkout CTA */}
          <Pressable
            onPress={() => router.push("/checkout")}
            style={({ pressed }) => [styles.checkoutButton, pressed && styles.pressed]}
          >
            <Text style={styles.checkoutText}>TIẾN HÀNH THANH TOÁN</Text>
            <Ionicons name="arrow-forward" size={20} color="#0b1f33" />
          </Pressable>

          <View style={styles.guaranteeRow}>
            <Ionicons name="shield-checkmark" size={16} color={CasioColors.accentDark} />
            <Text style={styles.guaranteeText}>
              Bảo hành chính hãng 5 năm • Đổi trả trong 7 ngày
            </Text>
          </View>
        </ScrollView>
      )}

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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(11, 31, 51, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: CasioColors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: CasioColors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: CasioColors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: CasioColors.primary,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  pressed: {
    opacity: 0.88,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: CasioColors.text,
  },
  cartCard: {
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#0b1f33",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImageContainer: {
    width: 86,
    height: 86,
    backgroundColor: "#faf9f6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  itemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemBrand: {
    color: CasioColors.accentDark,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  deleteButton: {
    padding: 4,
  },
  itemName: {
    color: CasioColors.text,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginVertical: 2,
  },
  itemPrice: {
    color: CasioColors.crimson,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 6,
  },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: CasioColors.border,
    borderRadius: 6,
    backgroundColor: "#faf9f6",
  },
  counterBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  counterValue: {
    minWidth: 26,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: CasioColors.text,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: "800",
    color: CasioColors.text,
  },
  couponCard: {
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  couponHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  couponTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: CasioColors.text,
  },
  couponInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  couponInput: {
    flex: 1,
    backgroundColor: "#faf9f6",
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: CasioColors.text,
    fontWeight: "600",
  },
  applyCouponBtn: {
    backgroundColor: CasioColors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  applyCouponText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  appliedCoupon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  appliedTextWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  appliedBadge: {
    backgroundColor: CasioColors.primary,
    color: CasioColors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 11,
    fontWeight: "800",
  },
  appliedDesc: {
    color: "#166534",
    fontSize: 12,
    fontWeight: "600",
  },
  removeCouponBtn: {
    padding: 4,
  },
  errorText: {
    color: "#e53e3e",
    fontSize: 12,
    marginTop: 6,
  },
  summaryCard: {
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: CasioColors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: CasioColors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: CasioColors.text,
  },
  discountValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#16a34a",
  },
  freeShipping: {
    fontSize: 13,
    fontWeight: "700",
    color: "#16a34a",
  },
  freeShipHint: {
    fontSize: 11,
    color: CasioColors.accentDark,
    fontStyle: "italic",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: CasioColors.border,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: CasioColors.text,
  },
  totalValue: {
    fontSize: 19,
    fontWeight: "900",
    color: CasioColors.crimson,
  },
  checkoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: CasioColors.accent,
    paddingVertical: 16,
    borderRadius: 10,
    shadowColor: CasioColors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 12,
  },
  checkoutText: {
    color: CasioColors.primary,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
  guaranteeRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
  },
  guaranteeText: {
    fontSize: 11,
    color: CasioColors.textSecondary,
    fontWeight: "600",
  },
});
