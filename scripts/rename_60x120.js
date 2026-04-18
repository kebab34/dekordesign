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

// Replace ALL occurrences (for products that appear multiple times)
function renAll(oldN, newN) {
  const old = `name: '${oldN}'`;
  const neo = `name: '${newN}'`;
  if (!data.includes(old)) { console.log(`FAIL(all): "${oldN}"`); fail++; return; }
  let count = 0;
  while (data.includes(old)) { data = data.replace(old, neo); count++; }
  ok += count;
}

// ── Agrilion ──
ren('Agrilion Gris 60x120',            'Agrilion Grey 60x120');

// ── Aldonsa / Altus (ALL CAPS + remove color) ──
ren('ALDONSA BEYAZ 60X120',            'Aldonsa 60x120');
ren('ALTUS 60X120',                    'Altus 60x120');

// ── Arch ──
ren('ARCH AGRI 60X120',               'Arch Açık Gri 60x120');
ren('ARCH GRI 60X120',                'Arch Gri 60x120');
// "Arch Gris 60x120" → duplicate of Arch Gri; rename so it becomes 2nd Arch Gri (but user needs only 1 → mark for removal)
// For now rename to same to avoid ghost entries
ren('Arch Gris 60x120',               'Arch Gri 60x120');

// ── Arcides (ALL CAPS) ──
ren('ARCIDES ANTRASİT 60X120',        'Arcides Antrasit 60x120');
ren('ARCIDES BONE 60X120',            'Arcides Bone 60x120');
ren('ARCIDES GRI 60X120',             'Arcides Grey 60x120');
ren('ARCIDES LATTE-60X120',           'Arcides Latte 60x120');
ren('ARCIDES SMOKE 60X120',           'Arcides Smoke 60x120');
// Vizon not in user list → keep as-is (will stay as extra)

// ── Arcos ──
ren('ARCOS MAT MOCHA 60X120',         'Arcos Mocha 60x120');
ren('ARCOS MAT SILVER 60X120',        'Arcos Silver 60x120');
ren('ARCOS MAT SMOKE 60X120',         'Arcos Smoke 60x120');

// ── Aren ──
ren('Aren Blanc 60x120',              'Aren White 60x120');
ren('Aren Gris 60x120',               'Aren Grey 60x120');

// ── Aristo ──
ren('ARISTO GREY 60X120',             'Aristo Gri 60x120');
ren('ARISTO VIZON 60X120',            'Aristo Vizon 60x120');

// ── Assos ──
ren('Assos Gris 60x120',              'Assos Grey 60x120');

// ── Beton ──
ren('Beton Blanc 60x120',             'Beton Bianco 60x120');
ren('Beton Gris 60x120',              'Beton Gri 60x120');

// ── Boho ──
ren('Boho Gris Clair 60x120',         'Boho Light Grey 60x120');
ren('Boho Gris Foncé 60x120',         'Boho Dark Grey 60x120');

// ── Bona Dea ──
ren('Bona Dea Blanc 60x120',          'Bona Dea Bianco 60x120');
ren('Bona Dea Gris Clair 60x120',     'Bona Dea Light Grey 60x120');
ren('Bona Dea D. Gris 60x120',        'Bona Dea Dark Grey 60x120');

// ── Carbon ──
ren('Carbon Antracit 60x120',         'Carbon Anthracite 60x120');
ren('Carbon Gris 60x120',             'Carbon Grey 60x120');

// ── Charm ──
ren('Charm Bleu 60x120',              'Charm Blue 60x120');
ren('Charm Rouille 60x120',           'Charm Rust 60x120');

// ── Concept ──
ren('Concept Blanc 60x120',           'Concept Beyaz 60x120');
ren('Concept Beige 60x120',           'Concept Bej 60x120');
ren('Concept Vizon 60x120',           'Concept Vizon 60x120'); // no change, already correct
ren('Concept Taupe 60x120',           'Concept Beyaz 60x120'); // Taupe not in list → map to Beyaz (2nd)
ren('Concept Gris Clairs 60x120',     'Concept Açık Gri 60x120');
ren('Concept Gris 60x120',            'Concept Gri 60x120');
ren('Concept Anthracite 60x120',      'Concept Antrasit 60x120');

// ── Crag ──
ren('Crag Blanc 60x120',              'Crag White 60x120');
ren('Crag Ivoire 60x120',             'Crag Ivory 60x120');
ren('Crag Moka 60x120',               'Crag Mocha 60x120');
ren('Crag Gris 60x120',               'Crag Grey 60x120');

// ── Elan ──
ren('Elan Anthracite 60x120',         'Elan Antrasit 60x120');
ren('Elan Brun 60x120',               'Elan Brown 60x120');
ren('Elan Gris 60x120',               'Elan Gri 60x120');

// ── Fuji ──
ren('Fuji Anracit 60x120',            'Fuji Anthracite 60x120');
ren('Fuji Gris 60x120',               'Fuji Grey 60x120');

// ── Gemma ──
ren('Gemma Or 60x120',                'Gemma Gold 60x120');
ren('Gemma Perle 60x120',             'Gemma Pearl 60x120');
ren('Gemma Fumée 60x120',             'Gemma Smoke 60x120');

// ── Grace ──
ren('Grace Gris 60x120',              'Grace Grey 60x120');

// ── Hampton ──
ren('Hampton Blanc 60x120',           'Hampton Bianco 60x120');
ren('Hampton Grisgio 60x120',         'Hampton Grigio 60x120');

// ── Las Palmas ──
ren('Las Palmas Antracit 60x120',     'Las Palmas Anthracite 60x120');
ren('Las Palmas Blanc 60x120',        'Las Palmas White 60x120');
renAll('Las Palmas Gris 60x120',      'Las Palmas Gri 60x120');
ren('Las Palmas Moka 60x120',         'Las Palmas Mocha 60x120');
// "Las Palmas Beige" → user has "Las Palmas Beige" (1) AND "Las Palmas Bej" (2 separate)
// Current "Las Palmas Beige" stays as is (covers 1×Beige)
// "Las Palmas Gris" (×2) → renamed above to "Las Palmas Gri"

// ── Limra ──
ren('Limra Beige 60x120',             'Limra Bej 60x120');
ren('Limra Gris 60x120',              'Limra Gri 60x120');

// ── Magnifique ──
ren('Magnifique Noir 60x120',         'Magnifique Black 60x120');

// ── Maryo ──
ren('Maryo Gris 60x120',              'Maryo Grey 60x120');

// ── Naos ──
ren('Naos Blanc 60x120',              'Naos White 60x120');

// ── New Metro ──
ren('New Metro Blanc 60x120',         'New Metro Beyaz 60x120');

// ── Nile ──
ren('Nile Gris Clairs 60x120',        'Nile Açık Gri 60x120');
ren('Nile Gris 60x120',               'Nile Gri 60x120');
ren('Nile Anthracite 60x120',         'Nile Antrasit 60x120');

// ── Nomerles ──
ren('Nomerles Blanc 60x120',          'Nomerles White 60x120');
ren('Nomerles Gris 60x120',           'Nomerles Grey 60x120');
ren('Nomerles Anthracite 60x120',     'Nomerles Antrasit 60x120');

// ── Olbia ──
ren('Olbia Gris 60x120',              'Olbia Grey 60x120');

// ── Onixia ──
ren('Onixia Sable 60x120',            'Onixia Sand 60x120');
ren('Onixia Gris 60x120',             'Onixia Grey 60x120');

// ── Orla ──
ren('Orla Argent 60x120',             'Orla Silver 60x120');

// ── Palazzo ──
ren('Palazzo Ivoire 60x120',          'Palazzo Ivory 60x120');
ren('Palazzo Gris 60x120',            'Palazzo Grey 60x120');

// ── Pamfilya ──
ren('Pamfilya Gris Clairs 60x120',    'Pamfilya Açık Gri 60x120');
ren('Pamfilya Gris 60x120',           'Pamfilya Gri 60x120');
ren('Pamfilya Anthracite 60x120',     'Pamfilya Antrasit 60x120');

// ── Quark ──
ren('Quark Anthracite 60x120',        'Quark Antrasit 60x120');
ren('Quark Gris 60x120',              'Quark Gri 60x120');

// ── Root ──
ren('Root Argent 60x120',             'Root Silver 60x120');

// ── Rubi ──
ren('Rubi Brun 60x120',               'Rubi Brown 60x120');
ren('Rubi Gris 60x120',               'Rubi Grey 60x120');

// ── Sara ──
ren('Sara Bleu 60x120',               'Sara Blue 60x120');
ren('Sara Brun 60x120',               'Sara Brown 60x120');
ren('Sara Vert 60x120',               'Sara Green 60x120');

// ── Side ──
ren('Side Brun 60x120',               'Side Brown 60x120');
ren('Side Vert 60x120',               'Side Green 60x120');

// ── Silyon ──
ren('Silyon Bleu 60x120',             'Silyon Blue 60x120');
ren('Silyon Or 60x120',               'Silyon Gold 60x120');

// ── Simirna ──
ren('Simirna Brun 60x120',            'Simirna Brown 60x120');
ren('Simirna Gris 60x120',            'Simirna Grey 60x120');

// ── Süper ──
ren('Süper Blanc 60x120',             'Süper Beyaz 60x120');

// ── Thanos ──
ren('Thanos Sable 60x120',            'Thanos Sand 60x120');
ren('Thanos Gris Clairs 60x120',      'Thanos Açık Gri 60x120');
ren('Thanos Gris Foncés 60x120',      'Thanos Koyu Gri 60x120');

// ── Tiger ──
ren('Tiger Noir 60x120',              'Tiger Black 60x120');

// ── Turin ──
ren('Turin Gris 60x120',              'Turin Gri 60x120');

// ── Venüs ──
ren('Venüs Blanc 60x120',             'Venüs White 60x120');
ren('Venüs Gris 60x120',              'Venüs Grey 60x120');

// ── Void ──
ren('Void Greige 60x120',             'Void Grej 60x120');
ren('Void Gris 60x120',               'Void Grey 60x120');

// ── Volare ──
ren('Volare Gris 60x120',             'Volare Grey 60x120');
ren('Volare Gris Clair 60x120',       'Volare Light Grey 60x120');
ren('Volare Blanc 60x120',            'Volare White 60x120');

// ── Wario ──
ren('Wario Bleu 60x120',              'Wario Blue 60x120');
ren('Wario Vert 60x120',              'Wario Green 60x120');

fs.writeFileSync(filePath, data, 'utf8');
console.log(`\nDone: ${ok} OK, ${fail} FAIL`);
