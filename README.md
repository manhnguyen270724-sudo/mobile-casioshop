# CASIO STORE - DỰ ÁN LẬP TRÌNH DI ĐỘNG 2 (90T)

Ứng dụng di động thương mại điện tử **Casio Official Store** xây dựng bằng **React Native (Expo SDK 58)**, sử dụng cơ sở dữ liệu **SQLite** cục bộ, điều hướng bằng **Expo Router** và hỗ trợ phân quyền người dùng / quản trị viên (Admin).

---

## 📌 THÔNG TIN ĐỒ ÁN & PHIẾU CHẤM ĐIỂM

- **Môn học:** Lập trình di động 2 (90T)
- **Link Git Repository:** [https://github.com/manhnguyen270724-sudo/mobile-casioshop](https://github.com/manhnguyen270724-sudo/mobile-casioshop)
- **Môi trường phát triển:**
  - **React Native:** `0.88.1`
  - **React:** `19.3.0`
  - **Expo SDK:** `~58.0.23`
  - **Expo Router:** `~58.0.30`
  - **Expo SQLite:** `~58.0.15`
  - **Ngôn ngữ:** TypeScript 100%

---

## 🔑 TÀI KHOẢN TRẢI NGHIỆM & CHẤM ĐIỂM

| Vai trò | Tên đăng nhập (Username) | Mật khẩu (Password) | Chức năng nổi bật |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin` *(hoặc `admin@example.com`)* | `admin123` | Vào thẳng **Trang chủ quản trị** (`/admin`), Bottom Tab 4 nút, Quản lý User, Quản lý Loại sản phẩm, Quản lý Sản phẩm, Quản lý Đơn hàng, Trình xem SQLite CSDL. |
| **Khách hàng (User)** | `user1` *(hoặc `user1@example.com`)* | `user123` | Vào **Trang chủ người dùng** (`/`), Bottom Tab 3 nút, Lọc theo danh mục/giá, Xem chi tiết, Giỏ hàng, Checkout, Lịch sử mua hàng, Cập nhật thông tin cá nhân. |
| **Đăng ký tài khoản mới** | Tạo bất kỳ qua tab **Sign up** | >= 6 ký tự | Kiểm tra validate họ tên, email, SĐT 10 số, lưu vào bảng `users` trong SQLite và tự động đăng nhập. |

---

## 📋 BẢNG CHẤM ĐIỂM TỔNG HỢP (10/10 ĐIỂM)

### A. Chức năng của người dùng (4.0đ)
1. **Trang chủ người dùng (0.25đ):** Hiển thị danh sách sản phẩm có sẵn khi khởi tạo CSDL SQLite (`src/app/index.tsx`).
2. **Banner và Menu điều hướng (0.25đ):** Gồm 2 nút điều hướng `Home`, `Danh mục sản phẩm` và Banner quảng cáo tự động trượt (`src/components/banner-slider.tsx`).
3. **Xem sản phẩm theo từng danh mục (0.5đ):** Component `src/components/CategorySelector.tsx` cho phép chọn từng hãng: G-Shock, Citizen, Seiko, Vintage, Omega, Edifice.
4. **Trang chi tiết sản phẩm (0.25đ):** Click vào sản phẩm mở màn hình chi tiết với hình ảnh, thông số kỹ thuật, giá, đánh giá và nút thêm vào giỏ (`src/app/product.tsx`).
5. **Bottom Tab ở trang chủ (0.25đ):** Gồm đúng 3 nút: **Home**, **Sign up**, **Login** (`src/components/bottom-nav.tsx`).
6. **Đăng ký thành công (0.5đ):** Form đăng ký với kiểm tra tính hợp lệ dữ liệu, lưu vào SQLite bảng `users` (`src/components/auth/RegisterForm.tsx`).
7. **Đăng nhập ở Bottom Tab (0.5đ):** Đăng nhập thành công điều hướng ngay về trang chủ người dùng (`src/components/auth/LoginForm.tsx`).
8. **Hiển thị thông tin người dùng và Đăng xuất (0.5đ):** Component `src/components/Header.tsx` hiển thị huy hiệu thành viên, tên người dùng và nút Đăng xuất kèm Modal xác nhận.
9. **Tìm kiếm theo tên/danh mục (0.5đ):** Tìm kiếm tức thì theo tên đồng hồ hoặc thương hiệu.
10. **Lọc sản phẩm theo khoảng giá (0.5đ):** 5 mức giá: `< 3 Tr`, `3 - 6 Tr`, `6 - 10 Tr`, `> 10 Tr` và `Tất cả`.

### B. Chức năng của admin (4.0đ)
1. **Khởi tạo database với 1 tài khoản admin có sẵn (0.25đ):** Seed sẵn tài khoản `admin` / `admin123` trong SQLite (`src/database/sqlite.ts`).
2. **Đăng nhập admin (0.5đ):** Đăng nhập thành công chuyển hướng đến **Trang chủ quản trị** (`/admin`), Header hiển thị `ADMIN`.
3. **Trang chủ quản trị (0.25đ):** Gồm các nút: Quản lý user, Quản lý loại sản phẩm, Quản lý sản phẩm (`src/app/admin/index.tsx`).
4. **Admin Bottom Tab (0.5đ):** Gồm 4 nút: **Home của user**, **Home của admin**, **Signup**, **Login** (`src/components/bottom-nav.tsx`).
5. **Quản trị user (0.5đ):** Xem danh sách, cập nhật vai trò (admin <-> user), xóa user (`src/app/admin/users.tsx`).
6. **Quản trị loại sản phẩm (1.0đ):**
   - Xem, thêm, sửa, xóa loại sản phẩm (0.5đ).
   - Thêm sản phẩm cho loại tương ứng (0.5đ) (`src/app/admin/categories.tsx`).
7. **Quản trị sản phẩm (1.0đ):** Xem toàn bộ kho hàng, thêm sản phẩm mới, chỉnh sửa thông tin, xóa sản phẩm (`src/app/admin/products.tsx`).

### C. Chức năng khác (2.0đ)
1. **Chức năng khác của người dùng (1.5đ):**
   - Xem và cập nhật giỏ hàng: tăng/giảm số lượng, xóa sản phẩm, nhập mã giảm giá `CASIO10` (0.5đ) (`src/app/cart.tsx`).
   - Checkout đơn hàng và Đặt hàng: nhập địa chỉ, phương thức thanh toán, hoàn tất đơn (0.5đ) (`src/app/checkout.tsx`).
   - Xem lịch sử mua hàng: theo dõi các đơn hàng đã mua và trạng thái (0.25đ) (`src/app/profile.tsx`).
   - Cập nhật thông tin người dùng: đổi tên, số điện thoại, địa chỉ (0.25đ) (`src/app/profile.tsx`).
2. **Chức năng khác của admin (0.5đ):**
   - Quản trị đơn hàng: xem danh sách đơn đặt hàng của khách, cập nhật tình trạng giao hàng (`src/app/admin/orders.tsx`).

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY

```bash
# 1. Clone repository
git clone https://github.com/manhnguyen270724-sudo/mobile-casioshop.git
cd mobile-casioshop

# 2. Cài đặt thư viện phụ thuộc
npm install

# 3. Khởi chạy ứng dụng
npx expo start
```

- Bấm `a` để mở trên Android Emulator.
- Bấm `w` để mở và chạy thử trực tiếp trên Web Browser.
- Quét mã QR bằng ứng dụng Expo Go trên điện thoại thật.
