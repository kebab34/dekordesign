const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--ignore-certificate-errors', '--no-sandbox', '--window-size=1400,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36');

  await page.goto('https://en.aderka.com.tr/pivot-seriler', { waitUntil: 'networkidle0', timeout: 45000 });

  // Scroll down to trigger lazy loading
  for (let i = 0; i < 15; i++) {
    await page.evaluate(idx => window.scrollTo(0, idx * 600), i);
    await new Promise(r => setTimeout(r, 600));
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 3000));

  const data = await page.evaluate(() => {
    const allText = document.body.innerText;

    const imgs = [...document.querySelectorAll('img')].map(img => ({
      src: img.src || img.dataset.src || '',
      alt: img.alt || '',
      w: img.naturalWidth || img.width,
      h: img.naturalHeight || img.height
    })).filter(i => i.src && !i.src.includes('data:'));

    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5')].map(h => h.innerText.trim()).filter(t => t);
    const paras = [...document.querySelectorAll('p')].map(p => p.innerText.trim()).filter(t => t.length > 5);

    return { allText: allText.slice(0, 5000), imgs, headings, paras: paras.slice(0, 30) };
  });

  console.log('=== PAGE TEXT (first 3000 chars) ===');
  console.log(data.allText);
  console.log('\n=== HEADINGS ===');
  data.headings.forEach(h => console.log(' -', h));
  console.log('\n=== PARAGRAPHS ===');
  data.paras.forEach(p => console.log(' >', p.slice(0, 150)));
  console.log('\n=== ALL IMAGES ===');
  data.imgs.forEach(i => console.log(` ${i.w}x${i.h} | ${i.alt.slice(0,40)} | ${i.src.slice(0,120)}`));

  const html = await page.content();
  fs.writeFileSync('aderka_pivot2.html', html);
  console.log('\nHTML saved to aderka_pivot2.html');

  await browser.close();
})();
