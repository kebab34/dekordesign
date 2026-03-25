/**
 * Génère src/data/dusData.js depuis public/cat_preview/dus_products.json
 * Usage: node generate_dus_data.js
 */

const fs = require('fs');
const path = require('path');

const INPUT  = './public/cat_preview/dus_products.json';
const OUTPUT = './src/data/dusData.js';

const raw = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// Traductions couleurs restantes
const COLOR_MAP = {
  'Beyaz Camlı': 'Verre blanc', 'Beyaz Taşlı': 'Pierre blanche',
  'Siyah Camlı': 'Verre noir', 'Siyah Taşlı': 'Pierre noire',
  'Gövde Altın': 'Corps doré', 'Gövde Mat Siyah': 'Corps noir mat',
  'Gövde Rose Gold': 'Corps rose gold',
  'Krom-Altın': 'Chrome-Or', 'Krom-Rose Gold': 'Chrome-Rose gold',
  'Siyah-Altın': 'Noir-Or', 'Siyah-Rose Gold': 'Noir-Rose gold',
  'Mat Siyah-Krom': 'Noir mat-Chrome',
  'Mat Bronz': 'Bronze mat', 'Mat Fırçalı Altın': 'Or brossé mat',
  'Mat Fırçalı Nikel': 'Nickel brossé mat', 'Mat Fırçalı Rose Gold': 'Rose gold brossé mat',
  'Gun Metal': 'Gun metal', 'Inox': 'Inox',
  'Bambu': 'Bambou', 'Black Mirror': 'Miroir noir',
  'Siyah Bakır': 'Noir cuivré', 'Krom Bakır': 'Chrome cuivré',
  'Siyah Altın': 'Noir doré', 'Krom Altın': 'Chrome doré',
};

// Traductions types restants
const TYPE_MAP = {
  'Ankastre Duş Bataryası': 'Robinet douche encastré',
  'Ankastre Banyo Bataryası': 'Robinet baignoire encastré',
  'Duş Bataryası': 'Robinet de douche',
  'Duş Kolonu': 'Colonne de douche',
  'Duş Paneli': 'Panneau de douche',
  'El Duş Seti': 'Ensemble douchette',
  'Duş Başlığı': 'Pommeau de douche',
  'Üst Takım': 'Ensemble tête de douche',
};

function cleanSpecs(specs) {
  const out = { ...specs };
  if (out['Couleur'] && COLOR_MAP[out['Couleur']]) out['Couleur'] = COLOR_MAP[out['Couleur']];
  if (out['Type']   && TYPE_MAP[out['Type']])   out['Type']   = TYPE_MAP[out['Type']];
  return out;
}

const products = raw.map((p, i) => {
  const parts = p.label.split(' - ');
  const name     = parts[0].trim();
  const fullName = p.label;
  const image    = p.image || '';

  return {
    id: i + 1,
    name,
    fullName,
    category: p.category,
    image,
    href: p.href,
    specs: cleanSpecs(p.specs || {}),
    sheetUrl: p.sheetUrl || null,
  };
});

// Catégories uniques dans l'ordre d'apparition
const seen = new Set();
const dusCategories = [];
products.forEach(p => {
  if (!seen.has(p.category)) {
    seen.add(p.category);
    dusCategories.push(p.category);
  }
});

const js = `// Généré automatiquement — ne pas éditer manuellement
export const dusData = ${JSON.stringify(products, null, 2)};

export const dusCategories = ${JSON.stringify(dusCategories, null, 2)};
`;

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, js, 'utf8');

console.log(`OK ${products.length} produits écrits dans ${OUTPUT}`);
const stats = {};
products.forEach(p => { stats[p.category] = (stats[p.category] || 0) + 1; });
Object.entries(stats).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
console.log(`Catégories: ${dusCategories.join(', ')}`);
