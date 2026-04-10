/**
 * Renomme les fichiers images et met à jour collectionsData.js
 * Collections: crag (mise à jour data), crotone → enzo
 */
const fs = require('fs');
const path = require('path');

// ─── STEP 1 : RENOMMAGES FICHIERS ────────────────────────────────────────────
const renames = [
  // crotone — fix capitalisation & tirets manquants
  ['public/tiles/crotone/Crotone-render.png',   'public/tiles/crotone/crotone-render.png'],
  ['public/tiles/crotone/crotone-render3.png',  'public/tiles/crotone/crotone-render-3.png'],

  // darkness — fix capitalisation & tirets
  ['public/tiles/darkness/Darkness-render.png',  'public/tiles/darkness/darkness-render.png'],
  ['public/tiles/darkness/darkness-render2.png', 'public/tiles/darkness/darkness-render-2.png'],
  ['public/tiles/darkness/darkness-render3.png', 'public/tiles/darkness/darkness-render-3.png'],

  // delbin
  ['public/tiles/delbin/Delbin.png',                     'public/tiles/delbin/delbin-render.png'],
  ['public/tiles/delbin/delbin-2.png',                   'public/tiles/delbin/delbin-render-2.png'],
  ['public/tiles/delbin/delbin-3.png',                   'public/tiles/delbin/delbin-render-3.png'],
  ['public/tiles/delbin/W010ZDRD320X0XPAAW50.png',       'public/tiles/delbin/delbin-blanc.png'],
  ['public/tiles/delbin/W010ZDRD320X0XPAAF50.png',       'public/tiles/delbin/delbin-gris.png'],
  ['public/tiles/delbin/W010ZDRD320X0XPAAG50.png',       'public/tiles/delbin/delbin-fumee.png'],

  // destiny
  ['public/tiles/destiny/Destiny.png',                   'public/tiles/destiny/destiny-render.png'],
  ['public/tiles/destiny/destiny-2.png',                 'public/tiles/destiny/destiny-render-2.png'],
  ['public/tiles/destiny/destiny-3.png',                 'public/tiles/destiny/destiny-render-3.png'],
  ['public/tiles/destiny/G015XDRD380X0XMAAW50.png',     'public/tiles/destiny/destiny-brillant-60x60.png'],
  ['public/tiles/destiny/G015XDRD380X0XPAAW50.png',     'public/tiles/destiny/destiny-mat-60x60.png'],
  ['public/tiles/destiny/G048ZD0D380X0XPAAW50.png',     'public/tiles/destiny/destiny-brillant-61x61.png'],

  // dina
  ['public/tiles/dina/DINA-30X60-FACE-(2).jpg',         'public/tiles/dina/dina-face-2.jpg'],
  ['public/tiles/dina/DINA-30X60-FACE-(3).jpg',         'public/tiles/dina/dina-face-3.jpg'],
  ['public/tiles/dina/DINA-30X60-FACE-(4).jpg',         'public/tiles/dina/dina-face-4.jpg'],

  // diva
  ['public/tiles/diva/Diva.png',                        'public/tiles/diva/diva-render.png'],
  ['public/tiles/diva/diva-2.png',                      'public/tiles/diva/diva-render-2.png'],
  ['public/tiles/diva/diva-3.png',                      'public/tiles/diva/diva-render-3.png'],
  ['public/tiles/diva/P156ZDBD51TX0XPXX050.png',        'public/tiles/diva/diva-60x120.png'],

  // dora
  ['public/tiles/dora/Dora.png',                        'public/tiles/dora/dora-render.png'],
  ['public/tiles/dora/dora-2.png',                      'public/tiles/dora/dora-render-2.png'],
  ['public/tiles/dora/dora-3.png',                      'public/tiles/dora/dora-render-3.png'],
  ['public/tiles/dora/G015ZDRD15TX0XPXXB60.png',        'public/tiles/dora/dora-brillant.png'],

  // dove
  ['public/tiles/dove/Dove.png',                        'public/tiles/dove/dove-render.png'],
  ['public/tiles/dove/dove-2.png',                      'public/tiles/dove/dove-render-2.png'],
  ['public/tiles/dove/dove-3.png',                      'public/tiles/dove/dove-render-3.png'],
  ['public/tiles/dove/W188ZXRD340X0XMAAW50.png',        'public/tiles/dove/dove-mat-30x90.png'],
  ['public/tiles/dove/W010ZX0D340X0XPAAW50.png',        'public/tiles/dove/dove-brillant-30x60.png'],
  ['public/tiles/dove/W010ZX0D340X0XMAAW50.png',        'public/tiles/dove/dove-mat-30x60.png'],
  ['public/tiles/dove/W200XX0D340X0XPAAW50.png',        'public/tiles/dove/dove-brillant-20x40.png'],
  ['public/tiles/dove/W200XX0D340X0XMAAW50.png',        'public/tiles/dove/dove-mat-20x40.png'],

  // elan
  ['public/tiles/elan/elan-1.jpg',                      'public/tiles/elan/elan-bone.jpg'],
  ['public/tiles/elan/elan-2.png',                      'public/tiles/elan/elan-render-2.png'],
  ['public/tiles/elan/elan-3.png',                      'public/tiles/elan/elan-render-3.png'],
  ['public/tiles/elan/P156ZDRE660X0XFAAE50.png',        'public/tiles/elan/elan-brun.png'],
  ['public/tiles/elan/P156ZDRE660X0XFAAF50.png',        'public/tiles/elan/elan-gris.png'],
  ['public/tiles/elan/P156ZDRE660X0XFAAG50.png',        'public/tiles/elan/elan-anthracite.png'],
  ['public/tiles/elan/P156ZDRE660X0XFAAK50.png',        'public/tiles/elan/elan-noir.png'],

  // eleganza
  ['public/tiles/eleganza/Eleganza.png',                'public/tiles/eleganza/eleganza-render.png'],
  ['public/tiles/eleganza/eleganza-2.png',              'public/tiles/eleganza/eleganza-render-2.png'],
  ['public/tiles/eleganza/eleganza-3.png',              'public/tiles/eleganza/eleganza-render-3.png'],
  ['public/tiles/eleganza/G192ZDRE54TV0XMXXB40.png',    'public/tiles/eleganza/eleganza-maple.png'],
  ['public/tiles/eleganza/G192ZDRE54TV0XMXXB50.png',    'public/tiles/eleganza/eleganza-walnut.png'],
  ['public/tiles/eleganza/G192ZDRE54TV0XMXXR40.png',    'public/tiles/eleganza/eleganza-oak.png'],

  // elitra
  ['public/tiles/elitra/Elitra.png',                    'public/tiles/elitra/elitra-render.png'],
  ['public/tiles/elitra/elitra-2.png',                  'public/tiles/elitra/elitra-render-2.png'],
  ['public/tiles/elitra/elitra-3.png',                  'public/tiles/elitra/elitra-render-3.png'],
  ['public/tiles/elitra/P156ZDBE63TX0XPXXG40.png',      'public/tiles/elitra/elitra-gris.png'],

  // elora
  ['public/tiles/elora/elora-1.png',                    'public/tiles/elora/elora-render.png'],
  ['public/tiles/elora/elora-2.png',                    'public/tiles/elora/elora-render-2.png'],
  ['public/tiles/elora/elora-3.png',                    'public/tiles/elora/elora-render-3.png'],
  ['public/tiles/elora/P156ZDRE670X0XFAAW50.png',       'public/tiles/elora/elora-blanc.png'],

  // enzo
  ['public/tiles/enzo/Enzo.png',                        'public/tiles/enzo/enzo-render.png'],
  ['public/tiles/enzo/enzo-2.png',                      'public/tiles/enzo/enzo-render-2.png'],
  ['public/tiles/enzo/enzo-3.png',                      'public/tiles/enzo/enzo-render-3.png'],
  ['public/tiles/enzo/W188ZDRE420X0XMAIW50.png',        'public/tiles/enzo/enzo-blanc.png'],
  ['public/tiles/enzo/W188ZDRE420X0XMAIF50.png',        'public/tiles/enzo/enzo-dekofon.png'],
  ['public/tiles/enzo/W188ZDRE420X0XMAIG50.png',        'public/tiles/enzo/enzo-mix-dekofon.png'],
  ['public/tiles/enzo/W188XDRE42040XMAI000.png',        'public/tiles/enzo/enzo-gris.png'],
  ['public/tiles/enzo/W188XDRE42040XMAIW50.png',        'public/tiles/enzo/enzo-anthracite.png'],
];

let renameOk = 0;
for (const [from, to] of renames) {
  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
    console.log(`✓ ${path.basename(from)} → ${path.basename(to)}`);
    renameOk++;
  } else {
    console.log(`⚠ Déjà renommé ou absent: ${path.basename(from)}`);
  }
}
console.log(`\nFichiers renommés: ${renameOk}/${renames.length}\n`);

// ─── STEP 2 : MISE À JOUR collectionsData.js ─────────────────────────────────
let data = fs.readFileSync('./src/data/collectionsData.js', 'utf8');

// Remplacement simple (quand le chemin est unique dans le fichier)
const simpleUpdates = [
  // ── CRAG — mainImage + thumbnails (avec contexte couleur pour lever l'ambiguïté) ──
  ["mainImage: '/tiles/crag/crag-2.png',",          "mainImage: '/tiles/crag/Crag-render.png',"],

  // ── CROTONE ──
  ["mainImage: '/tiles/crotone/crotone-2.png',",    "mainImage: '/tiles/crotone/crotone-render.png',"],
  ["thumbnail: '/tiles/crotone/crotone-2.png',",    "thumbnail: '/tiles/crotone/crotone-60x120.png',"],
  ["thumbnail: '/tiles/crotone/crotone-3.png',",    "thumbnail: '/tiles/crotone/crotone-60x60.png',"],

  // ── DARKNESS ──
  ["mainImage: '/tiles/darkness/darkness-2.png',",  "mainImage: '/tiles/darkness/darkness-render.png',"],
  ["thumbnail: '/tiles/darkness/darkness-2.png',",  "thumbnail: '/tiles/darkness/darkness.png',"],

  // ── DELBIN ──
  ["mainImage: '/tiles/delbin/delbin-2.png',",      "mainImage: '/tiles/delbin/delbin-render.png',"],
  ["thumbnail: '/tiles/delbin/delbin-2.png',",      "thumbnail: '/tiles/delbin/delbin-blanc.png',"],
  ["thumbnail: '/tiles/delbin/W010ZDRD320X0XPAAF50.png',", "thumbnail: '/tiles/delbin/delbin-gris.png',"],
  ["thumbnail: '/tiles/delbin/delbin-3.png',",      "thumbnail: '/tiles/delbin/delbin-fumee.png',"],

  // ── DESTINY ──
  ["mainImage: '/tiles/destiny/destiny-2.png',",    "mainImage: '/tiles/destiny/destiny-render.png',"],
  ["thumbnail: '/tiles/destiny/G015XDRD380X0XMAAW50.png',", "thumbnail: '/tiles/destiny/destiny-brillant-60x60.png',"],
  ["thumbnail: '/tiles/destiny/G015XDRD380X0XPAAW50.png',", "thumbnail: '/tiles/destiny/destiny-mat-60x60.png',"],
  ["thumbnail: '/tiles/destiny/G048ZD0D380X0XPAAW50.png',", "thumbnail: '/tiles/destiny/destiny-brillant-61x61.png',"],

  // ── DINA ──
  ["thumbnail: '/tiles/dina/DINA-30X60-FACE-(3).jpg',", "thumbnail: '/tiles/dina/dina-face-3.jpg',"],

  // ── DIVA ──
  ["mainImage: '/tiles/dina/dina-30x60.jpg',",      "mainImage: '/tiles/diva/diva-render.png',"],  // bug: pointait sur dina
  ["thumbnail: '/tiles/diva/diva-2.png',",          "thumbnail: '/tiles/diva/diva-60x120.png',"],

  // ── DORA ──
  ["mainImage: '/tiles/dora/dora-2.png',",          "mainImage: '/tiles/dora/dora-render.png',"],
  ["thumbnail: '/tiles/dora/dora-2.png',",          "thumbnail: '/tiles/dora/dora-brillant.png',"],

  // ── DOVE ──
  ["mainImage: '/tiles/dove/dove-2.png',",          "mainImage: '/tiles/dove/dove-render.png',"],

  // ── ELAN ──
  ["mainImage: '/tiles/elan/elan-1.jpg',",          "mainImage: '/tiles/elan/elan-render-2.png',"],
  ["thumbnail: '/tiles/elan/elan-1.jpg',",          "thumbnail: '/tiles/elan/elan-bone.jpg',"],
  ["thumbnail: '/tiles/elan/P156ZDRE660X0XFAAE50.png',", "thumbnail: '/tiles/elan/elan-brun.png',"],
  ["thumbnail: '/tiles/elan/P156ZDRE660X0XFAAF50.png',", "thumbnail: '/tiles/elan/elan-gris.png',"],
  ["thumbnail: '/tiles/elan/P156ZDRE660X0XFAAG50.png',", "thumbnail: '/tiles/elan/elan-anthracite.png',"],

  // ── ELEGANZA ──
  ["mainImage: '/tiles/eleganza/eleganza-2.png',",  "mainImage: '/tiles/eleganza/eleganza-render.png',"],
  ["thumbnail: '/tiles/eleganza/eleganza-2.png',",  "thumbnail: '/tiles/eleganza/eleganza-maple.png',"],
  ["thumbnail: '/tiles/eleganza/eleganza-3.png',",  "thumbnail: '/tiles/eleganza/eleganza-walnut.png',"],

  // ── ELITRA ──
  ["mainImage: '/tiles/elitra/elitra-2.png',",      "mainImage: '/tiles/elitra/elitra-render.png',"],
  ["thumbnail: '/tiles/elitra/elitra-2.png',",      "thumbnail: '/tiles/elitra/elitra-gris.png',"],

  // ── ELORA ──
  ["mainImage: '/tiles/elora/elora-1.png',",        "mainImage: '/tiles/elora/elora-render.png',"],
  ["thumbnail: '/tiles/elora/elora-1.png',",        "thumbnail: '/tiles/elora/elora-blanc.png',"],

  // ── ENZO ──
  ["mainImage: '/tiles/enzo/enzo-2.png',",          "mainImage: '/tiles/enzo/enzo-render.png',"],
  ["thumbnail: '/tiles/enzo/W188XDRE42040XMAI000.png',", "thumbnail: '/tiles/enzo/enzo-gris.png',"],
  ["thumbnail: '/tiles/enzo/W188XDRE42040XMAIW50.png',", "thumbnail: '/tiles/enzo/enzo-anthracite.png',"],
];

let updateOk = 0;
for (const [oldStr, newStr] of simpleUpdates) {
  if (data.includes(oldStr)) {
    data = data.replace(oldStr, newStr);
    updateOk++;
  } else {
    console.log(`⚠ Non trouvé dans collectionsData: ${oldStr.substring(0, 60)}`);
  }
}

// Remplacements complexes CRAG (contexte couleur requis)
const cragReplacements = [
  ['Crag Blanc',      'crag-2.png',  'crag-white.png'],
  ['Crag Ivoire',     'crag-3.png',  'crag-ivory.png'],
  ['Crag Cotto',      'crag-2.png',  'crag-cotto.png'],
  ['Crag Moka',       'crag-2.png',  'crag-mocha.png'],
  ['Crag Gris',       'P156XDRC780V0XMAAK30.png', 'crag-grey.png'],
  ['Crag Anthracite', 'crag-2.png',  'crag-anthracite.png'],
];
for (const [productName, oldFile, newFile] of cragReplacements) {
  const oldFull = `name: '${productName}`;
  const idx = data.indexOf(oldFull);
  if (idx === -1) { console.log(`⚠ Produit crag non trouvé: ${productName}`); continue; }
  const block = data.slice(idx, idx + 400);
  const oldThumb = `thumbnail: '/tiles/crag/${oldFile}',`;
  const newThumb = `thumbnail: '/tiles/crag/${newFile}',`;
  if (block.includes(oldThumb)) {
    const newBlock = block.replace(oldThumb, newThumb);
    data = data.slice(0, idx) + newBlock + data.slice(idx + 400);
    console.log(`✓ Crag ${productName}: ${oldFile} → ${newFile}`);
    updateOk++;
  } else {
    console.log(`⚠ Thumbnail non trouvé pour ${productName}`);
  }
}

// Remplacements complexes DOVE (plusieurs produits partagent dove-2/dove-3)
const doveReplacements = [
  ['Dove Mat Blanc 30x90',      'dove-2.png', 'dove-mat-30x90.png'],
  ['Dove Brillant Blanc 30x60', 'dove-3.png', 'dove-brillant-30x60.png'],
  ['Dove Mat Blanc 30x60',      'dove-2.png', 'dove-mat-30x60.png'],
  ['Dove Brillant Blanc 20x40', 'dove-2.png', 'dove-brillant-20x40.png'],
  ['Dove Mat Blanc 20x40',      'dove-3.png', 'dove-mat-20x40.png'],
];
for (const [productName, oldFile, newFile] of doveReplacements) {
  const marker = `name: '${productName}'`;
  const idx = data.indexOf(marker);
  if (idx === -1) { console.log(`⚠ Produit dove non trouvé: ${productName}`); continue; }
  const block = data.slice(idx, idx + 400);
  const oldThumb = `thumbnail: '/tiles/dove/${oldFile}',`;
  const newThumb = `thumbnail: '/tiles/dove/${newFile}',`;
  if (block.includes(oldThumb)) {
    const newBlock = block.replace(oldThumb, newThumb);
    data = data.slice(0, idx) + newBlock + data.slice(idx + 400);
    console.log(`✓ Dove ${productName}: ${oldFile} → ${newFile}`);
    updateOk++;
  } else {
    console.log(`⚠ Thumbnail non trouvé pour ${productName}`);
  }
}

// Remplacements complexes ENZO (plusieurs produits partagent enzo-2.png)
const enzoReplacements = [
  ['Enzo Blanc 30x90',        'enzo-2.png', 'enzo-blanc.png'],
  ['Enzo Blanc Dekofon 30x90','enzo-3.png', 'enzo-dekofon.png'],
  ['Enzo Mix Dekofon 30x90',  'enzo-2.png', 'enzo-mix-dekofon.png'],
  ['Enzo Blanc 60x60',        'enzo-2.png', 'enzo-white-60x60.png'],
];
for (const [productName, oldFile, newFile] of enzoReplacements) {
  const marker = `name: '${productName}'`;
  const idx = data.indexOf(marker);
  if (idx === -1) { console.log(`⚠ Produit enzo non trouvé: ${productName}`); continue; }
  const block = data.slice(idx, idx + 400);
  const oldThumb = `thumbnail: '/tiles/enzo/${oldFile}',`;
  const newThumb = `thumbnail: '/tiles/enzo/${newFile}',`;
  if (block.includes(oldThumb)) {
    const newBlock = block.replace(oldThumb, newThumb);
    data = data.slice(0, idx) + newBlock + data.slice(idx + 400);
    console.log(`✓ Enzo ${productName}: ${oldFile} → ${newFile}`);
    updateOk++;
  } else {
    console.log(`⚠ Thumbnail non trouvé pour ${productName}`);
  }
}

// Eleganza Oak — partage eleganza-2.png, traitement manuel
const eleganzaOakIdx = data.indexOf("name: 'Eleganza Oak");
if (eleganzaOakIdx !== -1) {
  const block = data.slice(eleganzaOakIdx, eleganzaOakIdx + 400);
  const newBlock = block.replace("thumbnail: '/tiles/eleganza/eleganza-maple.png',", "thumbnail: '/tiles/eleganza/eleganza-oak.png',");
  if (newBlock !== block) {
    data = data.slice(0, eleganzaOakIdx) + newBlock + data.slice(eleganzaOakIdx + 400);
    console.log('✓ Eleganza Oak: eleganza-maple.png → eleganza-oak.png');
    updateOk++;
  }
}

fs.writeFileSync('./src/data/collectionsData.js', data, 'utf8');
console.log(`\ncollectionsData.js: ${updateOk} mises à jour effectuées`);
