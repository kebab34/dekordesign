const puppeteer = require('puppeteer-core');

const pages_to_check = [
  { label: 'SANITAIRE',     url: 'https://www.bienseramik.com.tr/banyo-urunleri/banyo-saniterleri' },
  { label: 'ARMATURLER',    url: 'https://www.bienseramik.com.tr/banyo-urunleri/armaturler' },
  { label: 'DOUCHE',        url: 'https://www.bienseramik.com.tr/banyo-urunleri/dus-sistemleri' },
  { label: 'AKSESUAR',      url: 'https://www.bienseramik.com.tr/banyo-urunleri/banyo-aksesuarlari' },
  { label: 'TAMAMLAYICI',   url: 'https://www.bienseramik.com.tr/banyo-urunleri/tamamlayici-urunler' },
  { label: 'BANYO_MAIN',    url: 'https://www.bienseramik.com.tr/banyo-urunleri' },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    headless: true
  });

  for (const p of pages_to_check) {
    const page = await browser.newPage();
    try {
      await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 500));

      const imgs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img'))
          .filter(i => i.src.includes('b-cdn.net') && !i.src.includes('logo'))
          .map(i => ({ src: i.src, alt: i.alt, w: i.naturalWidth }))
          .slice(0, 6);
      });

      console.log(`\n=== ${p.label} (${p.url}) ===`);
      imgs.forEach(i => console.log(i.alt, '→', i.src));
    } catch(e) {
      console.log(`${p.label}: ERROR ${e.message}`);
    }
    await page.close();
  }

  await browser.close();
})().catch(console.error);
