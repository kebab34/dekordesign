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

// ── Agusta / Alboran ──
ren('Agusta Café 30x60',                  'Agusta Coffee 30x60');
ren('Alboran Gris 30x60',                 'Alboran Grey 30x60');

// ── Arch ──
ren('Arch Gris Clair 30x60',              'Arch Açık Gri 30x60');
ren('Arch Gris 30x60',                    'Arch Gri 30x60');
ren('ARCH GREY DEKOFON 30X60',            'Arch Gri Dekofon 30x60');

// ── Arcides ──
ren('ARCIDES SMOKE 30X60',                'Arcides Smoke 30x60');

// ── Belgium Stone ──
ren('Belgium Stone Gris 30x60',           'Belgium Stone Grey 30x60');
ren('Belgium Stone Gris Clair 30x60',     'Belgium Stone Light Grey 30x60');
ren('Belgium Stone Noir 30x60',           'Belgium Stone Black 30x60');

// ── Beton ──
ren('Beton Anthracite 30x60',             'Beton Antrasit 30x60');
ren('Beton Blanc 30x60',                  'Beton Bianco 30x60');
ren('Beton Gris 30x60',                   'Beton Gri 30x60');

// ── Brano / Brillo ──
ren('Brano Mat Blanc 30x60',              'Brano Mat Beyaz 30x60');
ren('Brillo Brillant Blanc 30x60',        'Brillo Parlak Beyaz 30x60');
ren('Brillo Brillant Pergamon 30x60',     'Brillo Parlak Pergamon 30x60');

// ── Buxy ──
ren('Buxy Anthracite 30x60',              'Buxy Antrasit 30x60');
ren('Buxy Gris 30x60',                    'Buxy Gri 30x60');

// ── Calacatta ──
ren('Calacatta Marmi Glossy 30x60',       'Calacatta Marmi Parlak 30x60');

// ── Concept ──
ren('Concept Anthracite 30x60',           'Concept Antrasit 30x60');
ren('Concept Beige 30x60',                'Concept Bej 30x60');
ren('Concept Blanc 30x60',                'Concept Beyaz 30x60');
ren('Concept Gris Clairs 30x60',          'Concept Açık Gri 30x60');
ren('Concept Gris 30x60',                 'Concept Gri 30x60');
ren('Concept Noir 30x60',                 'Concept Siyah 30x60');

// ── Delbin ──
ren('Delbin Blanc 30x60',                 'Delbin Beyaz 30x60');
ren('Delbin Fumée 30x60',                 'Delbin Füme 30x60');
ren('Delbin Gris 30x60',                  'Delbin Gri 30x60');

// ── Dove ──
ren('Dove Mat Blanc 30x60',               'Dove Mat Beyaz 30x60');
ren('Dove Brillant Blanc 30x60',          'Dove Parlak Beyaz 30x60');

// ── Europe ──
ren('Europe Blanc 30x60',                 'Europe White 30x60');
ren('Europe Gris 30x60',                  'Europe Grey 30x60');
ren('Europe Noir 30x60',                  'Europe Black 30x60');

// ── Grassland ──
ren('Grassland Bleu 30x60',               'Grassland Blue 30x60');
ren('Grassland Vert 30x60',               'Grassland Green 30x60');

// ── Hampton ──
ren('Hampton Blanc 30x60',                'Hampton Bianco 30x60');

// ── Helen ──
ren('Helen Gris 30x60',                   'Helen Grey 30x60');
ren('Helen Gris Dekofon 30x60',           'Helen Grey Dekofon 30x60');

// ── Helios ──
ren('Helios Or 30x60',                    'Helios Gold 30x60');
ren('Helios Or Dekofon 30x60',            'Helios Gold Dekofon 30x60');
ren('Helios Argent 30x60',                'Helios Silver 30x60');
ren('Helios Argent Dekofon 30x60',        'Helios Silver Dekofon 30x60');

// ── Imperial (İmperial) ──
ren('Imperial Blanc 30x60',               'İmperial Beyaz 30x60');
ren('Imperial Blanc Dekofon 30x60',       'Imperial Beyaz Dekofon 30x60');
ren('Imperial Blanc Dekor 30x60',         'İmperial Beyaz Dekor 30x60');
ren('Imperial Gris 30x60',                'İmperial Gri 30x60');
ren('Imperial Gris Dekofon 30x60',        'İmperial Gri Dekofon 30x60');
ren('Imperial Gris Dekor 30x60',          'İmperial Gri Dekor 30x60');
ren('Imperial Gris Hexagon Dekofon 30x60','İmperial Gri Hexagon Dekofon 30x60');

// ── Inca ──
ren('Inca Anthracite 30x60',              'Inca Antrasit 30x60');
ren('Inca Blanc 30x60',                   'Inca Beyaz 30x60');
ren('Inca Gris 30x60',                    'Inca Gri 30x60');

// ── Magnifique ──
ren('Magnifique Noir 30x60',              'Magnifique Black 30x60');

// ── Maxi ──
ren('Maxi Blanc 30x60',                   'Maxi Beyaz 30x60');
ren('Maxi Blanc Dekofon 30x60',           'Maxi Beyaz Dekofon 30x60');
ren('Maxi Blanc Platin Dekor 30x60',      'Maxi Beyaz Platin Dekor 30x60');

// ── Nile ──
ren('Nile Gris Clairs 30x60',             'Nile Açık Gri 30x60');

// ── Olivia ──
ren('Olivia Blanc 30x60',                 'Olivia Beyaz 30x60');
ren('Olivia Noir 30x60',                  'Olivia Siyah 30x60');

// ── Paros ──
ren('Paros Blanc 30x60',                  'Paros Beyaz 30x60');
ren('Paros Gris Clairs 30x60',            'Paros Açık Gri 30x60');
ren('Paros Gris Foncés 30x60',            'Paros Koyu Gri 30x60');

// ── Süper ──
ren('Süper Blanc 30x60',                  'Süper Beyaz 30x60');

// ── Void ──
ren('Void Blanc 30x60',                   'Void White 30x60');
ren('Void Blanc Dekofon 30x60',           'Void White Dekofon 30x60');
ren('Void Fumée 30x60',                   'Void Füme 30x60');
ren('Void Greige 30x60',                  'Void Grej 30x60');
ren('Void Gris 30x60',                    'Void Grey 30x60');
ren('Void Gris Dekofon 30x60',            'Void Grey Dekofon 30x60');

// ── Walter ──
ren('Walter Anthracite 30x60',            'Walter Antrasit 30x60');
ren('Walter Gris Clairs 30x60',           'Walter Açık Gri 30x60');
ren('Walter Gris 30x60',                  'Walter Gri 30x60');

// ── Yuta ──
ren('Yuta Blanc 30x60',                   'Yuta Beyaz 30x60');
ren('Yuta Crème 30x60',                   'Yuta Krem 30x60');

fs.writeFileSync(filePath, data, 'utf8');
console.log('\nDone: ' + ok + ' OK, ' + fail + ' FAIL');
