const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--ignore-certificate-errors', '--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36');

  console.log('Fetching Aderka pivot series page...');
  await page.goto('https://en.aderka.com.tr/pivot-seriler', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 3000));

  // Get all product cards
  const products = await page.evaluate(() => {
    const items = [];
    // Try different selectors
    const cards = document.querySelectorAll('a[href*="pivot"], .product-card, .series-card, [class*="serie"], [class*="product"], article, .card');
    cards.forEach(card => {
      const link = card.tagName === 'A' ? card.href : card.querySelector('a')?.href;
      const img = card.querySelector('img');
      const title = card.querySelector('h1, h2, h3, h4, h5, .title, [class*="title"], [class*="name"]');
      const desc = card.querySelector('p, .desc, [class*="desc"]');
      if (link || img || title) {
        items.push({
          href: link || '',
          image: img ? (img.src || img.dataset.src || img.dataset.lazy) : '',
          name: title ? title.innerText.trim() : '',
          description: desc ? desc.innerText.trim() : '',
          alt: img ? img.alt : ''
        });
      }
    });
    return items;
  });

  console.log(`Found ${products.length} items`);
  products.forEach((p, i) => console.log(`[${i}]`, p.name, '|', p.href?.split('/').pop(), '|', p.image?.slice(0,80)));

  // Also get all images and links on the page
  const allLinks = await page.evaluate(() => {
    return [...document.querySelectorAll('a')].map(a => ({
      href: a.href,
      text: a.innerText.trim().slice(0, 60),
      img: a.querySelector('img')?.src || ''
    })).filter(a => a.href && (a.href.includes('pivot') || a.href.includes('serie')));
  });

  console.log('\nAll pivot-related links:');
  allLinks.forEach(l => console.log(l.href, '|', l.text, '|', l.img?.slice(0,60)));

  // Save HTML
  const html = await page.content();
  fs.writeFileSync('aderka_pivot.html', html);
  console.log('\nHTML saved');

  await browser.close();
})();
