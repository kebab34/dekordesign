const fs = require('fs');

const expected_raw = [
'Agusta Coffee','Agusta Latte',
'Alboran Beige','Alboran Grey',
'Antibes',
'Arch Açık Gri','Arch Gri','Arch Gri Dekofon','Arch Mix Dekor',
'Arcides Antrasit','Arcides Bone','Arcides Grey','Arcides Smoke',
'Belgium Stone Black','Belgium Stone Grey','Belgium Stone Light Grey',
'Beton Antrasit','Beton Bianco','Beton Gri',
'Bona Dea Beige','Bona Dea Crema',
'Brano Mat Beyaz','Brano Mat Pergamon',
'Brillo Parlak Beyaz','Brillo Parlak Pergamon',
'Buxy Antrasit','Buxy Gri',
'Calacatta Marmi Mat','Calacatta Marmi Parlak',
'Cleopatra',
'Concept Açık Gri','Concept Antrasit','Concept Bej','Concept Beyaz','Concept Gri','Concept Siyah','Concept Vizon',
'Delbin Beyaz','Delbin Füme','Delbin Gri',
'Dina',
'Dove Mat Beyaz','Dove Parlak Beyaz',
'Epona',
'Europe Beige','Europe Black','Europe Grey','Europe White',
'Grassland Blue','Grassland Green',
'Hampton Anthracite','Hampton Bianco','Hampton Latte',
'Helen Bone','Helen Bone Dekofon','Helen Grey','Helen Grey Dekofon','Helen Taupe','Helen Taupe Dekofon',
'Helios Gold','Helios Gold Dekofon','Helios Silver','Helios Silver Dekofon',
'Hypnos',
'İmperial Beyaz','Imperial Beyaz Dekofon','İmperial Beyaz Dekor',
'İmperial Gri','İmperial Gri Dekofon','İmperial Gri Dekor','İmperial Gri Hexagon Dekofon',
'Inca Antrasit','Inca Beyaz','Inca Gri','Inca Mix Dekofon','Inca Vizon','Inca Vizon Dekofon',
'Joya',
'Karsos',
'Lisbon',
'Magnifique Black',
'Maxi Beyaz','Maxi Beyaz Dekofon','Maxi Beyaz Platin Dekor',
'Merlo',
'Neva','Neva Dekofon',
'Nile Açık Gri',
'Olivia Beyaz','Olivia Siyah',
'Paros Açık Gri','Paros Beyaz','Paros Koyu Gri','Paros Taupe',
'Riva','Riva Dekofon',
'Statuario Goya',
'Süper Beyaz',
'Urban Bone','Urban Latte',
'Verona',
'Void Bone','Void Bone Dekofon','Void Füme','Void Grej','Void Grey','Void Grey Dekofon','Void White','Void White Dekofon',
'Walter Açık Gri','Walter Antrasit','Walter Dekofon','Walter Gri',
'Yuta Beyaz','Yuta Krem',
'Zenith',
];

const expected = {};
for (const n of expected_raw) expected[n] = (expected[n]||0)+1;

const data = fs.readFileSync('src/data/collectionsData.js','utf8');
const current = {};
const re = /name: '([^']+)',[\s\S]{0,20}?\r?\n\s*color: [^\n]+\r?\n\s*size: '30x60'/g;
let m;
while ((m = re.exec(data)) !== null) {
  const name = m[1].replace(/\s+30[xX]60$/, '').trim();
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
