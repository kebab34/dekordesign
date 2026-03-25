const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE   = 'https://www.bienseramik.com.tr';

const CATEGORIES = [
  { slug: 'asma-klozetler',         label: 'WC Suspendu' },
  { slug: 'duvara-sifir-klozetler', label: 'WC Compact' },
  { slug: 'lavabo',                 label: 'Lavabo' },
  { slug: 'pisuar-ve-ara-bolmeler', label: 'Urinoir & Cloisons' },
  { slug: 'hela-taslari',           label: 'Cuvette à la turque' },
  { slug: 'bide',                   label: 'Bidet' },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    protocolTimeout: 120000,
  });

  const all = [];

  for (const cat of CATEGORIES) {
    const url = `${BASE}/banyolar/seramik-saglik-gerecleri/${cat.slug}`;
    console.log(`Scraping: ${url}`);
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));

    // Scroll pour charger tous les produits (lazy load)
    await page.evaluate(async () => {
      await new Promise(resolve => {
        let total = document.body.scrollHeight;
        let step = 400;
        let y = 0;
        const timer = setInterval(() => {
          window.scrollBy(0, step);
          y += step;
          if (y >= total) { clearInterval(timer); resolve(); }
        }, 100);
      });
    });
    await new Promise(r => setTimeout(r, 1500));

    // Extraire les produits
    const products = await page.evaluate((catSlug, catLabel, baseUrl) => {
      const items = [];
      // Chercher tous les liens/cartes produits
      document.querySelectorAll('a[href*="urun"], a[href*="product"], .prd, .card').forEach(el => {
        const link = el.tagName === 'A' ? el : el.querySelector('a');
        if (!link) return;
        const href = link.getAttribute('href') || '';
        if (!href || href.includes('linkedin') || href.includes('youtube')) return;

        const img = el.querySelector('img');
        const imgSrc = img ? (img.src || img.dataset.src || img.getAttribute('data-src') || '') : '';

        // Nom du produit
        const nameEl = el.querySelector('h5, h4, h3, .card-title, [class*="title"], [class*="name"]');
        const name = nameEl ? nameEl.textContent.trim() : '';

        // Prix
        const priceEl = el.querySelector('[class*="price"], [class*="fiyat"]');
        const price = priceEl ? priceEl.textContent.trim() : '';

        if (name || imgSrc) {
          items.push({
            category: catSlug,
            categoryLabel: catLabel,
            name: name || href.split('/').pop(),
            href: href.startsWith('http') ? href : baseUrl + '/' + href.replace(/^\//, ''),
            img: imgSrc,
            price,
          });
        }
      });

      // Déduplication par href
      const seen = new Set();
      return items.filter(p => {
        if (!p.href || seen.has(p.href)) return false;
        seen.add(p.href);
        return true;
      });
    }, cat.slug, cat.label, BASE);

    console.log(`  → ${products.length} produits trouvés`);
    all.push(...products);
    await page.close();
  }

  await browser.close();

  fs.writeFileSync('C:/Users/user/Desktop/projet/dekordesign/public/cat_preview/banyo_products.json',
    JSON.stringify(all, null, 2));

  console.log(`\nTotal: ${all.length} produits`);
  console.log('Catégories:');
  const cats = {};
  all.forEach(p => { cats[p.categoryLabel] = (cats[p.categoryLabel] || 0) + 1; });
  Object.entries(cats).forEach(([k,v]) => console.log(`  ${k}: ${v}`));

  // Afficher un échantillon
  console.log('\nÉchantillon:');
  all.slice(0, 5).forEach(p => console.log(`  [${p.categoryLabel}] ${p.name} - ${p.img.substring(0,60)}`));
})().catch(console.error);
