const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--ignore-certificate-errors', '--disable-web-security'],
    headless: true
  });
  const page = await browser.newPage();
  
  // Intercept all image requests
  const imageUrls = [];
  page.on('response', response => {
    const url = response.url();
    const type = response.headers()['content-type'] || '';
    if (type.includes('image') && url.includes('mikapen')) {
      imageUrls.push({ url, status: response.status() });
    }
  });

  await page.goto('https://mikapen.net/pencere-sistemleri/', { waitUntil: 'networkidle2', timeout: 20000 });
  for (let i = 0; i < 8; i++) { await page.evaluate(() => window.scrollBy(0, 500)); await new Promise(r => setTimeout(r, 300)); }
  await new Promise(r => setTimeout(r, 1000));

  const imgs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('img')).map(i => ({ src: i.src, alt: i.alt, complete: i.complete }))
  );
  
  console.log('Intercepted:', JSON.stringify(imageUrls.slice(0,10), null, 2));
  console.log('\nDOM imgs:', JSON.stringify(imgs.filter(i => i.src).slice(0,10), null, 2));
  
  await browser.close();
})().catch(console.error);
