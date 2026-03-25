/**
 * Scrape tous les produits duş sistemleri depuis bienseramik.com.tr
 * Usage: node scrape_dus.js
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE   = 'https://www.bienseramik.com.tr';
const ROOT   = `${BASE}/banyolar/dus-sistemleri-urunleri`;

// Traduction des slugs de catégorie en français
const SLUG_CATEGORY_MAP = {
  'dus-bataryalari':          'Robinets de douche',
  'termostatik-bataryalar':   'Robinets thermostatiques',
  'el-dus-setleri':           'Ensembles douchette',
  'sabit-dus-basliklari':     'Pommeaux de douche fixes',
  'dus-panelleri':            'Panneaux de douche',
  'dus-kolonlari':            'Colonnes de douche',
  'dus-sistemleri':           'Systèmes de douche complets',
};

// Déterminer la catégorie depuis le code produit ou le label
function getCategoryFromProduct(code, label) {
  if (!code) return getCategoryFromLabel(label);
  const u = code.toUpperCase();
  // BB = Banyo Bataryası (robinet baignoire/douche)
  if (u.startsWith('BB')) {
    // Water Flowbox sistemleri → Systèmes de douche complets
    if (label && label.toLowerCase().includes('water flowbox')) return 'Systèmes de douche complets';
    // Ankastre Duş → Robinets de douche encastrés
    if (label && label.toLowerCase().includes('ankastre')) return 'Robinets de douche encastrés';
    // Duş Kolonu → Colonnes de douche
    if (label && label.toLowerCase().includes('kolonu')) return 'Colonnes de douche';
    return 'Robinets de douche';
  }
  // BD = Duş (shower accessories/systems)
  if (u.startsWith('BD')) {
    if (label && (label.toLowerCase().includes('kolonu') || label.toLowerCase().includes('kolone'))) return 'Colonnes de douche';
    if (label && label.toLowerCase().includes('panel')) return 'Panneaux de douche';
    if (label && (label.toLowerCase().includes('başlığ') || label.toLowerCase().includes('basligi'))) return 'Pommeaux de douche fixes';
    if (label && (label.toLowerCase().includes('üst takım') || label.toLowerCase().includes('ust takim'))) return 'Ensembles de douche';
    return 'Systèmes de douche';
  }
  // BT = Tamamlayıcı (accessories)
  if (u.startsWith('BT')) {
    if (label && (label.toLowerCase().includes('borusu') || label.toLowerCase().includes('boru'))) return 'Bras de douche';
    if (label && label.toLowerCase().includes('set')) return 'Ensembles douchette';
    return 'Accessoires douche';
  }
  return getCategoryFromLabel(label);
}

function getCategoryFromLabel(label) {
  if (!label) return 'Systèmes de douche';
  const l = label.toLowerCase();
  if (l.includes('water flowbox')) return 'Systèmes de douche complets';
  if (l.includes('comfort rain') || l.includes('kolonu')) return 'Colonnes de douche';
  if (l.includes('panel')) return 'Panneaux de douche';
  if (l.includes('başlığ') || l.includes('basligi')) return 'Pommeaux de douche fixes';
  if (l.includes('ust takim') || l.includes('üst takım')) return 'Ensembles de douche';
  if (l.includes('borusu') || l.includes('boru')) return 'Bras de douche';
  if (l.includes('set')) return 'Ensembles douchette';
  if (l.includes('batarya') || l.includes('bataryası')) return 'Robinets de douche';
  return 'Systèmes de douche';
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
  'Duş Sayısı': 'Nombre de jets', 'Duş Sayısı:': 'Nombre de jets',
  'Fonksiyon': 'Fonction', 'Fonksiyon:': 'Fonction',
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
  'Mat Bronz': 'Bronze mat',
  'Plastik': 'Plastique',
  'ABS': 'ABS',
  'Duş Bataryası': 'Robinet douche',
  'Banyo Bataryası': 'Robinet baignoire/douche',
  'Ankastre Duş Bataryası': 'Robinet douche encastré',
  'Ankastre Banyo Bataryası': 'Robinet baignoire encastré',
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

  // Scroll pour charger tous les produits lazy
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let total = 0;
      const timer = setInterval(() => {
        window.scrollBy(0, 400);
        total += 400;
        if (total > document.body.scrollHeight) { clearInterval(timer); resolve(); }
      }, 100);
    });
  });
  await new Promise(r => setTimeout(r, 1500));

  const products = await page.evaluate((base) => {
    const items = [];
    document.querySelectorAll('a').forEach(a => {
      const h = a.href || '';
      if (h.includes('dus-sistemleri-urunleri/') && !h.includes('#')) {
        const slug = h.split('/').pop();
        // Extraire le code produit: dernier segment après le dernier tiret (code alphanum)
        const codeMatch = slug.match(/-([A-Za-z]{2}\d[\dA-Za-z]+)$/i);
        const productCode = codeMatch ? codeMatch[1].toUpperCase() : null;
        const label = a.textContent.trim();
        if (label.length > 0) {
          items.push({ href: h, label, productCode });
        }
      }
    });
    const seen = new Set();
    return items.filter(c => { if (seen.has(c.href)) return false; seen.add(c.href); return true; });
  }, BASE);

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

        // Image: chercher img.prd-img → CDN URL
        let imgSrc = '';
        const prdImg = document.querySelector('img.prd-img');
        if (prdImg) {
          const phpSrc = prdImg.src;
          // Extraire le filename depuis phpThumb src parameter
          const match = phpSrc.match(/src=\.\.\/uploads\/([^&]+)/);
          if (match) {
            const filename = match[1];
            imgSrc = `https://bienseramik.b-cdn.net/uploads/${filename}?width=800&height=800`;
          } else if (phpSrc.includes('b-cdn.net')) {
            // Déjà sur le CDN, ajuster la résolution
            imgSrc = phpSrc.replace(/\?.*$/, '?width=800&height=800');
          } else {
            imgSrc = phpSrc;
          }
        }

        // Essayer aussi img avec data-src ou src direct contenant le code produit
        if (!imgSrc) {
          const imgs = document.querySelectorAll('img[src*="b-cdn.net/uploads"]');
          if (imgs.length > 0) {
            imgSrc = imgs[0].src.replace(/\?.*$/, '?width=800&height=800');
          }
        }

        // Fiche produit RAR
        const sheetLink = document.querySelector('a[href*="-foy.rar"]');
        const sheetUrl = sheetLink ? sheetLink.href : null;

        return { specs, imgSrc, sheetUrl };
      });

      // Déterminer la référence
      let productCode = prod.productCode;
      const rawRef = detail.specs['Ürün Kodu:'] || detail.specs['Ürün Kodu'] || '';
      if (rawRef) productCode = rawRef;

      const category = getCategoryFromProduct(productCode, prod.label);

      // Image CDN depuis la référence si non trouvée
      let image = detail.imgSrc;
      if (!image && productCode) {
        image = `https://bienseramik.b-cdn.net/uploads/${productCode}.jpg?width=800&height=800`;
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

      console.log(`OK ${Object.keys(cleanSpecs).length} specs [${category}]`);
      await p.close();
    } catch (err) {
      console.log(`ERREUR ${err.message.substring(0, 50)}`);
      all.push({
        label: prod.label,
        href: prod.href,
        category: getCategoryFromProduct(prod.productCode, prod.label),
        image: '',
        specs: {},
        sheetUrl: null,
      });
    }

    // Pause toutes les 20 requêtes
    if (i % 20 === 19) await new Promise(r => setTimeout(r, 800));
  }

  await browser2.close();

  // ── Sauvegarder ───────────────────────────────────────────────────────────
  const outDir = './public/cat_preview';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(`${outDir}/dus_products.json`, JSON.stringify(all, null, 2));
  console.log(`\nOK ${all.length} produits sauvegardés dans dus_products.json`);

  const stats = {};
  all.forEach(p => { stats[p.category] = (stats[p.category] || 0) + 1; });
  Object.entries(stats).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
  console.log(`  Avec image: ${all.filter(p => p.image).length}/${all.length}`);
  console.log(`  Avec specs: ${all.filter(p => Object.keys(p.specs||{}).length > 0).length}/${all.length}`);
})().catch(console.error);
