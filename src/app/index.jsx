import BannerSlider from "@/components/banner-slider";
import BottomNav from "@/components/bottom-nav";
import ProductCard from "@/components/product-card";
import StoreHeader from "@/components/store-header";
import { CasioColors } from "@/constants/theme";
import { brands, products } from "@/data/products";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const featuredProducts = products.slice(0, 4);
  const bestSellers = products.filter((p) => p.brand === "G-Shock").slice(0, 6);

  return (
    <View style={styles.screen}>
      <StoreHeader title="CASIO STORE" showSearch={true} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Banner Slider */}
        <BannerSlider />

        {/* Brand Categories Horizontal Bar */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionSmallTitle}>BỘ SƯU TẬP CHÍNH HÃNG</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.brandPills}
          >
            {brands.map((b) => (
              <Pressable
                key={b}
                onPress={() => router.push("/shop")}
                style={({ pressed }) => [styles.brandPill, pressed && styles.pressed]}
              >
                <Text style={styles.brandPillText}>{b}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Promo Voucher Strip */}
        <Pressable
          onPress={() => router.push("/cart")}
          style={styles.promoBanner}
        >
          <View style={styles.promoIconWrap}>
            <Ionicons name="gift-outline" size={24} color={CasioColors.accent} />
          </View>
          <View style={styles.promoTextWrap}>
            <Text style={styles.promoTitle}>Ưu Đãi Đặc Quyền Tháng Này</Text>
            <Text style={styles.promoDesc}>
              Nhập mã <Text style={styles.promoCode}>CASIO10</Text> giảm ngay 10% đơn đầu tiên
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={CasioColors.accent} />
        </Pressable>

        {/* Section 1: Featured Products - Clean 2-Column Grid (2x2) */}
        <View style={styles.headingRow}>
          <View>
            <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
            <Text style={styles.sectionSubtitle}>Các mẫu được quan tâm nhiều nhất</Text>
          </View>
          <Pressable onPress={() => router.push("/shop")} style={styles.seeAllBtn}>
            <Text style={styles.link}>Xem tất cả</Text>
            <Ionicons name="chevron-forward" size={14} color={CasioColors.accentDark} />
          </Pressable>
        </View>

        {/* 2-Column Grid with ample width and breathing room */}
        <View style={styles.grid2Col}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>

        {/* 4 Brand Pillars / Features */}
        <View style={styles.features}>
          <Feature
            icon="shield-checkmark-outline"
            title="100% Chính Hãng"
            copy="Bảo hành 5 năm quốc tế"
          />
          <Feature
            icon="car-outline"
            title="Miễn Phí Vận Chuyển"
            copy="Đơn từ 2.000.000₫"
          />
          <Feature
            icon="repeat-outline"
            title="Đổi Mới 7 Ngày"
            copy="Nếu có lỗi sản xuất"
          />
          <Feature
            icon="headset-outline"
            title="Tư Vấn Tận Tâm"
            copy="Hỗ trợ 24/7 chuyên nghiệp"
          />
        </View>

        {/* Section 2: G-Shock Best Sellers - Horizontal Swipe Carousel */}
        <View style={styles.headingRow}>
          <View>
            <Text style={styles.sectionTitle}>Dòng G-Shock Bán Chạy</Text>
            <Text style={styles.sectionSubtitle}>Vuốt sang ngang để khám phá thêm</Text>
          </View>
          <Pressable onPress={() => router.push("/shop")} style={styles.seeAllBtn}>
            <Text style={styles.link}>Xem thêm</Text>
            <Ionicons name="chevron-forward" size={14} color={CasioColors.accentDark} />
          </Pressable>
        </View>

        {/* Horizontal Carousel with cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollList}
        >
          {bestSellers.map((product) => (
            <ProductCard key={`gs-${product.id}`} product={product} horizontal={true} />
          ))}
        </ScrollView>

        {/* Casio Heritage Story */}
        <View style={styles.about}>
          <Image
            source={require("@/assets/images/watchfemale1.jpg")}
            style={styles.aboutImage}
            resizeMode="cover"
          />
          <View style={styles.aboutText}>
            <Text style={styles.eyebrow}>CASIO HERITAGE & PROMISE</Text>
            <Text style={styles.aboutTitle}>
              Biểu tượng của sự chuẩn xác & bền bỉ Nhật Bản
            </Text>
            <Text style={styles.aboutCopy}>
              Từ năm 1974, Casio luôn tiên phong định nghĩa lại chiếc đồng hồ đeo tay. Mỗi sản phẩm là sự kết tinh của kỹ thuật cơ khí chính xác và độ bền vượt trội.
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

function Feature({ icon, title, copy }) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIconWrap}>
        <Ionicons name={icon} size={20} color={CasioColors.accent} />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureCopy}>{copy}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: CasioColors.background,
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  categorySection: {
    paddingTop: 8,
  },
  sectionSmallTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: CasioColors.accentDark,
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  brandPills: {
    paddingHorizontal: 12,
    gap: 8,
  },
  brandPill: {
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  brandPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: CasioColors.text,
  },
  promoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CasioColors.primary,
    marginHorizontal: 12,
    marginTop: 14,
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  promoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(245, 196, 81, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  promoTextWrap: {
    flex: 1,
  },
  promoTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },
  promoDesc: {
    color: "#a0aec0",
    fontSize: 11,
    marginTop: 2,
  },
  promoCode: {
    color: CasioColors.accent,
    fontWeight: "900",
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 22,
    marginBottom: 10,
  },
  sectionTitle: {
    color: CasioColors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  sectionSubtitle: {
    color: CasioColors.textSecondary,
    fontSize: 11,
    marginTop: 2,
    fontWeight: "500",
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  link: {
    color: CasioColors.accentDark,
    fontSize: 12,
    fontWeight: "800",
  },
  grid2Col: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  horizontalScrollList: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    paddingVertical: 18,
    marginHorizontal: 12,
    marginTop: 16,
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 14,
  },
  feature: {
    width: "50%",
    padding: 10,
    alignItems: "center",
    textAlign: "center",
  },
  featureIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CasioColors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  featureTitle: {
    color: CasioColors.text,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },
  featureCopy: {
    color: CasioColors.textSecondary,
    fontSize: 10,
    marginTop: 3,
    textAlign: "center",
  },
  about: {
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 20,
    overflow: "hidden",
  },
  aboutImage: {
    height: 180,
    width: "100%",
  },
  aboutText: {
    padding: 18,
  },
  eyebrow: {
    color: CasioColors.accentDark,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  aboutTitle: {
    color: CasioColors.text,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 24,
    marginTop: 6,
  },
  aboutCopy: {
    color: CasioColors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  pressed: {
    opacity: 0.85,
  },
});
