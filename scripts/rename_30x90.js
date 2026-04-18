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

// ── Adela ──
ren('Adela Anthracite 30x90',           'Adela Antrasit 30x90');
ren('Adela Anthracite Dekofon 30x90',   'Adela Antrasit Dekofon 30x90');
ren('Adela Blanc 30x90',                'Adela Beyaz 30x90');
ren('Adela Blanc Dekofon 30x90',        'Adela Beyaz Dekofon 30x90');
ren('Adela Gris 30x90',                 'Adela Grey 30x90');
ren('Adela Gris Dekofon 30x90',         'Adela Grey Dekofon 30x90');

// ── Adonis (ALL CAPS + size embedded) ──
ren('ADONIS 30X90',                     'Adonis Beyaz 30x90');
ren('ADONIS BLANC 30X90 DEKOFON',       'Adonis Beyaz Dekofon 30x90');

// ── Adria (ALL CAPS + size embedded) ──
ren('ADRIA ANTRASİT 30X90',             'Adria Antrasit 30x90');
ren('ADRIA KAHVE DUVAR 30X90',          'Adria Kahve 30x90');
ren('ADRIA MIX DEKOFON 30X90',          'Adria Mix Dekofon 30x90');
ren('ADRIA WHITE DEKOFON 30X90',        'Adria Beyaz Dekofon 30x90');
ren('ADRIA WHITE DUVAR 30X90',          'Adria Beyaz 30x90');

// ── Alin (ALL CAPS + size embedded) ──
ren('ALIN 30X90',                       'Alin 30x90');
ren('ALIN DEKOFON 30X90',              'Alin Dekofon 30x90');

// ── Assos (size prefix + typo ASOS) ──
ren('30x90 MAT ASOS FON',              'Assos 30x90');
ren('30x90 MAT ASOS DEKOFON',          'Assos Dekofon 30x90');

// ── Astoria ──
ren('Astoria Café 30x90',              'Astoria Kahve 30x90');
ren('Astoria Café Dekofon 30x90',      'Astoria Kahve Dekofon 30x90');
ren('Astoria Gris 30x90',              'Astoria Gri 30x90');
ren('Astoria Gris Dekofon 30x90',      'Astoria Gri Dekofon 30x90');
ren('Astoria Gris Dekor 30x90',        'Astoria Gri Dekor 30x90');

// ── Brano / Brillo ──
ren('Brano Mat Blanc 30x90',           'Brano Mat Beyaz 30x90');
ren('Brillo Brillant Blanc 30x90',     'Brillo Parlak Beyaz 30x90');

// ── Calacatta Marmi ──
ren('Calacatta Marmi Glossy 30x90',         'Calacatta Marmi Parlak 30x90');
ren('Calacatta Marmi Glossy Dekofon 30x90', 'Calacatta Marmi Parlak Dekofon 30x90');
ren('Calacatta Marmi Glossy Dekor 30x90',   'Calacatta Marmi Parlak Dekor 30x90');

// ── Cappadocia ──
ren('Cappadocia Gris 30x90',           'Cappadocia Grey 30x90');
ren('Cappadocia Gris Décofon 30x90',   'Cappadocia Grey Decofon 30x90');
ren('Cappadocia Sable 30x90',          'Cappadocia Sand 30x90');
ren('Cappadocia Sable Décofon 30x90',  'Cappadocia Sand Decofon 30x90');

// ── Casta ──
ren('Casta Gris 30x90',                'Casta Grey 30x90');
ren('Casta Gris Dekofon 30x90',        'Casta Grey Dekofon 30x90');
ren('Casta Gris Matis Dekofon 30x90',  'Casta Grey Matis Dekofon 30x90');

// ── Dove ──
ren('Dove Mat Blanc 30x90',            'Dove Mat Beyaz 30x90');

// ── Enzo ──
ren('Enzo Anthracite 30x90',           'Enzo Antrasit 30x90');
ren('Enzo Blanc 30x90',                'Enzo Beyaz 30x90');
ren('Enzo Blanc Dekofon 30x90',        'Enzo Beyaz Dekofon 30x90');
ren('Enzo Gris 30x90',                 'Enzo Gri 30x90');

// ── Famous ──
ren('Famous Gris 30x90',               'Famous Grey 30x90');
ren('Famous Gris Dekofon 30x90',       'Famous Grey Dekofon 30x90');

// ── La Vita ──
ren('La Vita Blanc 30x90',             'La Vita White 30x90');
ren('La Vita Noir 30x90',              'La Vita Black 30x90');

// ── Marvel / Marvy ──
ren('Marvel Gris 30x90',               'Marvel Grey 30x90');
ren('Marvy Brillant 30x90',            'Marvy Parlak 30x90');
ren('Marvy Brillant Dekofon 30x90',    'Marvy Parlak Dekofon 30x90');
ren('Marvy Brillant Dekor 30x90',      'Marvy Parlak Dekor 30x90');

// ── Mood ──
ren('Mood Blanc 30x90',                'Mood White 30x90');
ren('Mood Gris 30x90',                 'Mood Grey 30x90');

// ── Motto ──
ren('Motto Blanc 30x90',               'Motto Beyaz 30x90');
ren('Motto Blanc Dekofon 30x90',       'Motto Beyaz Dekofon 30x90');
ren('Motto Gris 30x90',                'Motto Gri 30x90');
ren('Motto Gris Dekofon 30x90',        'Motto Gri Dekofon 30x90');

// ── Nuvola ──
ren('Nuvola Blanc 30x90',              'Nuvola Beyaz 30x90');
ren('Nuvola Blanc Dekofon 30x90',      'Nuvola Beyaz Dekofon 30x90');
ren('Nuvola Blanc Dekor 30x90',        'Nuvola Beyaz Dekor 30x90');
ren('Nuvola Blanc Polygon Dekor 30x90','Nuvola Beyaz Polygon Dekor 30x90');

// ── Oasis ──
ren('Oasis Murdum 30x90',              'Oasis Mürdüm 30x90');
ren('Oasis Murdum Dekofon 30x90',      'Oasis Mürdüm Dekofon 30x90');
ren('Oasis Murdum Dekor 30x90',        'Oasis Mürdüm Dekor 30x90');
ren('Oasis Yesil 30x90',               'Oasis Yeşil 30x90');
ren('Oasis Yesil Dekofon 30x90',       'Oasis Yeşil Dekofon 30x90');
ren('Oasis Yesil Dekor 30x90',         'Oasis Yeşil Dekor 30x90');

// ── Paris ──
ren('Paris Blanc 30x90',               'Paris White 30x90');
ren('Paris Blanc Dekofon 30x90',       'Paris White Dekofon 30x90');
ren('Paris Noir 30x90',                'Paris Black 30x90');
ren('Paris Noir Dekofon 30x90',        'Paris Black Dekofon 30x90');

// ── Pera ──
ren('Pera Blanc 30x90',                'Pera White 30x90');
ren('Pera Blanc Dekofon 30x90',        'Pera White Dekofon 30x90');
ren('Pera Gris Clair 30x90',           'Pera Light Grey 30x90');
ren('Pera Clair Gris Dekofon 30x90',   'Pera Light Grey Dekofon 30x90');
ren('Pera Gris 30x90',                 'Pera Grey 30x90');
ren('Pera Gris Dekofon 30x90',         'Pera Grey Dekofon 30x90');

// ── Sante ──
ren('Sante Blanc 30x90',               'Sante White 30x90');
ren('Sante Blanc Decor 30x90',         'Sante White Decor 30x90');
ren('Sante Fumée 30x90',               'Sante Smoke 30x90');
ren('Sante Fumée Dekofon 30x90',       'Sante Smoke Dekofon 30x90');
ren('Sante Fumée Dekor 30x90',         'Sante Smoke Dekor 30x90');

// ── Terra ──
ren('Terra Blanc 30x90',               'Terra Beyaz 30x90');
ren('Terra Gris 30x90',                'Terra Gri 30x90');
ren('Terra Gul Kurusu 30x90',          'Terra Gül Kurusu 30x90');

// ── Valor ──
ren('Valor Blanc 30x90',               'Valor White 30x90');
ren('Valor Blanc Dekofon 30x90',       'Valor White Dekofon 30x90');
ren('Valor Noir 30x90',                'Valor Black 30x90');
ren('Valor Noir Dekofon 30x90',        'Valor Black Dekofon 30x90');

// ── Vigo ──
ren('Vigo Blanc 30x90',                'Vigo Beyaz 30x90');
ren('Vigo Blanc Dekofon 30x90',        'Vigo Beyaz Dekofon 30x90');

// ── Yuta ──
ren('Yuta Blanc 30x90',                'Yuta Beyaz 30x90');
ren('Yuta Blanc Dekofon 30x90',        'Yuta Beyaz Dekofon 30x90');
ren('Yuta Crème 30x90',                'Yuta Krem 30x90');
ren('Yuta Crème Dekofon 30x90',        'Yuta Krem Dekofon 30x90');

fs.writeFileSync(filePath, data, 'utf8');
console.log('\nDone: ' + ok + ' OK, ' + fail + ' FAIL');
