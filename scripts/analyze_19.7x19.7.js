const fs = require('fs');

const expected_raw = [
'Alba','Alba Autumn','Alba Spring','Alba Summer','Alba Winter',
'Pastel Kırmızı','Pastel Siyah',
'Sempre Junior Bianca','Sempre Junior Grigio','Sempre Junior Nero','Sempre Junior Rosa',
'Star Kırmızı','Star Mavi',
'Tiffany Mavi','Tiffany Siyah','Tiffany Yeşil',
'Urban Anthracite','Urban Bone','Urban Dunkel',
];

const expected = {};
for (const n of expected_raw) expected[n] = (expected[n]||0)+1;

const data = fs.readFileSync('src/data/collectionsData.js','utf8');
const current = {};
const re = /name: '([^']+)',[\s\S]{0,20}?\r?\n\s*color: [^\n]+\r?\n\s*size: '19\.7x19\.7'/g;
let m;
while ((m = re.exec(data)) !== null) {
  const name = m[1].replace(/\s+19\.7[xX]19\.7$/, '').trim();
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
