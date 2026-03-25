const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('https://www.bienseramik.com.tr/karolar/banyo-karolari', { waitUntil: 'networkidle2', timeout: 30000 });
  for (let i = 0; i < 15; i++) {
    await page.evaluate(() => window.scrollBy(0, 400));
    await new Promise(r => setTimeout(r, 300));
  }
  await new Promise(r => setTimeout(r, 1000));

  const data = await page.evaluate(() => {
    const results = [];
    // Try various selectors for collection cards
    const cards = document.querySelectorAll('a[href*="/karolar/"]');
    cards.forEach(card => {
      const href = card.href;
      const img = card.querySelector('img');
      const title = card.querySelector('h1,h2,h3,h4,h5,p,span');
      results.push({
        href,
        text: card.innerText?.trim().substring(0, 100),
        imgSrc: img?.src || '',
        imgAlt: img?.alt || ''
      });
    });
    return results;
  });

  const filtered = data.filter(d => d.href && !d.href.includes('banyo-karolari') || d.text);
  console.log(JSON.stringify(filtered, null, 2));
  await browser.close();
})().catch(console.error);
