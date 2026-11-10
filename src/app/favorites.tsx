import BottomNav from "@/components/bottom-nav";
import Header from "@/components/Header";
import ProductCard from "@/components/product-card";
import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  const { favorites, products } = useStore();
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <View style={styles.screen}>
      <Header title="YÊU THÍCH" showBack={false} />

      {favoriteProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="heart-outline" size={54} color={CasioColors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Danh sách yêu thích trống</Text>
          <Text style={styles.emptySubtitle}>
            Hãy lưu lại những mẫu đồng hồ Casio bạn yêu thích để dễ dàng theo dõi và mua sắm sau này.
          </Text>
          <Pressable
            onPress={() => router.push("/shop")}
            style={({ pressed }) => [styles.exploreBtn, pressed && styles.pressed]}
          >
            <Text style={styles.exploreBtnText}>KHÁM PHÁ NGAY</Text>
            <Ionicons name="arrow-forward" size={18} color="#0b1f33" />
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={favoriteProducts}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => <ProductCard product={item} />}
          ListHeaderComponent={
            <View style={styles.headerArea}>
              <Text style={styles.heading}>Bộ sưu tập yêu thích</Text>
              <Text style={styles.subtitle}>
                Bạn đang lưu {favoriteProducts.length} mẫu đồng hồ
              </Text>
            </View>
          }
        />
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
  list: {
    padding: 10,
    paddingBottom: 24,
  },
  row: {
    justifyContent: "space-between",
  },
  headerArea: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: "900",
    color: CasioColors.text,
  },
  subtitle: {
    fontSize: 13,
    color: CasioColors.textSecondary,
    marginTop: 4,
    fontWeight: "500",
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
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: CasioColors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreBtnText: {
    color: CasioColors.primary,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  pressed: {
    opacity: 0.88,
  },
});
