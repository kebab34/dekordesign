const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('https://www.bienseramik.com.tr/karolar/banyo-karolari', { waitUntil: 'networkidle2', timeout: 30000 });
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 350));
  }
  await new Promise(r => setTimeout(r, 1500));

  const data = await page.evaluate(() => {
    // Get all links with images — likely collection cards
    const results = [];
    const seen = new Set();
    document.querySelectorAll('a').forEach(a => {
      const img = a.querySelector('img');
      if (!img) return;
      const href = a.href;
      if (seen.has(href)) return;
      seen.add(href);
      results.push({
        href,
        text: a.innerText?.trim().replace(/\s+/g, ' ').substring(0, 120),
        imgSrc: img.src,
        imgAlt: img.alt
      });
    });
    return results;
  });

  // Also dump full page text to find collection names
  const pageText = await page.evaluate(() => document.body.innerText);
  console.log('=== LINKS WITH IMAGES ===');
  console.log(JSON.stringify(data, null, 2));
  console.log('\n=== PAGE TEXT (first 3000 chars) ===');
  console.log(pageText.substring(0, 3000));
  await browser.close();
})().catch(console.error);
