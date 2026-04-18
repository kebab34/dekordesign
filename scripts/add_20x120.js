const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/data/collectionsData.js');
let data = fs.readFileSync(filePath, 'utf8');

let ok = 0, fail = 0;

function prod(id, name, color, surface, thumb) {
  const surfStr = surface ? "'" + surface + "'" : 'null';
  return `      {
        id: ${id},
        name: '${name}',
        color: '${color}',
        size: '20x120',
        surface: ${surfStr},
        thumbnail: '${thumb}',
        faces: [
          '',
        ],
        specifications: {}
      }`;
}

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

// ── Boho Light Grey ──
addProducts('Boho',
  prod(3, 'Boho Light Grey 20x120', 'Gris Clair', 'Mat', '/tiles/boho/boho-light-grey-120x120.png')
);

// ── Bona Dea Crema + Light Grey ──
addProducts('Bona Dea',
  prod(39, 'Bona Dea Crema 20x120',      'Crema',  'Lappato', '/tiles/bona-dea/bona-dea-crema-30x60.png') + ',\n' +
  prod(40, 'Bona Dea Light Grey 20x120', 'L. Gris','Lappato', '/tiles/bona-dea/bona-dea-light-grey-60x120.png')
);

// ── Las Palmas Bej ──
addProducts('Las Palmas',
  prod(26, 'Las Palmas Bej 20x120', 'Bej', 'Full Lappato', '/tiles/las-palmas/las-palmas-bej-60X120.png')
);

// ── Void Bone ──
addProducts('Void',
  prod(24, 'Void Bone 20x120', 'Bone', 'Lappato', '/tiles/void/void-bone-60X120.png')
);

fs.writeFileSync(filePath, data, 'utf8');
console.log('\nDone: ' + ok + ' OK, ' + fail + ' FAIL');
