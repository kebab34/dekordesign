const fs = require('fs');

const expected_raw = [
'Abella','Abella Dekofon',
'Antique Carrara','Antique Carrara Dekofon','Antique Carrara Dekor','Antique Carrara Polygon Dekor',
'Avanos','Avanos Beige','Avanos Dekofon',
'Bond Bazalt Dekofon','Bond Beige','Bond Grey','Bond Wood Dekofon',
'Brano Mat Beyaz',
'Eterna Vizon','Eterna Vizon Dekofon',
'Famous Grey','Famous Grey Dekofon',
'Gordion Dark Grey','Gordion Vizon','Gordion White','Gordion White Dekofon',
'Grand Ash','Grand Ash Organic Dekofon','Grand White','Grand White Patchwork Dekofon',
'Helen Bone','Helen Bone Dekofon','Helen Taupe','Helen Taupe Dekofon',
'Odin','Odin Dekofon',
'Orfe Beige','Orfe Beige Dekofon','Orfe Bone','Orfe Bone Dekofon','Orfe Bouquet Dekofon',
'Parisian Beyaz','Parisian Beyaz Dekofon','Parisian Beyaz File Dekor','Parisian Beyaz Geo Dekor',
'Statuario Goya','Statuario Goya Dekofon',
'Tiana Antrasit','Tiana Beyaz','Tiana Dekofon',
];

const expected = {};
for (const n of expected_raw) expected[n] = (expected[n]||0)+1;

const data = fs.readFileSync('src/data/collectionsData.js','utf8');
const current = {};
const re = /name: '([^']+)',[\s\S]{0,20}?\r?\n\s*color: [^\n]+\r?\n\s*size: '40x120'/g;
let m;
while ((m = re.exec(data)) !== null) {
  const name = m[1].replace(/\s+40[xX]120$/, '').trim();
  current[name] = (current[name]||0)+1;
}

console.log('=== MISSING or need more ===');
for (const [name, cnt] of Object.entries(expected).sort()) {
  const have = current[name]||0;
  if (have < cnt) console.log(`  need ${cnt-have} more (have ${have}): "${name}"`);
}

console.log('\n=== EXTRA (rename or remove) ===');
for (const [name, cnt] of Object.entries(current).sort()) {
  if (!expected[name]) console.log(`  extra x${cnt}: "${name}"`);
}
