const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    headless: true
  });
  const page = await browser.newPage();
  
  // Try the banyo products page with correct URL
  for (const url of [
    'https://www.bienseramik.com.tr/banyolar',
    'https://www.bienseramik.com.tr/',
    'https://www.bienseramik.com.tr/banyo-urunleri/sanitaire',
  ]) {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
    for (let i = 0; i < 8; i++) { await page.evaluate(() => window.scrollBy(0, 400)); await new Promise(r => setTimeout(r, 200)); }
    const imgs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('img'))
        .filter(i => i.src.includes('b-cdn.net/uploads') && !i.src.includes('logo'))
        .map(i => ({ src: i.src.split('?')[0], alt: i.alt }))
    );
    if (imgs.length > 0) {
      console.log(`\n=== ${url} ===`);
      imgs.slice(0,8).forEach(i => console.log(i.alt, '→', i.src));
    }
  }
  await browser.close();
})().catch(console.error);
