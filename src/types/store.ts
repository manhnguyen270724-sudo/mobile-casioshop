export interface Product {
  id: string;
  brand: string;
  name: string;
  img: string;
  price: string | number;
  description?: string;
  specs?: Record<string, string>;
  rating?: number;
  reviewsCount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type UserRole = "admin" | "user";

export interface User {
  id?: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  memberLevel: string;
  points: number;
}

export interface RegisterFormData {
  username?: string;
  name?: string;
  email: string;
  phone?: string;
  address?: string;
  password?: string;
  role?: UserRole;
}

export type OrderStatus =
  | "Chờ xác nhận"
  | "Đang xử lý"
  | "Đang giao hàng"
  | "Đã giao"
  | "Đã hủy";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  status: OrderStatus;
  customerName?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
  paymentMethod?: string;
  shippingMethod?: string;
  finalTotal?: number;
  [key: string]: any;
}

export interface CouponResult {
  success: boolean;
  message: string;
}

export interface StoreContextType {
  // Products CRUD
  products: Product[];
  addProduct: (product: Omit<Product, "id"> & { id?: string }) => Product;
  updateProduct: (id: string, updatedData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Categories CRUD
  categories: string[];
  addCategory: (name: string) => void;
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;

  // Users Management
  users: User[];
  user: User | null;
  login: (accountOrEmail: string, password?: string) => Promise<User>;
  register: (formData: RegisterFormData) => Promise<User>;
  logout: () => void;
  updateUserRole: (usernameOrEmail: string, newRole: UserRole) => void;
  deleteUser: (usernameOrEmail: string) => void;
  updateUserProfile: (data: Partial<User>) => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  discountCode: string;
  discountPercent: number;
  discountAmount: number;
  shippingFee: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  changeQuantity: (productId: string, amount: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => CouponResult;
  removeCoupon: () => void;

  // Favorites
  favorites: string[];
  favoritesCount: number;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Orders
  orders: Order[];
  lastOrder: Order | null;
  placeOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // Database Management
  resetDatabase: () => void;
}
