import { CasioColors } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface LoadingDotsProps {
  color?: string;
  size?: number;
  spacing?: number;
}

export default function LoadingDots({
  color = CasioColors.accent,
  size = 11,
  spacing = 8,
}: LoadingDotsProps) {
  const [dot1] = useState(() => new Animated.Value(0));
  const [dot2] = useState(() => new Animated.Value(0));
  const [dot3] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const create3DBounce = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1, // peak
            duration: 320,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0, // ground
            duration: 320,
            useNativeDriver: true,
          }),
          Animated.delay(320 - delay),
        ])
      );
    };

    const a1 = create3DBounce(dot1, 0);
    const a2 = create3DBounce(dot2, 140);
    const a3 = create3DBounce(dot3, 280);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  const render3DSphere = (animVal: Animated.Value, key: string) => {
    const translateY = animVal.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -12], // 3D vertical jump
    });

    const scaleY = animVal.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0.85, 1.15, 1.05, 1], // realistic squash & stretch
    });

    const scaleX = animVal.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [1.15, 0.9, 0.98, 1],
    });

    const shadowScale = animVal.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.45], // ground shadow shrinks as ball rises
    });

    const shadowOpacity = animVal.interpolate({
      inputRange: [0, 1],
      outputRange: [0.35, 0.1],
    });

    return (
      <View key={key} style={[styles.sphereContainer, { marginHorizontal: spacing / 2 }]}>
        {/* 3D Ball */}
        <Animated.View
          style={[
            styles.sphere,
            {
              backgroundColor: color,
              width: size,
              height: size,
              borderRadius: size / 2,
              transform: [{ translateY }, { scaleX }, { scaleY }],
            },
          ]}
        >
          {/* 3D Specular Highlight */}
          <View style={styles.specularGleam} />
        </Animated.View>

        {/* 3D Dynamic Ground Shadow */}
        <Animated.View
          style={[
            styles.groundShadow,
            {
              width: size * 0.9,
              height: size * 0.35,
              borderRadius: size * 0.45,
              opacity: shadowOpacity,
              transform: [{ scaleX: shadowScale }],
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {render3DSphere(dot1, "d1")}
      {render3DSphere(dot2, "d2")}
      {render3DSphere(dot3, "d3")}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    height: 32,
  },
  sphereContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 28,
  },
  sphere: {
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  specularGleam: {
    position: "absolute",
    top: 2,
    left: 2,
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
  groundShadow: {
    backgroundColor: "rgba(11, 31, 51, 0.8)",
    marginTop: 2,
  },
});
