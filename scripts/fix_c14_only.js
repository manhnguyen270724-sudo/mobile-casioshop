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

  // 1. Go to login
  await page.goto(`${BASE_URL}/auth?tab=login`, { waitUntil: 'networkidle0' });
  await delay(1500);

  // If already logged in as someone else, log out
  const isAccountScreen = await page.evaluate(() => document.body.innerText.includes('TÀI KHOẢN CỦA BẠN'));
  if (isAccountScreen) {
    await clickByExactText(page, 'Đăng xuất tài khoản này');
    await delay(1000);
  }

  // Click quick user login
  await clickByExactText(page, 'Khách (user123)');
  await delay(800);
  await clickByExactText(page, 'ĐĂNG NHẬP NGAY');
  await delay(2500);

  // Go to profile
  await page.goto(`${BASE_URL}/profile`, { waitUntil: 'networkidle0' });
  await delay(1500);

  // Click Cập nhật thông tin
  console.log('Clicking Cập nhật thông tin...');
  await clickByExactText(page, 'Cập nhật thông tin');
  await delay(1500);

  console.log('Capturing C1_4_cap_nhat_thong_tin.png...');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C1_4_cap_nhat_thong_tin.png') });

  await browser.close();
  console.log('DONE!');
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
