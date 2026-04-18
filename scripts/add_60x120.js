const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/data/collectionsData.js');
let data = fs.readFileSync(filePath, 'utf8');

let addedCount = 0;

// Get last product id in a collection
function getLastId(collName) {
  const start = data.indexOf(`'${collName}':`);
  if (start === -1) return -1;
  const rest = data.slice(start);
  const nextColl = rest.search(/\r?\n  '[A-Z]/);
  const chunk = rest.slice(0, nextColl > 0 ? nextColl : 5000);
  const ids = [...chunk.matchAll(/id: (\d+)/g)].map(m => +m[1]);
  return ids.length ? Math.max(...ids) : -1;
}

// Insert products block before the closing `],` + `documents:` of a collection
function addProducts(collName, newProductsBlock) {
  const collStart = data.indexOf(`'${collName}':`);
  if (collStart === -1) { console.log(`FAIL: collection "${collName}" not found`); return false; }
  let searchPos = collStart;
  while (searchPos < collStart + 50000) {
    const idx = data.indexOf('\n    ],', searchPos);
    if (idx === -1) break;
    const after = data.slice(idx + 7, idx + 60).replace(/[\r\n\s]*/g, '');
    if (after.startsWith('documents:') || after.startsWith('commonSpecs:') || after.startsWith('specs:')) {
      // Check if last char before \n    ], is } (no trailing comma needed)
      const charBefore = data.slice(idx - 1, idx);
      const comma = (charBefore !== ',') ? ',' : '';
      data = data.slice(0, idx) + comma + newProductsBlock + data.slice(idx);
      return true;
    }
    searchPos = idx + 1;
  }
  console.log(`FAIL: products end not found in "${collName}"`); return false;
}

function mkProd(id, name, color, surface, thumb) {
  return `
      {
        id: ${id},
        name: '${name}',
        color: '${color}',
        size: '60x120',
        surface: ${surface === null ? 'null' : `'${surface}'`},
        thumbnail: '${thumb}',
        faces: [''],
        specifications: {}
      }`;
}

function add(collName, entries) {
  const lastId = getLastId(collName);
  if (lastId === -1) { console.log(`SKIP (not found): ${collName}`); return; }
  let block = '';
  entries.forEach(([name, color, surface, thumb], i) => {
    block += (i > 0 ? ',' : '') + mkProd(lastId + 1 + i, name + ' 60x120', color, surface, thumb);
  });
  if (addProducts(collName, block)) {
    addedCount += entries.length;
    console.log(`OK [${collName}] +${entries.length}: ${entries.map(e=>e[0]).join(', ')}`);
  }
}

const T = (slug, file) => `/tiles/${slug}/${file}`;

// ── Arcides (+1 each) ──────────────────────────────────────────────────────
add('Arcides', [
  ['Arcides Antrasit', 'Anthracite', null, T('arcides','arcides-anthracite.png')],
  ['Arcides Bone',     'Bone',       null, T('arcides','arcides-bone.png')],
  ['Arcides Grey',     'Gris',       null, T('arcides','arcides-gris.png')],
  ['Arcides Latte',    'Latte',      null, T('arcides','arcides-latte.png')],
  ['Arcides Smoke',    'Smoke',      null, T('arcides','arcides-smoke.png')],
]);

// ── Assos (+1 plain, +1 each color) ───────────────────────────────────────
add('Assos', [
  ['Assos',        '',          null, T('assos','assos-60x120.png')],
  ['Assos Beige',  'Beige',     null, T('assos','assos-beige-60x120.jpg')],
  ['Assos Grey',   'Grey',      null, T('assos','assos-gris-60x120.jpg')],
  ['Assos Noche',  'Noche',     null, T('assos','assos-noche-60x120.jpg')],
  ['Assos Silver', 'Silver',    null, T('assos','assos-silver-60x120.jpg')],
]);

// ── Bona Dea (+1 each) ────────────────────────────────────────────────────
add('Bona Dea', [
  ['Bona Dea Beige',      'Beige',      'Lappato', T('bona-dea','bona-dea-beige-60x120.png')],
  ['Bona Dea Bianco',     'Bianco',     'Lappato', T('bona-dea','bona-dea-bianco-60x120.png')],
  ['Bona Dea Crema',      'Crema',      'Lappato', T('bona-dea','bona-dea-crema-30x60.png')],
  ['Bona Dea Dark Grey',  'Dark Grey',  'Lappato', T('bona-dea','bona-dea-dark-grey-60x120.png')],
  ['Bona Dea Light Grey', 'Light Grey', 'Lappato', T('bona-dea','bona-dea-light-grey-60x120.png')],
]);

// ── Concept ───────────────────────────────────────────────────────────────
add('Concept', [
  ['Concept Açık Gri', 'Açık Gri',  null, T('concept','concept-acik-gris-60x120.png')],
  ['Concept Antrasit', 'Antrasit',  null, T('concept','concept-antrasit-60x120.png')],
  ['Concept Bej',      'Bej',       null, T('concept','concept-beige-60x120.png')],
  ['Concept Bej',      'Bej',       null, T('concept','concept-beige-60x120.png')],
  ['Concept Beyaz',    'Beyaz',     null, T('concept','concept-beyaz-60x120.png')],
  ['Concept Gri',      'Gri',       null, T('concept','concept-gris-60x120.png')],
  ['Concept Gri',      'Gri',       null, T('concept','concept-gris-60x120.png')],
  ['Concept Vizon',    'Vizon',     null, T('concept','concept-vizon-60x120.png')],
  ['Concept Vizon',    'Vizon',     null, T('concept','concept-vizon-60x120.png')],
  ['Concept Vizon',    'Vizon',     null, T('concept','concept-vizon-60x120.png')],
]);

// ── Las Palmas ─────────────────────────────────────────────────────────────
add('Las Palmas', [
  ['Las Palmas Anthracite', 'Anthracite', null, T('las-palmas','LAS-PALMAS-ANTRASIT-SEMILAPPATO-60X120---FACE-1.jpg')],
  ['Las Palmas Bej',        'Bej',        null, T('las-palmas','las-palmas-bej-60X120.png')],
  ['Las Palmas Bej',        'Bej',        null, T('las-palmas','las-palmas-bej-60X120.png')],
  ['Las Palmas Carbon',     'Carbon',     null, T('las-palmas','las-palmas-carbon-60X120.png')],
  ['Las Palmas Carbon',     'Carbon',     null, T('las-palmas','las-palmas-carbon-60X120.png')],
  ['Las Palmas Grey',       'Grey',       null, T('las-palmas','las-palmas-gris-60X120.png')],
  ['Las Palmas Mocha',      'Mocha',      null, T('las-palmas','las-palmas-mocha-60X120.png')],
  ['Las Palmas Mocha',      'Mocha',      null, T('las-palmas','las-palmas-mocha-60X120.png')],
  ['Las Palmas White',      'White',      null, T('las-palmas','las-palmas-blanc-60X120.png')],
  ['Las Palmas White',      'White',      null, T('las-palmas','las-palmas-blanc-60X120.png')],
]);

// ── Mia (+1) ───────────────────────────────────────────────────────────────
add('Mia', [
  ['Mia', '', null, T('mia','mia-60X120.png')],
]);

// ── Nomerles (+2 each for Antrasit/Grey/White, +1 Vizon) ──────────────────
add('Nomerles', [
  ['Nomerles Antrasit', 'Antrasit', null, T('nomerles','nomerles-antrasite.png')],
  ['Nomerles Antrasit', 'Antrasit', null, T('nomerles','nomerles-antrasite.png')],
  ['Nomerles Grey',     'Grey',     null, T('nomerles','nomerles-gris.png')],
  ['Nomerles Grey',     'Grey',     null, T('nomerles','nomerles-gris.png')],
  ['Nomerles Vizon',    'Vizon',    null, T('nomerles','nomerles-vizon.png')],
  ['Nomerles White',    'White',    null, T('nomerles','nomerles-white.png')],
  ['Nomerles White',    'White',    null, T('nomerles','nomerles-white.png')],
]);

// ── Palazzo (+1 Ivory) ────────────────────────────────────────────────────
add('Palazzo', [
  ['Palazzo Ivory', 'Ivory', null, T('palazzo','palazzo-ivory.png')],
]);

// ── Root (+1 each) ────────────────────────────────────────────────────────
add('Root', [
  ['Root Ash',   'Ash',   null, T('root','root-ash-60X120.png')],
  ['Root Crema', 'Crema', null, T('root','root-crema-60X120.png')],
  ['Root Silver','Silver',null, T('root','root-silver-60X120.png')],
]);

// ── Statuario Goya (+1) ───────────────────────────────────────────────────
add('Statuario Goya', [
  ['Statuario Goya', '', 'Brillant', T('statuario-goya','statuario-goya-30x60.png')],
]);

// ── Amethist ──────────────────────────────────────────────────────────────
add('Amethist', [
  ['Amethist Anthracite', 'Anthracite', null, T('amethist','amethist-anthracite.jpg')],
  ['Amethist Grey',       'Grey',       null, T('amethist','amethist-gris.jpg')],
]);

// ── Antares ───────────────────────────────────────────────────────────────
add('Antares', [
  ['Antares', '', null, T('antares','antares.jpg')],
]);

// ── Aqua Marin ────────────────────────────────────────────────────────────
add('Aqua Marin', [
  ['Aqua Marin', '', null, T('aqua-marin','aquamarin.jpg')],
]);

// ── Artanes ───────────────────────────────────────────────────────────────
add('Artanes Oxide', [
  ['Artanes Oxide', 'Oxide', null, T('artanes-oxide','artane-oxide.jpg')],
]);

// ── Carney ────────────────────────────────────────────────────────────────
add('Carney 3D Plus', [
  ['Carney Anthracite 3D Plus', 'Anthracite', null, T('carney-3d-plus','carney-anthracite.jpg')],
  ['Carney Grey 3D Plus',       'Grey',       null, T('carney-3d-plus','carney-grey.jpg')],
  ['Carney White 3D Plus',      'White',      null, T('carney-3d-plus','carney-white.jpg')],
]);

// ── Corten ────────────────────────────────────────────────────────────────
add('Corten 3D', [
  ['Corten 3D', '', null, T('corten-3d','corten-3D.jpg')],
]);

// ── Grassland ─────────────────────────────────────────────────────────────
add('Grassland', [
  ['Grassland Blue',  'Blue',  null, T('grassland','grassland-blue-30x60.png')],
  ['Grassland Green', 'Green', null, T('grassland','grassland-green-30x60.png')],
]);

// ── Kallos ────────────────────────────────────────────────────────────────
add('Kallos', [
  ['Kallos', '', null, T('kallos','Kallos.png')],
]);

// ── Kelvin ────────────────────────────────────────────────────────────────
add('Kelvin 3D Plus', [
  ['Kelvin 3D Plus', '', null, T('kelvin-3d-plus','kelvin-3D-plus.jpg')],
]);

// ── Madiolux ──────────────────────────────────────────────────────────────
add('Madiolux 3D', [
  ['Madiolux 3D', '', null, T('madiolux-3d','madiolux.jpg')],
]);

// ── Mora ──────────────────────────────────────────────────────────────────
add('Mora', [
  ['Mora', '', null, T('mora','mora.jpg')],
]);

// ── Norm ──────────────────────────────────────────────────────────────────
add('Norm 3D', [
  ['Norm Cherry 3D', 'Cherry', null, T('norm-3d','norm-cherry.jpg')],
  ['Norm Pine 3D',   'Pine',   null, T('norm-3d','norm-pine.jpg')],
]);

// ── Optima ────────────────────────────────────────────────────────────────
add('Optima 3D Plus', [
  ['Optima 3D Plus', '', null, T('optima-3d-plus','optima.jpg')],
]);

// ── Radiance ──────────────────────────────────────────────────────────────
add('Radiance', [
  ['Radiance', '', null, T('radiance','7BANT-RADIANCE-60X120X2-1504ENG-BAS3001-GS4BINARY-R6-RGB-P1.jpg')],
]);

// ── Rigel ─────────────────────────────────────────────────────────────────
add('Rigel 3D', [
  ['Rigel 3D', '', null, T('rigel-3d','P156ZDRR61SX0XMAAW10-1.jpg')],
]);

// ── Rio ───────────────────────────────────────────────────────────────────
add('Rio', [
  ['Rio Beige', 'Beige', null, T('rio','rio-beige.jpg')],
  ['Rio Dark',  'Dark',  null, T('rio','rio-dark.jpg')],
  ['Rio Light', 'Light', null, T('rio','rio-light.jpg')],
]);

// ── Selena ────────────────────────────────────────────────────────────────
add('Selena 3D Plus', [
  ['Selena 3D Plus', '', null, T('selena-3d-plus','P156ZDRSI5SX0XPAAK30-1.jpg')],
]);

// ── Serpantin ─────────────────────────────────────────────────────────────
add('Serpantin', [
  ['Serpantin Sand',  'Sand',  null, T('serpantin','serpantin-sand-60X120.webp')],
  ['Serpantin White', 'White', null, T('serpantin','serpantin-white-60X120.webp')],
]);

// ── Serpegiante ───────────────────────────────────────────────────────────
add('Serpegiante 3D', [
  ['Serpegiante 3D', '', null, '/tiles/serpegiante/serpegiante-render.png'],
]);

// ── Shell ─────────────────────────────────────────────────────────────────
add('Shell', [
  ['Shell', '', null, T('shell','7BANTSEET-SHELL-BEIGE-60X120X2-ENG1504-BAS3001-GS4BINARY-SSB3-RGB-P1.jpg')],
]);

// ── Storm Rock ────────────────────────────────────────────────────────────
add('Storm Rock', [
  ['Storm Rock Anthracite', 'Anthracite', null, T('storm-rock','storm-rock-antracite.jpg')],
  ['Storm Rock Cotto',      'Cotto',      null, T('storm-rock','storm-rock-cotto.jpg')],
  ['Storm Rock Grey',       'Grey',       null, T('storm-rock','storm-rock-gris.jpg')],
  ['Storm Rock New Green',  'New Green',  null, T('storm-rock','storm-rock-new-green.jpg')],
  ['Storm Rock White',      'White',      null, T('storm-rock','storm-rock-white.jpg')],
]);

// ── Tempo ─────────────────────────────────────────────────────────────────
add('Tempo 3D', [
  ['Tempo 3D', '', null, T('tempo-3d','P156ZDRD59SX0XMAAG40-1.jpg')],
]);

// ── Timber ────────────────────────────────────────────────────────────────
add('Timber 3D', [
  ['Timber 3D', '', null, T('timber-3d','timber.jpg')],
]);

// ── Traverten ─────────────────────────────────────────────────────────────
add('Traverten 3D', [
  ['Traverten Beige 3D', 'Beige', null, T('traverten-3d','traverten.jpg')],
]);

// ── Vales ─────────────────────────────────────────────────────────────────
add('Vales', [
  ['Vales', '', null, T('vales','vales.jpg')],
]);

// ── Venis ─────────────────────────────────────────────────────────────────
add('Venis', [
  ['Venis Anthracite', 'Anthracite', null, T('venis','venis-anthracite.jpg')],
  ['Venis Grey',       'Grey',       null, T('venis','venis-gris.jpg')],
]);

// ── Windy ─────────────────────────────────────────────────────────────────
add('Windy', [
  ['Windy', '', null, T('windy','windy.png')],
]);

// ── Zenith ────────────────────────────────────────────────────────────────
add('Zenith', [
  ['Zenith', '', null, T('zenith','zenith-60X120.png')],
]);

fs.writeFileSync(filePath, data, 'utf8');
console.log(`\nTotal added: ${addedCount} products`);
