/**
 * Fusionne les entrées générées dans collectionsData.js
 * Remplace les entrées simples (images[]) par les entrées complètes (products[])
 * pour les collections qui ont un dossier dans /public/docs/
 *
 * Usage: node scripts/mergeIntoCollectionsData.js
 */

const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '../public/docs');
const dataFile = path.join(__dirname, '../src/data/collectionsData.js');

// Même mapping que generateCollectionEntries.js
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

function extractGroupKey(filename) {
  const name = filename.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i, '');
  return name.replace(/\s*-?\s*FACE\s*\d+$/i, '').trim();
}

function extractSize(groupKey) {
  const m = groupKey.match(/(\d+)[xX,](\d+(?:[,\.]\d+)?)/);
  if (!m) return '';
  return `${m[1].replace(',', '.')}x${m[2].replace(',', '.')}`;
}

function extractSurface(label) {
  const up = label.toUpperCase();
  if (up.includes('DEKOFON')) return 'Dekofon';
  if (up.includes('YER KAROSU') || up.includes('YER ')) return 'Sol';
  if (up.includes('DUVAR')) return 'Mural';
  if (up.includes(' FON')) return 'Fon';
  return null;
}

function extractColor(label) {
  const colorMap = [
    ['BEYAZ', 'Blanc'], ['WHITE', 'Blanc'], ['BIANCO', 'Blanc'],
    ['ANTRASİT', 'Anthracite'], ['ANTRASIT', 'Anthracite'], ['ANTHRACITE', 'Anthracite'],
    ['ACIK GRI', 'Gris clair'], ['LIGHT GREY', 'Gris clair'], ['LIGHT GRI', 'Gris clair'],
    ['A.GRI', 'Gris anthracite'], ['AGRI', 'Gris'],
    ['GRİ', 'Gris'], ['GREY', 'Gris'], ['GRI', 'Gris'],
    ['IVORY', 'Ivoire'], ['BONE', 'Beige'],
    ['LATTE', 'Latte'], ['VIZON', 'Vison'],
    ['SMOKE', 'Fumé'], ['SILVER', 'Argent'], ['MOCHA', 'Moka'],
    ['KAHVE', 'Brun'], ['BROWN', 'Brun'],
    ['MIX', 'Mix'], ['MISTO', 'Mixte'],
    ['AUTUMN', 'Automne'], ['SPRING', 'Printemps'], ['SUMMER', 'Été'], ['WINTER', 'Hiver'],
    ['EBONI', 'Ébène'], ['OAK', 'Chêne'], ['EBONY', 'Ébène'],
    ['BEIGE', 'Beige'],
  ];
  const up = label.toUpperCase();
  for (const [key, val] of colorMap) {
    if (up.includes(key)) return val;
  }
  return '';
}

function naturalSort(files) {
  return files.sort((a, b) => {
    const numA = parseInt((a.match(/FACE\s*(\d+)/i) || [0, 0])[1]);
    const numB = parseInt((b.match(/FACE\s*(\d+)/i) || [0, 0])[1]);
    return numA - numB;
  });
}

function buildEntryForSlug(slug) {
  const collName = slugToName[slug];
  const dirPath = path.join(docsDir, slug);

  // RENDER
  const renderDir = path.join(dirPath, 'RENDER');
  let mainImage = null;
  if (fs.existsSync(renderDir)) {
    const imgs = fs.readdirSync(renderDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
    if (imgs.length) mainImage = `/docs/${slug}/RENDER/${imgs[0]}`;
  }

  // TEXTURE → groupes
  const textureDir = path.join(dirPath, 'TEXTURE');
  const groups = {};
  if (fs.existsSync(textureDir)) {
    const files = fs.readdirSync(textureDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
    for (const file of files) {
      const key = extractGroupKey(file);
      if (!groups[key]) groups[key] = [];
      groups[key].push(file);
    }
    for (const key of Object.keys(groups)) {
      groups[key] = naturalSort(groups[key]);
    }
  }

  // Documents RAR
  const rarFiles = fs.readdirSync(dirPath).filter(f => /\.rar$/i.test(f));
  const documents = rarFiles.map(rar => {
    let name = 'Document';
    if (rar.includes('foy')) name = 'Fiche Produit';
    else if (rar.includes('texture')) name = 'Textures';
    else if (rar.includes('render')) name = 'Renders';
    return `{ name: '${name}', file: '/docs/${slug}/${rar}', type: 'RAR' }`;
  });

  // Produits
  const products = Object.entries(groups).map(([groupKey, faces], index) => {
    const size = extractSize(groupKey);
    const color = extractColor(groupKey);
    const surface = extractSurface(groupKey);
    const thumbnail = `/docs/${slug}/TEXTURE/${faces[0]}`;
    const facesStr = faces.map(f => `          '/docs/${slug}/TEXTURE/${f}'`).join(',\n');

    return `      {
        id: ${index},
        name: '${groupKey.replace(/'/g, "\\'")}',
        color: '${color}',
        size: '${size}',
        surface: ${surface ? `'${surface}'` : 'null'},
        thumbnail: '${thumbnail}',
        faces: [
${facesStr}
        ],
        specifications: {
          // À remplir depuis le PDF
        },
      }`;
  });

  return `  '${collName}': {
    slug: '${slug}',
    mainImage: ${mainImage ? `'${mainImage}'` : 'null'},
    products: [
${products.join(',\n')}
    ],
    documents: [
      ${documents.join(',\n      ')}
    ],
    commonSpecs: {
      // À remplir depuis le PDF
    },
  },`;
}

// ─── Mise à jour de collectionsData.js ───────────────────────────────────

let content = fs.readFileSync(dataFile, 'utf8');
const collectionDirs = fs.readdirSync(docsDir).filter(d =>
  fs.statSync(path.join(docsDir, d)).isDirectory()
);

// On saute Adela car déjà renseignée manuellement avec les vraies specs
const skipSlugs = ['adela'];

let updatedCount = 0;

for (const slug of collectionDirs) {
  if (skipSlugs.includes(slug)) {
    console.log(`⏭️  ${slug} — ignoré (données manuelles conservées)`);
    continue;
  }

  const collName = slugToName[slug];
  if (!collName) {
    console.log(`⚠️  ${slug} — slug non reconnu, ignoré`);
    continue;
  }

  // Génère la nouvelle entrée
  const newEntry = buildEntryForSlug(slug);

  // Trouve et remplace l'entrée existante dans le fichier
  // Pattern: '${collName}': { ... jusqu'à la prochaine entrée },
  const escapedName = collName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `\\s*'${escapedName}':\\s*\\{[\\s\\S]*?(?=\\n  '|\\n\\};)`,
    'g'
  );

  if (pattern.test(content)) {
    // Réinitialise le regex
    // Capture l'entrée ET la virgule finale si présente
  const pattern2 = new RegExp(
      `(  '${escapedName}':\\s*\\{[\\s\\S]*?\\},?(?=\\n  '|\\n\\};))`,
      'g'
    );
    content = content.replace(pattern2, newEntry);
    console.log(`✅ ${collName} — mis à jour`);
    updatedCount++;
  } else {
    console.log(`❌ ${collName} — entrée non trouvée dans collectionsData.js`);
  }
}

fs.writeFileSync(dataFile, content, 'utf8');
console.log(`\n✅ collectionsData.js mis à jour (${updatedCount} collections)`);
