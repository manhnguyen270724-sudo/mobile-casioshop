import BottomNav from "@/components/bottom-nav";
import CategorySelector from "@/components/CategorySelector";
import Header from "@/components/Header";
import ProductCard from "@/components/product-card";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { parsePrice } from "@/database/products";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type SortOption = "default" | "price_asc" | "price_desc";
type PriceRange = "all" | "under_3m" | "3m_6m" | "6m_10m" | "over_10m";

const PRICE_RANGES: { id: PriceRange; label: string }[] = [
  { id: "all", label: "Tất cả giá" },
  { id: "under_3m", label: "< 3 Tr" },
  { id: "3m_6m", label: "3 - 6 Tr" },
  { id: "6m_10m", label: "6 - 10 Tr" },
  { id: "over_10m", label: "> 10 Tr" },
];

export default function ShopScreen() {
  const { products, categories } = useStore();
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");

  const filtered = useMemo(() => {
    let result = products.filter((product) => {
      // 1. Category/Brand
      const matchBrand =
        selectedBrand === "Tất cả" ||
        product.brand.toLowerCase() === selectedBrand.toLowerCase();

      // 2. Query search
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q);

      // 3. Price Range
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

      return matchBrand && matchQuery && matchPrice;
    });

    if (sortBy === "price_asc") {
      result = [...result].sort(
        (a, b) => parsePrice(a.price) - parsePrice(b.price),
      );
    } else if (sortBy === "price_desc") {
      result = [...result].sort(
        (a, b) => parsePrice(b.price) - parsePrice(a.price),
      );
    }

    return result;
  }, [products, selectedBrand, query, sortBy, priceRange]);

  return (
    <View style={styles.screen}>
      <Header title="DANH MỤC SẢN PHẨM" showBack={true} />

      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.heading}>Bộ Sưu Tập Casio</Text>
            <Text style={styles.subtitle}>
              Lọc theo danh mục, mức giá và tìm kiếm đồng hồ chính hãng
            </Text>

            {/* Search Input Box (Requirement 9) */}
            <View style={styles.searchContainer}>
              <Ionicons
                name="search-outline"
                size={20}
                color="#8a96a3"
                style={styles.searchIcon}
              />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Tìm theo tên, mã sản phẩm hoặc thương hiệu..."
                placeholderTextColor="#9aa0a6"
                style={styles.searchInput}
              />
              {query.length > 0 && (
                <Pressable
                  onPress={() => setQuery("")}
                  hitSlop={8}
                  style={styles.clearBtn}
                >
                  <Ionicons name="close-circle" size={18} color="#8a96a3" />
                </Pressable>
              )}
            </View>

            {/* CategorySelector (Requirement 3) */}
            <CategorySelector
              categories={categories}
              selectedCategory={selectedBrand}
              onSelectCategory={(cat) => setSelectedBrand(cat)}
              title="LỌC THEO LOẠI SẢN PHẨM"
            />

            {/* Price Range Filter (Requirement 10) */}
            <View style={styles.priceRow}>
              <Text style={styles.filterTitle}>KHOẢNG GIÁ:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pricePills}
              >
                {PRICE_RANGES.map((r) => {
                  const isActive = priceRange === r.id;
                  return (
                    <Pressable
                      key={r.id}
                      onPress={() => setPriceRange(r.id)}
                      style={[
                        styles.priceChip,
                        isActive && styles.activePriceChip,
                      ]}
                    >
                      <Text
                        style={[
                          styles.priceChipText,
                          isActive && styles.activePriceChipText,
                        ]}
                      >
                        {r.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Sort bar and count */}
            <View style={styles.sortBar}>
              <Text style={styles.countText}>
                Tìm thấy{" "}
                <Text style={styles.countHighlight}>{filtered.length}</Text> sản
                phẩm
              </Text>
              <View style={styles.sortButtons}>
                <Pressable
                  onPress={() => setSortBy("default")}
                  style={[
                    styles.sortBtn,
                    sortBy === "default" && styles.activeSortBtn,
                  ]}
                >
                  <Text
                    style={[
                      styles.sortBtnText,
                      sortBy === "default" && styles.activeSortBtnText,
                    ]}
                  >
                    Mặc định
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setSortBy("price_asc")}
                  style={[
                    styles.sortBtn,
                    sortBy === "price_asc" && styles.activeSortBtn,
                  ]}
                >
                  <Ionicons
                    name="arrow-up"
                    size={13}
                    color={sortBy === "price_asc" ? "#0b1f33" : "#8a96a3"}
                  />
                  <Text
                    style={[
                      styles.sortBtnText,
                      sortBy === "price_asc" && styles.activeSortBtnText,
                    ]}
                  >
                    Giá tăng
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setSortBy("price_desc")}
                  style={[
                    styles.sortBtn,
                    sortBy === "price_desc" && styles.activeSortBtn,
                  ]}
                >
                  <Ionicons
                    name="arrow-down"
                    size={13}
                    color={sortBy === "price_desc" ? "#0b1f33" : "#8a96a3"}
                  />
                  <Text
                    style={[
                      styles.sortBtnText,
                      sortBy === "price_desc" && styles.activeSortBtnText,
                    ]}
                  >
                    Giá giảm
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={54} color="#8a96a3" />
            <Text style={styles.emptyTitle}>Không có mẫu phù hợp</Text>
            <Text style={styles.emptyDesc}>
              Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh khoảng giá.
            </Text>
            <Pressable
              onPress={() => {
                setSelectedBrand("Tất cả");
                setQuery("");
                setPriceRange("all");
              }}
              style={styles.btnReset}
            >
              <Text style={styles.btnResetText}>Xóa tất cả bộ lọc</Text>
            </Pressable>
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
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  row: {
    justifyContent: "space-between",
  },
  header: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: "900",
    color: CasioColors.text,
    paddingHorizontal: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: CasioColors.textMuted,
    paddingHorizontal: 8,
    marginTop: 2,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: CasioColors.text,
    fontSize: 13,
    height: "100%",
  },
  clearBtn: {
    padding: 4,
  },
  priceRow: {
    marginHorizontal: 8,
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1,
    marginBottom: 6,
  },
  pricePills: {
    gap: 8,
  },
  priceChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  activePriceChip: {
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    borderColor: CasioColors.accent,
  },
  priceChipText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
  },
  activePriceChipText: {
    color: CasioColors.accent,
    fontWeight: "800",
  },
  sortBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: CasioColors.border,
    marginTop: 6,
    flexWrap: "wrap",
    gap: 8,
  },
  countText: {
    fontSize: 12,
    color: CasioColors.textMuted,
  },
  countHighlight: {
    fontWeight: "800",
    color: CasioColors.accentDark,
  },
  sortButtons: {
    flexDirection: "row",
    gap: 6,
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderWidth: 1,
  },
  activeSortBtn: {
    backgroundColor: CasioColors.accent,
    borderColor: CasioColors.accent,
  },
  sortBtnText: {
    fontSize: 11,
    color: "#8a96a3",
    fontWeight: "600",
  },
  activeSortBtnText: {
    color: "#0b1f33",
    fontWeight: "800",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: CasioColors.text,
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 12,
    color: CasioColors.textMuted,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  btnReset: {
    marginTop: 16,
    backgroundColor: CasioColors.accent,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnResetText: {
    color: CasioColors.primary,
    fontWeight: "800",
    fontSize: 12,
  },
});
