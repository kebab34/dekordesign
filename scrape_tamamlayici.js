/**
 * Scrape les produits tamamlayici (produits complémentaires salle de bain)
 * Usage: node scrape_tamamlayici.js
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE   = 'https://www.bienseramik.com.tr';
const ROOT   = `${BASE}/banyolar/tamamlayici-urunler`;

const CAT_LABELS = {
  'gomme-rezervuarlar':          'Réservoirs encastrés',
  'aktuator-panelleri':          'Panneaux de commande',
  'klozet-kapaklari':            'Abattants WC',
  'magiclight-klozet-kapaklari': 'Abattants Magiclight',
  'rezervuarlar':                'Réservoirs',
  'seramik-pop-up':              'Bonde céramique',
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    protocolTimeout: 120000,
  });

  // ── Catégories ────────────────────────────────────────────────────────────
  const page = await browser.newPage();
  await page.goto(ROOT, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1500));

  const categories = await page.evaluate((root) => {
    const cats = [];
    document.querySelectorAll('a').forEach(a => {
      const href = a.href || '';
      const text = a.textContent.trim();
      if (href.includes('tamamlayici-urunler/') && href !== root && !href.includes('#') && text.length > 0) {
        cats.push({ href, label: text });
      }
    });
    const seen = new Set();
    return cats.filter(c => { if (seen.has(c.href)) return false; seen.add(c.href); return true; });
  }, ROOT);

  console.log(`${categories.length} catégories trouvées`);
  await page.close();

  // ── Scraping ──────────────────────────────────────────────────────────────
  const all = [];

  for (const cat of categories) {
    const slug = cat.href.split('/').pop();
    const labelFR = CAT_LABELS[slug] || cat.label;
    console.log(`Scraping: ${labelFR}...`);

    const p = await browser.newPage();
    await p.goto(cat.href, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));

    // Scroll pour charger toutes les images lazy
    await p.evaluate(async () => {
      await new Promise(resolve => {
        let y = 0;
        const timer = setInterval(() => {
          window.scrollBy(0, 500);
          y += 500;
          if (y >= document.body.scrollHeight) { clearInterval(timer); resolve(); }
        }, 150);
      });
    });
    await new Promise(r => setTimeout(r, 2000));

    const products = await p.evaluate((labelFR, base) => {
      const items = [];
      // Structure: .card.prd contient img + a
      document.querySelectorAll('.card.prd, .prd').forEach(card => {
        const img = card.querySelector('img');
        const link = card.querySelector('a[href]');
        if (!link) return;

        let href = link.getAttribute('href') || '';
        // Construire l'URL complète si relative
        if (!href.startsWith('http')) href = base + '/' + href.replace(/^\//, '');

        const name = link.querySelector('h5, h4, h3')?.textContent.trim() ||
                     link.textContent.trim().substring(0, 100) ||
                     href.split('/').pop();

        // Image: nettoyer le path /../uploads/
        let imgSrc = img ? img.src || '' : '';
        imgSrc = imgSrc.replace('/../uploads/', '/uploads/');

        items.push({ categoryLabel: labelFR, name, href, img: imgSrc });
      });

      const seen = new Set();
      return items.filter(p => { if (seen.has(p.href)) return false; seen.add(p.href); return true; });
    }, labelFR, BASE);

    console.log(`  → ${products.length} produits`);
    all.push(...products);
    await p.close();
  }

  await browser.close();

  // ── Scrape les specs de chaque produit ────────────────────────────────────
  console.log('\nScraping des specs produits...');
  const browser2 = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    protocolTimeout: 120000,
  });

  const TRANSLATIONS = {
    'Ürün Kodu': 'Référence', 'Référence': 'Référence',
    'Seri': 'Série', 'Série': 'Série',
    'Renk': 'Couleur', 'Couleur': 'Couleur',
    'Genişlik': 'Largeur', 'Derinlik': 'Profondeur', 'Yükseklik': 'Hauteur',
    'Net Ağırlık': 'Poids net (kg)', 'Brüt Ağırlık': 'Poids brut (kg)',
    'Poids brut': 'Poids brut (kg)', 'Poids net': 'Poids net (kg)',
    'Malzeme': 'Matériau', 'Tip': 'Type', 'Ürün Typei': 'Type',
    'Ebat': 'Dimensions', 'Anma Boyutu': 'Taille nominale',
    'Ürün Özellik': 'Caractéristique',
    'Kapasite': 'Capacité', 'Hacim': 'Volume',
    'Klozet Tipi': 'Type WC compatible',
    'Uyumlu Klozet': 'WC compatible',
    'Bağlantı': 'Raccord',
    // ignorer
    'Kalınlık': null, 'Kutu Ağırlık': null, 'Palet Ağırlık': null,
    'Paket içi Adet (Yurt İçi)': null, 'Paket içi Adet (Yurt Dışı)': null,
  };
  const VAL_MAP = {
    'Beyaz': 'Blanc', 'Siyah': 'Noir', 'Gri': 'Gris', 'Krom': 'Chromé',
    'Mat Siyah': 'Noir mat', 'Mat Beyaz': 'Blanc mat',
    'Paslanmaz Çelik': 'Acier inoxydable', 'Plastik': 'Plastique',
    'ABS': 'ABS', 'PP': 'PP', 'Duroplast': 'Duroplast',
    'Evet': 'Oui', 'Hayır': 'Non',
    'Buz': 'Givré',
  };

  function translate(str) {
    if (!str) return null;
    const s = str.trim();
    if (TRANSLATIONS[s] !== undefined) return TRANSLATIONS[s];
    // clé avec colon
    const noColon = s.replace(/:$/, '').trim();
    if (TRANSLATIONS[noColon] !== undefined) return TRANSLATIONS[noColon];
    return s;
  }
  function translateVal(v) {
    if (!v || v.trim() === '' || v.trim() === 'cm' || v.trim() === 'kg') return null;
    const s = v.trim();
    return VAL_MAP[s] || s;
  }

  for (let i = 0; i < all.length; i++) {
    const prod = all[i];
    process.stdout.write(`[${i+1}/${all.length}] ${prod.name.substring(0,40).padEnd(40)} `);
    try {
      const p = await browser2.newPage();
      await p.goto(prod.href, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 600));

      const detail = await p.evaluate(() => {
        const specs = {};
        document.querySelectorAll('table tr').forEach(row => {
          const cells = row.querySelectorAll('td, th');
          if (cells.length >= 2) {
            const k = cells[0].textContent.trim();
            const v = cells[1].textContent.trim();
            if (k && v && k !== v) specs[k] = v;
          }
        });
        // Image haute résolution depuis la page produit
        const mainImg = document.querySelector('.product-detail img, [class*="product"] img:first-child, .prd-img img');
        const imgSrc = mainImg ? mainImg.src || '' : '';
        // Fiche produit RAR
        const sheetLink = document.querySelector('a[href*="-foy.rar"]');
        const sheetUrl = sheetLink ? sheetLink.href : null;
        return { specs, imgHD: imgSrc, sheetUrl };
      });

      // Traduire les specs
      const cleanSpecs = {};
      for (const [k, v] of Object.entries(detail.specs)) {
        const fk = translate(k);
        if (fk === null) continue;
        const fv = translateVal(v);
        if (!fv) continue;
        cleanSpecs[fk] = fv;
      }

      prod.specs = cleanSpecs;
      prod.sheetUrl = detail.sheetUrl;

      // Améliorer l'image si trouvée sur la page détail
      if (detail.imgHD && detail.imgHD.includes('b-cdn') && !prod.img) {
        prod.img = detail.imgHD.replace('/../uploads/', '/uploads/');
      }

      // Construire sheetUrl depuis la référence si non trouvé
      if (!prod.sheetUrl && cleanSpecs['Référence']) {
        prod.sheetUrl = `https://www.bienseramik.com.tr/uploads/${cleanSpecs['Référence']}-foy.rar`;
      }

      console.log(`✓ ${Object.keys(cleanSpecs).length} specs`);
      await p.close();
    } catch (err) {
      console.log(`✗ ${err.message.substring(0, 40)}`);
      prod.specs = {};
    }
    if (i % 15 === 14) await new Promise(r => setTimeout(r, 500));
  }

  await browser2.close();

  fs.writeFileSync('./public/cat_preview/tamamlayici_products.json', JSON.stringify(all, null, 2));
  console.log(`\n✓ ${all.length} produits sauvegardés`);
  const stats = {};
  all.forEach(p => { stats[p.categoryLabel] = (stats[p.categoryLabel] || 0) + 1; });
  Object.entries(stats).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
  console.log(`  Avec image: ${all.filter(p => p.img).length}/${all.length}`);
  console.log(`  Avec specs: ${all.filter(p => Object.keys(p.specs||{}).length > 0).length}/${all.length}`);
})().catch(console.error);
