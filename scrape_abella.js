const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--ignore-certificate-errors', '--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36');

  console.log('Fetching Abella page...');
  await page.goto('https://www.bienseramik.com.tr/karolar/ic-mekan-karolari/abella', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  const data = await page.evaluate(() => {
    const result = {
      name: '',
      description: '',
      specs: {},
      variants: [],
      images: []
    };

    // Nom de la collection
    const h1 = document.querySelector('h1');
    if (h1) result.name = h1.innerText.trim();

    // Description
    const desc = document.querySelector('.collection-description, .product-description, [class*="description"]');
    if (desc) result.description = desc.innerText.trim();

    // Toutes les images de la page
    const allImgs = [...document.querySelectorAll('img')];
    result.images = allImgs
      .map(img => img.src)
      .filter(src => src && !src.includes('logo') && !src.includes('icon') && (src.includes('.jpg') || src.includes('.png') || src.includes('.jpeg') || src.includes('.webp')))
      .filter((src, i, arr) => arr.indexOf(src) === i);

    // Specs / tableau de caractéristiques
    const tables = [...document.querySelectorAll('table')];
    tables.forEach(table => {
      const rows = [...table.querySelectorAll('tr')];
      rows.forEach(row => {
        const cells = [...row.querySelectorAll('td, th')];
        if (cells.length >= 2) {
          const key = cells[0].innerText.trim();
          const val = cells[1].innerText.trim();
          if (key && val) result.specs[key] = val;
        }
      });
    });

    // Cherche les variantes (tailles, couleurs)
    const variantEls = document.querySelectorAll('[class*="variant"], [class*="product-item"], [class*="tile"], [class*="format"]');
    variantEls.forEach(el => {
      const text = el.innerText.trim();
      const img = el.querySelector('img');
      if (text) {
        result.variants.push({
          label: text,
          image: img ? img.src : null
        });
      }
    });

    // Cherche les tailles / formats listés
    const sizeEls = document.querySelectorAll('[class*="size"], [class*="boyut"], [class*="format"]');
    result.sizes = [...sizeEls].map(el => el.innerText.trim()).filter(t => t && t.match(/\d+/));

    return result;
  });

  console.log('\n=== ABELLA DATA ===');
  console.log('Name:', data.name);
  console.log('Description:', data.description);
  console.log('\nSpecs:');
  Object.entries(data.specs).forEach(([k, v]) => console.log(` ${k}: ${v}`));
  console.log('\nImages found:', data.images.length);
  data.images.forEach((img, i) => console.log(` [${i}] ${img}`));
  console.log('\nVariants:', data.variants.length);
  data.variants.forEach(v => console.log(` - ${v.label} | ${v.image}`));
  console.log('\nSizes:', data.sizes);

  // Dump HTML pour analyse si besoin
  const html = await page.content();
  const fs = require('fs');
  fs.writeFileSync('abella_page.html', html);
  console.log('\nHTML saved to abella_page.html');

  await browser.close();
})();
