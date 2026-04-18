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
        size: '60x60',
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
      ok++;
      return true;
    }
    searchPos = idx + 1;
  }
}

// ── Adria: Adria Beyaz 60x60 ──
addProducts('Adria',
  prod(8, 'Adria Beyaz 60x60', 'Beyaz', null, '/tiles/adria/adria-white-60x60.png')
);

// ── Alin: Alin 60x60 ──
addProducts('Alin',
  prod(3, 'Alin 60x60', '', null, '/tiles/alin/alin-60x60.png')
);

// ── Arcides: 4 duplicates ──
addProducts('Arcides',
  prod(23, 'Arcides Antrasit 60x60', 'Anthracite', null, '/tiles/arcides/arcides-anthracite-60x60.png') + ',\n' +
  prod(24, 'Arcides Bone 60x60', 'Beige', null, '/tiles/arcides/arcides-latte-60x60.png') + ',\n' +
  prod(25, 'Arcides Latte 60x60', 'Latte', null, '/tiles/arcides/arcides-latte-60x60.png') + ',\n' +
  prod(26, 'Arcides Smoke 60x60', 'Fumé', null, '/tiles/arcides/arcides-smoke-60x60.png')
);

// ── Belgium Stone: Light Grey ──
addProducts('Belgium Stone',
  prod(11, 'Belgium Stone Light Grey 60x60', 'Light Grey', 'Mat', '/tiles/belgium-stone/beligum-stone-gris-60x60.png')
);

// ── Bona Dea: 4 duplicates ──
addProducts('Bona Dea',
  prod(35, 'Bona Dea Crema 60x60', 'Crema', 'Lappato', '/tiles/bona-dea/bona-dea-crema-60x60.png') + ',\n' +
  prod(36, 'Bona Dea Dark Grey 60x60', 'D. Gris', 'Lappato', '/tiles/bona-dea/bona-dea-dark-grey-60x60.png') + ',\n' +
  prod(37, 'Bona Dea Dark Grey Dekofon 60x60', 'D. Gris Dekofon', 'Lappato', '/tiles/bona-dea/bona-dea-dark-grey-dekofon-60x60.png') + ',\n' +
  prod(38, 'Bona Dea Light Grey Dekofon 60x60', 'L. Gris Dekofon', 'Lappato', '/tiles/bona-dea/bona-dea-light-grey-dekofon-60x60.png')
);

// ── Concept: 2 duplicates ──
addProducts('Concept',
  prod(33, 'Concept Bej 60x60', 'Beige', 'Full Lappato', '/tiles/concept/concept-beige-60x60.png') + ',\n' +
  prod(34, 'Concept Gri 60x60', 'Gris', 'Full Lappato', '/tiles/concept/concept-gris-60x60.png')
);

// ── Destiny: Parlak Beyaz duplicate ──
addProducts('Destiny',
  prod(3, 'Destiny Parlak Beyaz 60x60', 'Brillant Blanc', 'Brillant', '/tiles/destiny/destiny-parlak-beyaz-60x60.png')
);

// ── Hampton: Açık Gri ──
addProducts('Hampton',
  prod(14, 'Hampton Açık Gri 60x60', 'Açık Gri', 'Mat', '/tiles/hampton/hampton-latte-60X60.png')
);

// ── Helen: Taupe ──
addProducts('Helen',
  prod(10, 'Helen Taupe 60x60', 'Taupe', 'Mat', '/tiles/helen/helen-taupe-30X60.jpg')
);

// ── Manhattan: Dunkel Gri ──
addProducts('Manhattan',
  prod(6, 'Manhattan Dunkel Gri 60x60', 'Dunkel Gri', 'Mat', '/tiles/manhattan/manhattan-dunkel-gris-60X60.png')
);

// ── Mystone: Anthracite + Coffee ──
addProducts('Mystone',
  prod(2, 'Mystone Anthracite 60x60', 'Anthracite', 'Full Lappato', '/tiles/mystone/MYSTONE-ANTHRACITE-60X60X2-MAT-P1.jpg') + ',\n' +
  prod(3, 'Mystone Coffee 60x60', 'Coffee', 'Full Lappato', '/tiles/mystone/MYSTONE-COFFEE-60X60X2-MAT-P1.jpg')
);

// ── Pebble: Light Grey + Sand ──
addProducts('Pebble',
  prod(2, 'Pebble Light Grey 60x60', 'Light Grey', 'Mat', '/tiles/pebble/PEBBLE-LIGHT-GREY-60X60X2-MAT-P1.jpg') + ',\n' +
  prod(3, 'Pebble Sand 60x60', 'Sand', 'Mat', '/tiles/pebble/PEBBLE-SAND-60X60X2-MAT-P1.jpg')
);

// ── Rhea: Anthracite + Grey + Ivory ──
addProducts('Rhea',
  prod(3, 'Rhea Anthracite 60x60', 'Anthracite', null, '/tiles/rhea/rhea-anthracite.jpg') + ',\n' +
  prod(4, 'Rhea Grey 60x60', 'Grey', null, '/tiles/rhea/rhea-grey.jpg') + ',\n' +
  prod(5, 'Rhea Ivory 60x60', 'Ivory', null, '/tiles/rhea/rhea-grey.jpg')
);

// ── Sarda: 60x60 ──
addProducts('Sarda',
  prod(1, 'Sarda 60x60', 'Havuz Mavi', 'Mat', '/tiles/sarda/sarda.jpg')
);

// ── Sempre: Grigio duplicate ──
addProducts('Sempre',
  prod(13, 'Sempre Grigio 60x60', 'Grisgio', 'Mat', '/tiles/sempre/sempre-grigio-60X60.png')
);

// ── Statuario Goya: duplicate ──
addProducts('Statuario Goya',
  prod(8, 'Statuario Goya 60x60', '', 'Brillant', '/tiles/statuario-goya/statuario-goya-61x61.png')
);

// ── Tavas: 5 new products ──
addProducts('Tavas',
  prod(5, 'Tavas Cream 60x60', 'Cream', 'Mat', '/tiles/tavas/TAVAS-CREAM-60X60X2-MAT-P1.jpg') + ',\n' +
  prod(6, 'Tavas Gold 60x60', 'Gold', 'Mat', '/tiles/tavas/TAVAS-GOLD-60X60X2-MAT-P1.jpg') + ',\n' +
  prod(7, 'Tavas Grey 60x60', 'Grey', 'Mat', '/tiles/tavas/TAVAS-GREY-60X60X2-MAT-P1.jpg') + ',\n' +
  prod(8, 'Tavas Light Grey 60x60', 'Light Grey', 'Mat', '/tiles/tavas/TAVAS-LIGHT-GREY-60X60X2-MAT-P1.jpg') + ',\n' +
  prod(9, 'Tavas Noce 60x60', 'Noce', 'Mat', '/tiles/tavas/TAVAS-NOCE-60X60X2-MAT-P1.jpg')
);

fs.writeFileSync(filePath, data, 'utf8');
console.log('\nDone: ' + ok + ' OK, ' + fail + ' FAIL');
