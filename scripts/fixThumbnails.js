/**
 * fixThumbnails.js
 * Corrige les chemins thumbnail/faces dans collectionsData.js
 * en remplaçant les paths manquants par les fichiers réellement présents dans /public/tiles/
 */

const fs = require('fs');
const path = require('path');

const tilesRoot = path.join(__dirname, '../public/tiles');
const dataFile  = path.join(__dirname, '../src/data/collectionsData.js');

// Fichiers qui sont des renders (pas des produits)
function isRender(slug, filename) {
  const lower = filename.toLowerCase();
  const slugLower = slug.toLowerCase();
  // ex: adria-2.png, adria-3.png, Adria.png
  if (lower === `${slugLower}.png`) return true;
  if (new RegExp(`^${slugLower}-[0-9]+\\.`).test(lower)) return true;
  return false;
}

// Retourne les fichiers produits disponibles dans un dossier tiles
function getProductFiles(slug) {
  const dir = path.join(tilesRoot, slug);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f) && !isRender(slug, f))
    .sort();
}

// Vérifie si un chemin existe dans /public
function fileExists(tilePath) {
  const full = path.join(__dirname, '../public', tilePath);
  return fs.existsSync(full);
}

// Charge le module collectionsData.js (eval simplifié via require)
// On lit le fichier texte et on le parse en JS
let rawData;
try {
  // Contournement : on remplace l'export ES module par un require compatible
  const content = fs.readFileSync(dataFile, 'utf8')
    .replace(/^\/\/.*/gm, '')               // retire les commentaires //
    .replace(/export const collectionsData =/, 'module.exports =');
  const tmpFile = path.join(__dirname, '_tmp_collections.js');
  fs.writeFileSync(tmpFile, content);
  rawData = require(tmpFile);
  fs.unlinkSync(tmpFile);
} catch (e) {
  console.error('Erreur de chargement collectionsData.js :', e.message);
  process.exit(1);
}

let fileContent = fs.readFileSync(dataFile, 'utf8');
let fixedThumbnails = 0;
let skippedThumbnails = 0;

for (const [collName, collData] of Object.entries(rawData)) {
  const slug = collData.slug;
  if (!collData.products || collData.products.length === 0) continue;

  const productFiles = getProductFiles(slug);
  if (productFiles.length === 0) continue;

  let fileIndex = 0;

  for (const prod of collData.products) {
    const thumb = prod.thumbnail;
    if (thumb && fileExists(thumb)) {
      skippedThumbnails++;
      continue; // thumbnail existe, on ne touche pas
    }

    // thumbnail manquant → prend le prochain fichier produit disponible
    const newFile = productFiles[fileIndex % productFiles.length];
    fileIndex++;
    const newPath = `/tiles/${slug}/${newFile}`;

    // Remplace dans le fichier texte (première occurrence exacte du path manquant)
    const escaped = thumb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(thumbnail:\\s*)'${escaped}'`);
    if (regex.test(fileContent)) {
      fileContent = fileContent.replace(regex, `$1'${newPath}'`);
      console.log(`[FIX] ${collName} / ${prod.name}: ${thumb} → ${newPath}`);
      fixedThumbnails++;
    }
  }
}

fs.writeFileSync(dataFile, fileContent, 'utf8');
console.log(`\nTerminé : ${fixedThumbnails} thumbnails corrigés, ${skippedThumbnails} déjà OK.`);
