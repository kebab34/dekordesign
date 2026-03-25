const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('https://www.bienseramik.com.tr/karolar/banyo-karolari', { waitUntil: 'networkidle2', timeout: 30000 });
  for (let i = 0; i < 25; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 300));
  }
  await new Promise(r => setTimeout(r, 1500));

  // Extract only the collection filter list
  const collections = await page.evaluate(() => {
    // Find the Koleksiyon section in the filter sidebar
    const allText = document.body.innerText;
    // Get everything between "Koleksiyon" and the next filter label
    const match = allText.match(/Koleksiyon\n([\s\S]*?)(?:\nDoku|\nEbat|\nÜrün)/);
    if (match) return match[1].trim().split('\n').map(s => s.trim()).filter(Boolean);
    // Fallback: get all unique text from filter checkboxes/labels
    const items = [];
    document.querySelectorAll('label, .filter-item, li').forEach(el => {
      const t = el.innerText?.trim();
      if (t && t.length > 1 && t.length < 50 && /^[A-ZÀ-Ö]/.test(t)) items.push(t);
    });
    return [...new Set(items)];
  });

  console.log('Total collections on site:', collections.length);
  console.log(collections.join('\n'));
  await browser.close();
})().catch(console.error);
