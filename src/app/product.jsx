import StoreHeader from "@/components/store-header";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { formatPrice, getProduct, parsePrice } from "@/data/products";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProductScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const product = getProduct(id);
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <View style={styles.screen}>
        <StoreHeader showBack title="SẢN PHẨM" />
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={56} color={CasioColors.primary} />
          <Text style={styles.emptyText}>Không tìm thấy sản phẩm này.</Text>
          <Pressable onPress={() => router.push("/shop")} style={styles.btnBack}>
            <Text style={styles.btnBackText}>Xem sản phẩm khác</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const favorited = isFavorite(product.id);
  const rawPrice = parsePrice(product.price);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert(
      "Đã thêm vào giỏ!",
      `Đã thêm ${quantity} x ${product.name} vào giỏ hàng.`,
      [
        { text: "Xem giỏ hàng", onPress: () => router.push("/cart") },
        { text: "Mua tiếp", style: "cancel" },
      ]
    );
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  return (
    <View style={styles.screen}>
      <StoreHeader showBack title="CHI TIẾT ĐỒNG HỒ" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Product Image Area */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: product.img }}
            style={styles.image}
            resizeMode="contain"
          />

          <Pressable
            hitSlop={8}
            onPress={() => toggleFavorite(product.id)}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={favorited ? "heart" : "heart-outline"}
              size={22}
              color={favorited ? CasioColors.crimson : "#8a96a3"}
            />
          </Pressable>

          <View style={styles.tagsRow}>
            <View style={styles.tagPrimary}>
              <Text style={styles.tagPrimaryText}>CHÍNH HÃNG 100%</Text>
            </View>
            <View style={styles.tagGold}>
              <Text style={styles.tagGoldText}>BẢO HÀNH 5 NĂM</Text>
            </View>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoCard}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(rawPrice)}</Text>
            <View style={styles.installmentBadge}>
              <Text style={styles.installmentText}>Trả góp 0% lãi suất</Text>
            </View>
          </View>

          {/* Quick Spec Badges */}
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <Ionicons name="water-outline" size={20} color={CasioColors.primary} />
              <Text style={styles.featureItemTitle}>Chống nước</Text>
              <Text style={styles.featureItemVal}>20 ATM / 200M</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="shield-outline" size={20} color={CasioColors.primary} />
              <Text style={styles.featureItemTitle}>Mặt kính</Text>
              <Text style={styles.featureItemVal}>Khoáng Mineral</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="battery-charging-outline" size={20} color={CasioColors.primary} />
              <Text style={styles.featureItemTitle}>Tuổi thọ Pin</Text>
              <Text style={styles.featureItemVal}>Khoảng 10 Năm</Text>
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Số lượng:</Text>
            <View style={styles.counter}>
              <Pressable
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                style={styles.counterBtn}
              >
                <Ionicons name="remove" size={18} color={CasioColors.primary} />
              </Pressable>
              <Text style={styles.counterVal}>{quantity}</Text>
              <Pressable
                onPress={() => setQuantity((q) => q + 1)}
                style={styles.counterBtn}
              >
                <Ionicons name="add" size={18} color={CasioColors.primary} />
              </Pressable>
            </View>
          </View>

          {/* Technical Specifications */}
          <Text style={styles.sectionHeader}>Thông số kỹ thuật</Text>
          <View style={styles.specTable}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Thương hiệu</Text>
              <Text style={styles.specVal}>{product.brand} (Japan)</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Mã định danh</Text>
              <Text style={styles.specVal}>{product.id}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Bộ máy</Text>
              <Text style={styles.specVal}>Quartz / Pin tiêu chuẩn Nhật Bản</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Chất liệu dây</Text>
              <Text style={styles.specVal}>Dây nhựa Resin / Thép không gỉ 316L</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Độ chính xác</Text>
              <Text style={styles.specVal}>±15 giây một tháng</Text>
            </View>
            <View style={[styles.specRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.specLabel}>Đổi mới</Text>
              <Text style={styles.specVal}>7 ngày nếu có lỗi sản xuất</Text>
            </View>
          </View>

          {/* Service Promises */}
          <View style={styles.promisesBox}>
            <View style={styles.promiseRow}>
              <Ionicons name="checkmark-done-circle" size={18} color="#16a34a" />
              <Text style={styles.promiseTxt}>Sản phẩm full box chính hãng, có tem chống hàng giả</Text>
            </View>
            <View style={styles.promiseRow}>
              <Ionicons name="checkmark-done-circle" size={18} color="#16a34a" />
              <Text style={styles.promiseTxt}>Miễn phí thay pin trọn đời tại các trạm bảo hành Casio</Text>
            </View>
            <View style={styles.promiseRow}>
              <Ionicons name="checkmark-done-circle" size={18} color="#16a34a" />
              <Text style={styles.promiseTxt}>Giao hàng nhanh toàn quốc, kiểm tra trước khi nhận</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Purchase Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? 18 : 12),
          },
        ]}
      >
        <Pressable
          onPress={handleAddToCart}
          style={({ pressed }) => [styles.btnAddToCart, pressed && styles.pressed]}
        >
          <Ionicons name="bag-add-outline" size={20} color={CasioColors.primary} />
          <Text style={styles.btnAddToCartText}>Thêm vào giỏ</Text>
        </Pressable>

        <Pressable
          onPress={handleBuyNow}
          style={({ pressed }) => [styles.btnBuyNow, pressed && styles.pressed]}
        >
          <Text style={styles.btnBuyNowText}>MUA NGAY</Text>
          <Ionicons name="flash" size={18} color={CasioColors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: CasioColors.background,
    flex: 1,
  },
  content: {
    padding: 14,
    paddingBottom: 110,
  },
  imageCard: {
    backgroundColor: "#ffffff",
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 16,
    height: 340,
    width: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    shadowColor: "#0b1f33",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  tagsRow: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    gap: 6,
  },
  tagPrimary: {
    backgroundColor: CasioColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagPrimaryText: {
    color: CasioColors.accent,
    fontSize: 9,
    fontWeight: "800",
  },
  tagGold: {
    backgroundColor: CasioColors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagGoldText: {
    color: CasioColors.primary,
    fontSize: 9,
    fontWeight: "800",
  },
  infoCard: {
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginTop: 14,
  },
  brand: {
    color: CasioColors.accentDark,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  name: {
    color: CasioColors.text,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 6,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
  },
  price: {
    color: CasioColors.crimson,
    fontSize: 24,
    fontWeight: "900",
  },
  installmentBadge: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  installmentText: {
    color: "#1d4ed8",
    fontSize: 11,
    fontWeight: "700",
  },
  featuresGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 18,
    gap: 8,
  },
  featureItem: {
    flex: 1,
    backgroundColor: "#faf9f6",
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  featureItemTitle: {
    fontSize: 10,
    color: CasioColors.textSecondary,
    marginTop: 6,
  },
  featureItemVal: {
    fontSize: 11,
    fontWeight: "800",
    color: CasioColors.text,
    marginTop: 2,
    textAlign: "center",
  },
  quantitySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: CasioColors.border,
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: CasioColors.text,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: CasioColors.border,
    borderRadius: 8,
    backgroundColor: "#faf9f6",
  },
  counterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  counterVal: {
    minWidth: 32,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "800",
    color: CasioColors.text,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: "800",
    color: CasioColors.text,
    marginBottom: 10,
  },
  specTable: {
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: CasioColors.border,
    backgroundColor: "#faf9f6",
  },
  specLabel: {
    fontSize: 12,
    color: CasioColors.textSecondary,
    fontWeight: "600",
  },
  specVal: {
    fontSize: 12,
    fontWeight: "700",
    color: CasioColors.text,
    maxWidth: "60%",
    textAlign: "right",
  },
  promisesBox: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  promiseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  promiseTxt: {
    fontSize: 12,
    color: "#166534",
    fontWeight: "600",
    flex: 1,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CasioColors.primary,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  btnAddToCart: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 8,
  },
  btnAddToCartText: {
    color: CasioColors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  btnBuyNow: {
    flex: 1.2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    backgroundColor: CasioColors.accent,
    paddingVertical: 14,
    borderRadius: 8,
  },
  btnBuyNowText: {
    color: CasioColors.primary,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.88,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 15,
    color: CasioColors.textSecondary,
    marginVertical: 16,
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
