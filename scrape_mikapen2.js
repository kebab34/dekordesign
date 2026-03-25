const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('https://mikapen.net', { waitUntil: 'networkidle2', timeout: 20000 });
  for (let i = 0; i < 10; i++) { await page.evaluate(() => window.scrollBy(0, 400)); await new Promise(r => setTimeout(r, 300)); }
  await new Promise(r => setTimeout(r, 1000));
  
  const data = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img')).map(i => ({ src: i.src, alt: i.alt }));
    const text = document.body.innerText.substring(0, 500);
    return { imgs, text };
  });
  console.log('TEXT:', data.text);
  console.log('\nALL IMGS:', JSON.stringify(data.imgs.slice(0, 20), null, 2));
  await browser.close();
})().catch(console.error);
