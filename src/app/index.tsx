import BannerSlider from "@/components/banner-slider";
import BottomNav from "@/components/bottom-nav";
import CategorySelector from "@/components/CategorySelector";
import Header from "@/components/Header";
import ProductCard from "@/components/product-card";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { parsePrice } from "@/database/products";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type PriceRange = "all" | "under_3m" | "3m_6m" | "6m_10m" | "over_10m";

const PRICE_RANGES: { id: PriceRange; label: string }[] = [
  { id: "all", label: "Tất cả mức giá" },
  { id: "under_3m", label: "< 3 Triệu" },
  { id: "3m_6m", label: "3tr - 6tr" },
  { id: "6m_10m", label: "6tr - 10tr" },
  { id: "over_10m", label: "> 10 Triệu" },
];

export default function HomeScreen() {
  const { products, categories, user } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [activeMenu, setActiveMenu] = useState<"home" | "shop">("home");

  // Filtering products by: Category, Search query (Name or Brand), Price Range
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category Filter
      const matchCategory =
        selectedCategory === "Tất cả" ||
        product.brand.toLowerCase() === selectedCategory.toLowerCase();

      // 2. Search Filter (by Name or Category/Brand)
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query);

      // 3. Price Range Filter
      const price = parsePrice(product.price);
      let matchPrice = true;
      if (priceRange === "under_3m") {
        matchPrice = price < 3000000;
      } else if (priceRange === "3m_6m") {
        matchPrice = price >= 3000000 && price <= 6000000;
      } else if (priceRange === "6m_10m") {
        matchPrice = price > 6000000 && price <= 10000000;
      } else if (priceRange === "over_10m") {
        matchPrice = price > 10000000;
      }

      return matchCategory && matchSearch && matchPrice;
    });
  }, [products, selectedCategory, searchQuery, priceRange]);

  const bestSellers = useMemo(() => {
    return products.filter((p) => p.brand === "G-Shock").slice(0, 6);
  }, [products]);

  return (
    <View style={styles.screen}>
      {/* Requirement 8: Header hiển thị thông tin user & đăng xuất */}
      <Header title="CASIO STORE" showCart={true} />

      {/* Requirement 2: Menu điều hướng gồm Home & Danh mục sản phẩm */}
      <View style={styles.navigationMenuBar}>
        <Pressable
          onPress={() => {
            setActiveMenu("home");
            setSelectedCategory("Tất cả");
          }}
          style={[
            styles.menuItem,
            activeMenu === "home" && styles.activeMenuItem,
          ]}
        >
          <Ionicons
            name="home"
            size={16}
            color={activeMenu === "home" ? CasioColors.accent : "#94a3b8"}
          />
          <Text
            style={[
              styles.menuText,
              activeMenu === "home" && styles.activeMenuText,
            ]}
          >
            Home
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setActiveMenu("shop");
            router.push("/shop");
          }}
          style={[
            styles.menuItem,
            activeMenu === "shop" && styles.activeMenuItem,
          ]}
        >
          <Ionicons
            name="grid"
            size={16}
            color={activeMenu === "shop" ? CasioColors.accent : "#94a3b8"}
          />
          <Text
            style={[
              styles.menuText,
              activeMenu === "shop" && styles.activeMenuText,
            ]}
          >
            Danh mục sản phẩm
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Requirement 2: Banner Slider */}
        <BannerSlider />

        {/* Requirement 9: Tìm kiếm theo tên / danh mục */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={19} color="#8a96a3" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Tìm theo tên hoặc danh mục (G-Shock, Seiko...)"
              placeholderTextColor="#9aa0a6"
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="#8a96a3" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Requirement 3: Xem sản phẩm theo từng danh mục (CategorySelector.tsx) */}
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          title="CHỌN DANH MỤC ĐỒNG HỒ"
        />

        {/* Requirement 10: Lọc sản phẩm theo khoảng giá */}
        <View style={styles.priceFilterSection}>
          <View style={styles.priceFilterHeader}>
            <Ionicons name="funnel-outline" size={14} color={CasioColors.accent} />
            <Text style={styles.priceFilterTitle}>KHOẢNG GIÁ</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pricePillsScroll}
          >
            {PRICE_RANGES.map((r) => {
              const isActive = priceRange === r.id;
              return (
                <Pressable
                  key={r.id}
                  onPress={() => setPriceRange(r.id)}
                  style={[
                    styles.pricePill,
                    isActive && styles.activePricePill,
                  ]}
                >
                  <Text
                    style={[
                      styles.pricePillText,
                      isActive && styles.activePricePillText,
                    ]}
                  >
                    {r.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Voucher Promo Strip */}
        <Pressable onPress={() => router.push("/cart")} style={styles.promoBanner}>
          <View style={styles.promoIconWrap}>
            <Ionicons name="gift-outline" size={22} color={CasioColors.accent} />
          </View>
          <View style={styles.promoTextWrap}>
            <Text style={styles.promoTitle}>Ưu Đãi Đặc Quyền Tháng Này</Text>
            <Text style={styles.promoDesc}>
              Nhập mã <Text style={styles.promoCode}>CASIO10</Text> giảm 10% đơn đầu tiên
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={CasioColors.accent} />
        </Pressable>

        {/* Requirement 1: Trang chủ gồm các sản phẩm có sẵn khi khởi tạo DB */}
        <View style={styles.headingRow}>
          <View>
            <Text style={styles.sectionTitle}>
              {selectedCategory === "Tất cả"
                ? "Sản phẩm chính hãng"
                : `Danh mục: ${selectedCategory}`}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {filteredProducts.length} mẫu đồng hồ phù hợp tiêu chí
            </Text>
          </View>
          <Pressable onPress={() => router.push("/shop")} style={styles.seeAllBtn}>
            <Text style={styles.link}>Xem tất cả</Text>
            <Ionicons name="chevron-forward" size={14} color={CasioColors.accentDark} />
          </Pressable>
        </View>

        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={44} color="#64748b" />
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm phù hợp.</Text>
            <Pressable
              onPress={() => {
                setSelectedCategory("Tất cả");
                setSearchQuery("");
                setPriceRange("all");
              }}
              style={styles.resetFilterBtn}
            >
              <Text style={styles.resetFilterText}>Đặt lại bộ lọc</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.grid2Col}>
            {/* Requirement 4: Click vào sản phẩm mở màn hình chi tiết */}
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        )}

        {/* 4 Brand Pillars */}
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

        {/* Best Sellers Section */}
        {bestSellers.length > 0 && (
          <>
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

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollList}
            >
              {bestSellers.map((product) => (
                <ProductCard key={`gs-${product.id}`} product={product} horizontal={true} />
              ))}
            </ScrollView>
          </>
        )}

        {/* Heritage Story */}
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

      {/* Requirement 5 & 14: Bottom Tab */}
      <BottomNav />
    </View>
  );
}

interface FeatureProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  copy: string;
}

function Feature({ icon, title, copy }: FeatureProps) {
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
  navigationMenuBar: {
    flexDirection: "row",
    backgroundColor: CasioColors.primary,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeMenuItem: {
    borderBottomColor: CasioColors.accent,
  },
  menuText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#94a3b8",
  },
  activeMenuText: {
    color: CasioColors.accent,
    fontWeight: "800",
  },
  content: {
    paddingBottom: 24,
  },
  searchSection: {
    paddingHorizontal: 14,
    marginTop: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CasioColors.surface,
    borderWidth: 1,
    borderColor: CasioColors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: CasioColors.text,
    fontSize: 13,
    padding: 0,
  },
  priceFilterSection: {
    marginVertical: 4,
  },
  priceFilterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  priceFilterTitle: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  pricePillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pricePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  activePricePill: {
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    borderColor: CasioColors.accent,
  },
  pricePillText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
  },
  activePricePillText: {
    color: CasioColors.accent,
    fontWeight: "800",
  },
  promoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CasioColors.primary,
    marginHorizontal: 14,
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  promoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: CasioColors.text,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: CasioColors.textMuted,
    marginTop: 2,
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  link: {
    fontSize: 12,
    fontWeight: "700",
    color: CasioColors.accentDark,
  },
  grid2Col: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    gap: 10,
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 14,
  },
  resetFilterBtn: {
    backgroundColor: CasioColors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resetFilterText: {
    color: CasioColors.primary,
    fontWeight: "800",
    fontSize: 12,
  },
  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 14,
    marginTop: 20,
    gap: 10,
  },
  feature: {
    width: "48%",
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  featureIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(245, 196, 81, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: CasioColors.text,
    marginBottom: 2,
  },
  featureCopy: {
    fontSize: 10,
    color: CasioColors.textMuted,
  },
  horizontalScrollList: {
    paddingHorizontal: 14,
    gap: 12,
  },
  about: {
    marginHorizontal: 14,
    marginTop: 24,
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  aboutImage: {
    width: "100%",
    height: 160,
  },
  aboutText: {
    padding: 16,
  },
  eyebrow: {
    color: CasioColors.accentDark,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  aboutTitle: {
    color: CasioColors.text,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 22,
    marginBottom: 6,
  },
  aboutCopy: {
    color: CasioColors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
});
