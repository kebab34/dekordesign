const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/data/collectionsData.js');
let data = fs.readFileSync(filePath, 'utf8');

let ok = 0, fail = 0;

function addProducts(collName, block) {
  const collIdx = data.indexOf("'" + collName + "':");
  if (collIdx === -1) { console.log('FAIL coll: ' + collName); fail++; return false; }
  let searchPos = collIdx;
  while (true) {
    const idx = data.indexOf('\n    ],', searchPos);
    if (idx === -1 || idx > collIdx + 60000) { console.log('FAIL insert: ' + collName); fail++; return false; }
    const after = data.slice(idx + 7, idx + 80).replace(/[\r\n\s]*/g, '');
    if (after.startsWith('documents:') || after.startsWith('commonSpecs:') || after.startsWith('specs:')) {
      data = data.slice(0, idx) + ',\n' + block + data.slice(idx);
      ok++; return true;
    }
    searchPos = idx + 1;
  }
}

function fixEmptySize(oldName, newName, newThumb) {
  const nameStr = "name: '" + oldName + "'";
  const idx = data.indexOf(nameStr);
  if (idx === -1) { console.log('FAIL fix: ' + oldName); fail++; return; }
  // rename
  data = data.slice(0, idx) + "name: '" + newName + "'" + data.slice(idx + nameStr.length);
  const newIdx = data.indexOf("name: '" + newName + "'");
  // fix size: '' → size: '30x60'
  const chunk = data.slice(newIdx, newIdx + 200);
  const sizePos = chunk.indexOf("size: ''");
  if (sizePos !== -1) data = data.slice(0, newIdx + sizePos) + "size: '30x60'" + data.slice(newIdx + sizePos + "size: ''".length);
  // fix thumbnail
  const chunk2 = data.slice(newIdx, newIdx + 300);
  const oldThumbStr = "thumbnail: '" + chunk2.match(/thumbnail: '([^']*)'/)[1] + "'";
  const newThumbStr = "thumbnail: '" + newThumb + "'";
  const tPos = data.indexOf(oldThumbStr, newIdx);
  if (tPos !== -1 && tPos < newIdx + 300) data = data.slice(0, tPos) + newThumbStr + data.slice(tPos + oldThumbStr.length);
  ok++; console.log('OK fix: ' + newName);
}

function prod(id, name, color, surface, thumb) {
  const surfStr = surface ? "'" + surface + "'" : 'null';
  return `      {
        id: ${id},
        name: '${name}',
        color: '${color}',
        size: '30x60',
        surface: ${surfStr},
        thumbnail: '${thumb}',
        faces: [
          '',
        ],
        specifications: {}
      }`;
}

// ── Arch Mix Dekor ──
addProducts('Arch',
  prod(7, 'Arch Mix Dekor 30x60', 'Mix', 'Mat', '/tiles/arch/arch-mix-dekor.png')
);

// ── Arcides: Antrasit + Bone + Grey ──
addProducts('Arcides',
  prod(27, 'Arcides Antrasit 30x60', 'Anthracite', null, '/tiles/arcides/arcides-anthracite.png') + ',\n' +
  prod(28, 'Arcides Bone 30x60',     'Beige',      null, '/tiles/arcides/arcides-bone.png')       + ',\n' +
  prod(29, 'Arcides Grey 30x60',     'Grey',       null, '/tiles/arcides/arcides-gris.png')
);

// ── Lisbon + Merlo: fix empty size ──
fixEmptySize('Lisbon', 'Lisbon 30x60', '/tiles/lisbon/lisbon.jpg');
fixEmptySize('Merlo',  'Merlo 30x60',  '/tiles/merlo/merlo.jpg');

fs.writeFileSync(filePath, data, 'utf8');
console.log('\nDone: ' + ok + ' OK, ' + fail + ' FAIL');
