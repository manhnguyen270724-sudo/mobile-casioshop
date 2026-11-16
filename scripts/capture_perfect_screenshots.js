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

async function clickByExactText(page, targetText) {
  const els = await page.$$('*');
  for (const el of els) {
    const text = await page.evaluate((n) => {
      if (n.children.length === 0 && n.textContent) {
        return n.textContent.trim();
      }
      return '';
    }, el);
    if (text === targetText) {
      const box = await el.boundingBox();
      if (box && box.width > 0 && box.height > 0) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        return true;
      }
    }
  }
  return false;
}

async function run() {
  console.log('Starting full suite screenshot capture...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=430,932'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 2 });

  // Clear session to ensure clean start
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    try {
      localStorage.clear();
    } catch (e) {}
  });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await delay(2000);

  // 1. A1_trang_chu.png: Trang chủ người dùng (sản phẩm có sẵn khi khởi tạo DB)
  console.log('1. A1_trang_chu.png');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A1_trang_chu.png') });

  // 2. A2_banner_menu.png: Banner và Menu điều hướng (Home, Danh mục sản phẩm)
  console.log('2. A2_banner_menu.png');
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A2_banner_menu.png') });

  // 3. A3_category_selector.png: Xem sản phẩm theo từng danh mục
  console.log('3. A3_category_selector.png');
  await clickByExactText(page, 'G-Shock');
  await delay(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A3_category_selector.png') });
  await clickByExactText(page, 'Tất cả');
  await delay(800);

  // 4. A4_chi_tiet_san_pham.png: Trang chi tiết sản phẩm
  console.log('4. A4_chi_tiet_san_pham.png');
  await page.goto(`${BASE_URL}/product?id=M3`, { waitUntil: 'networkidle0' });
  await delay(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A4_chi_tiet_san_pham.png') });

  // 5. A5_bottom_tab_user.png: Bottom Tab ở trang chủ gồm 3 nút (Home, Sign up, Login)
  console.log('5. A5_bottom_tab_user.png');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await delay(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A5_bottom_tab_user.png') });

  // 6. A6_dang_ky.png: Đăng ký tài khoản
  console.log('6. A6_dang_ky.png');
  await page.goto(`${BASE_URL}/auth?tab=register`, { waitUntil: 'networkidle0' });
  await delay(1800);
  const regInputs = await page.$$('input');
  if (regInputs.length >= 4) {
    await regInputs[0].click();
    await regInputs[0].type('Nguyễn Mạnh', { delay: 20 });
    await regInputs[1].click();
    await regInputs[1].type('0987654321', { delay: 20 });
    await regInputs[2].click();
    await regInputs[2].type('nguyenmanh@pnv.edu.vn', { delay: 20 });
    await regInputs[3].click();
    await regInputs[3].type('123456', { delay: 20 });
  }
  await delay(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A6_dang_ky.png') });

  // 7. A7_dang_nhap_thanh_cong.png: Đăng nhập ở Bottom Tab -> điều hướng trang chủ
  console.log('7. A7_dang_nhap_thanh_cong.png');
  await page.goto(`${BASE_URL}/auth?tab=login`, { waitUntil: 'networkidle0' });
  await delay(1800);
  await clickByExactText(page, 'Khách (user123)');
  await delay(800);
  await clickByExactText(page, 'ĐĂNG NHẬP NGAY');
  await delay(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A7_dang_nhap_thanh_cong.png') });

  // 8. A8_thong_tin_user_header.png: Thông tin user đã đăng nhập và Đăng xuất (Header.tsx)
  console.log('8. A8_thong_tin_user_header.png');
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A8_thong_tin_user_header.png') });

  // 9. A9_tim_kiem_san_pham.png: Tìm kiếm theo tên / danh mục
  console.log('9. A9_tim_kiem_san_pham.png');
  const searchInput = await page.$('input[placeholder*="Tìm theo tên"]');
  if (searchInput) {
    await searchInput.click();
    await searchInput.type('Citizen', { delay: 40 });
  }
  await delay(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A9_tim_kiem_san_pham.png') });
  if (searchInput) {
    await page.evaluate((el) => {
      el.value = '';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, searchInput);
  }
  await delay(800);

  // 10. A10_loc_khoang_gia.png: Lọc sản phẩm theo khoảng giá
  console.log('10. A10_loc_khoang_gia.png');
  await clickByExactText(page, '3tr - 6tr');
  await delay(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A10_loc_khoang_gia.png') });
  await clickByExactText(page, 'Tất cả mức giá');
  await delay(800);

  // 18. C1_1_gio_hang.png: Xem và cập nhật giỏ hàng
  console.log('18. C1_1_gio_hang.png');
  await page.goto(`${BASE_URL}/cart`, { waitUntil: 'networkidle0' });
  await delay(1800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C1_1_gio_hang.png') });

  // 19. C1_2_checkout_dat_hang.png: Checkout đơn hàng và Đặt hàng
  console.log('19. C1_2_checkout_dat_hang.png');
  await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'networkidle0' });
  await delay(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C1_2_checkout_dat_hang.png') });

  // 20. C1_3_lich_su_mua_hang.png: Xem lịch sử mua hàng
  console.log('20. C1_3_lich_su_mua_hang.png');
  await page.goto(`${BASE_URL}/profile`, { waitUntil: 'networkidle0' });
  await delay(2000);
  await page.evaluate(() => window.scrollTo(0, 320));
  await delay(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C1_3_lich_su_mua_hang.png') });

  // 21. C1_4_cap_nhat_thong_tin.png: Cập nhật thông tin người dùng
  console.log('21. C1_4_cap_nhat_thong_tin.png');
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(800);
  await clickByExactText(page, 'Chỉnh sửa thông tin');
  await delay(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C1_4_cap_nhat_thong_tin.png') });

  // 11. B1_khoi_tao_database_admin.png: Database inspector với tài khoản admin
  console.log('11. B1_khoi_tao_database_admin.png');
  await page.goto(`${BASE_URL}/admin/database`, { waitUntil: 'networkidle0' });
  await delay(2000);
  const tabs = await page.$$('*');
  for (const t of tabs) {
    const txt = await page.evaluate((n) => (n.children.length === 0 ? n.textContent : ''), t);
    if (txt && txt.trim().startsWith('users')) {
      const b = await t.boundingBox();
      if (b) await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
      break;
    }
  }
  await delay(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B1_khoi_tao_database_admin.png') });

  // 12. B2_dang_nhap_admin.png: Đăng nhập admin
  console.log('12. B2_dang_nhap_admin.png');
  await page.goto(`${BASE_URL}/auth?tab=login`, { waitUntil: 'networkidle0' });
  await delay(1800);
  await clickByExactText(page, 'Admin (admin123)');
  await delay(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B2_dang_nhap_admin.png') });

  // 13. B3_trang_chu_admin.png: Trang chủ quản trị
  console.log('13. B3_trang_chu_admin.png');
  await clickByExactText(page, 'ĐĂNG NHẬP NGAY');
  await delay(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B3_trang_chu_admin.png') });

  // 14. B4_bottom_tab_admin.png: Bottom tab của admin (4 nút)
  console.log('14. B4_bottom_tab_admin.png');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await delay(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B4_bottom_tab_admin.png') });

  // 15. B5_quan_tri_user.png: Quản trị user
  console.log('15. B5_quan_tri_user.png');
  await page.goto(`${BASE_URL}/admin/users`, { waitUntil: 'networkidle0' });
  await delay(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B5_quan_tri_user.png') });

  // 16. B6_quan_tri_loai_sp.png: Quản trị loại sản phẩm
  console.log('16. B6_quan_tri_loai_sp.png');
  await page.goto(`${BASE_URL}/admin/categories`, { waitUntil: 'networkidle0' });
  await delay(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B6_quan_tri_loai_sp.png') });

  // 17. B7_quan_tri_san_pham.png: Quản trị sản phẩm
  console.log('17. B7_quan_tri_san_pham.png');
  await page.goto(`${BASE_URL}/admin/products`, { waitUntil: 'networkidle0' });
  await delay(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B7_quan_tri_san_pham.png') });

  // 22. C2_quan_tri_don_hang.png: Quản trị đơn hàng
  console.log('22. C2_quan_tri_don_hang.png');
  await page.goto(`${BASE_URL}/admin/orders`, { waitUntil: 'networkidle0' });
  await delay(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C2_quan_tri_don_hang.png') });

  await browser.close();
  console.log('SUCCESSFULLY RE-CAPTURED ALL 22 PERFECT SCREENSHOTS!');
}

run().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
