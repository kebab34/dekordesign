const fs = require('fs');

const expected_raw = [
'Adel Grey','Adel Ivory','Adel White',
'Agrilion Anthracite','Agrilion Bone','Agrilion Grey',
'Aldonsa','Altus','Amazonite',
'Amethist Anthracite','Amethist Grey',
'Antares','Aqua Marin',
'Arch Açık Gri','Arch Gri',
'Arcides Antrasit','Arcides Antrasit',
'Arcides Bone','Arcides Bone',
'Arcides Grey','Arcides Grey',
'Arcides Latte','Arcides Latte',
'Arcides Smoke','Arcides Smoke',
'Arcos Mocha','Arcos Silver','Arcos Smoke',
'Aren Beige','Aren Grey','Aren White',
'Aristo Gri','Aristo Vizon',
'Artanes Oxide',
'Assos',
'Assos Beige','Assos Beige',
'Assos Grey','Assos Grey',
'Assos Noche','Assos Noche',
'Assos Silver','Assos Silver',
'Atlantik','Belita','Bellatrix',
'Bengal Oxido','Bengal Perla',
'Beton Bianco','Beton Gri','Black Star',
'Boho Dark Grey','Boho Light Grey',
'Bona Dea Beige','Bona Dea Beige',
'Bona Dea Bianco','Bona Dea Bianco',
'Bona Dea Crema','Bona Dea Crema',
'Bona Dea Dark Grey','Bona Dea Dark Grey',
'Bona Dea Light Grey','Bona Dea Light Grey',
'Camouflage','Capella',
'Carbon Anthracite','Carbon Grey',
'Carney Anthracite 3D Plus','Carney Grey 3D Plus','Carney White 3D Plus',
'Casoria Grigio',
'Chakra','Chakra Dekofon','Charlotte',
'Charm Blue','Charm Rust','Cleopatra',
'Concept Açık Gri',
'Concept Antrasit','Concept Antrasit',
'Concept Bej','Concept Bej','Concept Bej',
'Concept Beyaz','Concept Beyaz',
'Concept Gri','Concept Gri','Concept Gri',
'Concept Vizon','Concept Vizon','Concept Vizon','Concept Vizon',
'Coper Moss','Coper Sky',
'Corten 3D',
'Crag Anthracite','Crag Cotto','Crag Grey','Crag Ivory','Crag Mocha','Crag White',
'Crotone','Darkness','Diva',
'Elan Antrasit','Elan Bone','Elan Brown','Elan Gri',
'Elitra','Elora','Everest','Flevo','Fortuna',
'Fuji Anthracite','Fuji Beige','Fuji Grey',
'Gemma Gold','Gemma Mint','Gemma Peach','Gemma Pearl','Gemma Sky','Gemma Smoke',
'Grace Bone','Grace Grey',
'Grassland Blue','Grassland Green',
'Hampton Anthracite','Hampton Bianco','Hampton Grigio','Hampton Latte',
'Harley','Himalaya Ice','Hormigon Molde','Hypnos','Joya','Kallos','Kapteyn',
'Kelvin 3D Plus',
'Larimar Ocean','Larix',
'Las Palmas Anthracite','Las Palmas Anthracite','Las Palmas Anthracite',
'Las Palmas Beige',
'Las Palmas Bej','Las Palmas Bej',
'Las Palmas Carbon','Las Palmas Carbon','Las Palmas Carbon',
'Las Palmas Grey',
'Las Palmas Gri','Las Palmas Gri',
'Las Palmas Mocha','Las Palmas Mocha','Las Palmas Mocha',
'Las Palmas White','Las Palmas White','Las Palmas White',
'Limra Bej','Limra Gri',
'Madiolux 3D','Madran Mink','Madran Vanillia',
'Magnifique Black',
'Maryo Beige','Maryo Grey',
'Mia','Mia',
'Miramar','Miranda','Mora','Mystic',
'Naos','Naos White',
'Nemrut Bone','Nemrut Grey','Nemrut Light Grey','Nemrut Mocha',
'New Metro Beyaz','Newport',
'Nile Açık Gri','Nile Antrasit','Nile Gri',
'Nomerles Antrasit','Nomerles Antrasit','Nomerles Antrasit',
'Nomerles Grey','Nomerles Grey','Nomerles Grey',
'Nomerles Vizon','Nomerles Vizon',
'Nomerles White','Nomerles White','Nomerles White',
'Norm Cherry 3D','Norm Pine 3D',
'Olbia Grey','Onelia',
'Onixia Grey','Onixia Sand',
'Optima 3D Plus',
'Orla Bronz','Orla Perla','Orla Platinum','Orla Silver',
'Palazzo Grey','Palazzo Ivory','Palazzo Ivory',
'Pamfilya Açık Gri','Pamfilya Antrasit','Pamfilya Gri',
'Piegato',
'Quark Antrasit','Quark Bone','Quark Gri','Quark Moka',
'Radiance','Regnum',
'Rigel 3D',
'Rio Beige','Rio Dark','Rio Light',
'Root Ash','Root Ash','Root Crema','Root Crema','Root Silver','Root Silver',
'Rubi Anthracite','Rubi Bone','Rubi Brown','Rubi Grey',
'Salt Cave Almond','Salt Cave Ice','Salt Cave Taupe',
'Salus Anthracite','Salus Grey',
'Sara Blue','Sara Bone','Sara Brown','Sara Green',
'Sealong','Selena 3D Plus',
'Serpantin Sand','Serpantin White',
'Serpegiante 3D','Shell',
'Side Brown','Side Green',
'Silyon Blue','Silyon Gold',
'Simirna Brown','Simirna Grey',
'Statuario Goya','Statuario Goya',
'Storm Rock Anthracite','Storm Rock Cotto','Storm Rock Grey',
'Storm Rock New Green','Storm Rock Suola','Storm Rock White',
'Strato',
'Süper Beyaz','Swan',
'Tempo 3D',
'Thanos Açık Gri','Thanos Koyu Gri','Thanos Sand',
'Tiger Black',
'Timber 3D','Traverten Beige 3D',
'Turin Gri','Vales',
'Venis Anthracite','Venis Grey',
'Venüs Grey','Venüs Vizon','Venüs White',
'Vintage','Vitray',
'Void Bone','Void Grej','Void Grey',
'Volare Grey','Volare Light Grey','Volare Taupe','Volare White',
'Wario Blue','Wario Green','White Star','Windy','Zenith',
];

// Count expected
const expected = {};
for (const n of expected_raw) expected[n] = (expected[n]||0)+1;

// Parse current 60x120 products
const data = fs.readFileSync('src/data/collectionsData.js','utf8');
const current = {};
const re = /name: '([^']+)',[\s\S]{0,20}?\r?\n\s*color: [^\n]+\r?\n\s*size: '60x120'/g;
let m;
while ((m = re.exec(data)) !== null) {
  const raw = m[1];
  // Strip size suffix
  const name = raw.replace(/\s+60[xX]120$/, '').trim();
  current[name] = (current[name]||0)+1;
}

console.log('=== MISSING or need more (expected but not in current) ===');
for (const [name, cnt] of Object.entries(expected).sort()) {
  const have = current[name]||0;
  if (have < cnt) console.log(`  need ${cnt-have} more (have ${have}): "${name}"`);
}

console.log('\n=== EXTRA in current (not expected - need rename or remove) ===');
for (const [name, cnt] of Object.entries(current).sort()) {
  if (!expected[name]) console.log(`  extra x${cnt}: "${name}"`);
}
