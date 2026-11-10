import { CasioColors } from "@/constants/theme";
import { useStore } from "@/context/StoreContext";
import { formatPrice, parsePrice } from "@/database/products";
import { Product } from "@/types/store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  GestureResponderEvent,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700&auto=format&fit=crop&q=80";

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function ProductCard({ product, horizontal = false, style }: ProductCardProps) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const favorited = isFavorite(product.id);
  const [imgUri, setImgUri] = useState<string>(
    product.img && !product.img.includes("watchstore.vn") ? product.img : FALLBACK_IMAGE
  );

  useEffect(() => {
    setImgUri(product.img && !product.img.includes("watchstore.vn") ? product.img : FALLBACK_IMAGE);
  }, [product.img]);

  return (
    <View style={[styles.card, horizontal ? styles.cardHorizontal : styles.cardGrid, style]}>
      <Pressable
        onPress={() =>
          router.push({ pathname: "/product", params: { id: product.id } })
        }
        style={({ pressed }) => [styles.touchArea, pressed && styles.cardPressed]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imgUri }}
            onError={() => setImgUri(FALLBACK_IMAGE)}
            style={styles.image}
            resizeMode="contain"
          />
          <Pressable
            hitSlop={8}
            onPress={(e: GestureResponderEvent) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={favorited ? "heart" : "heart-outline"}
              size={18}
              color={favorited ? CasioColors.crimson : "#8a96a3"}
            />
          </Pressable>
          <View style={styles.badgeOfficial}>
            <Text style={styles.badgeText}>CHÍNH HÃNG</Text>
          </View>
        </View>

        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.brand}>
            {product.brand}
          </Text>
          <Text numberOfLines={2} style={styles.name}>
            {product.name}
          </Text>
          <View style={styles.priceRow}>
            <Text numberOfLines={1} style={styles.price}>
              {formatPrice(parsePrice(product.price))}
            </Text>
          </View>
        </View>
      </Pressable>

      <Pressable
        onPress={() => addToCart(product)}
        style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}
      >
        <Ionicons name="bag-add-outline" size={15} color="#ffffff" style={styles.btnIcon} />
        <Text style={styles.buttonText}>Thêm vào giỏ</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CasioColors.surface,
    borderColor: CasioColors.border,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#0b1f33",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: "space-between",
  },
  cardGrid: {
    width: "48%",
    marginBottom: 14,
  },
  cardHorizontal: {
    width: 175,
    marginRight: 12,
  },
  touchArea: {
    flex: 1,
  },
  cardPressed: {
    transform: [{ scale: 0.97 }, { perspective: 800 }, { rotateX: "3deg" }],
    opacity: 0.94,
  },
  imageContainer: {
    backgroundColor: "#faf9f6",
    height: 150,
    width: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: "90%",
    height: "90%",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeOfficial: {
    position: "absolute",
    bottom: 6,
    left: 6,
    backgroundColor: CasioColors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: CasioColors.accent,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  info: {
    padding: 10,
    paddingBottom: 4,
  },
  brand: {
    color: CasioColors.accentDark,
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: {
    color: CasioColors.text,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    minHeight: 36,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  price: {
    color: CasioColors.crimson,
    fontSize: 14,
    fontWeight: "900",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CasioColors.primary,
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 4,
    borderRadius: 7,
    paddingVertical: 9,
    gap: 4,
  },
  buttonPressed: {
    opacity: 0.85,
    backgroundColor: CasioColors.primaryLight,
  },
  btnIcon: {
    marginRight: 0,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
});
