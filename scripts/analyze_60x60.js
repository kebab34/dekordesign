const fs = require('fs');

const expected_raw = [
'Abella','Adela White','Adonis Beyaz','Adria Beyaz',
'Albero Eboni','Albero Grey','Albero Oak',
'Alin',
'Alyssa Antrasit','Alyssa Bone','Alyssa Gri',
'Anticatto Bianco','Anticatto Misto',
'Antique Carrara Parlak',
'Arch Açık Gri Parlak','Arch Gri Parlak',
'Arcides Antrasit','Arcides Antrasit',
'Arcides Bone','Arcides Bone',
'Arcides Grey',
'Arcides Latte','Arcides Latte',
'Arcides Smoke','Arcides Smoke',
'Astoria Crema','Avanos',
'Belgium Stone Grey','Belgium Stone Light Grey',
'Bengal Oxido','Bengal Perla',
'Beton Antrasit','Beton Bianco','Beton Gri',
'Bona Dea Beige','Bona Dea Bianco',
'Bona Dea Crema','Bona Dea Crema',
'Bona Dea Dark Grey','Bona Dea Dark Grey',
'Bona Dea Dark Grey Dekofon','Bona Dea Dark Grey Dekofon',
'Bona Dea Light Grey',
'Bona Dea Light Grey Dekofon','Bona Dea Light Grey Dekofon',
'Bond Beige','Calacatta Marmi',
'Cappadocia Grey','Cappadocia Sand',
'Concept Açık Gri','Concept Antrasit',
'Concept Bej','Concept Bej',
'Concept Beyaz',
'Concept Gri','Concept Gri',
'Concept Siyah',
'Concept Vizon','Concept Vizon',
'Crotone',
'Destiny Mat Beyaz',
'Destiny Parlak Beyaz','Destiny Parlak Beyaz',
'Dora Parlak','Enzo Beyaz',
'Famous Grey','Grand Ash','Grand White',
'Grassland Blue','Grassland Green',
'Hampton Açık Gri','Hampton Anthracite','Hampton Bianco','Hampton Latte',
'Helen Taupe','Helios','Hypnos',
'İmperial Beyaz',
'La Vita White','Lamuna',
'Las Palmas Bej','Las Palmas Gri',
'Lefke Cotto','Lefke Grey','Lefke Ivory',
'Limra Bej','Limra Gri',
'Loreto Dark','Loreto Light',
'Luca Bone','Luca Light Grey','Luca Taupe',
'Magellan Gri','Magnifique Black',
'Manhattan Bej','Manhattan Dunkel Gri','Manhattan Gri',
'Marmol Oldlace','Marmol Shadow',
'Marvel Latte','Marvy Mat',
'Maxi Mat Beyaz','Maxi Parlak Beyaz',
'Mystone Anthracite','Mystone Coffee',
'Nile Açık Gri','Nile Antrasit','Nile Gri',
'Odin Parlak','Olbia Grey',
'Orfe Bone',
'Pamfilya Açık Gri',
'Paris White','Parisian Mat Beyaz',
'Pebble Light Grey','Pebble Sand',
'Pera Grey','Pera Light Grey','Pera White',
'Quarzt Antrasit','Quarzt Bej','Quarzt Bone','Quarzt Gri',
'Rhea Anthracite','Rhea Grey','Rhea Ivory',
'Sakura','Sante White','Sarda',
'Sempre Bianca',
'Sempre Grigio','Sempre Grigio',
'Sempre Junior Bianca','Sempre Junior Grigio','Sempre Junior Nero',
'Sempre Nero',
'Star Line',
'Statuario Goya','Statuario Goya',
'Süper Beyaz',
'Tavas Cream','Tavas Gold','Tavas Grey','Tavas Light Grey','Tavas Noce',
'Teadora Açık Gri','Teadora Beyaz','Teadora Koyu Gri','Teadora Vizon',
'Terra Beyaz',
'Thanos Koyu Gri','Thanos Sand',
'Tiana Beyaz',
'Tuana Açık Gri','Tuana Gri',
'Urban Anthracite','Urban Bone','Urban Dunkel','Urban Latte',
'Valor White','Vedra Grafit','Vigo Beyaz',
'Violata Gris Parlak','Violeta Cafe Parlak',
'Void Bone','Void Füme','Void Grej','Void Grey',
'White Star','Zenith',
];

const expected = {};
for (const n of expected_raw) expected[n] = (expected[n]||0)+1;

const data = fs.readFileSync('src/data/collectionsData.js','utf8');
const current = {};
const re = /name: '([^']+)',[\s\S]{0,20}?\r?\n\s*color: [^\n]+\r?\n\s*size: '60x60'/g;
let m;
while ((m = re.exec(data)) !== null) {
  const name = m[1].replace(/\s+60[xX]60$/, '').trim();
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
