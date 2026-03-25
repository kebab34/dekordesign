/**
 * Génère src/data/aksesuarData.js depuis public/cat_preview/aksesuar_products.json
 * Usage: node generate_aksesuar_data.js
 */

const fs = require('fs');
const path = require('path');

const INPUT  = './public/cat_preview/aksesuar_products.json';
const OUTPUT = './src/data/aksesuarData.js';

const raw = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// Traductions couleurs supplémentaires
const COLOR_MAP = {
  'İpeksi Mat Siyah':   'Noir mat satiné',
  'İpeksi Mat Beyaz':   'Blanc mat satiné',
  'PVD Altın':          'Or PVD',
  'PVD Rose Gold':      'Or rose PVD',
  'Parlak Paslanmaz Çelik': 'Acier inoxydable brillant',
  'Mat Paslanmaz Çelik':    'Acier inoxydable mat',
  'Çinko':              'Zinc',
  'Beyaz Camlı':        'Verre blanc',
  'Siyah Camlı':        'Verre noir',
  'Gun Metal':          'Gun metal',
  'Inox':               'Inox',
};

// Traductions de types supplémentaires
const TYPE_MAP = {
  'Tamamlayıcı Mamül': 'Accessoire',
};

function cleanSpecs(specs) {
  const out = { ...specs };
  if (out['Couleur'] && COLOR_MAP[out['Couleur']]) out['Couleur'] = COLOR_MAP[out['Couleur']];
  if (out['Type']    && TYPE_MAP[out['Type']])    out['Type']    = TYPE_MAP[out['Type']];
  return out;
}

const products = raw.map((p, i) => {
  // Nom court = première partie avant " - " ou le label complet
  const parts = p.label.split(' - ');
  const name = parts[0].trim();
  const fullName = p.label;

  return {
    id: i + 1,
    name,
    fullName,
    category: p.category,
    image: p.image || '',
    href: p.href,
    specs: cleanSpecs(p.specs || {}),
    sheetUrl: p.sheetUrl || null,
  };
});

// Catégories uniques dans l'ordre d'apparition
const seen = new Set();
const aksesuarCategories = [];
products.forEach(p => {
  if (!seen.has(p.category)) {
    seen.add(p.category);
    aksesuarCategories.push(p.category);
  }
});

const js = `// Généré automatiquement — ne pas éditer manuellement
export const aksesuarData = ${JSON.stringify(products, null, 2)};

export const aksesuarCategories = ${JSON.stringify(aksesuarCategories, null, 2)};
`;

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, js, 'utf8');

console.log(`OK ${products.length} produits écrits dans ${OUTPUT}`);
const stats = {};
products.forEach(p => { stats[p.category] = (stats[p.category] || 0) + 1; });
Object.entries(stats).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
console.log(`Catégories: ${aksesuarCategories.join(', ')}`);
