import { dbService } from "@/database/sqlite";
import {
  CartItem,
  CouponResult,
  Order,
  OrderStatus,
  Product,
  RegisterFormData,
  StoreContextType,
  User,
  UserRole,
} from "@/types/store";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  // State: Products, Categories, Users, Orders
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // User session
  const [user, setUser] = useState<User | null>(null);

  // Cart & Favorites
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>(["M1", "M3"]);
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Initialize from SQLite Database
  useEffect(() => {
    let isMounted = true;
    dbService.initDatabase().then((data) => {
      if (isMounted) {
        setUsers(data.users);
        setCategories(data.categories);
        setProducts(data.products);
        setOrders(data.orders);
        if (data.orders.length > 0) {
          setLastOrder(data.orders[0]);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Auth: Login
  const login = useCallback(
    async (accountOrEmail: string, password?: string): Promise<User> => {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const cleanInput = accountOrEmail.trim().toLowerCase();
      const matched = users.find(
        (u) =>
          u.username.toLowerCase() === cleanInput ||
          u.email.toLowerCase() === cleanInput ||
          (u.phone && u.phone.trim() === cleanInput)
      );

      if (matched) {
        if (password && matched.password && matched.password !== password) {
          throw new Error("Mật khẩu không chính xác!");
        }
        setUser(matched);
        return matched;
      }

      // Check special admin shorthand fallback
      if (cleanInput === "admin" && (!password || password === "admin123")) {
        const adminUser: User = {
          id: "u-1",
          username: "admin",
          password: "admin123",
          name: "Quản Trị Viên (Admin)",
          email: "admin@example.com",
          phone: "0988 888 888",
          address: "Trụ sở Casio Store Vietnam",
          role: "admin",
          memberLevel: "ADMINISTRATOR",
          points: 9999,
        };
        setUser(adminUser);
        return adminUser;
      }

      throw new Error("Tài khoản hoặc mật khẩu không chính xác!");
    },
    [users]
  );

  // Auth: Register
  const register = useCallback(
    async (formData: RegisterFormData): Promise<User> => {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const username =
        formData.username?.trim() ||
        formData.email.split("@")[0] ||
        `user_${Date.now()}`;

      const existing = users.find(
        (u) =>
          u.username.toLowerCase() === username.toLowerCase() ||
          u.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (existing) {
        throw new Error("Tài khoản hoặc email này đã tồn tại trong hệ thống!");
      }

      const role: UserRole =
        formData.role || (username.toLowerCase() === "admin" ? "admin" : "user");

      const newUser: User = {
        id: `u-${Date.now()}`,
        username,
        name: formData.name || username,
        email: formData.email,
        phone: formData.phone || "0912 345 678",
        address: formData.address || "Việt Nam",
        role,
        memberLevel: role === "admin" ? "ADMINISTRATOR" : "MEMBER",
        points: role === "admin" ? 9999 : 200,
        password: formData.password || "123456",
      };

      // Save to SQLite
      dbService.insertUser(newUser);

      setUsers((prev) => [...prev, newUser]);
      return newUser;
    },
    [users]
  );

  // Logout: Instantly reset session
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // User Management CRUD
  const updateUserRole = useCallback(
    (usernameOrEmail: string, newRole: UserRole) => {
      dbService.updateUserRole(usernameOrEmail, newRole);

      setUsers((prev) =>
        prev.map((u) => {
          if (
            u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
            u.email.toLowerCase() === usernameOrEmail.toLowerCase()
          ) {
            return { ...u, role: newRole };
          }
          return u;
        })
      );
      if (
        user &&
        (user.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
          user.email.toLowerCase() === usernameOrEmail.toLowerCase())
      ) {
        setUser((prev) => (prev ? { ...prev, role: newRole } : null));
      }
    },
    [user]
  );

  const deleteUser = useCallback((usernameOrEmail: string) => {
    dbService.deleteUser(usernameOrEmail);

    setUsers((prev) =>
      prev.filter(
        (u) =>
          u.username.toLowerCase() !== usernameOrEmail.toLowerCase() &&
          u.email.toLowerCase() !== usernameOrEmail.toLowerCase()
      )
    );
  }, []);

  const updateUserProfile = useCallback(
    (data: Partial<User>) => {
      setUser((prev) => {
        if (!prev) return null;
        const updated = { ...prev, ...data };
        dbService.updateUserProfile(prev.username, data);

        setUsers((currentList) =>
          currentList.map((u) => (u.username === prev.username ? updated : u))
        );
        return updated;
      });
    },
    []
  );

  // Product CRUD
  const addProduct = useCallback(
    (productData: Omit<Product, "id"> & { id?: string }): Product => {
      const id = productData.id || `M${Date.now()}`;
      const newProd: Product = {
        ...productData,
        id,
      };

      // Save to SQLite
      dbService.insertProduct(newProd);

      setProducts((prev) => [newProd, ...prev]);

      if (productData.brand && !categories.includes(productData.brand)) {
        dbService.insertCategory(productData.brand);
        setCategories((prev) => [...prev, productData.brand]);
      }
      return newProd;
    },
    [categories]
  );

  const updateProduct = useCallback(
    (id: string, updatedData: Partial<Product>) => {
      dbService.updateProduct(id, updatedData);

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
      );
      if (updatedData.brand && !categories.includes(updatedData.brand)) {
        dbService.insertCategory(updatedData.brand);
        setCategories((prev) => [...prev, updatedData.brand!]);
      }
    },
    [categories]
  );

  const deleteProduct = useCallback((id: string) => {
    dbService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Categories CRUD
  const addCategory = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      dbService.insertCategory(trimmed);
      setCategories((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    },
    []
  );

  const updateCategory = useCallback((oldName: string, newName: string) => {
    const cleanOld = oldName.trim();
    const cleanNew = newName.trim();
    if (!cleanNew || cleanOld === cleanNew) return;

    dbService.updateCategory(cleanOld, cleanNew);

    setCategories((prev) => prev.map((c) => (c === cleanOld ? cleanNew : c)));
    setProducts((prev) =>
      prev.map((p) => (p.brand === cleanOld ? { ...p, brand: cleanNew } : p))
    );
  }, []);

  const deleteCategory = useCallback((name: string) => {
    dbService.deleteCategory(name);
    setCategories((prev) => prev.filter((c) => c !== name));
  }, []);

  // Cart operations
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...currentCart, { ...product, quantity }];
    });
  }, []);

  const changeQuantity = useCallback((productId: string, amount: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Favorites
  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites]
  );

  // Coupon
  const applyCoupon = useCallback((code: string): CouponResult => {
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
    return {
      success: false,
      message: "Mã giảm giá không hợp lệ hoặc đã hết hạn",
    };
  }, []);

  const removeCoupon = useCallback(() => {
    setDiscountCode("");
    setDiscountPercent(0);
  }, []);

  // Financial calculations
  const subtotal = useMemo(
    () =>
      cart.reduce((total, item) => {
        const num =
          typeof item.price === "number"
            ? item.price
            : Number(String(item.price).replace(/[^0-9]/g, ""));
        return total + num * item.quantity;
      }, 0),
    [cart]
  );

  const discountAmount = useMemo(
    () => Math.round((subtotal * discountPercent) / 100),
    [subtotal, discountPercent]
  );

  const shippingFee = subtotal > 2000000 || subtotal === 0 ? 0 : 40000;
  const cartTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Orders
  const placeOrder = useCallback(
    (orderData: Partial<Order>): Order => {
      const orderId = `CASIO-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: orderId,
        items: [...cart],
        subtotal,
        discountAmount,
        shippingFee,
        total: cartTotal,
        createdAt: new Date().toISOString(),
        status: "Chờ xác nhận",
        customerName: user?.name || orderData.customerName || "Khách Hàng",
        email: user?.email || orderData.email || "guest@example.com",
        phone: user?.phone || orderData.phone || "0908 123 456",
        address: user?.address || orderData.address || "Việt Nam",
        ...orderData,
      };

      // Save to SQLite
      dbService.insertOrder(newOrder);

      setLastOrder(newOrder);
      setOrders((prev) => [newOrder, ...prev]);
      setCart([]);
      setDiscountCode("");
      setDiscountPercent(0);
      return newOrder;
    },
    [cart, subtotal, discountAmount, shippingFee, cartTotal, user]
  );

  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    dbService.updateOrderStatus(orderId, newStatus);

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    setLastOrder((prev) =>
      prev && prev.id === orderId ? { ...prev, status: newStatus } : prev
    );
  }, []);

  const resetDatabase = useCallback(() => {
    const data = dbService.resetDatabase();
    setProducts(data.products);
    setCategories(data.categories);
    setUsers(data.users);
    setOrders(data.orders);
  }, []);

  const value: StoreContextType = useMemo(
    () => ({
      products,
      addProduct,
      updateProduct,
      deleteProduct,

      categories,
      addCategory,
      updateCategory,
      deleteCategory,

      users,
      user,
      login,
      register,
      logout,
      updateUserRole,
      deleteUser,
      updateUserProfile,

      cart,
      cartCount: cart.reduce((total, item) => total + item.quantity, 0),
      cartSubtotal: subtotal,
      discountCode,
      discountPercent,
      discountAmount,
      shippingFee,
      cartTotal,
      addToCart,
      changeQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      removeCoupon,

      favorites,
      favoritesCount: favorites.length,
      toggleFavorite,
      isFavorite,

      orders,
      lastOrder,
      placeOrder,
      updateOrderStatus,
      resetDatabase,
    }),
    [
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      users,
      user,
      login,
      register,
      logout,
      updateUserRole,
      deleteUser,
      updateUserProfile,
      cart,
      subtotal,
      discountCode,
      discountPercent,
      discountAmount,
      shippingFee,
      cartTotal,
      addToCart,
      changeQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      removeCoupon,
      favorites,
      orders,
      lastOrder,
      placeOrder,
      updateOrderStatus,
      resetDatabase,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
