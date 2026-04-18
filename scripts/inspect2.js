const fs = require('fs');
const data = fs.readFileSync('src/data/collectionsData.js','utf8');

function getCollInfo(collName) {
  const collIdx = data.indexOf("'" + collName + "':");
  if (collIdx === -1) return null;
  let searchPos = collIdx;
  let productsEnd = -1;
  while (true) {
    const idx = data.indexOf('\n    ],', searchPos);
    if (idx === -1 || idx > collIdx + 60000) break;
    const after = data.slice(idx + 7, idx + 80).replace(/[\r\n\s]*/g, '');
    if (after.startsWith('documents:') || after.startsWith('commonSpecs:') || after.startsWith('specs:')) {
      productsEnd = idx;
      break;
    }
    searchPos = idx + 1;
  }
  if (productsEnd === -1) return null;
  const chunk = data.slice(collIdx, productsEnd);
  const allIds = [...chunk.matchAll(/\bid: (\d+)/g)].map(x => parseInt(x[1]));
  const lastId = allIds.length ? Math.max(...allIds) : -1;
  // Get 60x60 products
  const re = /\bid: (\d+),[\s\S]{0,10}?name: '([^']+)',[\s\S]{0,10}?color: '([^']*)',[\s\S]{0,10}?size: '60x60'[\s\S]{0,80}?thumbnail: '([^']*)'/g;
  const prods = [];
  let m;
  while ((m = re.exec(chunk)) !== null) prods.push({id: parseInt(m[1]), name: m[2], thumb: m[4]});
  return {lastId, prods};
}

const colls = ['Adria','Alin','Astoria','Avanos','Belgium Stone','Hampton','Helen','Manhattan','Mystone','Pebble','Rhea','Sarda','Tavas'];
for (const c of colls) {
  const info = getCollInfo(c);
  if (!info) { console.log(c + ': NOT FOUND'); continue; }
  console.log(c + ': lastId=' + info.lastId + ', 60x60:');
  info.prods.forEach(p => console.log('  id:' + p.id + ' ' + p.name + ' -> ' + p.thumb));
}
