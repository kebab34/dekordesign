const fs = require('fs');
const data = fs.readFileSync('src/data/collectionsData.js','utf8');

function getCollProducts60x60(collName) {
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
  const re = /\bid: (\d+),[\s\S]{0,10}?name: '([^']+)',[\s\S]{0,10}?color: '([^']*)',[\s\S]{0,10}?size: '60x60'/g;
  const prods = [];
  let m;
  while ((m = re.exec(chunk)) !== null) prods.push({id: parseInt(m[1]), name: m[2], color: m[3]});
  const allIds = [...chunk.matchAll(/\bid: (\d+)/g)].map(x => parseInt(x[1]));
  const lastId = allIds.length ? Math.max(...allIds) : -1;
  return {prods, lastId};
}

const colls = ['Arcides','Bona Dea','Concept','Destiny','Sempre','Statuario Goya'];
for (const c of colls) {
  const info = getCollProducts60x60(c);
  if (!info) { console.log(c + ': NOT FOUND'); continue; }
  console.log(c + ': lastId=' + info.lastId);
  info.prods.forEach(p => console.log('  id:' + p.id + ' ' + p.name));
}
