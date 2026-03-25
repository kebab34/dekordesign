const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--ignore-certificate-errors', '--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36');

  const urls = [
    'https://www.bienseramik.com.tr/karolar/ic-mekan-karolari/abella/abella-40x120',
    'https://www.bienseramik.com.tr/karolar/ic-mekan-karolari/abella/abella-dekofon-40x120',
    'https://www.bienseramik.com.tr/karolar/ic-mekan-karolari/abella/abella-60x60'
  ];

  const results = [];

  for (const url of urls) {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const d = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('img')]
        .map(i => i.src)
        .filter(s => s.includes('cdn') && (s.includes('.jpg') || s.includes('.png') || s.includes('.webp')))
        .filter((s, i, a) => a.indexOf(s) === i);

      const title = document.querySelector('h1')?.innerText?.trim() || '';

      const specs = {};
      document.querySelectorAll('tr').forEach(r => {
        const cells = r.querySelectorAll('td');
        if (cells.length >= 2) {
          const k = cells[0].innerText.trim();
          const v = cells[1].innerText.trim();
          if (k && v) specs[k] = v;
        }
      });

      // Try to find size/finish info in dl/dt/dd or list items
      const listItems = [...document.querySelectorAll('li, dt, dd, .spec, [class*="spec"], [class*="detail"]')]
        .map(el => el.innerText.trim())
        .filter(t => t.length > 1 && t.length < 100);

      return { title, imgs: imgs.slice(0, 10), specs, listItems };
    });

    console.log('\n=== ' + url.split('/').pop() + ' ===');
    console.log('Title:', d.title);
    console.log('Specs:', JSON.stringify(d.specs, null, 2));
    console.log('List items:', d.listItems.slice(0, 20).join(' | '));
    console.log('Images:');
    d.imgs.forEach(img => console.log(' ', img));

    results.push({ url, ...d });
  }

  const fs = require('fs');
  fs.writeFileSync('abella_results.json', JSON.stringify(results, null, 2));
  console.log('\nSaved to abella_results.json');

  await browser.close();
})();
