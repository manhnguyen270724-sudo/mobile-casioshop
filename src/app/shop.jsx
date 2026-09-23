import BottomNav from "@/components/bottom-nav";
import ProductCard from "@/components/product-card";
import StoreHeader from "@/components/store-header";
import { CasioColors } from "@/constants/theme";
import { brands, parsePrice, products } from "@/data/products";
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

export default function ShopScreen() {
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("default"); // 'default' | 'price_asc' | 'price_desc'

  const filtered = useMemo(() => {
    let result = products.filter(
      (product) =>
        (selectedBrand === "Tất cả" || product.brand === selectedBrand) &&
        product.name.toLowerCase().includes(query.toLowerCase()),
    );

    if (sortBy === "price_asc") {
      result = [...result].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortBy === "price_desc") {
      result = [...result].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    return result;
  }, [selectedBrand, query, sortBy]);

  return (
    <View style={styles.screen}>
      <StoreHeader title="BỘ SƯU TẬP" showBack={false} />

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
            <Text style={styles.heading}>Khám Phá Đồng Hồ</Text>
            <Text style={styles.subtitle}>
              Hàng trăm mẫu đồng hồ Casio chính hãng với ưu đãi đặc quyền
            </Text>

            {/* Search Input Box */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#8a96a3" style={styles.searchIcon} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Tìm theo tên, mã sản phẩm..."
                placeholderTextColor="#9aa0a6"
                style={styles.searchInput}
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery("")} hitSlop={8} style={styles.clearBtn}>
                  <Ionicons name="close-circle" size={18} color="#8a96a3" />
                </Pressable>
              )}
            </View>

            {/* Brand Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScroll}
            >
              {brands.map((brand) => {
                const isActive = selectedBrand === brand;
                return (
                  <Pressable
                    key={brand}
                    onPress={() => setSelectedBrand(brand)}
                    style={[
                      styles.filterChip,
                      isActive && styles.activeFilterChip,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive && styles.activeFilterChipText,
                      ]}
                    >
                      {brand}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Sort Controls & Counter */}
            <View style={styles.controlsRow}>
              <Text style={styles.countText}>
                Tìm thấy <Text style={styles.countHighlight}>{filtered.length}</Text> sản phẩm
              </Text>

              <View style={styles.sortGroup}>
                <Pressable
                  onPress={() =>
                    setSortBy((prev) =>
                      prev === "price_asc"
                        ? "price_desc"
                        : prev === "price_desc"
                        ? "default"
                        : "price_asc"
                    )
                  }
                  style={styles.sortButton}
                >
                  <Ionicons name="swap-vertical" size={14} color={CasioColors.primary} />
                  <Text style={styles.sortButtonText}>
                    {sortBy === "price_asc"
                      ? "Giá tăng dần"
                      : sortBy === "price_desc"
                      ? "Giá giảm dần"
                      : "Sắp xếp"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="search" size={48} color="#8a96a3" />
            <Text style={styles.emptyTitle}>Không tìm thấy sản phẩm</Text>
            <Text style={styles.emptyDesc}>
              Vui lòng thử tìm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ sản phẩm.
            </Text>
            <Pressable
              onPress={() => {
                setQuery("");
                setSelectedBrand("Tất cả");
                setSortBy("default");
              }}
              style={styles.resetBtn}
            >
              <Text style={styles.resetBtnText}>Xem tất cả sản phẩm</Text>
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
    padding: 8,
    paddingBottom: 24,
  },
  row: {
    justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 6,
  },
  heading: {
    color: CasioColors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  subtitle: {
    color: CasioColors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: CasioColors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: CasioColors.text,
    paddingVertical: 11,
    fontSize: 13,
    fontWeight: "600",
  },
  clearBtn: {
    padding: 4,
  },
  filtersScroll: {
    gap: 8,
    paddingVertical: 4,
    marginBottom: 10,
  },
  filterChip: {
    borderColor: CasioColors.border,
    backgroundColor: CasioColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  activeFilterChip: {
    backgroundColor: CasioColors.primary,
    borderColor: CasioColors.primary,
  },
  filterChipText: {
    color: CasioColors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  activeFilterChipText: {
    color: CasioColors.accent,
    fontWeight: "800",
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: CasioColors.border,
    marginTop: 4,
  },
  countText: {
    color: CasioColors.textSecondary,
    fontSize: 12,
  },
  countHighlight: {
    fontWeight: "800",
    color: CasioColors.text,
  },
  sortGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ffffff",
    borderColor: CasioColors.border,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  sortButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: CasioColors.primary,
  },
  emptyWrap: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: CasioColors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 12,
    color: CasioColors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 18,
  },
  resetBtn: {
    backgroundColor: CasioColors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
});
