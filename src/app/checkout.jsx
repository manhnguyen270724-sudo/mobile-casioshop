import StoreHeader from "@/components/store-header";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/data/products";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function CheckoutScreen() {
  const { cart, cartSubtotal, cartTotal, discountAmount, shippingFee, placeOrder } =
    useStore();

  const [name, setName] = useState("Nguyễn Văn An");
  const [phone, setPhone] = useState("0908 123 456");
  const [address, setAddress] = useState("123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' | 'bank' | 'momo'
  const [shippingMethod, setShippingMethod] = useState("standard"); // 'standard' | 'express'

  const actualShippingFee =
    shippingMethod === "express" ? shippingFee + 30000 : shippingFee;
  const finalTotal = cartTotal + (shippingMethod === "express" ? 30000 : 0);

  const handlePlaceOrder = () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập họ và tên người nhận");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại liên lạc");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập địa chỉ nhận hàng");
      return;
    }

    const order = placeOrder({
      customerName: name,
      phone,
      address,
      note,
      paymentMethod,
      shippingMethod,
      finalTotal,
    });

    router.replace({
      pathname: "/order-success",
      params: { orderId: order.id },
    });
  };

  if (cart.length === 0) {
    return (
      <View style={styles.screen}>
        <StoreHeader title="THANH TOÁN" showBack={true} />
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={60} color={CasioColors.primary} />
          <Text style={styles.emptyText}>Bạn không có sản phẩm nào để thanh toán.</Text>
          <Pressable onPress={() => router.push("/shop")} style={styles.btnBack}>
            <Text style={styles.btnBackText}>Quay lại cửa hàng</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <StoreHeader title="THANH TOÁN" showBack={true} showCart={false} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Step Indicator */}
        <View style={styles.stepContainer}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepActive]}>
              <Text style={styles.stepNumberActive}>1</Text>
            </View>
            <Text style={styles.stepTextActive}>Giỏ hàng</Text>
          </View>
          <View style={styles.stepLineActive} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepActive]}>
              <Text style={styles.stepNumberActive}>2</Text>
            </View>
            <Text style={styles.stepTextActive}>Thanh toán</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepText}>Hoàn tất</Text>
          </View>
        </View>

        {/* Section 1: Customer Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location-outline" size={20} color={CasioColors.accentDark} />
            <Text style={styles.cardTitle}>Địa chỉ giao hàng</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Họ và tên *</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nguyễn Văn A"
              placeholderTextColor="#9aa0a6"
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Số điện thoại nhận hàng *</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="0912 345 678"
              placeholderTextColor="#9aa0a6"
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Địa chỉ cụ thể *</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, TP"
              placeholderTextColor="#9aa0a6"
              multiline
              numberOfLines={2}
              style={[styles.input, styles.textArea]}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Ghi chú cho đơn hàng (tuỳ chọn)</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
              placeholderTextColor="#9aa0a6"
              style={styles.input}
            />
          </View>
        </View>

        {/* Section 2: Shipping Method */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="car-outline" size={20} color={CasioColors.accentDark} />
            <Text style={styles.cardTitle}>Phương thức vận chuyển</Text>
          </View>

          <Pressable
            onPress={() => setShippingMethod("standard")}
            style={[
              styles.optionItem,
              shippingMethod === "standard" && styles.optionSelected,
            ]}
          >
            <View style={styles.radio}>
              {shippingMethod === "standard" && <View style={styles.radioDot} />}
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Giao hàng tiêu chuẩn</Text>
              <Text style={styles.optionDesc}>2 - 4 ngày làm việc toàn quốc</Text>
            </View>
            <Text style={styles.optionPrice}>
              {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setShippingMethod("express")}
            style={[
              styles.optionItem,
              shippingMethod === "express" && styles.optionSelected,
            ]}
          >
            <View style={styles.radio}>
              {shippingMethod === "express" && <View style={styles.radioDot} />}
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Giao hỏa tốc 2H</Text>
              <Text style={styles.optionDesc}>Áp dụng nội thành Hà Nội & TP.HCM</Text>
            </View>
            <Text style={styles.optionPrice}>
              {formatPrice(shippingFee + 30000)}
            </Text>
          </Pressable>
        </View>

        {/* Section 3: Payment Method */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="card-outline" size={20} color={CasioColors.accentDark} />
            <Text style={styles.cardTitle}>Phương thức thanh toán</Text>
          </View>

          <Pressable
            onPress={() => setPaymentMethod("cod")}
            style={[
              styles.optionItem,
              paymentMethod === "cod" && styles.optionSelected,
            ]}
          >
            <View style={styles.radio}>
              {paymentMethod === "cod" && <View style={styles.radioDot} />}
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Thanh toán khi nhận hàng (COD)</Text>
              <Text style={styles.optionDesc}>Kiểm tra hàng trước khi thanh toán</Text>
            </View>
            <Ionicons name="cash-outline" size={22} color={CasioColors.primary} />
          </Pressable>

          <Pressable
            onPress={() => setPaymentMethod("bank")}
            style={[
              styles.optionItem,
              paymentMethod === "bank" && styles.optionSelected,
            ]}
          >
            <View style={styles.radio}>
              {paymentMethod === "bank" && <View style={styles.radioDot} />}
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Chuyển khoản Ngân hàng (QR Code)</Text>
              <Text style={styles.optionDesc}>Vietcombank, MB Bank, Techcombank</Text>
            </View>
            <Ionicons name="qr-code-outline" size={22} color={CasioColors.primary} />
          </Pressable>

          <Pressable
            onPress={() => setPaymentMethod("momo")}
            style={[
              styles.optionItem,
              paymentMethod === "momo" && styles.optionSelected,
            ]}
          >
            <View style={styles.radio}>
              {paymentMethod === "momo" && <View style={styles.radioDot} />}
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Ví điện tử MoMo / VNPAY</Text>
              <Text style={styles.optionDesc}>Thanh toán tiện lợi & an toàn</Text>
            </View>
            <Ionicons name="wallet-outline" size={22} color={CasioColors.primary} />
          </Pressable>
        </View>

        {/* Section 4: Final Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chi tiết thanh toán</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính ({cart.length} món):</Text>
            <Text style={styles.summaryValue}>{formatPrice(cartSubtotal)}</Text>
          </View>
          {discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Mã giảm giá:</Text>
              <Text style={styles.discountValue}>-{formatPrice(discountAmount)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
            <Text style={actualShippingFee === 0 ? styles.freeShipping : styles.summaryValue}>
              {actualShippingFee === 0 ? "Miễn phí" : formatPrice(actualShippingFee)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
            <Text style={styles.totalValue}>{formatPrice(finalTotal)}</Text>
          </View>
        </View>

        {/* Place Order CTA */}
        <Pressable
          onPress={handlePlaceOrder}
          style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
        >
          <Text style={styles.submitBtnText}>XÁC NHẬN ĐẶT HÀNG</Text>
          <Ionicons name="checkmark-circle" size={20} color="#0b1f33" />
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  stepItem: {
    alignItems: "center",
    gap: 4,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#dedbd4",
    justifyContent: "center",
    alignItems: "center",
  },
  stepActive: {
    backgroundColor: CasioColors.primary,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6a737d",
  },
  stepNumberActive: {
    fontSize: 12,
    fontWeight: "700",
    color: CasioColors.accent,
  },
  stepText: {
    fontSize: 11,
    color: "#89939d",
    fontWeight: "600",
  },
  stepTextActive: {
    fontSize: 11,
    color: CasioColors.text,
    fontWeight: "700",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#dedbd4",
    marginHorizontal: 8,
    marginBottom: 16,
  },
  stepLineActive: {
    flex: 1,
    height: 2,
    backgroundColor: CasioColors.primary,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  card: {
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: CasioColors.text,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: CasioColors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#faf9f6",
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: CasioColors.text,
    fontWeight: "600",
  },
  textArea: {
    height: 60,
    textAlignVertical: "top",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#faf9f6",
  },
  optionSelected: {
    borderColor: CasioColors.primary,
    backgroundColor: "#f4f7fa",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: CasioColors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: CasioColors.primary,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: CasioColors.text,
  },
  optionDesc: {
    fontSize: 11,
    color: CasioColors.textSecondary,
    marginTop: 2,
  },
  optionPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: CasioColors.text,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: CasioColors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "700",
    color: CasioColors.text,
  },
  discountValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#16a34a",
  },
  freeShipping: {
    fontSize: 13,
    fontWeight: "700",
    color: "#16a34a",
  },
  divider: {
    height: 1,
    backgroundColor: CasioColors.border,
    marginVertical: 10,
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
  submitBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: CasioColors.accent,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 8,
    shadowColor: CasioColors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnText: {
    color: CasioColors.primary,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
  pressed: {
    opacity: 0.88,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 15,
    color: CasioColors.textSecondary,
    marginVertical: 16,
    textAlign: "center",
  },
  btnBack: {
    backgroundColor: CasioColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnBackText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});
