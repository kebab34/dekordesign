const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    headless: true
  });

  const page = await browser.newPage();
  await page.goto('https://www.bienseramik.com.tr/banyo-urunleri', { waitUntil: 'networkidle2', timeout: 20000 });
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => window.scrollBy(0, 400));
    await new Promise(r => setTimeout(r, 300));
  }
  await new Promise(r => setTimeout(r, 1000));

  const result = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'))
      .map(i => ({ src: i.src, alt: i.alt }));
    const text = document.body.innerText.substring(0, 2000);
    return { imgs, text };
  });

  console.log('TEXT:', result.text.substring(0, 500));
  console.log('\nIMAGES:', result.imgs.filter(i => i.src.includes('uploads')).slice(0, 10).map(i => `${i.alt} → ${i.src}`).join('\n'));

  await browser.close();
})().catch(console.error);
