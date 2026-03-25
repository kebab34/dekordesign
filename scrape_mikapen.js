const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('https://mikapen.net', { waitUntil: 'networkidle2', timeout: 20000 });
  for (let i = 0; i < 8; i++) { await page.evaluate(() => window.scrollBy(0, 400)); await new Promise(r => setTimeout(r, 200)); }
  
  const imgs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('img'))
      .filter(i => i.src && i.src.includes('mikapen') && !i.src.includes('logo') && !i.src.includes('icon'))
      .map(i => ({ src: i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight }))
  );
  console.log(JSON.stringify(imgs.slice(0, 15), null, 2));
  await browser.close();
})().catch(console.error);
