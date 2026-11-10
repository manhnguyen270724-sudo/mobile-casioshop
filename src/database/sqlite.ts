import { Order, OrderStatus, Product, User } from "@/types/store";
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

// Initial seed data
const SEED_USERS: User[] = [
  {
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
  },
  {
    id: "u-2",
    username: "user1",
    password: "user123",
    name: "Nguyễn Văn Một",
    email: "user1@example.com",
    phone: "0901 111 222",
    address: "123 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM",
    role: "user",
    memberLevel: "VIP GOLD",
    points: 1200,
  },
  {
    id: "u-3",
    username: "user2",
    password: "user234",
    name: "Trần Thị Hai",
    email: "user2@example.com",
    phone: "0902 222 333",
    address: "456 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
    role: "user",
    memberLevel: "MEMBER",
    points: 350,
  },
  {
    id: "u-4",
    username: "user3",
    password: "user345",
    name: "Lê Hoàng Long",
    email: "user3@example.com",
    phone: "0903 333 444",
    address: "789 Cách Mạng Tháng 8, Quận 3, TP.HCM",
    role: "user",
    memberLevel: "MEMBER",
    points: 400,
  },
  {
    id: "u-5",
    username: "user4",
    password: "user456",
    name: "Phạm Minh Thư",
    email: "user4@example.com",
    phone: "0904 444 555",
    address: "12 Võ Văn Tần, Quận 3, TP.HCM",
    role: "user",
    memberLevel: "MEMBER",
    points: 250,
  },
  {
    id: "u-6",
    username: "user5",
    password: "user567",
    name: "Đặng Tiến Dũng",
    email: "user5@example.com",
    phone: "0905 555 666",
    address: "34 Phan Đăng Lưu, Phú Nhuận, TP.HCM",
    role: "user",
    memberLevel: "MEMBER",
    points: 300,
  },
  {
    id: "u-7",
    username: "user6",
    password: "user678",
    name: "Bùi Thị Mai",
    email: "user6@example.com",
    phone: "0906 666 777",
    address: "56 Nguyễn Trãi, Quận 5, TP.HCM",
    role: "user",
    memberLevel: "MEMBER",
    points: 150,
  },
  {
    id: "u-8",
    username: "user7",
    password: "user789",
    name: "Vũ Hải Nam",
    email: "user7@example.com",
    phone: "0907 777 888",
    address: "88 Lý Thường Kiệt, Quận 10, TP.HCM",
    role: "user",
    memberLevel: "MEMBER",
    points: 500,
  },
  {
    id: "u-9",
    username: "user8",
    password: "user890",
    name: "Hoàng Gia Bảo",
    email: "user8@example.com",
    phone: "0908 888 999",
    address: "99 Hai Bà Trưng, Quận 1, TP.HCM",
    role: "user",
    memberLevel: "MEMBER",
    points: 620,
  },
  {
    id: "u-10",
    username: "user9",
    password: "user901",
    name: "Đỗ Kim Ngân",
    email: "user9@example.com",
    phone: "0909 999 000",
    address: "101 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM",
    role: "user",
    memberLevel: "MEMBER",
    points: 800,
  },
];

const SEED_CATEGORIES: string[] = [
  "G-Shock",
  "Citizen",
  "Seiko",
  "Vintage",
  "Omega",
  "Edifice",
];

const SEED_PRODUCTS: Product[] = [
  {
    id: "M1",
    brand: "G-Shock",
    name: "Đồng Hồ Bonest Gatti 47mm Nam BG5606-A2",
    img: "https://www.watchstore.vn/wp-content/uploads/2023/11/bg5606-a2-1-917313870-1440319181-1712669090-768x768.jpg",
    price: "6.197.500₫",
    description: "Thiết kế thể thao góc cạnh, mặt số đa tầng, chống nước 200M, bảo hành 5 năm.",
    rating: 4.9,
    reviewsCount: 142,
  },
  {
    id: "M2",
    brand: "G-Shock",
    name: "Đồng Hồ Bonest Gatti 45mm Nam BG4001-R2",
    img: "https://www.watchstore.vn/wp-content/uploads/2023/12/bg5804-a2-1-750261156-1218272464-1712669786-768x768.jpg",
    price: "6.448.750₫",
    description: "Bộ vỏ carbon siêu bền bỉ, chống sốc tuyệt đối, kính khoáng cường lực Mineral Glass.",
    rating: 4.8,
    reviewsCount: 98,
  },
  {
    id: "M3",
    brand: "G-Shock",
    name: "Đồng Hồ Casio 51mm Nam GA-110GB-1ADR",
    img: "https://www.watchstore.vn/wp-content/uploads/2020/11/ga-110gb-1adr-1995959558-852531344-1712563990-768x768.jpg",
    price: "4.066.400₫",
    description: "Phiên bản Black & Gold huyền thoại, tích hợp đèn LED Auto Light, bấm giờ 1/1000s.",
    rating: 5.0,
    reviewsCount: 310,
  },
  {
    id: "M4",
    brand: "G-Shock",
    name: "Đồng Hồ Casio 45mm Nam MTP-VD01L-1EVUDF",
    img: "https://www.watchstore.vn/wp-content/uploads/2021/05/1-khung-sp-1274501040-1790641903-1712568185-768x768.jpg",
    price: "945.600₫",
    description: "Dây da thanh lịch, hiển thị ngày tại vị trí 3 giờ, chống nước 50M tiêu chuẩn hằng ngày.",
    rating: 4.7,
    reviewsCount: 65,
  },
  {
    id: "M5",
    brand: "Citizen",
    name: "Đồng Hồ Olym Pianus 42mm Nam OP990-45.24ADGK-GL-D",
    img: "https://www.watchstore.vn/wp-content/uploads/2022/09/op990-45.24adgk-gl-d-1712726130-768x768.jpg",
    price: "7.410.000₫",
    description: "Mặt kính Sapphire nguyên khối chống xước, bộ máy cơ tự động Skeleton lộ tim độc đáo.",
    rating: 4.9,
    reviewsCount: 88,
  },
  {
    id: "M6",
    brand: "Seiko",
    name: "Đồng Hồ Bentley 42mm Nam BL2215-25MWWB-D",
    img: "https://www.watchstore.vn/wp-content/uploads/2023/08/bl2215-25mwwb-d-1-83794753-385047346-1712665485-768x768.jpg",
    price: "8.510.000₫",
    description: "Kiểu dáng quý phái, dây kim loại thép không gỉ 316L mạ PVD cao cấp.",
    rating: 4.8,
    reviewsCount: 114,
  },
  {
    id: "M7",
    brand: "Vintage",
    name: "Đồng Hồ SRWatch 40mm Nam SG7004.1101GM",
    img: "https://www.watchstore.vn/wp-content/uploads/2023/11/sg70041101gm-1-1655623959-1088545011-1712669159-768x768.jpg",
    price: "3.105.000₫",
    description: "Phong cách Retro cổ điển thập niên 80s, thiết kế mỏng nhẹ ôm trọn cổ tay.",
    rating: 4.7,
    reviewsCount: 52,
  },
  {
    id: "M8",
    brand: "Vintage",
    name: "Đồng Hồ Citizen 43mm Nam AN3600-59L",
    img: "https://www.watchstore.vn/wp-content/uploads/2020/11/an3600-59l-1712563825-768x768.jpg",
    price: "4.320.000₫",
    description: "Mặt số xanh navy cổ điển, 6 kim Chronograph bấm giờ thể thao mạnh mẽ.",
    rating: 4.8,
    reviewsCount: 79,
  },
  {
    id: "M9",
    brand: "Citizen",
    name: "Đồng Hồ Bonest Gatti 42mm Nam BG6003-A3",
    img: "https://www.watchstore.vn/wp-content/uploads/2023/12/bg5806-a3-1-1876520846-1933878820-1712670101-768x768.jpg",
    price: "7.537.500₫",
    description: "Thiết kế thể thao sang trọng, dạ quang phát sáng ban đêm cực rõ nét.",
    rating: 4.9,
    reviewsCount: 46,
  },
  {
    id: "M10",
    brand: "Omega",
    name: "Đồng Hồ Bonest Gatti 46mm Nam BG5501-A4",
    img: "https://www.watchstore.vn/wp-content/uploads/2023/11/bg5501-a4-1-1977979114-1746612935-1712668784-768x768.jpg",
    price: "5.527.500₫",
    description: "Dây cao su tự nhiên cao cấp kháng khuẩn, chống trầy xước, phong cách doanh nhân.",
    rating: 5.0,
    reviewsCount: 93,
  },
  {
    id: "Fm11",
    brand: "Omega",
    name: "Bulova 32mm Nữ 96L273967867",
    img: "https://www.watchstore.vn/wp-content/uploads/2022/03/96l273-1712581838-400x400.jpg",
    price: "10.612.250₫",
    description: "Đồng hồ nữ đính đá cao cấp phong cách quý phái, thiết kế tinh xảo, chống nước 30M.",
    rating: 4.9,
    reviewsCount: 38,
  },
  {
    id: "Fm12",
    brand: "Citizen",
    name: "Bulova 22mm Nữ 96X136673",
    img: "https://www.watchstore.vn/wp-content/uploads/2022/11/96x136-1-1700752665-100333105-1712589188-400x400.jpg",
    price: "4.250.000₫",
    description: "Kích thước 22mm nhỏ gọn, trang nhã, kính cứng Mineral Crystal chống va đập tốt.",
    rating: 4.8,
    reviewsCount: 45,
  },
  {
    id: "Fm13",
    brand: "Omega",
    name: "Freelook 34mm Nữ FL.1.10049.1",
    img: "https://www.watchstore.vn/wp-content/uploads/2021/11/fl-661303999-1468444074-1712574475-400x400.jpg",
    price: "1.507.500₫",
    description: "Dây kim loại mạ vàng hồng thanh lịch, mặt số tối giản dễ phối đồ công sở.",
    rating: 4.7,
    reviewsCount: 29,
  },
  {
    id: "Fm14",
    brand: "Omega",
    name: "Ogival 34mm Nữ OG380-451DLW",
    img: "https://www.watchstore.vn/wp-content/uploads/2022/06/380-451dlw-1-1654585952376-1712585553-400x400.jpg",
    price: "9.030.000₫",
    description: "Bộ máy Thụy Sĩ chuẩn xác, viền đính kim cương nhân tạo Swarovski lấp lánh.",
    rating: 5.0,
    reviewsCount: 67,
  },
  {
    id: "Fm15",
    brand: "Omega",
    name: "Versus 36mm Nữ VSP641618",
    img: "https://www.watchstore.vn/wp-content/uploads/2022/08/vsp641618-1-652387053-684910801-1712587496-400x400.jpg",
    price: "4.675.000₫",
    description: "Thương hiệu thời trang Italy, thiết kế cá tính, dây da chính hãng êm ái.",
    rating: 4.8,
    reviewsCount: 41,
  },
  {
    id: "Fm16",
    brand: "Seiko",
    name: "Mido 33mm Nữ M001.230.22.036.91",
    img: "https://www.watchstore.vn/wp-content/uploads/2023/01/m001-1378360526-1268271006-1712590847-400x400.jpg",
    price: "14.875.000₫",
    description: "Kính Sapphire chống trầy xước tuyệt đối, mạ vàng PVD demi sang trọng đẳng cấp.",
    rating: 5.0,
    reviewsCount: 82,
  },
  {
    id: "Fm17",
    brand: "Citizen",
    name: "Citizen 30mm Nữ EM0320-59D",
    img: "https://www.watchstore.vn/wp-content/uploads/2021/07/em0320-59d-1712572339-400x400.jpg",
    price: "7.670.000₫",
    description: "Công nghệ năng lượng ánh sáng Eco-Drive không cần thay pin, vỏ thép 316L sáng bóng.",
    rating: 4.9,
    reviewsCount: 56,
  },
  {
    id: "Fm18",
    brand: "Seiko",
    name: "Bentley 34mm Nữ BL2333-10LTDI",
    img: "https://www.watchstore.vn/wp-content/uploads/2024/03/bl2333-10ltdi-1-75836748-1949570291-1712670901-400x400.jpg",
    price: "3.478.000₫",
    description: "Thiết kế mặt khảm xà cừ tự nhiên chuyển sắc, dây da trẻ trung hiện đại.",
    rating: 4.7,
    reviewsCount: 34,
  },
  {
    id: "Fm19",
    brand: "Seiko",
    name: "Bulova 32mm Nữ 96L267678",
    img: "https://www.watchstore.vn/wp-content/uploads/2021/12/96l267-1-924642084-550870592-1712575302-400x400.jpg",
    price: "3.500.000₫",
    description: "Dáng vuông thanh lịch cổ điển, mặt số số La Mã nổi bật, máy pin Nhật Bản.",
    rating: 4.8,
    reviewsCount: 43,
  },
  {
    id: "Fm20",
    brand: "Seiko",
    name: "Freelook 32mm Nữ FL.1.10180.4",
    img: "https://www.watchstore.vn/wp-content/uploads/2021/11/fl-1825341786-821972922-1712574733-400x400.jpg",
    price: "1.455.000₫",
    description: "Giá học sinh sinh viên siêu hợp lý, chất liệu hợp kim cao cấp mạ điện phân bền màu.",
    rating: 4.6,
    reviewsCount: 71,
  },
];

const SEED_ORDERS: Order[] = [
  {
    id: "CASIO-928145",
    customerName: "Nguyễn Văn Một",
    email: "user1@example.com",
    phone: "0901 111 222",
    address: "123 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM",
    items: [
      {
        ...SEED_PRODUCTS[0],
        quantity: 1,
      },
    ],
    subtotal: 6197500,
    discountAmount: 0,
    shippingFee: 0,
    total: 6197500,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "Đang giao hàng",
    paymentMethod: "cod",
    shippingMethod: "standard",
  },
  {
    id: "CASIO-582910",
    customerName: "Trần Thị Hai",
    email: "user2@example.com",
    phone: "0902 222 333",
    address: "456 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
    items: [
      {
        ...SEED_PRODUCTS[2],
        quantity: 1,
      },
    ],
    subtotal: 4066400,
    discountAmount: 406640,
    shippingFee: 0,
    total: 3659760,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: "Đã giao",
    paymentMethod: "bank",
    shippingMethod: "express",
  },
];

// In-Memory / LocalStorage Mock for Web or Fallback
class MemoryStorage {
  users: User[] = [...SEED_USERS];
  categories: string[] = [...SEED_CATEGORIES];
  products: Product[] = [...SEED_PRODUCTS];
  orders: Order[] = [...SEED_ORDERS];

  constructor() {
    this.loadFromWebStorage();
  }

  loadFromWebStorage() {
    if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
      try {
        const u = window.localStorage.getItem("casio_users");
        if (u) {
          const loadedUsers: User[] = JSON.parse(u);
          const existingUsernames = new Set(loadedUsers.map((item) => item.username));
          const missingUsers = SEED_USERS.filter((item) => !existingUsernames.has(item.username));
          this.users = [...loadedUsers, ...missingUsers];
        }
        const c = window.localStorage.getItem("casio_categories");
        if (c) {
          const loadedCats: string[] = JSON.parse(c);
          const existingCats = new Set(loadedCats);
          const missingCats = SEED_CATEGORIES.filter((cat) => !existingCats.has(cat));
          this.categories = [...loadedCats, ...missingCats];
        }
        const p = window.localStorage.getItem("casio_products");
        if (p) {
          const loadedProds: Product[] = JSON.parse(p);
          const existingIds = new Set(loadedProds.map((item) => item.id));
          const missingProds = SEED_PRODUCTS.filter((item) => !existingIds.has(item.id));
          this.products = [...loadedProds, ...missingProds];
        }
        const o = window.localStorage.getItem("casio_orders");
        if (o) this.orders = JSON.parse(o);
      } catch {
        // use defaults
      }
    }
  }

  saveToWebStorage() {
    if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem("casio_users", JSON.stringify(this.users));
        window.localStorage.setItem("casio_categories", JSON.stringify(this.categories));
        window.localStorage.setItem("casio_products", JSON.stringify(this.products));
        window.localStorage.setItem("casio_orders", JSON.stringify(this.orders));
      } catch {
        // ignore
      }
    }
  }
}

const memoryStore = new MemoryStorage();

// SQLite Database Manager Class
class DatabaseManager {
  private db: SQLite.SQLiteDatabase | null = null;
  private isNativeSQLite = Platform.OS !== "web";

  async initDatabase(): Promise<{
    users: User[];
    categories: string[];
    products: Product[];
    orders: Order[];
  }> {
    if (!this.isNativeSQLite) {
      memoryStore.loadFromWebStorage();
      return {
        users: memoryStore.users,
        categories: memoryStore.categories,
        products: memoryStore.products,
        orders: memoryStore.orders,
      };
    }

    try {
      this.db = SQLite.openDatabaseSync("casio_store.db");

      // 1. Create Tables
      this.db.execSync(`
        PRAGMA journal_mode = WAL;
        
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE,
          password TEXT,
          name TEXT,
          email TEXT UNIQUE,
          phone TEXT,
          address TEXT,
          role TEXT,
          memberLevel TEXT,
          points INTEGER
        );

        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT UNIQUE
        );

        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          brand TEXT,
          name TEXT,
          img TEXT,
          price TEXT,
          description TEXT,
          rating REAL,
          reviewsCount INTEGER
        );

        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          customerName TEXT,
          email TEXT,
          phone TEXT,
          address TEXT,
          itemsJson TEXT,
          subtotal REAL,
          discountAmount REAL,
          shippingFee REAL,
          total REAL,
          createdAt TEXT,
          status TEXT,
          paymentMethod TEXT,
          shippingMethod TEXT
        );
      `);

      // 2. Ensure all seed data is seeded (INSERT OR IGNORE guarantees presence without overwriting changes)
      SEED_USERS.forEach((u) => {
        this.db?.runSync(
          `INSERT OR IGNORE INTO users (id, username, password, name, email, phone, address, role, memberLevel, points)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [u.id || "", u.username, u.password || "123456", u.name, u.email, u.phone, u.address, u.role, u.memberLevel, u.points]
        );
      });

      SEED_CATEGORIES.forEach((cat, index) => {
        this.db?.runSync(
          "INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?);",
          [`cat-${index + 1}`, cat]
        );
      });

      SEED_PRODUCTS.forEach((p) => {
        this.db?.runSync(
          `INSERT OR IGNORE INTO products (id, brand, name, img, price, description, rating, reviewsCount)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [p.id, p.brand, p.name, p.img, String(p.price), p.description || "", p.rating || 5.0, p.reviewsCount || 0]
        );
      });

      const orderCountRes = this.db.getFirstSync<{ count: number }>(
        "SELECT COUNT(*) as count FROM orders;"
      );
      if (!orderCountRes || orderCountRes.count === 0) {
        SEED_ORDERS.forEach((o) => {
          this.db?.runSync(
            `INSERT INTO orders (id, customerName, email, phone, address, itemsJson, subtotal, discountAmount, shippingFee, total, createdAt, status, paymentMethod, shippingMethod)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              o.id,
              o.customerName || "",
              o.email || "",
              o.phone || "",
              o.address || "",
              JSON.stringify(o.items),
              o.subtotal,
              o.discountAmount,
              o.shippingFee,
              o.total,
              o.createdAt,
              o.status,
              o.paymentMethod || "cod",
              o.shippingMethod || "standard",
            ]
          );
        });
      }

      // 3. Load all rows from SQLite
      const rawUsers = this.db.getAllSync<User>("SELECT * FROM users;");
      const rawCats = this.db.getAllSync<{ id: string; name: string }>("SELECT * FROM categories;");
      const rawProds = this.db.getAllSync<Product>("SELECT * FROM products;");
      const rawOrders = this.db.getAllSync<any>("SELECT * FROM orders ORDER BY createdAt DESC;");

      const parsedOrders: Order[] = rawOrders.map((o) => ({
        id: o.id,
        customerName: o.customerName,
        email: o.email,
        phone: o.phone,
        address: o.address,
        items: JSON.parse(o.itemsJson || "[]"),
        subtotal: o.subtotal,
        discountAmount: o.discountAmount,
        shippingFee: o.shippingFee,
        total: o.total,
        createdAt: o.createdAt,
        status: o.status as OrderStatus,
        paymentMethod: o.paymentMethod,
        shippingMethod: o.shippingMethod,
      }));

      return {
        users: rawUsers,
        categories: rawCats.map((c) => c.name),
        products: rawProds,
        orders: parsedOrders,
      };
    } catch (err) {
      console.warn("SQLite Native initialization fallback to memory adapter:", err);
      return {
        users: memoryStore.users,
        categories: memoryStore.categories,
        products: memoryStore.products,
        orders: memoryStore.orders,
      };
    }
  }

  // User Operations
  insertUser(user: User) {
    if (!this.isNativeSQLite || !this.db) {
      memoryStore.users.push(user);
      memoryStore.saveToWebStorage();
      return;
    }
    try {
      this.db.runSync(
        `INSERT INTO users (id, username, password, name, email, phone, address, role, memberLevel, points)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [user.id || `u-${Date.now()}`, user.username, user.password || "123456", user.name, user.email, user.phone, user.address, user.role, user.memberLevel, user.points]
      );
    } catch (e) {
      console.warn("insertUser SQLite error:", e);
    }
  }

  updateUserRole(usernameOrEmail: string, newRole: "admin" | "user") {
    if (!this.isNativeSQLite || !this.db) {
      memoryStore.users = memoryStore.users.map((u) =>
        u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
        u.email.toLowerCase() === usernameOrEmail.toLowerCase()
          ? { ...u, role: newRole }
          : u
      );
      memoryStore.saveToWebStorage();
      return;
    }
    try {
      this.db.runSync(
        "UPDATE users SET role = ? WHERE LOWER(username) = ? OR LOWER(email) = ?;",
        [newRole, usernameOrEmail.toLowerCase(), usernameOrEmail.toLowerCase()]
      );
    } catch (e) {
      console.warn("updateUserRole SQLite error:", e);
    }
  }

  deleteUser(usernameOrEmail: string) {
    if (!this.isNativeSQLite || !this.db) {
      memoryStore.users = memoryStore.users.filter(
        (u) =>
          u.username.toLowerCase() !== usernameOrEmail.toLowerCase() &&
          u.email.toLowerCase() !== usernameOrEmail.toLowerCase()
      );
      memoryStore.saveToWebStorage();
      return;
    }
    try {
      this.db.runSync(
        "DELETE FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?;",
        [usernameOrEmail.toLowerCase(), usernameOrEmail.toLowerCase()]
      );
    } catch (e) {
      console.warn("deleteUser SQLite error:", e);
    }
  }

  updateUserProfile(username: string, data: Partial<User>) {
    if (!this.isNativeSQLite || !this.db) {
      memoryStore.users = memoryStore.users.map((u) =>
        u.username.toLowerCase() === username.toLowerCase() ? { ...u, ...data } : u
      );
      memoryStore.saveToWebStorage();
      return;
    }
    try {
      if (data.name) this.db.runSync("UPDATE users SET name = ? WHERE username = ?;", [data.name, username]);
      if (data.phone) this.db.runSync("UPDATE users SET phone = ? WHERE username = ?;", [data.phone, username]);
      if (data.address) this.db.runSync("UPDATE users SET address = ? WHERE username = ?;", [data.address, username]);
      if (data.email) this.db.runSync("UPDATE users SET email = ? WHERE username = ?;", [data.email, username]);
    } catch (e) {
      console.warn("updateUserProfile SQLite error:", e);
    }
  }

  // Category Operations
  insertCategory(name: string) {
    if (!this.isNativeSQLite || !this.db) {
      if (!memoryStore.categories.includes(name)) {
        memoryStore.categories.push(name);
        memoryStore.saveToWebStorage();
      }
      return;
    }
    try {
      this.db.runSync(
        "INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?);",
        [`cat-${Date.now()}`, name]
      );
    } catch (e) {
      console.warn("insertCategory error:", e);
    }
  }

  updateCategory(oldName: string, newName: string) {
    if (!this.isNativeSQLite || !this.db) {
      memoryStore.categories = memoryStore.categories.map((c) => (c === oldName ? newName : c));
      memoryStore.products = memoryStore.products.map((p) => (p.brand === oldName ? { ...p, brand: newName } : p));
      memoryStore.saveToWebStorage();
      return;
    }
    try {
      this.db.runSync("UPDATE categories SET name = ? WHERE name = ?;", [newName, oldName]);
      this.db.runSync("UPDATE products SET brand = ? WHERE brand = ?;", [newName, oldName]);
    } catch (e) {
      console.warn("updateCategory error:", e);
    }
  }

  deleteCategory(name: string) {
    if (!this.isNativeSQLite || !this.db) {
      memoryStore.categories = memoryStore.categories.filter((c) => c !== name);
      memoryStore.saveToWebStorage();
      return;
    }
    try {
      this.db.runSync("DELETE FROM categories WHERE name = ?;", [name]);
    } catch (e) {
      console.warn("deleteCategory error:", e);
    }
  }

  // Product Operations
  insertProduct(product: Product) {
    if (!this.isNativeSQLite || !this.db) {
      memoryStore.products.unshift(product);
      memoryStore.saveToWebStorage();
      return;
    }
    try {
      this.db.runSync(
        `INSERT INTO products (id, brand, name, img, price, description, rating, reviewsCount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [product.id, product.brand, product.name, product.img, String(product.price), product.description || "", product.rating || 5.0, product.reviewsCount || 0]
      );
    } catch (e) {
      console.warn("insertProduct error:", e);
    }
  }

  updateProduct(id: string, data: Partial<Product>) {
    if (!this.isNativeSQLite || !this.db) {
      memoryStore.products = memoryStore.products.map((p) => (p.id === id ? { ...p, ...data } : p));
      memoryStore.saveToWebStorage();
      return;
    }
    try {
      if (data.name) this.db.runSync("UPDATE products SET name = ? WHERE id = ?;", [data.name, id]);
      if (data.brand) this.db.runSync("UPDATE products SET brand = ? WHERE id = ?;", [data.brand, id]);
      if (data.price) this.db.runSync("UPDATE products SET price = ? WHERE id = ?;", [String(data.price), id]);
      if (data.img) this.db.runSync("UPDATE products SET img = ? WHERE id = ?;", [data.img, id]);
      if (data.description) this.db.runSync("UPDATE products SET description = ? WHERE id = ?;", [data.description, id]);
    } catch (e) {
      console.warn("updateProduct error:", e);
    }
  }

  deleteProduct(id: string) {
    if (!this.isNativeSQLite || !this.db) {
      memoryStore.products = memoryStore.products.filter((p) => p.id !== id);
      memoryStore.saveToWebStorage();
      return;
    }
    try {
      this.db.runSync("DELETE FROM products WHERE id = ?;", [id]);
    } catch (e) {
      console.warn("deleteProduct error:", e);
    }
  }

  // Order Operations
  insertOrder(order: Order) {
    if (!this.isNativeSQLite || !this.db) {
      memoryStore.orders.unshift(order);
      memoryStore.saveToWebStorage();
      return;
    }
    try {
      this.db.runSync(
        `INSERT INTO orders (id, customerName, email, phone, address, itemsJson, subtotal, discountAmount, shippingFee, total, createdAt, status, paymentMethod, shippingMethod)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          order.id,
          order.customerName || "",
          order.email || "",
          order.phone || "",
          order.address || "",
          JSON.stringify(order.items),
          order.subtotal,
          order.discountAmount,
          order.shippingFee,
          order.total,
          order.createdAt,
          order.status,
          order.paymentMethod || "cod",
          order.shippingMethod || "standard",
        ]
      );
    } catch (e) {
      console.warn("insertOrder error:", e);
    }
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    if (!this.isNativeSQLite || !this.db) {
      memoryStore.orders = memoryStore.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      memoryStore.saveToWebStorage();
      return;
    }
    try {
      this.db.runSync("UPDATE orders SET status = ? WHERE id = ?;", [newStatus, orderId]);
    } catch (e) {
      console.warn("updateOrderStatus error:", e);
    }
  }
}

export const dbService = new DatabaseManager();
export { SEED_CATEGORIES, SEED_ORDERS, SEED_PRODUCTS, SEED_USERS };

