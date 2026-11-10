import { ToastProvider } from "@/components/common/Toast";
import { CasioColors } from "@/constants/theme";
import { StoreProvider } from "@/context/StoreContext";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

// Prevent auto-hiding until ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after initialization
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <StoreProvider>
      <ToastProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 280,
            gestureEnabled: true,
            contentStyle: { backgroundColor: CasioColors.background },
          }}
        >
        <Stack.Screen
          name="index"
          options={{
            animation: "none",
          }}
        />
        <Stack.Screen
          name="shop"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="favorites"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="cart"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="product"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="checkout"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="order-success"
          options={{
            animation: "fade_from_bottom",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="auth"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="admin/index"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="admin/users"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="admin/categories"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="admin/products"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="admin/orders"
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack>
      </ToastProvider>
    </StoreProvider>
  );
}
