import { createContext, useCallback, useContext, useMemo, useState } from "react";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(["M1", "M3"]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [lastOrder, setLastOrder] = useState(null);
  const [user, setUser] = useState(null);

  const login = useCallback(async (email, password) => {
    // Simulate network delay to showcase 3-dots loading animation
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const loggedUser = {
      name: email.split("@")[0] || "Khách Hàng Casio",
      email,
      phone: "0908 123 456",
      address: "123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      memberLevel: "VIP GOLD",
      points: 1500,
    };
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const register = useCallback(async (formData) => {
    // Simulate network delay for 3-dots loading animation
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const newUser = {
      name: formData.name || "Thành Viên Mới",
      email: formData.email,
      phone: formData.phone || "0912 345 678",
      address: formData.address || "Việt Nam",
      memberLevel: "MEMBER",
      points: 200,
    };
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...currentCart, { ...product, quantity }];
    });
  }, []);

  const changeQuantity = useCallback((productId, amount) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleFavorite = useCallback((productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const isFavorite = useCallback(
    (productId) => favorites.includes(productId),
    [favorites],
  );

  const applyCoupon = useCallback((code) => {
    const clean = code.trim().toUpperCase();
    if (clean === "CASIO10" || clean === "VIP10") {
      setDiscountCode(clean);
      setDiscountPercent(10);
      return { success: true, message: "Áp dụng mã giảm 10% thành công!" };
    }
    if (clean === "CASIO20") {
      setDiscountCode(clean);
      setDiscountPercent(20);
      return { success: true, message: "Áp dụng mã giảm 20% thành công!" };
    }
    return { success: false, message: "Mã giảm giá không hợp lệ hoặc đã hết hạn" };
  }, []);

  const removeCoupon = useCallback(() => {
    setDiscountCode("");
    setDiscountPercent(0);
  }, []);

  const subtotal = useMemo(
    () =>
      cart.reduce((total, item) => {
        const num =
          typeof item.price === "number"
            ? item.price
            : Number(String(item.price).replace(/[^0-9]/g, ""));
        return total + num * item.quantity;
      }, 0),
    [cart],
  );

  const discountAmount = useMemo(
    () => Math.round((subtotal * discountPercent) / 100),
    [subtotal, discountPercent],
  );

  const shippingFee = subtotal > 2000000 || subtotal === 0 ? 0 : 40000;
  const cartTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const placeOrder = useCallback(
    (orderData) => {
      const orderId = `CASIO-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder = {
        id: orderId,
        items: [...cart],
        subtotal,
        discountAmount,
        shippingFee,
        total: cartTotal,
        createdAt: new Date().toISOString(),
        ...orderData,
      };
      setLastOrder(newOrder);
      setCart([]);
      setDiscountCode("");
      setDiscountPercent(0);
      return newOrder;
    },
    [cart, subtotal, discountAmount, shippingFee, cartTotal],
  );

  const value = useMemo(
    () => ({
      cart,
      cartCount: cart.reduce((total, item) => total + item.quantity, 0),
      cartSubtotal: subtotal,
      discountCode,
      discountPercent,
      discountAmount,
      shippingFee,
      cartTotal,
      favorites,
      favoritesCount: favorites.length,
      lastOrder,
      user,
      login,
      register,
      logout,
      addToCart,
      changeQuantity,
      removeFromCart,
      clearCart,
      toggleFavorite,
      isFavorite,
      applyCoupon,
      removeCoupon,
      placeOrder,
    }),
    [
      cart,
      subtotal,
      discountCode,
      discountPercent,
      discountAmount,
      shippingFee,
      cartTotal,
      favorites,
      lastOrder,
      user,
      login,
      register,
      logout,
      addToCart,
      changeQuantity,
      removeFromCart,
      clearCart,
      toggleFavorite,
      isFavorite,
      applyCoupon,
      removeCoupon,
      placeOrder,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
