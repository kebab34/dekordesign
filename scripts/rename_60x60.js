const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/data/collectionsData.js');
let data = fs.readFileSync(filePath, 'utf8');

let ok = 0, fail = 0;

function ren(oldN, newN) {
  const old = `name: '${oldN}'`;
  const neo = `name: '${newN}'`;
  const idx = data.indexOf(old);
  if (idx === -1) { console.log(`FAIL: "${oldN}"`); fail++; return; }
  data = data.slice(0, idx) + neo + data.slice(idx + old.length);
  ok++;
}

// Alyssa
ren('60X60 ALYSSA ANTRASIT 60x60',  'Alyssa Antrasit 60x60');
ren('60X60 ALYSSA BONE 60x60',      'Alyssa Bone 60x60');
ren('ALYSSA GREY MAT 60x60',        'Alyssa Gri 60x60');

// Adela / Adonis
ren('Adela Blanc 60x60',            'Adela White 60x60');
ren('ADONIS Blanc 60x60',           'Adonis Beyaz 60x60');

// Albero
ren('ALBERO EBONI 60x60',           'Albero Eboni 60x60');
ren('ALBERO GREY 60x60',            'Albero Grey 60x60');
ren('ALBERO OAK 60x60',             'Albero Oak 60x60');

// Anticatto
ren('ANTICATTO BIANCO 60x60',       'Anticatto Bianco 60x60');
ren('ANTICATTO MISTO 60x60',        'Anticatto Misto 60x60');

// Antique Carrara
ren('ANTIQUE CARRARA 60x60',        'Antique Carrara Parlak 60x60');

// Arch
ren('ARCH AGRI 60x60',              'Arch Açık Gri Parlak 60x60');
ren('ARCH GRI 60x60',               'Arch Gri Parlak 60x60');

// Arcides (ALL CAPS → proper case)
ren('ARCIDES ANTRASİT 60x60',       'Arcides Antrasit 60x60');
ren('ARCIDES BONE 60x60',           'Arcides Bone 60x60');
ren('ARCIDES GREY 60x60',           'Arcides Grey 60x60');
ren('ARCIDES LATTE-60X60 60x60',    'Arcides Latte 60x60');
ren('ARCIDES SMOKE 60x60',          'Arcides Smoke 60x60');

// Belgium Stone
ren('Belgium Stone Gris 60x60',     'Belgium Stone Grey 60x60');

// Beton
ren('Beton Anthracite 60x60',       'Beton Antrasit 60x60');
ren('Beton Blanc 60x60',            'Beton Bianco 60x60');
ren('Beton Gris 60x60',             'Beton Gri 60x60');

// Bona Dea
ren('Bona Dea Blanc 60x60',         'Bona Dea Bianco 60x60');
ren('Bona Dea D. Gris Dekofon 60x60','Bona Dea Dark Grey Dekofon 60x60');
ren('Bona Dea D. Gris 60x60',       'Bona Dea Dark Grey 60x60');
ren('Bona Dea Gris Clair 60x60',    'Bona Dea Light Grey 60x60');
ren('Bona Dea L. Gris Dekofon 60x60','Bona Dea Light Grey Dekofon 60x60');

// Cappadocia
ren('Cappadocia Gris 60x60',        'Cappadocia Grey 60x60');
ren('Cappadocia Sable 60x60',       'Cappadocia Sand 60x60');

// Concept
ren('Concept Anthracite 60x60',     'Concept Antrasit 60x60');
ren('Concept Beige 60x60',          'Concept Bej 60x60');
ren('Concept Blanc 60x60',          'Concept Beyaz 60x60');
ren('Concept Gris Clairs 60x60',    'Concept Açık Gri 60x60');
ren('Concept Gris 60x60',           'Concept Gri 60x60');
ren('Concept Noir 60x60',           'Concept Siyah 60x60');

// Destiny
ren('Destiny Brillant Blanc 60x60', 'Destiny Parlak Beyaz 60x60');
ren('Destiny Mat Blanc 60x60',      'Destiny Mat Beyaz 60x60');

// Dora / Enzo
ren('Dora Brillant 60x60',          'Dora Parlak 60x60');
ren('Enzo Blanc 60x60',             'Enzo Beyaz 60x60');

// Famous / Grand
ren('Famous Gris 60x60',            'Famous Grey 60x60');
ren('Grand Blanc 60x60',            'Grand White 60x60');

// Grassland
ren('Grassland Bleu 60x60',         'Grassland Blue 60x60');
ren('Grassland Vert 60x60',         'Grassland Green 60x60');

// Hampton
ren('Hampton Blanc 60x60',          'Hampton Bianco 60x60');

// Imperial
ren('Imperial Blanc 60x60',         'İmperial Beyaz 60x60');

// La Vita
ren('La Vita Blanc 60x60',          'La Vita White 60x60');

// Las Palmas
ren('Las Palmas Beige 60x60',       'Las Palmas Bej 60x60');
ren('Las Palmas Gris 60x60',        'Las Palmas Gri 60x60');

// Lefke
ren('Lefke Gris 60x60',             'Lefke Grey 60x60');
ren('Lefke Ivoire 60x60',           'Lefke Ivory 60x60');

// Limra
ren('Limra Beige 60x60',            'Limra Bej 60x60');
ren('Limra Gris 60x60',             'Limra Gri 60x60');

// Loreto
ren('Loreto Clair 60x60',           'Loreto Light 60x60');
ren('Loreto Foncé 60x60',           'Loreto Dark 60x60');

// Luca
ren('Luca Gris Clair 60x60',        'Luca Light Grey 60x60');

// Magellan / Magnifique
ren('Magellan Gris 60x60',          'Magellan Gri 60x60');
ren('Magnifique Noir 60x60',        'Magnifique Black 60x60');

// Manhattan
ren('Manhattan Beige 60x60',        'Manhattan Bej 60x60');
ren('Manhattan Gris 60x60',         'Manhattan Gri 60x60');

// Maxi
ren('Maxi Brillant Blanc 60x60',    'Maxi Parlak Beyaz 60x60');
ren('Maxi Mat Blanc 60x60',         'Maxi Mat Beyaz 60x60');

// Nile
ren('Nile Anthracite 60x60',        'Nile Antrasit 60x60');
ren('Nile Gris Clairs 60x60',       'Nile Açık Gri 60x60');
ren('Nile Gris 60x60',              'Nile Gri 60x60');

// Odin / Olbia
ren('Odin Brillant 60x60',          'Odin Parlak 60x60');
ren('Olbia Gris 60x60',             'Olbia Grey 60x60');

// Pamfilya
ren('Pamfilya Gris Clairs 60x60',   'Pamfilya Açık Gri 60x60');

// Paris / Parisian
ren('Paris Blanc 60x60',            'Paris White 60x60');
ren('Parisian Mat Blanc 60x60',     'Parisian Mat Beyaz 60x60');

// Pera
ren('Pera Blanc 60x60',             'Pera White 60x60');
ren('Pera Gris Clair 60x60',        'Pera Light Grey 60x60');
ren('Pera Gris 60x60',              'Pera Grey 60x60');

// Quarzt
ren('Quarzt Anthracite 60x60',      'Quarzt Antrasit 60x60');
ren('Quarzt Beige 60x60',           'Quarzt Bej 60x60');
ren('Quarzt Gris 60x60',            'Quarzt Gri 60x60');

// Sante
ren('Sante Blanc 60x60',            'Sante White 60x60');

// Sempre
ren('Sempre Grisgio 60x60',         'Sempre Grigio 60x60');
ren('Sempre Junior Grisgio 60x60',  'Sempre Junior Grigio 60x60');

// Süper
ren('Süper Blanc 60x60',            'Süper Beyaz 60x60');

// Terra / Thanos / Tiana
ren('Terra Blanc 60x60',            'Terra Beyaz 60x60');
ren('Thanos Gris Foncés 60x60',     'Thanos Koyu Gri 60x60');
ren('Thanos Sable 60x60',           'Thanos Sand 60x60');
ren('Tiana Blanc 60x60',            'Tiana Beyaz 60x60');

// Valor / Vigo
ren('Valor Blanc 60x60',            'Valor White 60x60');
ren('Vigo Blanc 60x60',             'Vigo Beyaz 60x60');

// Violata / Violeta
ren('Violeta Café Brillant 60x60',        'Violeta Cafe Parlak 60x60');
ren('Violeta Violata Gris Brillant 60x60','Violata Gris Parlak 60x60');

// Void
ren('Void Fumée 60x60',             'Void Füme 60x60');
ren('Void Greige 60x60',            'Void Grej 60x60');
ren('Void Gris 60x60',              'Void Grey 60x60');

fs.writeFileSync(filePath, data, 'utf8');
console.log(`\nDone: ${ok} OK, ${fail} FAIL`);
