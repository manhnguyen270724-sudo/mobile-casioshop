const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();
  page.on('console', (msg) => console.log('LOG:', msg.text()));
  await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 2 });
  await page.goto('http://localhost:8081/product?id=M3', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2000));

  const els = await page.$$('*');
  let btnBox = null;
  for (const el of els) {
    const text = await page.evaluate(
      (n) => (n.children.length === 0 ? n.textContent.trim() : ''),
      el
    );
    if (text === 'Thêm vào giỏ') {
      btnBox = await el.boundingBox();
      console.log('Found Thêm vào giỏ at:', btnBox);
      break;
    }
  }
  if (btnBox) {
    await page.mouse.click(btnBox.x + btnBox.width / 2, btnBox.y + btnBox.height / 2);
  }
  await new Promise((r) => setTimeout(r, 2000));
  await page.goto('http://localhost:8081/cart', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: 'docs/screenshots/test_cart.png' });
  await browser.close();
})();
