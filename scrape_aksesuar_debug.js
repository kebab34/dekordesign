/**
 * Debug: Inspect banyo-aksesuarlari page structure
 * Usage: node scrape_aksesuar_debug.js
 */

const puppeteer = require('puppeteer-core');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE   = 'https://www.bienseramik.com.tr';
const ROOT   = `${BASE}/banyolar/banyo-aksesuarlari`;

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    protocolTimeout: 120000,
  });

  const page = await browser.newPage();
  await page.goto(ROOT, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  // Find subcategories
  const subcats = await page.evaluate((base) => {
    const links = [];
    document.querySelectorAll('a').forEach(a => {
      const h = a.href || '';
      if (h.includes('banyo-aksesuarlari/') && !h.includes('#')) {
        const text = a.textContent.trim();
        links.push({ href: h, text });
      }
    });
    const seen = new Set();
    return links.filter(l => {
      if (seen.has(l.href)) return false;
      seen.add(l.href);
      return true;
    });
  }, BASE);

  console.log(`\nSubcategories found: ${subcats.length}`);
  subcats.slice(0, 20).forEach(s => console.log(`  ${s.href} — "${s.text}"`));

  // Check .card.prd structure on root page
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let total = 0;
      const timer = setInterval(() => {
        window.scrollBy(0, 400);
        total += 400;
        if (total > document.body.scrollHeight) { clearInterval(timer); resolve(); }
      }, 100);
    });
  });
  await new Promise(r => setTimeout(r, 1500));

  const cardInfo = await page.evaluate(() => {
    const cards = document.querySelectorAll('.card.prd');
    console.log('Cards found:', cards.length);
    const results = [];
    cards.forEach((card, i) => {
      if (i >= 5) return;
      const img = card.querySelector('img');
      const a = card.querySelector('a');
      results.push({
        imgSrc: img ? img.src : null,
        imgDataSrc: img ? img.getAttribute('data-src') : null,
        href: a ? a.href : null,
        text: a ? a.textContent.trim().substring(0, 60) : null,
        html: card.innerHTML.substring(0, 300),
      });
    });
    return { count: cards.length, samples: results };
  });

  console.log(`\n.card.prd on ROOT: ${cardInfo.count}`);
  cardInfo.samples.forEach((c, i) => {
    console.log(`\n[${i}] href: ${c.href}`);
    console.log(`    img: ${c.imgSrc}`);
    console.log(`    img data-src: ${c.imgDataSrc}`);
    console.log(`    text: ${c.text}`);
    console.log(`    html snippet: ${c.html}`);
  });

  // Also check all product links with the root pattern
  const allLinks = await page.evaluate((base) => {
    const links = [];
    document.querySelectorAll('a').forEach(a => {
      const h = a.href || '';
      const t = a.textContent.trim();
      if (h.includes('banyo-aksesuarlari/') && !h.includes('#') && t.length > 0) {
        links.push({ href: h, text: t.substring(0, 60) });
      }
    });
    const seen = new Set();
    return links.filter(l => {
      if (seen.has(l.href)) return false;
      seen.add(l.href);
      return true;
    });
  }, BASE);

  console.log(`\nAll unique links with 'banyo-aksesuarlari/': ${allLinks.length}`);
  allLinks.slice(0, 10).forEach(l => console.log(`  ${l.href} — "${l.text}"`));

  // Navigate to first subcategory or product detail to check image structure
  let targetUrl = null;
  if (subcats.length > 0) {
    targetUrl = subcats[0].href;
    console.log(`\nNavigating to first subcategory: ${targetUrl}`);
  } else if (allLinks.length > 0) {
    targetUrl = allLinks[0].href;
    console.log(`\nNavigating to first product link: ${targetUrl}`);
  }

  if (targetUrl) {
    const page2 = await browser.newPage();
    await page2.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));

    // Scroll
    await page2.evaluate(async () => {
      await new Promise(resolve => {
        let total = 0;
        const timer = setInterval(() => {
          window.scrollBy(0, 400);
          total += 400;
          if (total > document.body.scrollHeight) { clearInterval(timer); resolve(); }
        }, 100);
      });
    });
    await new Promise(r => setTimeout(r, 1500));

    const subInfo = await page2.evaluate(() => {
      const cards = document.querySelectorAll('.card.prd');
      const prdImg = document.querySelector('img.prd-img');
      const table = document.querySelector('table');

      const cardSamples = [];
      cards.forEach((card, i) => {
        if (i >= 3) return;
        const img = card.querySelector('img');
        const a = card.querySelector('a');
        cardSamples.push({
          imgSrc: img ? img.src : null,
          imgDataSrc: img ? img.getAttribute('data-src') : null,
          href: a ? a.href : null,
          text: a ? a.textContent.trim().substring(0, 60) : null,
        });
      });

      return {
        cardCount: cards.length,
        cardSamples,
        prdImgSrc: prdImg ? prdImg.src : null,
        hasTable: !!table,
        tableText: table ? table.textContent.substring(0, 200) : null,
      };
    });

    console.log(`\nSubcat page cards: ${subInfo.cardCount}`);
    subInfo.cardSamples.forEach((c, i) => {
      console.log(`  [${i}] href: ${c.href}`);
      console.log(`       img: ${c.imgSrc}`);
      console.log(`       data-src: ${c.imgDataSrc}`);
      console.log(`       text: ${c.text}`);
    });
    if (subInfo.prdImgSrc) console.log(`  prd-img: ${subInfo.prdImgSrc}`);
    if (subInfo.hasTable) console.log(`  table: ${subInfo.tableText}`);

    // If this was a subcategory listing, navigate to first product
    if (subInfo.cardCount > 0 && subInfo.cardSamples[0] && subInfo.cardSamples[0].href) {
      const productUrl = subInfo.cardSamples[0].href;
      console.log(`\nNavigating to first product: ${productUrl}`);
      const page3 = await browser.newPage();
      await page3.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1000));

      const prodDetail = await page3.evaluate(() => {
        const prdImg = document.querySelector('img.prd-img');
        const allImgs = Array.from(document.querySelectorAll('img')).slice(0, 5).map(img => ({
          src: img.src,
          dataSrc: img.getAttribute('data-src'),
          className: img.className,
        }));
        const table = document.querySelector('table');
        const sheetLink = document.querySelector('a[href*="-foy.rar"]');
        return {
          prdImgSrc: prdImg ? prdImg.src : null,
          allImgs,
          tableText: table ? table.textContent.substring(0, 300) : null,
          sheetUrl: sheetLink ? sheetLink.href : null,
        };
      });

      console.log(`  prd-img: ${prodDetail.prdImgSrc}`);
      console.log(`  all imgs:`);
      prodDetail.allImgs.forEach(img => console.log(`    class="${img.className}" src="${img.src}" data-src="${img.dataSrc}"`));
      console.log(`  table: ${prodDetail.tableText}`);
      console.log(`  sheetUrl: ${prodDetail.sheetUrl}`);
      await page3.close();
    }

    await page2.close();
  }

  await browser.close();
  console.log('\nDebug done.');
})().catch(console.error);
