const candidates = [
  // Jomashop Citizen / Seiko / Tissot / Casio with white background:
  'https://cdn2.jomashop.com/media/catalog/product/cache/b3e31d40bbb1abcc90b26106659d5d3f/c/a/casio-g-shock-quartz-black-dial-men_s-watch-dw5600e-1v_4.jpg',
  'https://cdn2.jomashop.com/media/catalog/product/cache/b3e31d40bbb1abcc90b26106659d5d3f/c/a/casio-classic-alarm-chronograph-digital-gold-dial-unisex-watch-a168wg9w_2.jpg',
  'https://cdn2.jomashop.com/media/catalog/product/cache/b3e31d40bbb1abcc90b26106659d5d3f/c/a/casio-databank-quartz-black-dial-men_s-watch-ca53w-1_4.jpg',
  'https://cdn2.jomashop.com/media/catalog/product/cache/b3e31d40bbb1abcc90b26106659d5d3f/c/a/casio-edifice-chronograph-black-dial-men_s-watch-efr-552d-1avuef.jpg',
  'https://cdn2.jomashop.com/media/catalog/product/cache/b3e31d40bbb1abcc90b26106659d5d3f/c/a/casio-g-shock-quartz-black-dial-men_s-watch-ga700-1b.jpg',
  'https://cdn2.jomashop.com/media/catalog/product/cache/b3e31d40bbb1abcc90b26106659d5d3f/s/e/seiko-5-automatic-black-dial-men_s-watch-snk809.jpg',
  'https://cdn2.jomashop.com/media/catalog/product/cache/b3e31d40bbb1abcc90b26106659d5d3f/c/i/citizen-nighthawk-eco-drive-black-dial-men_s-watch-bj7000-52e.jpg',
  'https://cdn2.jomashop.com/media/catalog/product/cache/b3e31d40bbb1abcc90b26106659d5d3f/c/a/casio-edifice-chronograph-quartz-black-dial-mens-watch-efv540d1av.jpg',
  'https://cdn2.jomashop.com/media/catalog/product/cache/b3e31d40bbb1abcc90b26106659d5d3f/c/a/casio-g-shock-digital-grey-dial-mens-watch-dw-9052-1v.jpg',
  'https://cdn2.jomashop.com/media/catalog/product/cache/b3e31d40bbb1abcc90b26106659d5d3f/s/e/seiko-prospex-automatic-black-dial-men_s-watch-srpe93.jpg'
];

(async () => {
  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      console.log(res.status, url.split('/').pop().slice(0, 40));
    } catch (e) {
      console.log('ERR', e.message);
    }
  }
})();
