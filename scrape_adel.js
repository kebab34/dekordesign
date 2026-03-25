const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('https://www.bienseramik.com.tr/karolar/banyo-karolari?koleksiyon=Adel', { waitUntil: 'networkidle2', timeout: 30000 });
  for (let i = 0; i < 15; i++) {
    await page.evaluate(() => window.scrollBy(0, 400));
    await new Promise(r => setTimeout(r, 300));
  }
  await new Promise(r => setTimeout(r, 1000));

  const products = await page.evaluate(() => {
    const cards = [];
    document.querySelectorAll('a[href*="/karolar/"]').forEach(a => {
      const img = a.querySelector('img');
      if (!img) return;
      const nameEl = a.querySelector('h2,h3,h4,p,span,.product-name,.name');
      cards.push({
        href: a.href,
        name: nameEl?.innerText?.trim() || a.innerText?.trim().substring(0, 60),
        img: img.src,
        imgAlt: img.alt
      });
    });
    return cards;
  });

  console.log(JSON.stringify(products, null, 2));
  await browser.close();
})().catch(console.error);
