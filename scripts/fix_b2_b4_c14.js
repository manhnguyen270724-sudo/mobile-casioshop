const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
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
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=430,932'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 2 });

  // 1. Fix C1_4: Log in as user1 and open Edit Profile modal
  console.log('Fixing C1_4_cap_nhat_thong_tin.png...');
  await page.goto(`${BASE_URL}/profile`, { waitUntil: 'networkidle0' });
  await delay(1500);
  await clickByExactText(page, 'Cập nhật thông tin');
  await delay(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C1_4_cap_nhat_thong_tin.png') });

  // 2. Fix B2, B3, B4: Log out user first, then login as Admin
  console.log('Fixing B2, B3, B4...');
  // Clear user from localStorage
  await page.evaluate(() => {
    localStorage.removeItem('casio_current_user');
  });

  // Go to auth page
  await page.goto(`${BASE_URL}/auth?tab=login`, { waitUntil: 'networkidle0' });
  await delay(1500);

  // Click Admin quick fill
  await clickByExactText(page, 'Admin (admin123)');
  await delay(1000);
  console.log('Capturing B2_dang_nhap_admin.png...');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B2_dang_nhap_admin.png') });

  // Click Login button
  await clickByExactText(page, 'ĐĂNG NHẬP NGAY');
  await delay(2500);
  console.log('Capturing B3_trang_chu_admin.png...');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B3_trang_chu_admin.png') });

  // Scroll to bottom for B4
  console.log('Capturing B4_bottom_tab_admin.png...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await delay(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B4_bottom_tab_admin.png') });

  await browser.close();
  console.log('FIX COMPLETED SUCCESSFULLY!');
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
