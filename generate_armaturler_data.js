/**
 * Génère src/data/armaturlerData.js depuis public/cat_preview/armaturler_products.json
 * Usage: node generate_armaturler_data.js
 */

const fs = require('fs');
const path = require('path');

const INPUT = './public/cat_preview/armaturler_products.json';
const OUTPUT = './src/data/armaturlerData.js';

const raw = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// Traductions couleurs restantes en turc
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
};

// Traductions types restants en turc
const TYPE_MAP = {
  'Ankastre Lavabo Bataryası': 'Robinet lavabo encastré',
  'Fotoselli Ankastre Lavabo Bataryası': 'Robinet lavabo encastré à capteur',
  'Fotoselli Lavabo Bataryası': 'Robinet lavabo à capteur',
  'Fotoselli Lavabo Musluğu': 'Robinet lavabo à capteur',
  'Fotoselli Pisuvar Musluğu': 'Robinet urinoir à capteur',
  'Küvet Doldurucu ve Abdest Bataryası': 'Robinet baignoire remplissage',
  'Tamamlayıcı Mamül': 'Accessoire',
};

function cleanSpecs(specs) {
  const out = { ...specs };
  if (out['Couleur'] && COLOR_MAP[out['Couleur']]) out['Couleur'] = COLOR_MAP[out['Couleur']];
  if (out['Type'] && TYPE_MAP[out['Type']]) out['Type'] = TYPE_MAP[out['Type']];
  return out;
}

const products = raw.map((p, i) => {
  // Nom court = première partie avant " - " ou le label complet
  const parts = p.label.split(' - ');
  const name = parts[0].trim();
  const fullName = p.label;

  // Image: utiliser telle quelle (déjà formatée en 800x800 CDN)
  const image = p.image || '';

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
const armaturlerCategories = [];
products.forEach(p => {
  if (!seen.has(p.category)) {
    seen.add(p.category);
    armaturlerCategories.push(p.category);
  }
});

const js = `// Généré automatiquement — ne pas éditer manuellement
export const armaturlerData = ${JSON.stringify(products, null, 2)};

export const armaturlerCategories = ${JSON.stringify(armaturlerCategories, null, 2)};
`;

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, js, 'utf8');

console.log(`✓ ${products.length} produits écrits dans ${OUTPUT}`);
const stats = {};
products.forEach(p => { stats[p.category] = (stats[p.category] || 0) + 1; });
Object.entries(stats).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
console.log(`Catégories: ${armaturlerCategories.join(', ')}`);
