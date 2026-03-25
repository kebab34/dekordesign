const puppeteer = require('puppeteer-core');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'https://www.bienseramik.com.tr';
const ROOT = `${BASE}/banyolar/armaturler`;

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--ignore-certificate-errors'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.goto(ROOT, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  const cats = await page.evaluate((root) => {
    const items = [];
    document.querySelectorAll('a').forEach(a => {
      const h = a.href || '';
      const t = a.textContent.trim();
      if (h.includes('armaturler/') && h !== root && !h.includes('#') && t.length > 0) {
        items.push({ href: h, label: t });
      }
    });
    const seen = new Set();
    return items.filter(c => { if (seen.has(c.href)) return false; seen.add(c.href); return true; });
  }, ROOT);

  console.log('Categories:', JSON.stringify(cats, null, 2));

  // Check card structure on first category
  if (cats.length > 0) {
    const p2 = await browser.newPage();
    await p2.goto(cats[0].href, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));
    await p2.evaluate(async () => { let y=0; await new Promise(r => { const t=setInterval(() => { window.scrollBy(0,500); y+=500; if(y>=document.body.scrollHeight){clearInterval(t);r();} },150); }); });
    await new Promise(r => setTimeout(r, 2000));
    const struct = await p2.evaluate(() => {
      const card = document.querySelector('.card.prd, .prd');
      return {
        cardHtml: card ? card.outerHTML.substring(0, 600) : 'not found',
        totalCards: document.querySelectorAll('.card.prd, .prd').length,
      };
    });
    console.log('Card structure:', JSON.stringify(struct, null, 2));
    await p2.close();
  }
  await browser.close();
})().catch(console.error);
