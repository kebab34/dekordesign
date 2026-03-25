/**
 * Debug script — inspect structure of dus-sistemleri-urunleri page
 */

const puppeteer = require('puppeteer-core');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT   = 'https://www.bienseramik.com.tr/banyolar/dus-sistemleri-urunleri';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    protocolTimeout: 120000,
  });

  const page = await browser.newPage();
  console.log('Visiting:', ROOT);
  await page.goto(ROOT, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  // Find subcategories
  const subcats = await page.evaluate((root) => {
    const links = [];
    document.querySelectorAll('a').forEach(a => {
      const h = a.href || '';
      if (h.includes('dus-sistemleri-urunleri/') && !h.includes('#')) {
        links.push({ href: h, text: a.textContent.trim() });
      }
    });
    const seen = new Set();
    return links.filter(l => { if (seen.has(l.href)) return false; seen.add(l.href); return true; });
  }, ROOT);

  console.log('\n=== SUBCATEGORIES FOUND ===');
  subcats.forEach(s => console.log(`  ${s.text} → ${s.href}`));

  // Check card structure on root page
  const cardInfo = await page.evaluate(() => {
    const cards = document.querySelectorAll('.card.prd');
    console.log('cards found:', cards.length);
    if (cards.length === 0) return { count: 0, html: '' };
    return { count: cards.length, html: cards[0].outerHTML.substring(0, 1000) };
  });

  console.log('\n=== CARD STRUCTURE (root page) ===');
  console.log('Cards found on root:', cardInfo.count);
  if (cardInfo.html) console.log('First card HTML:\n', cardInfo.html);

  // If no cards on root, check first subcat
  if (cardInfo.count === 0 && subcats.length > 0) {
    console.log('\nNo cards on root, checking first subcategory:', subcats[0].href);
    await page.goto(subcats[0].href, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));

    const subcatCards = await page.evaluate(() => {
      const cards = document.querySelectorAll('.card.prd');
      if (cards.length === 0) {
        // Dump all links that look like products
        const links = [];
        document.querySelectorAll('a').forEach(a => {
          if (a.href && a.href.includes('/banyolar/') && !a.href.includes('#')) {
            links.push(a.href);
          }
        });
        return { count: 0, html: '', links: [...new Set(links)].slice(0, 20) };
      }
      return { count: cards.length, html: cards[0].outerHTML.substring(0, 1500), links: [] };
    });

    console.log('Cards found on subcat:', subcatCards.count);
    if (subcatCards.html) console.log('First card HTML:\n', subcatCards.html);
    if (subcatCards.links.length) console.log('Links found:\n', subcatCards.links);
  }

  // Also check all links on root that might be product pages
  const allLinks = await page.evaluate(() => {
    const links = [];
    document.querySelectorAll('a[href]').forEach(a => {
      const h = a.href;
      if (h.includes('/banyolar/') && !h.includes('#')) links.push({ href: h, text: a.textContent.trim().substring(0, 60) });
    });
    const seen = new Set();
    return links.filter(l => { if (seen.has(l.href)) return false; seen.add(l.href); return true; }).slice(0, 30);
  });
  console.log('\n=== ALL /banyolar/ LINKS ON CURRENT PAGE ===');
  allLinks.forEach(l => console.log(`  [${l.text}] ${l.href}`));

  await browser.close();
})().catch(console.error);
