/**
 * addRendersArray.js
 * Ajoute/met à jour un tableau `renders` dans chaque collection de collectionsData.js
 * basé sur les fichiers *render* présents dans /public/tiles/{slug}/
 */

const fs = require('fs');
const path = require('path');

const tilesRoot = path.join(__dirname, '../public/tiles');
const dataFile  = path.join(__dirname, '../src/data/collectionsData.js');

function getRendersForSlug(slug) {
  const dir = path.join(tilesRoot, slug);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => /render/i.test(f) && /\.(png|jpg|jpeg|webp)$/i.test(f))
    .sort((a, b) => {
      // render.png avant render-2.png avant render-3.png
      const numA = parseInt(a.match(/-(\d+)\./)?.[1] || '1');
      const numB = parseInt(b.match(/-(\d+)\./)?.[1] || '1');
      return numA - numB;
    })
    .map(f => `/tiles/${slug}/${f}`);
}

// Charger le fichier texte
let content = fs.readFileSync(dataFile, 'utf8');

// Charger les données pour avoir les slugs
let rawData;
try {
  const cleaned = content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\/\/.*/gm, '')
    .replace(/export const collectionsData =/, 'module.exports =');
  const tmpFile = path.join(__dirname, '_tmp_renders.js');
  fs.writeFileSync(tmpFile, cleaned);
  rawData = require(tmpFile);
  fs.unlinkSync(tmpFile);
} catch(e) {
  console.error('Erreur:', e.message);
  process.exit(1);
}

let updated = 0;

for (const [collName, collData] of Object.entries(rawData)) {
  const slug = collData.slug;
  const renders = getRendersForSlug(slug);
  if (renders.length === 0) continue;

  const rendersLine = `    renders: [\n${renders.map(r => `      '${r}',`).join('\n')}\n    ],`;

  // Si renders existe déjà → remplacer
  const existingRendersRe = new RegExp(`(  '${collName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':[\\s\\S]*?)    renders: \\[[\\s\\S]*?\\],(\n    mainImage:)`);
  if (existingRendersRe.test(content)) {
    content = content.replace(existingRendersRe, `$1${rendersLine}$2`);
    console.log(`[UPD] ${collName}: ${renders.length} renders`);
    updated++;
  } else {
    // Sinon → insérer après `slug: '...',`
    const slugRe = new RegExp(`(  '${collName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*\\{[^\\n]*\\n    slug: '[^']*',)`);
    if (slugRe.test(content)) {
      content = content.replace(slugRe, `$1\n${rendersLine}`);
      console.log(`[ADD] ${collName}: ${renders.length} renders`);
      updated++;
    } else {
      console.log(`[SKIP] ${collName}: pattern non trouvé`);
    }
  }
}

fs.writeFileSync(dataFile, content, 'utf8');
console.log(`\nTerminé : ${updated} collections mises à jour.`);
