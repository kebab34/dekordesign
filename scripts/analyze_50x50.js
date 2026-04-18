const fs = require('fs');

const expected_raw = [
'Arch Açık Gri Mat',
'Arno',
'Catalpa',
'Fraxinus',
'Fresno',
'Greta',
'Herringwood',
'İmperial Beyaz',
'İmperial Gri',
'Madero',
'Minimo',
'Modellato',
'Napoli Fildişi',
'Napoli Gri',
'Neva',
'Nevada Açık Gri',
'Nevada Bone',
'Nevada Gri',
'Riva',
'Sativa Bone',
'Sativa Cool Gri',
'Stacy',
'Stuart',
];

const expected = {};
for (const n of expected_raw) expected[n] = (expected[n]||0)+1;

const data = fs.readFileSync('src/data/collectionsData.js','utf8');
const current = {};
const re = /name: '([^']+)',[\s\S]{0,20}?\r?\n\s*color: [^\n]+\r?\n\s*size: '50x50'/g;
let m;
while ((m = re.exec(data)) !== null) {
  const name = m[1].replace(/\s+50[xX]50$/, '').trim();
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
