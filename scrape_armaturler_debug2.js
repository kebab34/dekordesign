const puppeteer = require('puppeteer-core');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--ignore-certificate-errors'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.goto('https://www.bienseramik.com.tr/banyolar/armaturler/claire-lavabo-bataryasi-kisa-bl11051101', { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));
  const info = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img')).slice(0, 10).map(i => ({ src: i.src, cls: i.className }));
    const specs = {};
    document.querySelectorAll('table tr').forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length >= 2) specs[cells[0].textContent.trim()] = cells[1].textContent.trim();
    });
    const sheetLink = document.querySelector('a[href*="-foy.rar"]');
    const breadcrumbs = Array.from(document.querySelectorAll('.breadcrumb a, nav[aria-label] a, [class*="breadcrumb"] a')).map(a => ({ text: a.textContent.trim(), href: a.href }));
    const h1 = document.querySelector('h1')?.textContent.trim();
    const h2 = document.querySelector('h2')?.textContent.trim();
    // Look for category links in breadcrumbs or nav
    const catLinks = Array.from(document.querySelectorAll('a')).filter(a => a.href.includes('armaturler') && !a.href.endsWith('armaturler') && a.href !== window.location.href).slice(0,5).map(a => ({ href: a.href, text: a.textContent.trim() }));
    return { imgs: imgs.slice(0,8), specs, sheetUrl: sheetLink ? sheetLink.href : null, breadcrumbs, h1, h2, catLinks };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})().catch(console.error);
