const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:8081';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=430,932'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 2 });

  // 1. A1_trang_chu.png: Trang chủ người dùng với danh sách sản phẩm
  console.log('1. A1_trang_chu.png');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await delay(3000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A1_trang_chu.png') });

  // 2. A2_banner_menu.png: Banner và Menu điều hướng
  console.log('2. A2_banner_menu.png');
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A2_banner_menu.png') });

  // 3. A3_category_selector.png: Xem sản phẩm theo từng danh mục
  console.log('3. A3_category_selector.png');
  await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('div, span, p'));
    const gshock = chips.find((c) => c.textContent && c.textContent.trim() === 'G-Shock');
    if (gshock) gshock.click();
  });
  await delay(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A3_category_selector.png') });

  // Reset category
  await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('div, span, p'));
    const all = chips.find((c) => c.textContent && c.textContent.trim() === 'Tất cả');
    if (all) all.click();
  });
  await delay(1000);

  // 4. A4_chi_tiet_san_pham.png: Trang chi tiết sản phẩm
  console.log('4. A4_chi_tiet_san_pham.png');
  await page.goto(`${BASE_URL}/product?id=M3`, { waitUntil: 'domcontentloaded' });
  await delay(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A4_chi_tiet_san_pham.png') });

  // 5. A5_bottom_tab_user.png: Bottom Tab ở trang chủ người dùng
  console.log('5. A5_bottom_tab_user.png');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await delay(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A5_bottom_tab_user.png') });

  // 6. A6_dang_ky.png: Màn hình Đăng ký tài khoản
  console.log('6. A6_dang_ky.png');
  await page.goto(`${BASE_URL}/auth?tab=register`, { waitUntil: 'domcontentloaded' });
  await delay(2000);
  // Fill sample info
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    if (inputs.length >= 4) {
      inputs[0].value = 'Nguyễn Mạnh';
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[1].value = '0987654321';
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[2].value = 'nguyenmanh@example.com';
      inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[3].value = '123456';
      inputs[3].dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await delay(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A6_dang_ky.png') });

  // 7. A7_dang_nhap_thanh_cong.png: Đăng nhập ở Bottom Tab -> Thành công
  console.log('7. A7_dang_nhap_thanh_cong.png');
  await page.goto(`${BASE_URL}/auth?tab=login`, { waitUntil: 'domcontentloaded' });
  await delay(2000);
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    if (inputs.length >= 2) {
      inputs[0].value = 'user1';
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[1].value = 'user123';
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    }
    const btns = Array.from(document.querySelectorAll('div, button'));
    const loginBtn = btns.find((b) => b.textContent && b.textContent.includes('ĐĂNG NHẬP NGAY'));
    if (loginBtn) loginBtn.click();
  });
  await delay(3000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A7_dang_nhap_thanh_cong.png') });

  // 8. A8_thong_tin_user_header.png: Thông tin user đã đăng nhập & Đăng xuất
  console.log('8. A8_thong_tin_user_header.png');
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A8_thong_tin_user_header.png') });

  // 9. A9_tim_kiem_san_pham.png: Tìm kiếm theo tên / danh mục
  console.log('9. A9_tim_kiem_san_pham.png');
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Tìm theo tên"]');
    if (input) {
      input.value = 'GA-110';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await delay(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A9_tim_kiem_san_pham.png') });

  // Clear search
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Tìm theo tên"]');
    if (input) {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await delay(1000);

  // 10. A10_loc_khoang_gia.png: Lọc sản phẩm theo khoảng giá
  console.log('10. A10_loc_khoang_gia.png');
  await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('div, span, p'));
    const priceChip = chips.find((c) => c.textContent && c.textContent.trim() === '3tr - 6tr');
    if (priceChip) priceChip.click();
  });
  await delay(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A10_loc_khoang_gia.png') });

  // Reset price
  await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('div, span, p'));
    const allPrice = chips.find((c) => c.textContent && c.textContent.trim() === 'Tất cả mức giá');
    if (allPrice) allPrice.click();
  });
  await delay(1000);

  // Log out user
  await page.evaluate(() => {
    const logoutBtn = Array.from(document.querySelectorAll('div, span, p, button')).find(
      (el) => el.textContent && el.textContent.trim() === 'Đăng xuất'
    );
    if (logoutBtn) logoutBtn.click();
  });
  await delay(1000);
  // Confirm logout modal if open
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('div, span, p, button'));
    const confirm = btns.find((b) => b.textContent && b.textContent.trim() === 'Đăng xuất' && b.style);
    if (confirm) confirm.click();
  });
  await delay(1500);

  // 11. B1_khoi_tao_database_admin.png: Database inspector với tài khoản admin
  console.log('11. B1_khoi_tao_database_admin.png');
  await page.goto(`${BASE_URL}/admin/database`, { waitUntil: 'domcontentloaded' });
  await delay(2500);
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('div, span, p'));
    const userTab = tabs.find((t) => t.textContent && t.textContent.trim().startsWith('users'));
    if (userTab) userTab.click();
  });
  await delay(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B1_khoi_tao_database_admin.png') });

  // 12. B2_dang_nhap_admin.png: Đăng nhập admin
  console.log('12. B2_dang_nhap_admin.png');
  await page.goto(`${BASE_URL}/auth?tab=login`, { waitUntil: 'domcontentloaded' });
  await delay(2000);
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    if (inputs.length >= 2) {
      inputs[0].value = 'admin';
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[1].value = 'admin123';
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    }
    const btns = Array.from(document.querySelectorAll('div, button'));
    const loginBtn = btns.find((b) => b.textContent && b.textContent.includes('ĐĂNG NHẬP NGAY'));
    if (loginBtn) loginBtn.click();
  });
  await delay(3000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B2_dang_nhap_admin.png') });

  // 13. B3_trang_chu_admin.png: Trang chủ quản trị
  console.log('13. B3_trang_chu_admin.png');
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'domcontentloaded' });
  await delay(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B3_trang_chu_admin.png') });

  // 14. B4_bottom_tab_admin.png: Bottom tab của admin (4 nút)
  console.log('14. B4_bottom_tab_admin.png');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await delay(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B4_bottom_tab_admin.png') });

  // 15. B5_quan_tri_user.png: Quản trị user
  console.log('15. B5_quan_tri_user.png');
  await page.goto(`${BASE_URL}/admin/users`, { waitUntil: 'domcontentloaded' });
  await delay(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B5_quan_tri_user.png') });

  // 16. B6_quan_tri_loai_sp.png: Quản trị loại sản phẩm
  console.log('16. B6_quan_tri_loai_sp.png');
  await page.goto(`${BASE_URL}/admin/categories`, { waitUntil: 'domcontentloaded' });
  await delay(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B6_quan_tri_loai_sp.png') });

  // 17. B7_quan_tri_san_pham.png: Quản trị sản phẩm
  console.log('17. B7_quan_tri_san_pham.png');
  await page.goto(`${BASE_URL}/admin/products`, { waitUntil: 'domcontentloaded' });
  await delay(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B7_quan_tri_san_pham.png') });

  // 18. C1_1_gio_hang.png: Xem và cập nhật giỏ hàng
  console.log('18. C1_1_gio_hang.png');
  // First add product to cart
  await page.goto(`${BASE_URL}/product?id=M3`, { waitUntil: 'domcontentloaded' });
  await delay(2000);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('div, button'));
    const addBtn = btns.find((b) => b.textContent && b.textContent.includes('Thêm vào giỏ'));
    if (addBtn) addBtn.click();
  });
  await delay(1000);
  await page.goto(`${BASE_URL}/cart`, { waitUntil: 'domcontentloaded' });
  await delay(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C1_1_gio_hang.png') });

  // 19. C1_2_checkout_dat_hang.png: Checkout đơn hàng và Đặt hàng
  console.log('19. C1_2_checkout_dat_hang.png');
  await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'domcontentloaded' });
  await delay(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C1_2_checkout_dat_hang.png') });

  // 20. C1_3_lich_su_mua_hang.png: Xem lịch sử mua hàng
  console.log('20. C1_3_lich_su_mua_hang.png');
  await page.goto(`${BASE_URL}/profile`, { waitUntil: 'domcontentloaded' });
  await delay(2500);
  await page.evaluate(() => window.scrollTo(0, 300));
  await delay(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C1_3_lich_su_mua_hang.png') });

  // 21. C1_4_cap_nhat_thong_tin.png: Cập nhật thông tin người dùng
  console.log('21. C1_4_cap_nhat_thong_tin.png');
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(500);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('div, span, p, button'));
    const editBtn = btns.find((b) => b.textContent && b.textContent.includes('Chỉnh sửa thông tin'));
    if (editBtn) editBtn.click();
  });
  await delay(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C1_4_cap_nhat_thong_tin.png') });

  // 22. C2_quan_tri_don_hang.png: Quản trị đơn hàng
  console.log('22. C2_quan_tri_don_hang.png');
  await page.goto(`${BASE_URL}/admin/orders`, { waitUntil: 'domcontentloaded' });
  await delay(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C2_quan_tri_don_hang.png') });

  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

run().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
