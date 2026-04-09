/**
 * matchThumbnails.js
 * Pour chaque produit avec un thumbnail manquant :
 * - cherche le fichier le plus pertinent dans /public/tiles/{slug}/
 * - basé sur les mots-clés couleur/surface/taille du produit
 * - met à jour mainImage si cassé aussi
 */

const fs = require('fs');
const path = require('path');

const tilesRoot = path.join(__dirname, '../public/tiles');
const dataFile  = path.join(__dirname, '../src/data/collectionsData.js');

function fileExists(tilePath) {
  return fs.existsSync(path.join(__dirname, '../public', tilePath));
}

function getFiles(slug) {
  const dir = path.join(tilesRoot, slug);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
}

function isRender(filename) {
  return /render/i.test(filename);
}

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[àáâ]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/[ùûü]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, ' ')
    .trim();
}

// Mots-clés pour chaque couleur/valeur
const colorAliases = {
  blanc:       ['blanc', 'white', 'beyaz', 'bianco', 'branco'],
  gris:        ['gris', 'grey', 'gray', 'graphite', 'grigio'],
  anthracite:  ['anthracite', 'antrasit', 'antracit', 'dark', 'noir', 'black', 'nero', 'eboni', 'ebony'],
  ivoire:      ['ivory', 'ivoire', 'cream', 'creme', 'crema'],
  beige:       ['beige', 'sabbia', 'sand', 'sable', 'bone', 'latte'],
  brun:        ['brun', 'brown', 'cafe', 'coffee', 'kahve', 'bronze', 'marron', 'walnut'],
  mix:         ['mix', 'misto', 'karismik', 'multi'],
  dekofon:     ['dekofon', 'dekor', 'decor', 'decoration', 'deco'],
  rouge:       ['rouge', 'red', 'rosso', 'kirmizi'],
  bleu:        ['bleu', 'blue', 'blu', 'marine', 'navy'],
  vert:        ['vert', 'green', 'verde', 'sage'],
  or:          ['or', 'gold', 'dore', 'altın'],
  parlak:      ['parlak', 'lappato', 'poli', 'gloss', 'brillant'],
  mat:         ['mat', 'matte', 'natural'],
};

function getKeywords(prod) {
  const kws = new Set();

  // Couleur
  const colorNorm = normalize(prod.color || '');
  for (const [key, aliases] of Object.entries(colorAliases)) {
    if (aliases.some(a => colorNorm.includes(a))) {
      aliases.forEach(a => kws.add(a));
      break;
    }
  }
  // aussi ajouter directement les mots de la couleur normalisée
  colorNorm.split(' ').filter(w => w.length > 2).forEach(w => kws.add(w));

  // Surface
  const surfNorm = normalize(prod.surface || '');
  surfNorm.split(' ').filter(w => w.length > 2).forEach(w => kws.add(w));
  for (const [key, aliases] of Object.entries(colorAliases)) {
    if (aliases.some(a => surfNorm.includes(a))) {
      aliases.forEach(a => kws.add(a));
    }
  }

  // Taille
  if (prod.size) {
    const sizeNorm = prod.size.toLowerCase().replace('x', 'x');
    kws.add(sizeNorm);
    kws.add(sizeNorm.replace('x', '-'));
  }

  // Nom produit
  const nameNorm = normalize(prod.name || '');
  nameNorm.split(' ').filter(w => w.length > 3).forEach(w => kws.add(w));

  return kws;
}

function scoreFile(filename, keywords) {
  const fnNorm = normalize(filename);
  let score = 0;
  for (const kw of keywords) {
    if (fnNorm.includes(kw)) score++;
  }
  return score;
}

function findBestMatch(files, keywords, excludeRenders = true) {
  const candidates = excludeRenders ? files.filter(f => !isRender(f)) : files;
  if (candidates.length === 0) return null;

  let best = null, bestScore = -1;
  for (const f of candidates) {
    const s = scoreFile(f, keywords);
    if (s > bestScore) { bestScore = s; best = f; }
  }
  return best;
}

// Chargement des données
let rawData;
try {
  const content = fs.readFileSync(dataFile, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\/\/.*/gm, '')
    .replace(/export const collectionsData =/, 'module.exports =');
  const tmpFile = path.join(__dirname, '_tmp2.js');
  fs.writeFileSync(tmpFile, content);
  rawData = require(tmpFile);
  fs.unlinkSync(tmpFile);
} catch (e) {
  console.error('Erreur chargement:', e.message);
  process.exit(1);
}

let fileContent = fs.readFileSync(dataFile, 'utf8');
let fixed = 0, alreadyOk = 0, notFound = 0;

function replaceInFile(oldPath, newPath) {
  const escaped = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`'${escaped}'`);
  if (regex.test(fileContent)) {
    fileContent = fileContent.replace(regex, `'${newPath}'`);
    return true;
  }
  return false;
}

for (const [collName, collData] of Object.entries(rawData)) {
  const slug = collData.slug;
  const allFiles = getFiles(slug);
  if (allFiles.length === 0) { notFound++; continue; }

  const renderFiles = allFiles.filter(isRender);
  const productFiles = allFiles.filter(f => !isRender(f));

  // Fix mainImage
  if (collData.mainImage && !fileExists(collData.mainImage)) {
    const newRender = renderFiles[0] || allFiles[0];
    if (newRender) {
      const newPath = `/tiles/${slug}/${newRender}`;
      if (replaceInFile(collData.mainImage, newPath)) {
        console.log(`[RENDER] ${collName}: ${collData.mainImage} → ${newPath}`);
        fixed++;
      }
    }
  }

  // Fix thumbnails
  if (!collData.products) continue;

  // Garde une copie des fichiers déjà attribués pour éviter les doublons
  const used = new Set();

  for (const prod of collData.products) {
    const thumb = prod.thumbnail;
    if (!thumb) continue;
    if (fileExists(thumb)) { alreadyOk++; continue; }

    const keywords = getKeywords(prod);

    // Cherche le meilleur match parmi les fichiers non encore utilisés
    const available = productFiles.filter(f => !used.has(f));
    let best = findBestMatch(available, keywords);

    // Si score 0 ou rien de disponible → prend dans tous les product files
    if (!best) best = findBestMatch(productFiles, keywords);
    // Dernier recours : premier render
    if (!best) best = renderFiles[0] || allFiles[0];

    if (best) {
      const newPath = `/tiles/${slug}/${best}`;
      if (replaceInFile(thumb, newPath)) {
        used.add(best);
        console.log(`[FIX] ${collName} / "${prod.color || prod.name}": ${thumb} → ${best}`);
        fixed++;
      }
    }
  }
}

fs.writeFileSync(dataFile, fileContent, 'utf8');
console.log(`\nTerminé : ${fixed} chemins corrigés, ${alreadyOk} déjà OK, ${notFound} dossiers introuvables.`);
