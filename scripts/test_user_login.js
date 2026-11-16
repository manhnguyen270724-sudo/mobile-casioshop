const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 2 });
  await page.goto('http://localhost:8081/auth?tab=login', { waitUntil: 'networkidle0' });

  // Find exact text element for 'Khách (user123)'
  const els = await page.$$('*');
  let userBox = null;
  for (const el of els) {
    const text = await page.evaluate((n) => {
      if (n.children.length === 0 && n.textContent) {
        return n.textContent.trim();
      }
      return '';
    }, el);
    if (text === 'Khách (user123)') {
      userBox = await el.boundingBox();
      console.log('Found exact text Khách (user123) at:', userBox);
      break;
    }
  }
  if (userBox) {
    await page.mouse.click(userBox.x + userBox.width / 2, userBox.y + userBox.height / 2);
  }

  await new Promise((r) => setTimeout(r, 1000));

  let submitBox = null;
  for (const el of els) {
    const text = await page.evaluate((n) => {
      if (n.children.length === 0 && n.textContent) {
        return n.textContent.trim();
      }
      return '';
    }, el);
    if (text === 'ĐĂNG NHẬP NGAY') {
      submitBox = await el.boundingBox();
      console.log('Found exact text ĐĂNG NHẬP NGAY at:', submitBox);
      break;
    }
  }
  if (submitBox) {
    await page.mouse.click(submitBox.x + submitBox.width / 2, submitBox.y + submitBox.height / 2);
  }

  await new Promise((r) => setTimeout(r, 3000));
  console.log('Current URL after login:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Has Xin chao:', bodyText.includes('Xin chào'));
  await page.screenshot({ path: 'docs/screenshots/test_logged_in.png' });
  await browser.close();
})();
