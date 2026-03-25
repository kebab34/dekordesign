/**
 * Scrape les fiches détail de chaque produit sanitaire Bien Seramik
 * Usage: node scrape_banyo_details.js
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const INPUT  = './public/cat_preview/banyo_products.json';
const OUTPUT = './public/cat_preview/banyo_details.json';

const products = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// Traductions turc → français
const TRANSLATIONS = {
  // Clés
  'Ürün Kodu': 'Référence',
  'Renk': 'Couleur',
  'Genişlik': 'Largeur',
  'Derinlik': 'Profondeur',
  'Yükseklik': 'Hauteur',
  'Net Ağırlık': 'Poids net',
  'Brüt Ağırlık': 'Poids brut',
  'Hacim': 'Volume',
  'Malzeme': 'Matériau',
  'Tip': 'Type',
  'Rim Durumu': 'Système de chasse',
  'Montaj Tipi': 'Type de montage',
  'Gider Bağlantısı': 'Sortie',
  'Su Giriş Yeri': 'Alimentation eau',
  'Temizlik Deliği': 'Trou de nettoyage',
  'Sifon Bağlantısı': 'Raccord siphon',
  'Gömme Montaj': 'Montage encastré',
  'Renk Grubu': 'Groupe couleur',
  'Seri': 'Série',
  'Uyumlu Ürün': 'Produit compatible',
  'Şekil': 'Forme',
  'Kapasite': 'Capacité',
  // Valeurs
  'Beyaz': 'Blanc',
  'No-Rim': 'Sans bride',
  'Yatay': 'Horizontal',
  'Dikey': 'Vertical',
  'Asma': 'Suspendu',
  'Evet': 'Oui',
  'Hayır': 'Non',
  'Seramik': 'Céramique',
  'Porselen': 'Porcelaine',
  'Yer': 'Sol',
  'Zemin': 'Sol',
  'Duvara Sıfır': 'Compact',
  'Gizli Montaj': 'Montage caché',
  'Yuvarlak': 'Rond',
  'Oval': 'Ovale',
  'Dikdörtgen': 'Rectangulaire',
};

function translate(str) {
  if (!str) return str;
  // Traduction exacte d'abord
  if (TRANSLATIONS[str.trim()]) return TRANSLATIONS[str.trim()];
  // Remplacement partiel
  let result = str;
  for (const [tr, fr] of Object.entries(TRANSLATIONS)) {
    result = result.replace(new RegExp(tr, 'g'), fr);
  }
  return result;
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    protocolTimeout: 120000,
  });

  const results = [];
  const total = products.length;

  for (let i = 0; i < total; i++) {
    const prod = products[i];
    process.stdout.write(`[${i + 1}/${total}] ${prod.name.substring(0, 40).padEnd(40)} `);

    try {
      const page = await browser.newPage();
      await page.goto(prod.href, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 800));

      const detail = await page.evaluate(() => {
        const result = {
          specs: {},
          images: [],
          description: '',
        };

        // ── Specs / tableau de caractéristiques ──────────────────────────
        // Chercher tous les tableaux ou listes de specs possibles
        const specSelectors = [
          'table tr',
          '.product-spec tr',
          '.specs tr',
          '.specifications tr',
          '.tech-specs tr',
          '[class*="spec"] tr',
          '[class*="teknik"] tr',
          '[class*="ozellik"] tr',
        ];

        for (const sel of specSelectors) {
          const rows = document.querySelectorAll(sel);
          if (rows.length > 0) {
            rows.forEach(row => {
              const cells = row.querySelectorAll('td, th');
              if (cells.length >= 2) {
                const key = cells[0].textContent.trim();
                const val = cells[1].textContent.trim();
                if (key && val && key !== val) {
                  result.specs[key] = val;
                }
              }
            });
            if (Object.keys(result.specs).length > 0) break;
          }
        }

        // Chercher des dl/dt/dd (definition lists)
        if (Object.keys(result.specs).length === 0) {
          document.querySelectorAll('dl').forEach(dl => {
            const dts = dl.querySelectorAll('dt');
            const dds = dl.querySelectorAll('dd');
            dts.forEach((dt, idx) => {
              if (dds[idx]) {
                result.specs[dt.textContent.trim()] = dds[idx].textContent.trim();
              }
            });
          });
        }

        // Chercher des paires label/value génériques
        if (Object.keys(result.specs).length === 0) {
          const pairs = document.querySelectorAll(
            '[class*="label"] + [class*="value"], ' +
            '[class*="key"] + [class*="val"], ' +
            '[class*="property"] + [class*="content"]'
          );
          pairs.forEach(val => {
            const label = val.previousElementSibling;
            if (label) {
              result.specs[label.textContent.trim()] = val.textContent.trim();
            }
          });
        }

        // ── Images produit supplémentaires ───────────────────────────────
        const imgSelectors = [
          '.product-images img',
          '.product-gallery img',
          '.gallery img',
          '[class*="slider"] img',
          '[class*="carousel"] img',
          '.swiper-slide img',
          '.product-detail img',
        ];

        const imgSet = new Set();
        for (const sel of imgSelectors) {
          document.querySelectorAll(sel).forEach(img => {
            const src = img.src || img.dataset.src || '';
            if (src && !src.includes('logo') && !src.includes('icon') && src.includes('http')) {
              imgSet.add(src);
            }
          });
        }
        result.images = [...imgSet].slice(0, 6);

        // ── Description ──────────────────────────────────────────────────
        const descSelectors = [
          '.product-description p',
          '[class*="description"] p',
          '[class*="aciklama"] p',
          '.detail-content p',
        ];
        for (const sel of descSelectors) {
          const el = document.querySelector(sel);
          if (el) {
            result.description = el.textContent.trim().substring(0, 400);
            break;
          }
        }

        return result;
      });

      // Traduire les specs
      const translatedSpecs = {};
      for (const [k, v] of Object.entries(detail.specs)) {
        const fk = translate(k);
        const fv = translate(v);
        translatedSpecs[fk] = fv;
      }

      results.push({
        ...prod,
        specs: translatedSpecs,
        images: detail.images,
        description: detail.description,
      });

      const specCount = Object.keys(translatedSpecs).length;
      console.log(`✓ ${specCount} specs, ${detail.images.length} images`);

      await page.close();

    } catch (err) {
      console.log(`✗ ${err.message.substring(0, 50)}`);
      results.push({ ...prod, specs: {}, images: [], description: '' });
    }

    // Petite pause pour ne pas surcharger
    if (i % 10 === 9) await new Promise(r => setTimeout(r, 1000));
  }

  await browser.close();

  fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2));
  console.log(`\n✓ Sauvegardé : ${OUTPUT}`);
  console.log(`  ${results.length} produits`);

  // Stats
  const withSpecs = results.filter(p => Object.keys(p.specs).length > 0).length;
  const withImages = results.filter(p => p.images.length > 0).length;
  console.log(`  Avec specs : ${withSpecs}/${results.length}`);
  console.log(`  Avec images supplémentaires : ${withImages}/${results.length}`);
})().catch(console.error);
