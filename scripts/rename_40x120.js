const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/data/collectionsData.js');
let data = fs.readFileSync(filePath, 'utf8');

let ok = 0, fail = 0;

function ren(oldN, newN) {
  const old = "name: '" + oldN + "'";
  const neo = "name: '" + newN + "'";
  const idx = data.indexOf(old);
  if (idx === -1) { console.log('FAIL: "' + oldN + '"'); fail++; return; }
  data = data.slice(0, idx) + neo + data.slice(idx + old.length);
  ok++;
}

// ── Antique Carrara (ALL CAPS + typo "ANTUQUE") ──
// FON variants → Antique Carrara (3 face variants → same name)
ren('ANTUQUE CARRARA 40X120 FON - 1',      'Antique Carrara 40x120');
ren('ANTUQUE CARRARA 40X120 FON - 2',      'Antique Carrara 40x120');
ren('ANTUQUE CARRARA 40X120 FON - 3',      'Antique Carrara 40x120');
// DEKOFON variants → Antique Carrara Dekofon
ren('ANTUQUE CARRARA 40X120 DEKOFON - 1',  'Antique Carrara Dekofon 40x120');
ren('ANTUQUE CARRARA 40X120 DEKOFON - 2',  'Antique Carrara Dekofon 40x120');
ren('ANTUQUE CARRARA 40X120 DEKOFON - 3',  'Antique Carrara Dekofon 40x120');
// DEKOR / POLYGON DEKOR
ren('ANTIQUE CARRARA 40X120 DEKOR - 1',    'Antique Carrara Dekor 40x120');
ren('ANTIQUE CARRARA 40X120 POLYGON DEKOR - 1', 'Antique Carrara Polygon Dekor 40x120');

// ── Bond ──
ren('Bond Gris 40x120',                    'Bond Grey 40x120');

// ── Brano ──
ren('Brano Mat Blanc 40x120',              'Brano Mat Beyaz 40x120');

// ── Famous ──
ren('Famous Gris 40x120',                  'Famous Grey 40x120');
ren('Famous Gris Dekofon 40x120',          'Famous Grey Dekofon 40x120');

// ── Gordion ──
ren('Gordion Blanc 40x120',                'Gordion White 40x120');
ren('Gordion Blanc Dekofon 40x120',        'Gordion White Dekofon 40x120');
ren('Gordion Taupe 40x120',                'Gordion Vizon 40x120');
ren('Gordion Gris Foncé 40x120',           'Gordion Dark Grey 40x120');

// ── Grand ──
ren('Grand Blanc 40x120',                  'Grand White 40x120');
ren('Grand Blanc Patchwork Dekofon 40x120','Grand White Patchwork Dekofon 40x120');

// ── Parisian ──
ren('Parisian Blanc 40x120',               'Parisian Beyaz 40x120');
ren('Parisian Blanc Dekofon 40x120',       'Parisian Beyaz Dekofon 40x120');
ren('Parisian Blanc File Dekor 40x120',    'Parisian Beyaz File Dekor 40x120');
ren('Parisian Blanc Geo Dekor 40x120',     'Parisian Beyaz Geo Dekor 40x120');

// ── Tiana ──
ren('Tiana Blanc 40x120',                  'Tiana Beyaz 40x120');
ren('Tiana Anthracite 40x120',             'Tiana Antrasit 40x120');

fs.writeFileSync(filePath, data, 'utf8');
console.log('\nDone: ' + ok + ' OK, ' + fail + ' FAIL');
