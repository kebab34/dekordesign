/**
 * Scrape tous les produits armatürler depuis bienseramik.com.tr
 * Usage: node scrape_armaturler.js
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE   = 'https://www.bienseramik.com.tr';
const ROOT   = `${BASE}/banyolar/armaturler`;

// Catégories basées sur les préfixes de codes produits
function getCategoryFromCode(code) {
  if (!code) return 'Robinetterie';
  const upper = code.toUpperCase();
  if (upper.startsWith('BL')) return 'Robinets lavabo';
  if (upper.startsWith('BB')) return 'Robinets baignoire / douche';
  if (upper.startsWith('BE')) return 'Robinets évier';
  if (upper.startsWith('BC')) return 'Robinets bidet';
  if (upper.startsWith('BF')) return 'Robinets à capteur';
  if (upper.startsWith('BM')) return 'Vannes encastrées';
  if (upper.startsWith('BT')) return 'Accessoires douche';
  return 'Robinetterie';
}

// Traductions des clés
const TRANSLATIONS = {
  'Ürün Kodu': 'Référence', 'Ürün Kodu:': 'Référence',
  'Seri': 'Série', 'Seri:': 'Série',
  'Renk': 'Couleur', 'Renk:': 'Couleur',
  'Genişlik': 'Largeur', 'Genişlik:': 'Largeur',
  'Derinlik': 'Profondeur', 'Derinlik:': 'Profondeur',
  'Yükseklik': 'Hauteur', 'Yükseklik:': 'Hauteur',
  'Net Ağırlık': 'Poids net (kg)', 'Net Ağırlık:': 'Poids net (kg)',
  'Brüt Ağırlık': 'Poids brut (kg)', 'Brüt Ağırlık:': 'Poids brut (kg)',
  'Ebat': 'Dimensions', 'Ebat:': 'Dimensions',
  'Malzeme': 'Matériau', 'Malzeme:': 'Matériau',
  'Tip': 'Type', 'Tip:': 'Type',
  'Ürün Typei': 'Type', 'Ürün Typei:': 'Type',
  'Ürün Tipi': 'Type', 'Ürün Tipi:': 'Type',
  'Anma Boyutu': 'Taille nominale', 'Anma Boyutu:': 'Taille nominale',
  'Ürün Özellik': 'Caractéristique', 'Ürün Özellik:': 'Caractéristique',
  'Sıcak Su Girişi': 'Arrivée eau chaude', 'Sıcak Su Girişi:': 'Arrivée eau chaude',
  'Soğuk Su Girişi': 'Arrivée eau froide', 'Soğuk Su Girişi:': 'Arrivée eau froide',
  'Çıkış Ucu Uzunluğu': 'Longueur bec (mm)', 'Çıkış Ucu Uzunluğu:': 'Longueur bec (mm)',
  'Çıkış Ucu Yüksekliği': 'Hauteur bec (mm)', 'Çıkış Ucu Yüksekliği:': 'Hauteur bec (mm)',
  'Koli İçi Adet': 'Quantité par carton', 'Koli İçi Adet:': 'Quantité par carton',
  // ignorer
  'Kalınlık': null, 'Kalınlık:': null,
  'Kutu Ağırlık': null, 'Kutu Ağırlık:': null,
  'Palet Ağırlık': null, 'Palet Ağırlık:': null,
  'Paket içi Adet (Yurt İçi)': null, 'Paket içi Adet (Yurt İçi):': null,
  'Paket içi Adet (Yurt Dışı)': null, 'Paket içi Adet (Yurt Dışı):': null,
  'V Değeri': null, 'V Değeri:': null,
  'Doku': null, 'Doku:': null,
  'Rektifiye': null, 'Rektifiye:': null,
  'Kutu m2': null, 'Kutu m2 :': null,
  'Palet m2': null, 'Palet m2 :': null,
};

// Traductions des valeurs
const VAL_MAP = {
  'Beyaz': 'Blanc',
  'Krom': 'Chromé',
  'Siyah': 'Noir',
  'Mat Siyah': 'Noir mat',
  'Mat Krom': 'Chrome mat',
  'Paslanmaz Çelik': 'Acier inoxydable',
  'Pirinç': 'Laiton',
  'Evet': 'Oui',
  'Hayır': 'Non',
  'Altın': 'Or',
  'Mat Altın': 'Or mat',
  'Rose Gold': 'Or rose',
  'Plastik': 'Plastique',
  'ABS': 'ABS',
  'Lavabo Bataryası': 'Robinet lavabo',
  'Eviye Bataryası': 'Robinet évier',
  'Banyo Bataryası': 'Robinet baignoire',
  'Duş Bataryası': 'Robinet douche',
  'Bide Bataryası': 'Robinet bidet',
};

function translateKey(k) {
  if (!k) return null;
  const s = k.trim();
  if (TRANSLATIONS[s] !== undefined) return TRANSLATIONS[s];
  const noColon = s.replace(/:$/, '').trim();
  if (TRANSLATIONS[noColon] !== undefined) return TRANSLATIONS[noColon];
  return s;
}

function translateVal(v) {
  if (!v) return null;
  const s = v.trim();
  if (!s || s === 'cm' || s === 'kg' || s === '-') return null;
  return VAL_MAP[s] || s;
}

(async () => {
  console.log('Lancement du navigateur...');
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    protocolTimeout: 120000,
  });

  // ── Récupérer tous les produits depuis la page racine ─────────────────────
  const page = await browser.newPage();
  await page.goto(ROOT, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  const products = await page.evaluate((root) => {
    const items = [];
    document.querySelectorAll('a').forEach(a => {
      const h = a.href || '';
      const t = a.textContent.trim();
      if (h.includes('armaturler/') && h !== root && !h.includes('#') && t.length > 0) {
        // Extraire le code produit du slug (dernier segment après le dernier tiret-code)
        const slug = h.split('/').pop();
        const codeMatch = slug.match(/-([A-Za-z]{2}\d[\dA-Za-z]+)$/);
        const productCode = codeMatch ? codeMatch[1].toUpperCase() : null;
        items.push({ href: h, label: t, productCode });
      }
    });
    const seen = new Set();
    return items.filter(c => { if (seen.has(c.href)) return false; seen.add(c.href); return true; });
  }, ROOT);

  console.log(`${products.length} produits trouvés sur la page racine`);
  await page.close();
  await browser.close();

  // ── Scraping des détails de chaque produit ─────────────────────────────────
  console.log('\nScraping des détails produits...');
  const browser2 = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    protocolTimeout: 120000,
  });

  const all = [];

  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    process.stdout.write(`[${i+1}/${products.length}] ${prod.label.substring(0,45).padEnd(45)} `);

    try {
      const p = await browser2.newPage();
      await p.goto(prod.href, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 500));

      const detail = await p.evaluate(() => {
        // Specs dans la table
        const specs = {};
        document.querySelectorAll('table tr').forEach(row => {
          const cells = row.querySelectorAll('td, th');
          if (cells.length >= 2) {
            const k = cells[0].textContent.trim();
            const v = cells[1].textContent.trim();
            if (k && v && k !== v) specs[k] = v;
          }
        });

        // Image: chercher img.prd-img en premier, puis phpThumb
        let imgSrc = '';
        const prdImg = document.querySelector('img.prd-img');
        if (prdImg) {
          // L'URL phpThumb contient le nom du fichier, on reconstruit l'URL CDN
          const phpSrc = prdImg.src;
          const match = phpSrc.match(/src=\.\.\/uploads\/([^&]+)/);
          if (match) {
            const filename = match[1];
            // Convertir en PNG si possible (CDN supporte PNG)
            const pngName = filename.replace(/\.\w+$/, '.png');
            imgSrc = `https://bienseramik.b-cdn.net/uploads/${pngName}?width=800&height=800`;
          } else {
            imgSrc = phpSrc;
          }
        }

        // Fiche produit RAR
        const sheetLink = document.querySelector('a[href*="-foy.rar"]');
        const sheetUrl = sheetLink ? sheetLink.href : null;

        return { specs, imgSrc, sheetUrl };
      });

      // Déterminer la référence et la catégorie
      let productCode = prod.productCode;
      const rawRef = detail.specs['Ürün Kodu:'] || detail.specs['Ürün Kodu'] || '';
      if (rawRef) productCode = rawRef;

      const category = getCategoryFromCode(productCode);

      // Construire l'image CDN depuis la référence
      let image = detail.imgSrc;
      if (!image && productCode) {
        image = `https://bienseramik.b-cdn.net/uploads/${productCode}.png?width=800&height=800`;
      }

      // Traduire les specs
      const cleanSpecs = {};
      for (const [k, v] of Object.entries(detail.specs)) {
        const fk = translateKey(k);
        if (fk === null) continue;
        const fv = translateVal(v);
        if (!fv) continue;
        cleanSpecs[fk] = fv;
      }

      // SheetUrl depuis la référence si non trouvé
      let sheetUrl = detail.sheetUrl;
      if (!sheetUrl && productCode) {
        sheetUrl = `https://www.bienseramik.com.tr/uploads/${productCode}-foy.rar`;
      }

      all.push({
        label: prod.label,
        href: prod.href,
        category,
        image,
        specs: cleanSpecs,
        sheetUrl,
      });

      console.log(`✓ ${Object.keys(cleanSpecs).length} specs [${category}]`);
      await p.close();
    } catch (err) {
      console.log(`✗ ${err.message.substring(0, 50)}`);
      all.push({
        label: prod.label,
        href: prod.href,
        category: getCategoryFromCode(prod.productCode),
        image: '',
        specs: {},
        sheetUrl: null,
      });
    }

    // Pause toutes les 20 requêtes pour éviter de surcharger le serveur
    if (i % 20 === 19) await new Promise(r => setTimeout(r, 800));
  }

  await browser2.close();

  // ── Sauvegarder ───────────────────────────────────────────────────────────
  fs.writeFileSync('./public/cat_preview/armaturler_products.json', JSON.stringify(all, null, 2));
  console.log(`\n✓ ${all.length} produits sauvegardés dans armaturler_products.json`);

  const stats = {};
  all.forEach(p => { stats[p.category] = (stats[p.category] || 0) + 1; });
  Object.entries(stats).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
  console.log(`  Avec image: ${all.filter(p => p.image).length}/${all.length}`);
  console.log(`  Avec specs: ${all.filter(p => Object.keys(p.specs||{}).length > 0).length}/${all.length}`);
})().catch(console.error);
