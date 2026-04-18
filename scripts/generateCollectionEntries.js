/**
 * Script de génération des entrées collectionsData pour les dossiers dans /public/docs/
 *
 * Usage: node scripts/generateCollectionEntries.js
 *
 * Pour chaque dossier dans /public/docs/ :
 *  - Groupe les images TEXTURE par variante (en coupant avant "- FACE" ou "FACE")
 *  - Détecte la taille, couleur, surface depuis le nom de fichier
 *  - Prend la première image RENDER comme mainImage
 *  - Liste les fichiers RAR comme documents
 */

const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '../public/docs');
const outputFile = path.join(__dirname, '../src/data/generatedEntries.js');

// Mapping slug → nom de collection exact
const slugToName = {
  'adel': 'Adel',
  'adela': 'Adela',
  'adonis': 'Adonis',
  'adria': 'Adria',
  'alba': 'Alba',
  'albero': 'Albero',
  'aldonsa': 'Aldonsa',
  'alin': 'Alin',
  'altus': 'Altus',
  'alyssa': 'Alyssa',
  'antiasit': 'Antiasit',
  'anticatto': 'Anticatto',
  'antique-carrara': 'Antique Carrara',
  'arch': 'Arch',
  'arcides': 'Arcides',
  'arcos': 'Arcos',
  'aristo': 'Aristo',
  'arno': 'Arno',
  'assos': 'Assos',
};

// Extrait la clé de groupe depuis un nom de fichier TEXTURE
// Ex: "ADEL GREY 60X120 - FACE 1.jpg" → "ADEL GREY 60X120"
// Ex: "30x90 MAT ASOS FON FACE1.jpg" → "30x90 MAT ASOS FON"
// Ex: "ARCIDES LATTE-60X60-FACE 1.jpg" → "ARCIDES LATTE-60X60"
// Ex: "ARCH GREY  FON 30X60 PRLK FACE1.jpg" → "ARCH GREY  FON 30X60 PRLK"
function extractGroupKey(filename) {
  const name = filename.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i, '');
  // Pattern: "- FACE N" ou "FACEN" ou " FACE N" avec espace
  const stripped = name
    .replace(/\s*-?\s*FACE\s*\d+$/i, '')
    .trim();
  return stripped;
}

// Extrait taille depuis le nom du groupe
function extractSize(groupKey) {
  const m = groupKey.match(/(\d+)[xX,](\d+(?:[,\.]\d+)?)/);
  if (!m) return null;
  // Normalise la virgule en point, ex: "19,7" → "19.7"
  const w = m[1].replace(',', '.');
  const h = m[2].replace(',', '.');
  return `${w}x${h}`;
}

// Extrait la couleur/variante depuis le nom du groupe
// Après le nom de collection, on enlève la taille → reste la couleur/infos
function extractColorInfo(groupKey, collectionSlug) {
  // Retire les dimensions
  let info = groupKey.replace(/\d+[xX,]\d+(?:[,\.]\d+)?/g, '').trim();
  // Retire les tirets et espaces multiples
  info = info.replace(/[-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return info || groupKey;
}

// Extrait surface (FON/DEKOFON/YER KAROSU/DUVAR...)
function extractSurface(label) {
  const up = label.toUpperCase();
  if (up.includes('DEKOFON')) return 'Dekofon';
  if (up.includes('FON')) return 'Fon';
  if (up.includes('YER KAROSU') || up.includes('YER')) return 'Sol';
  if (up.includes('DUVAR')) return 'Mural';
  return null;
}

// Extrait couleur principale
function extractColor(label) {
  const colorMap = {
    'BEYAZ': 'Blanc', 'WHITE': 'Blanc', 'BIANCO': 'Blanc',
    'GRİ': 'Gris', 'GREY': 'Gris', 'GRI': 'Gris', 'GRAY': 'Gris',
    'ANTRASİT': 'Anthracite', 'ANTRASIT': 'Anthracite', 'ANTHRACITE': 'Anthracite',
    'IVORY': 'Ivoire', 'BONE': 'Beige', 'LATTE': 'Latte',
    'SMOKE': 'Fumé', 'SILVER': 'Argent', 'MOCHA': 'Moka',
    'KAHVE': 'Brun', 'BROWN': 'Brun',
    'MIX': 'Mix', 'MISTO': 'Mixte', 'MISTO': 'Mixte',
    'AUTUMN': 'Automne', 'SPRING': 'Printemps', 'SUMMER': 'Été', 'WINTER': 'Hiver',
    'VIZON': 'Vison', 'EBONI': 'Ébène', 'OAK': 'Chêne',
    'BEIGE': 'Beige', 'LIGHT': 'Clair',
    'AGRI': 'Gris clair', 'ACIK GRI': 'Gris clair',
    'A.GRI': 'Gris anthracite',
  };
  const up = label.toUpperCase();
  for (const [key, val] of Object.entries(colorMap)) {
    if (up.includes(key)) return val;
  }
  return null;
}

// Génère un label court pour le produit
function makeProductName(collectionName, groupKey) {
  // Retire les numéros de face, keep the rest
  return groupKey.replace(/[-_]+/g, ' ').trim();
}

// Trie les faces naturellement (FACE 1, FACE 2, ..., FACE 10)
function naturalSort(files) {
  return files.sort((a, b) => {
    const numA = parseInt((a.match(/FACE\s*(\d+)/i) || [0, 0])[1]);
    const numB = parseInt((b.match(/FACE\s*(\d+)/i) || [0, 0])[1]);
    return numA - numB;
  });
}

// ─── Traitement principal ─────────────────────────────────────────────────

const collectionDirs = fs.readdirSync(docsDir).filter(d =>
  fs.statSync(path.join(docsDir, d)).isDirectory()
);

let output = `// AUTO-GÉNÉRÉ par scripts/generateCollectionEntries.js
// Ce fichier contient les entrées générées pour les collections avec dossiers docs/
// Copiez-collez les entrées dans src/data/collectionsData.js

`;

for (const slug of collectionDirs) {
  const collName = slugToName[slug] || slug;
  const dirPath = path.join(docsDir, slug);

  // 1. Images RENDER
  const renderDir = path.join(dirPath, 'RENDER');
  let renderImages = [];
  if (fs.existsSync(renderDir)) {
    renderImages = fs.readdirSync(renderDir)
      .filter(f => /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i.test(f));
  }
  const mainImage = renderImages.length > 0
    ? `/docs/${slug}/RENDER/${renderImages[0]}`
    : null;

  // 2. Images TEXTURE → groupées par variante
  const textureDir = path.join(dirPath, 'TEXTURE');
  const groups = {}; // key → [filename, ...]

  if (fs.existsSync(textureDir)) {
    const textureFiles = fs.readdirSync(textureDir)
      .filter(f => /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i.test(f));

    for (const file of textureFiles) {
      const groupKey = extractGroupKey(file);
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(file);
    }
  }

  // Trie les faces dans chaque groupe
  for (const key of Object.keys(groups)) {
    groups[key] = naturalSort(groups[key]);
  }

  // 3. Documents RAR
  const rarFiles = fs.readdirSync(dirPath)
    .filter(f => /\.rar$/i.test(f));

  const documents = rarFiles.map(rar => {
    let name = 'Document';
    if (rar.includes('foy')) name = 'Fiche Produit';
    else if (rar.includes('texture')) name = 'Textures';
    else if (rar.includes('render')) name = 'Renders';
    return { name, file: `/docs/${slug}/${rar}`, type: 'RAR' };
  });

  // 4. Génère les produits
  const products = Object.entries(groups).map(([groupKey, faces], index) => {
    const size = extractSize(groupKey) || '';
    const color = extractColor(groupKey) || '';
    const surface = extractSurface(groupKey);
    const name = makeProductName(collName, groupKey);
    const thumbnail = `/docs/${slug}/TEXTURE/${faces[0]}`;
    const facesPaths = faces.map(f => `/docs/${slug}/TEXTURE/${f}`);

    return {
      id: index,
      name,
      color,
      size,
      surface,
      thumbnail,
      faces: facesPaths,
    };
  });

  // 5. Génère le code JS
  const productsStr = products.map(p => {
    const facesStr = p.faces.map(f => `          '${f}'`).join(',\n');
    return `      {
        id: ${p.id},
        name: '${p.name.replace(/'/g, "\\'")}',
        color: '${p.color}',
        size: '${p.size}',
        surface: ${p.surface ? `'${p.surface}'` : 'null'},
        thumbnail: '${p.thumbnail}',
        faces: [
${facesStr}
        ],
        specifications: {
          // À remplir depuis le PDF
        },
      }`;
  }).join(',\n');

  const docsStr = documents.map(d =>
    `      { name: '${d.name}', file: '${d.file}', type: '${d.type}' }`
  ).join(',\n');

  output += `  // ─── ${collName.toUpperCase()} ───────────────────────────────────────────
  '${collName}': {
    slug: '${slug}',
    mainImage: ${mainImage ? `'${mainImage}'` : 'null'},
    products: [
${productsStr}
    ],
    documents: [
${docsStr}
    ],
    commonSpecs: {
      // À remplir depuis le PDF
    },
  },

`;
}

fs.writeFileSync(outputFile, output, 'utf8');
console.log(`✅ Fichier généré: src/data/generatedEntries.js`);
console.log(`   ${collectionDirs.length} collections traitées: ${collectionDirs.join(', ')}`);
