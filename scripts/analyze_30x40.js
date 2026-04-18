const fs = require('fs');

const expected_raw = [
'Brano Mat Beyaz','Brillo Parlak Beyaz',
'Europe Beige','Europe Black','Europe Greige','Europe Grey','Europe White',
'Luca Bone','Luca Light Grey','Luca Taupe',
'Saaga Anthracite','Saaga Grey','Saaga Light Beige',
'Saten Havuz Lacivert','Saten Havuz Mavi',
'Urban Anthracite','Urban Bone','Urban Dunkel',
];

const expected = {};
for (const n of expected_raw) expected[n] = (expected[n]||0)+1;

const data = fs.readFileSync('src/data/collectionsData.js','utf8');
const current = {};
const re = /name: '([^']+)',[\s\S]{0,20}?\r?\n\s*color: [^\n]+\r?\n\s*size: '30x40'/g;
let m;
while ((m = re.exec(data)) !== null) {
  const name = m[1].replace(/\s+30[xX]40$/, '').trim();
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
