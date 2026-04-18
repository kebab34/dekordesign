const fs = require('fs');
const data = fs.readFileSync('src/data/collectionsData.js','utf8');

// Get thumbnail for a specific product name
function getThumb(productName) {
  const nameStr = "name: '" + productName + "'";
  const idx = data.indexOf(nameStr);
  if (idx === -1) return 'NOT FOUND';
  const chunk = data.slice(idx, idx + 300);
  const m = chunk.match(/thumbnail: '([^']*)'/);
  return m ? m[1] : 'NO THUMB';
}

const products = [
  // Arcides duplicates
  'Arcides Antrasit 60x60', 'Arcides Bone 60x60', 'Arcides Latte 60x60', 'Arcides Smoke 60x60',
  // Bona Dea
  'Bona Dea Crema 60x60', 'Bona Dea Dark Grey 60x60', 'Bona Dea Dark Grey Dekofon 60x60', 'Bona Dea Light Grey Dekofon 60x60',
  // Concept
  'Concept Bej 60x60', 'Concept Gri 60x60', 'Concept Vizon 60x60',
  // Destiny
  'Destiny Parlak Beyaz 60x60',
  // Sempre
  'Sempre Grigio 60x60',
  // Statuario Goya
  'Statuario Goya 60x60',
];

for (const p of products) {
  console.log(p + ' -> ' + getThumb(p));
}
