const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    headless: true
  });
  const page = await browser.newPage();
  
  // Try direct collection page
  await page.goto('https://www.bienseramik.com.tr/karolar/banyo-karolari/adel', { waitUntil: 'networkidle2', timeout: 30000 });
  for (let i = 0; i < 15; i++) {
    await page.evaluate(() => window.scrollBy(0, 400));
    await new Promise(r => setTimeout(r, 300));
  }
  await new Promise(r => setTimeout(r, 1000));

  const url = page.url();
  const text = await page.evaluate(() => document.body.innerText.substring(0, 1000));
  const imgs = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('img').forEach(img => {
      if (img.src && img.src.includes('uploads')) results.push({ src: img.src, alt: img.alt });
    });
    return results;
  });
  
  console.log('URL:', url);
  console.log('TEXT:', text);
  console.log('IMGS:', JSON.stringify(imgs, null, 2));
  await browser.close();
})().catch(console.error);
