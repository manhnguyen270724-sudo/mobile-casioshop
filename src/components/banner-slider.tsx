import { CasioColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_WIDTH = SCREEN_WIDTH - 24; // with horizontal margin

interface BannerItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  brandTarget: string;
}

const BANNERS: BannerItem[] = [
  {
    id: "b1",
    tag: "G-SHOCK 2026",
    title: "VƯỢT MỌI GIỚI HẠN",
    subtitle: "Chống va đập tuyệt đối • Kháng nước 200M",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop",
    brandTarget: "G-Shock",
  },
  {
    id: "b2",
    tag: "CASIO EDIFICE",
    title: "TỐC ĐỘ & ĐẲNG CẤP",
    subtitle: "Thiết kế thể thao bấm giờ Chronograph đỉnh cao",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop",
    brandTarget: "Citizen",
  },
  {
    id: "b3",
    tag: "RETRO HERITAGE",
    title: "HUYỀN THOẠI CỔ ĐIỂN",
    subtitle: "Nét đẹp phi thời gian cho phong cách hằng ngày",
    image:
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000&auto=format&fit=crop",
    brandTarget: "Vintage",
  },
];

export default function BannerSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<BannerItem>>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % BANNERS.length;
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: next,
            animated: true,
          });
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / BANNER_WIDTH);
    if (index >= 0 && index < BANNERS.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={BANNERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(item) => item.id}
        snapToInterval={BANNER_WIDTH}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push("/shop")}
            style={({ pressed }) => [
              styles.bannerSlide,
              { width: BANNER_WIDTH },
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            {/* Dark gradient overlay for text readability */}
            <View style={styles.overlay} />

            <View style={styles.bannerContent}>
              <View style={styles.tagWrap}>
                <Ionicons name="sparkles" size={11} color={CasioColors.accent} />
                <Text style={styles.tagText}>{item.tag}</Text>
              </View>

              <Text style={styles.bannerTitle}>{item.title}</Text>
              <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>

              <View style={styles.ctaButton}>
                <Text style={styles.ctaText}>MUA NGAY</Text>
                <Ionicons name="arrow-forward" size={14} color={CasioColors.primary} />
              </View>
            </View>
          </Pressable>
        )}
      />

      {/* Dots Indicator */}
      <View style={styles.dotsRow}>
        {BANNERS.map((_, i) => (
          <View
            key={`dot-${i}`}
            style={[styles.dot, activeIndex === i && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: "center",
  },
  bannerSlide: {
    height: 195,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    backgroundColor: CasioColors.primary,
    shadowColor: "#0b1f33",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  bannerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(11, 31, 51, 0.65)",
  },
  bannerContent: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    zIndex: 2,
  },
  tagWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    backgroundColor: "rgba(245, 196, 81, 0.2)",
    borderColor: CasioColors.accent,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 8,
  },
  tagText: {
    color: CasioColors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  bannerTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 28,
    letterSpacing: 0.5,
  },
  bannerSubtitle: {
    color: "#e2e8f0",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    maxWidth: "85%",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: CasioColors.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 14,
  },
  ctaText: {
    color: CasioColors.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#dedbd4",
  },
  activeDot: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: CasioColors.accentDark,
  },
  pressed: {
    opacity: 0.92,
  },
});
