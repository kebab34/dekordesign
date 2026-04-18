const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/collectionsData.js');
let data = fs.readFileSync(filePath, 'utf8');

let fixCount = 0;
let failCount = 0;

// Insert a block of text before the end of a collection's products array.
// Finds the collection, then finds the first `],` followed by `documents:` and inserts before it.
function insertBeforeProductsEnd(collName, blockToInsert, label) {
  const collStart = data.indexOf(`'${collName}':`);
  if (collStart === -1) {
    console.log(`FAIL [${label}]: collection not found`);
    failCount++;
    return;
  }
  // Find `],` followed by `documents:` (marks end of products array)
  // indexOf('\n    ],\n    documents:') works even with CRLF (\r\n) because \r\n contains \n
  let searchPos = collStart;
  let insertPos = -1;
  while (searchPos < collStart + 20000) {
    const idx = data.indexOf('\n    ],', searchPos);
    if (idx === -1) break;
    const afterClose = data.slice(idx + 7, idx + 60).replace(/[\r\n\s]*/g, '');
    if (afterClose.startsWith('documents:') || afterClose.startsWith('commonSpecs:') || afterClose.startsWith('specs:')) {
      insertPos = idx; // insert before `\n    ],`
      break;
    }
    searchPos = idx + 1;
  }
  if (insertPos === -1) {
    console.log(`FAIL [${label}]: products array end not found`);
    failCount++;
    return;
  }
  // The last product currently ends with `}` without a trailing comma — add comma + new entries
  // First, check if there's a trailing comma already on the last product
  const charBefore = data.slice(insertPos - 1, insertPos);
  const needsComma = charBefore !== ',';
  const prefix = needsComma ? ',' : '';
  data = data.slice(0, insertPos) + prefix + blockToInsert + data.slice(insertPos);
  console.log(`OK   [${label}]`);
  fixCount++;
}

// ─── ANTIQUE CARRARA: add Parlak 61x61 ─────────────────────────────────────

insertBeforeProductsEnd('Antique Carrara', `
      {
        id: 9,
        name: 'Antique Carrara Parlak 61x61',
        color: 'Parlak',
        size: '61x61',
        surface: 'Brillant',
        thumbnail: '/tiles/antique-carrara/antique-carrara-parlak-61x61.png',
        faces: [''],
        specifications: {}
      }`, 'Antique Carrara Parlak 61x61');

// ─── ARCIDES: add 5 × 61x61 ────────────────────────────────────────────────
// No 61x61 files in folder → use 60x60 (same square ratio); bone has no 60x60 so use .png

insertBeforeProductsEnd('Arcides', `
      {
        id: 13,
        name: 'Arcides Antrasit 61x61',
        color: 'Anthracite',
        size: '61x61',
        surface: null,
        thumbnail: '/tiles/arcides/arcides-anthracite-60x60.png',
        faces: [''],
        specifications: {}
      },
      {
        id: 14,
        name: 'Arcides Bone 61x61',
        color: 'Bone',
        size: '61x61',
        surface: null,
        thumbnail: '/tiles/arcides/arcides-bone.png',
        faces: [''],
        specifications: {}
      },
      {
        id: 15,
        name: 'Arcides Gris 61x61',
        color: 'Gris',
        size: '61x61',
        surface: null,
        thumbnail: '/tiles/arcides/arcides-gris-60x60.png',
        faces: [''],
        specifications: {}
      },
      {
        id: 16,
        name: 'Arcides Latte 61x61',
        color: 'Latte',
        size: '61x61',
        surface: null,
        thumbnail: '/tiles/arcides/arcides-latte-60x60.png',
        faces: [''],
        specifications: {}
      },
      {
        id: 17,
        name: 'Arcides Smoke 61x61',
        color: 'Smoke',
        size: '61x61',
        surface: null,
        thumbnail: '/tiles/arcides/arcides-smoke-60x60.png',
        faces: [''],
        specifications: {}
      }`, 'Arcides ×5 61x61');

// ─── HAMPTON: add Açık Gri 61x61 ───────────────────────────────────────────
// No 61x61 or açık gri file → grigio 60x120 is the closest (same grey color)

insertBeforeProductsEnd('Hampton', `
      {
        id: 13,
        name: 'Hampton Açık Gri 61x61',
        color: 'Açık Gri',
        size: '61x61',
        surface: 'Mat',
        thumbnail: '/tiles/hampton/hampton-grigio-60X120.png',
        faces: [''],
        specifications: {}
      }`, 'Hampton Açık Gri 61x61');

// ─── WRITE ───────────────────────────────────────────────────────────────────

fs.writeFileSync(filePath, data, 'utf8');
console.log(`\nDone: ${fixCount} OK, ${failCount} FAIL`);
