import { CasioColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  title?: string;
}

export default function CategorySelector({
  categories,
  selectedCategory,
  onSelectCategory,
  title = "DANH MỤC SẢN PHẨM",
}: CategorySelectorProps) {
  // Ensure "Tất cả" is present
  const allCategories = categories.includes("Tất cả")
    ? categories
    : ["Tất cả", ...categories];

  return (
    <View style={styles.container}>
      {!!title && (
        <View style={styles.headerRow}>
          <Ionicons name="grid-outline" size={15} color={CasioColors.accent} />
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {allCategories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => onSelectCategory(cat)}
              style={({ pressed }) => [
                styles.categoryChip,
                isActive && styles.activeChip,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  isActive && styles.activeCategoryText,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  scrollList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  activeChip: {
    backgroundColor: CasioColors.accent,
    borderColor: CasioColors.accent,
  },
  categoryText: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "600",
  },
  activeCategoryText: {
    color: CasioColors.primary,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.8,
  },
});

