const fs = require('fs');

const expected_raw = [
'Adela Antrasit','Adela Antrasit Dekofon','Adela Beyaz','Adela Beyaz Dekofon','Adela Grey','Adela Grey Dekofon',
'Adonis Beyaz','Adonis Beyaz Dekofon',
'Adria Antrasit','Adria Beyaz','Adria Beyaz Dekofon','Adria Kahve','Adria Mix Dekofon',
'Alin','Alin Dekofon',
'Assos','Assos Dekofon',
'Astoria Crema','Astoria Crema Dekofon','Astoria Crema Dekor',
'Astoria Gri','Astoria Gri Dekofon','Astoria Gri Dekor',
'Astoria Kahve','Astoria Kahve Dekofon',
'Astoria Turkuaz','Astoria Turkuaz Dekofon',
'Bengal Dekofon','Bengal Dekor','Bengal Oxido','Bengal Perla',
'Bond Bazalt Dekofon','Bond Beige','Bond Wood Dekofon',
'Brano Mat Beyaz',
'Brillo Parlak Beyaz',
'Calacatta Marmi Mat','Calacatta Marmi Mat Dekofon','Calacatta Marmi Parlak','Calacatta Marmi Parlak Dekofon','Calacatta Marmi Parlak Dekor',
'Cappadocia Grey','Cappadocia Grey Decofon','Cappadocia Sand','Cappadocia Sand Decofon',
'Casta Beige','Casta Beige Dekofon','Casta Beige Matis Dekofon','Casta Grey','Casta Grey Dekofon','Casta Grey Matis Dekofon',
'Dove Mat Beyaz',
'Enzo Antrasit','Enzo Beyaz','Enzo Beyaz Dekofon','Enzo Gri','Enzo Mix Dekofon',
'Estel Azul','Estel Dekofon','Estel Latte','Estel Olive','Estel Ruby',
'Fair Gris','Fair Gris Dekofon','Fair Gris Dekor','Fair Nero','Fair Nero Dekofon','Fair Nero Dekor',
'Famous Grey','Famous Grey Dekofon',
'Gaudi Dekofon',
'Helios','Helios Dekofon',
'Juno Diamond','Juno Diamond Dekofon','Juno Emerald','Juno Emerald Dekofon','Juno Mosaic Floral Dekofon','Juno Ruby','Juno Ruby Dekofon','Juno Sapphire','Juno Sapphire Dekofon',
'La Vita Black','La Vita Dekofon','La Vita White',
'Loris','Loris Dekofon',
'Marmol Oldlace','Marmol Oldlace Dekofon','Marmol Oldlace Dekor','Marmol Shadow','Marmol Shadow Dekofon','Marmol Shadow Dekor',
'Marvel Bitter','Marvel Caramel','Marvel Grey','Marvel Latte','Marvel Latte Dekofon',
'Marvy Mat','Marvy Mat Dekofon','Marvy Mat Dekor','Marvy Parlak','Marvy Parlak Dekofon','Marvy Parlak Dekor',
'Mirko','Mirko Dekofon',
'Mood Anthracite','Mood Bamboo Dekofon','Mood Beige','Mood Cement Dekofon','Mood Faber Bamboo Dekofon','Mood Faber Cement Dekofon','Mood Faber Mix Wood Dekofon','Mood Faber Oak Dekofon','Mood Greige','Mood Grey','Mood Oak Dekofon','Mood White',
'Motto Beyaz','Motto Beyaz Dekofon','Motto Bone','Motto Bone Dekofon','Motto Gri','Motto Gri Dekofon','Motto Taupe','Motto Taupe Dekofon',
'Nuvola Beyaz','Nuvola Beyaz Dekofon','Nuvola Beyaz Dekor','Nuvola Beyaz Polygon Dekor',
'Oasis Lila','Oasis Lila Dekofon','Oasis Lila Dekor','Oasis Mürdüm','Oasis Mürdüm Dekofon','Oasis Mürdüm Dekor','Oasis Yeşil','Oasis Yeşil Dekofon','Oasis Yeşil Dekor',
'Paris Black','Paris Black Dekofon','Paris White','Paris White Dekofon',
'Pera Grey','Pera Grey Dekofon','Pera Light Grey','Pera Light Grey Dekofon','Pera White','Pera White Dekofon',
'Sante Aqua','Sante Aqua Dekofon','Sante Aqua Dekor','Sante Honey','Sante Honey Dekor','Sante Smoke','Sante Smoke Dekofon','Sante Smoke Dekor','Sante Turquiose','Sante Turquiose Decor','Sante White','Sante White Decor',
'Star Line','Star Line Dekofon',
'Terra Beyaz','Terra Gri','Terra Gül Kurusu','Terra Mix Dekofon','Terra Turkuaz',
'Valor Black','Valor Black Dekofon','Valor White','Valor White Dekofon',
'Vigo Beyaz','Vigo Beyaz Dekofon',
'Yuta Beyaz','Yuta Beyaz Dekofon','Yuta Krem','Yuta Krem Dekofon',
];

const expected = {};
for (const n of expected_raw) expected[n] = (expected[n]||0)+1;

const data = fs.readFileSync('src/data/collectionsData.js','utf8');
const current = {};
const re = /name: '([^']+)',[\s\S]{0,20}?\r?\n\s*color: [^\n]+\r?\n\s*size: '30x90'/g;
let m;
while ((m = re.exec(data)) !== null) {
  const name = m[1].replace(/\s+30[xX]90$/, '').trim();
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
