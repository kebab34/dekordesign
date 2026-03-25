const puppeteer = require('puppeteer-core');

const SERIES = [
  { name: 'Exclusive', url: 'https://en.aderka.com.tr/exclusive-seriler' },
  { name: 'Stoneline', url: 'https://en.aderka.com.tr/stoneline-seriler' },
  { name: 'Elegance',  url: 'https://en.aderka.com.tr/elegance-seriler' },
  { name: 'Woodline',  url: 'https://en.aderka.com.tr/woodline-seriler' },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    headless: true
  });

  const allResults = {};

  for (const series of SERIES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(series.url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Scroll to trigger lazy loading
    for (let i = 0; i < 20; i++) {
      await page.evaluate(() => window.scrollBy(0, 400));
      await new Promise(r => setTimeout(r, 300));
    }
    await new Promise(r => setTimeout(r, 1500));

    const data = await page.evaluate(() => {
      const seen = new Set();
      const imgs = [];
      document.querySelectorAll('img').forEach(img => {
        const base = img.src.split('/v1/')[0];
        if (img.src && img.src.includes('wixstatic') && img.src.includes('mv2') && !seen.has(base)) {
          seen.add(base);
          imgs.push({ src: img.src, alt: (img.alt || '').trim() });
        }
      });

      // Grab meaningful text nodes (potential model names)
      const seenText = new Set();
      const texts = [];
      document.querySelectorAll('h1,h2,h3,h4,h5,p,span').forEach(el => {
        const t = (el.innerText || '').trim();
        if (t && t.length >= 3 && t.length <= 80 && !t.includes('\n') && !seenText.has(t)) {
          seenText.add(t);
          texts.push(t);
        }
      });

      return { imgs, texts };
    });

    allResults[series.name] = data;
    console.log(`\n=== ${series.name} ===`);
    console.log('Images:');
    data.imgs.forEach((img, i) => console.log(`  [${i}] alt="${img.alt}" hash=${img.src.match(/media\/([\w~]+)/)?.[1]}`));
    console.log('Texts (first 30):');
    data.texts.slice(0, 30).forEach(t => console.log(`  - ${t}`));

    await page.close();
  }

  await browser.close();
})().catch(console.error);
