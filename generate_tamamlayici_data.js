const fs = require('fs');
const raw = JSON.parse(fs.readFileSync('./public/cat_preview/tamamlayici_products.json', 'utf8'));

const CATEGORIES = [
  'Réservoirs encastrés',
  'Panneaux de commande',
  'Abattants WC',
  'Abattants Magiclight',
  'Réservoirs',
  'Bonde céramique',
];

function shortName(fullname) {
  return fullname.split(' - ')[0].trim();
}

const entries = raw.map((p, i) => {
  const imgHD = p.img ? p.img.replace('?width=400&height=400', '?width=800&height=800') : '';
  return {
    id: i + 1,
    name: shortName(p.name),
    fullName: p.name,
    category: p.categoryLabel,
    image: imgHD,
    href: p.href,
    specs: p.specs || {},
    sheetUrl: p.sheetUrl || null,
  };
});

const lines = [
  '// Généré automatiquement — ne pas éditer manuellement',
  `export const tamamlayiciData = ${JSON.stringify(entries, null, 2)};`,
  '',
  `export const tamamlayiciCategories = ${JSON.stringify(CATEGORIES)};`,
  '',
];

fs.writeFileSync('./src/data/tamamlayiciData.js', lines.join('\n'));
console.log(`✓ ${entries.length} produits → src/data/tamamlayiciData.js`);
