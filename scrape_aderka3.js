const puppeteer = require('puppeteer-core');
const fs = require('fs');

const SERIES = [
  { name: 'Exclusive', url: 'https://en.aderka.com.tr/exclusive-seriler' },
  { name: 'Stoneline', url: 'https://en.aderka.com.tr/stoneline-seriler' },
  { name: 'Elegance', url: 'https://en.aderka.com.tr/elegance-seriler' },
  { name: 'Woodline', url: 'https://en.aderka.com.tr/woodline-seriler' },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--ignore-certificate-errors', '--no-sandbox', '--window-size=1400,900']
  });

  const allData = {};

  for (const series of SERIES) {
    console.log(`\n=== Scraping ${series.name} ===`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36');

    await page.goto(series.url, { waitUntil: 'networkidle0', timeout: 45000 });

    // Scroll to load lazy images
    for (let i = 0; i < 20; i++) {
      await page.evaluate(idx => window.scrollTo(0, idx * 500), i);
      await new Promise(r => setTimeout(r, 400));
    }
    await new Promise(r => setTimeout(r, 2000));

    const data = await page.evaluate(() => {
      const allText = document.body.innerText;
      const imgs = [...document.querySelectorAll('img')].map(img => ({
        src: img.src || img.dataset.src || img.getAttribute('data-src') || '',
        alt: img.alt || '',
        w: img.naturalWidth || img.width,
        h: img.naturalHeight || img.height
      })).filter(i => i.src && !i.src.includes('data:') && i.src.includes('wixstatic'));

      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5')].map(h => h.innerText.trim()).filter(t => t);
      const paras = [...document.querySelectorAll('p, span')].map(p => p.innerText.trim()).filter(t => t.length > 3 && t.length < 200);

      return { allText: allText.slice(0, 8000), imgs, headings, paras: [...new Set(paras)].slice(0, 50) };
    });

    console.log('Text:', data.allText.slice(0, 1500));
    console.log('\nHeadings:', data.headings.join(' | '));
    console.log('\nImages:');
    data.imgs.forEach(i => console.log(` ${i.w}x${i.h} ${i.alt.slice(0,50)} | ${i.src.slice(0,120)}`));

    // Save HTML for detailed analysis
    const html = await page.content();
    fs.writeFileSync(`aderka_${series.name.toLowerCase()}.html`, html);

    allData[series.name] = { text: data.allText, headings: data.headings, imgs: data.imgs, paras: data.paras };
    await page.close();
  }

  fs.writeFileSync('aderka_all_data.json', JSON.stringify(allData, null, 2));
  console.log('\n\nAll data saved to aderka_all_data.json');

  await browser.close();
})();
