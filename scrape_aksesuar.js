/**
 * Scrape tous les produits banyo-aksesuarlari depuis bienseramik.com.tr
 * Usage: node scrape_aksesuar.js
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE   = 'https://www.bienseramik.com.tr';
const ROOT   = `${BASE}/banyolar/banyo-aksesuarlari`;

// Traduction des slugs de catégorie en français
const SLUG_CATEGORY_MAP = {
  'aynalar':                  'Miroirs',
  'havluluklar':              'Porte-serviettes',
  'sabunluklar':              'Porte-savons',
  'tuvalet-kagidi-standlari': 'Dérouleurs papier WC',
  'dis-fircaliklar':          'Porte-brosses à dents',
  'klozet-fircaliklari':      'Brosses WC',
  'reyolar':                  'Étagères',
  'kovalar':                  'Poubelles',
  'kancalar':                 'Crochets',
  'dispenserlar':             'Distributeurs',
  'banyo-setleri':            'Ensembles de salle de bain',
};

// Déduire la catégorie depuis le label du produit (en turc)
function getCategoryFromLabel(label) {
  if (!label) return 'Accessoires salle de bain';
  const l = label.toLowerCase();

  // Havluluklar (Porte-serviettes) — uzun, yuvarlak, çift, kapaklı havluluk
  if (l.includes('havluluk') || l.includes('havlu')) return 'Porte-serviettes';

  // Sabunluklar (Porte-savons)
  if (l.includes('sabunluk') || l.includes('sıvı sabunluk') || l.includes('sabun') && l.includes('luk')) return 'Porte-savons';

  // Kağıtlık / Tuvalet kağıdı (Dérouleurs papier WC)
  if (l.includes('kağıtlık') || l.includes('kagitlik') || l.includes('tuvalet kağıdı') || l.includes('tuvalet kagidi')) return 'Dérouleurs papier WC';

  // Diş fırçalık (Porte-brosses à dents)
  if (l.includes('diş fırçalık') || l.includes('dis fircalik') || l.includes('fırçalık') || l.includes('fircalik')) return 'Porte-brosses à dents';

  // Klozet fırçası / fırçalığı (Brosses WC)
  if (l.includes('klozet') || l.includes('tuvalet fırçası') || l.includes('tuvalet fircasi')) return 'Brosses WC';

  // Reyolar / Raflar (Étagères)
  if (l.includes('reyo') || l.includes('raf ') || l.includes('raf\t') || l.includes('köşe raf') || l.includes('raf')) return 'Étagères';

  // Kovalar (Poubelles)
  if (l.includes('kova') || l.includes('çöp') || l.includes('cop')) return 'Poubelles';

  // Kancalar (Crochets)
  if (l.includes('kanca') || l.includes('askı') || l.includes('aski') || l.includes('askilik')) return 'Crochets';

  // Dispenserlar (Distributeurs)
  if (l.includes('dispenser') || l.includes('sıvı sabun') || l.includes('sivi sabun') || l.includes('şampuan') || l.includes('sampuan')) return 'Distributeurs';

  // Aynalar (Miroirs)
  if (l.includes('ayna')) return 'Miroirs';

  // Setler (Ensembles)
  if (l.includes(' set') || l.includes('-set') || l.includes('li set') || l.includes('lı set')) return 'Ensembles de salle de bain';

  return 'Accessoires salle de bain';
}

// Traductions des clés de specs
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
  'Ürün Özellik': 'Caractéristique', 'Ürün Özellik:': 'Caractéristique',
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
  'Koli İçi Adet': null, 'Koli İçi Adet:': null,
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
  'Mat Beyaz': 'Blanc mat',
  'Plastik': 'Plastique',
  'ABS': 'ABS',
  'Çinko': 'Zinc',
  'İpeksi Mat Siyah': 'Noir mat satiné',
  'İpeksi Mat Beyaz': 'Blanc mat satiné',
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

  // ── Récupérer tous les produits depuis la page racine ────────────────────
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

  const products = await page.evaluate((base, root) => {
    const items = [];
    document.querySelectorAll('a').forEach(a => {
      const h = a.href || '';
      const t = a.textContent.trim();
      if (h.includes('banyo-aksesuarlari/') && !h.includes('#') && t.length > 0) {
        // Extraire le code produit du slug (ex: a0010101)
        const slug = h.split('/').pop();
        const codeMatch = slug.match(/-([Aa]\d{7})$/i);
        const productCode = codeMatch ? codeMatch[1].toUpperCase() : null;
        // Extraire la catégorie depuis l'image sur la card (si disponible)
        items.push({ href: h, label: t, productCode });
      }
    });
    const seen = new Set();
    return items.filter(c => { if (seen.has(c.href)) return false; seen.add(c.href); return true; });
  }, BASE, ROOT);

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

        // Image: chercher img.prd-img → phpThumb URL → extract filename → CDN URL
        let imgSrc = '';
        const prdImg = document.querySelector('img.prd-img');
        if (prdImg) {
          const phpSrc = prdImg.src;
          // Pattern: phpThumb.php?src=../uploads/FILENAME
          const match = phpSrc.match(/src=\.\.\/uploads\/([^&]+)/);
          if (match) {
            const filename = match[1];
            imgSrc = `https://bienseramik.b-cdn.net/uploads/${filename}?width=800&height=800`;
          } else if (phpSrc.includes('b-cdn.net')) {
            imgSrc = phpSrc.replace(/\?.*$/, '?width=800&height=800');
          } else {
            imgSrc = phpSrc;
          }
        }

        // Fallback: images CDN directes sur la page
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

      // Déterminer le code produit depuis les specs
      let productCode = prod.productCode;
      const rawRef = detail.specs['Ürün Kodu:'] || detail.specs['Ürün Kodu'] || '';
      if (rawRef) productCode = rawRef;

      const category = getCategoryFromLabel(prod.label);

      // Image CDN depuis la référence si non trouvée
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

      console.log(`OK ${Object.keys(cleanSpecs).length} specs [${category}]`);
      await p.close();
    } catch (err) {
      console.log(`ERREUR ${err.message.substring(0, 50)}`);
      all.push({
        label: prod.label,
        href: prod.href,
        category: getCategoryFromLabel(prod.label),
        image: '',
        specs: {},
        sheetUrl: null,
      });
    }

    // Pause toutes les 20 requêtes
    if (i % 20 === 19) await new Promise(r => setTimeout(r, 800));
  }

  await browser2.close();

  // ── Sauvegarder ────────────────────────────────────────────────────────────
  const outDir = './public/cat_preview';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(`${outDir}/aksesuar_products.json`, JSON.stringify(all, null, 2));
  console.log(`\nOK ${all.length} produits sauvegardés dans aksesuar_products.json`);

  const stats = {};
  all.forEach(p => { stats[p.category] = (stats[p.category] || 0) + 1; });
  Object.entries(stats).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
  console.log(`  Avec image: ${all.filter(p => p.image).length}/${all.length}`);
  console.log(`  Avec specs: ${all.filter(p => Object.keys(p.specs||{}).length > 0).length}/${all.length}`);
})().catch(console.error);
