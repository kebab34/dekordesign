const fs = require('fs');
const data = fs.readFileSync('src/data/collectionsData.js','utf8');

function getProduct(name) {
  const nameStr = "name: '" + name + "'";
  const idx = data.indexOf(nameStr);
  if (idx === -1) return null;
  const chunk = data.slice(idx, idx + 400);
  const colorM = chunk.match(/color: '([^']*)'/);
  const sizeM = chunk.match(/size: '([^']*)'/);
  const surfM = chunk.match(/surface: ([^,\n]*)/);
  const thumbM = chunk.match(/thumbnail: '([^']*)'/);
  return {
    color: colorM ? colorM[1] : '',
    size: sizeM ? sizeM[1] : '',
    surface: surfM ? surfM[1].trim() : 'null',
    thumb: thumbM ? thumbM[1] : ''
  };
}

const products = [
  'Arcides Antrasit 60x60', 'Arcides Bone 60x60', 'Arcides Latte 60x60', 'Arcides Smoke 60x60',
  'Bona Dea Crema 60x60', 'Bona Dea Dark Grey 60x60', 'Bona Dea Dark Grey Dekofon 60x60', 'Bona Dea Light Grey Dekofon 60x60',
  'Concept Bej 60x60', 'Concept Gri 60x60',
  'Destiny Parlak Beyaz 60x60',
  'Sempre Grigio 60x60',
  'Statuario Goya 60x60',
];

for (const p of products) {
  const info = getProduct(p);
  if (!info) { console.log(p + ': NOT FOUND'); continue; }
  console.log(p + ':');
  console.log('  color="' + info.color + '" surface=' + info.surface + ' thumb=' + info.thumb);
}
