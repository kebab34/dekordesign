const fs = require('fs');

const expected_raw = [
'Boho Light Grey',
'Bona Dea Crema','Bona Dea Light Grey',
'Bosco',
'Country Venge','Country Walnut',
'Eleganza Maple','Eleganza Oak','Eleganza Walnut',
'Fenix Cherry','Fenix Grey','Fenix Maple','Fenix Teak',
'Iroko Brown','Iroko Pearl','Iroko Warm Grey',
'Klein Cool','Klein Fon','Klein Natural',
'Las Palmas Bej',
'Logs Golden Oak','Logs Hazelnut','Logs Light Beige','Logs Special Walnut',
'Milenario Beige','Milenario Brown','Milenario Grey','Milenario Honey','Milenario White',
'Natura Wood Birch','Natura Wood Eboni','Natura Wood Oak','Natura Wood Pine',
'Norden Teak',
'Olmo Beige','Olmo Chestnut','Olmo Latte','Olmo Noce','Olmo Tobacco',
'Salamanca',
'Tsuga Almond','Tsuga Maun','Tsuga Natural',
'Void Bone',
'Yoga Wood Grey','Yoga Wood Ivory','Yoga Wood Oak','Yoga Wood Venge',
];

const expected = {};
for (const n of expected_raw) expected[n] = (expected[n]||0)+1;

const data = fs.readFileSync('src/data/collectionsData.js','utf8');
const current = {};
const re = /name: '([^']+)',[\s\S]{0,20}?\r?\n\s*color: [^\n]+\r?\n\s*size: '20x120'/g;
let m;
while ((m = re.exec(data)) !== null) {
  const name = m[1].replace(/\s+20[xX]120$/, '').trim();
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
