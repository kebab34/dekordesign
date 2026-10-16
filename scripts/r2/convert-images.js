/**
 * Convertit les images de public/tiles/ en WebP dans .r2-build/tiles/ (les originaux ne sont pas modifiés).
 *
 * Pour chaque image, deux fichiers :
 *   <nom>.webp     → 1600 px max (hero, lightbox)
 *   <nom>-sm.webp  → 600 px max (miniatures des grilles)
 *
 * Les chemins sont normalisés (minuscules, espaces → tirets) pour éviter les 404
 * sur les hébergeurs sensibles à la casse. La correspondance ancien → nouveau chemin
 * est écrite dans .r2-build/manifest-tiles.json pour réécrire les données ensuite.
 *
 * Usage : node scripts/r2/convert-images.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', '..');
const SRC = path.join(ROOT, 'public', 'tiles');
const OUT = path.join(ROOT, '.r2-build', 'tiles');
const MANIFEST = path.join(ROOT, '.r2-build', 'manifest-tiles.json');
const CONCURRENCY = 4;

const SIZES = [
  { suffix: '',    width: 1600, quality: 80 },
  { suffix: '-sm', width: 600,  quality: 75 },
];

const normalize = rel => rel
  .split(path.sep).join('/')
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/\.(png|jpe?g|webp)$/i, '');

function listImages(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return listImages(full);
    return /\.(png|jpe?g|webp)$/i.test(e.name) ? [full] : [];
  });
}

async function convert(file) {
  const rel = path.relative(SRC, file);
  const base = normalize(rel);
  for (const { suffix, width, quality } of SIZES) {
    const dest = path.join(OUT, `${base}${suffix}.webp`);
    if (fs.existsSync(dest)) continue; // reprise possible après interruption
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    await sharp(file).rotate().resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(dest);
  }
  return { from: rel.split(path.sep).join('/'), to: base };
}

(async () => {
  const files = listImages(SRC);
  console.log(`${files.length} images à convertir → ${path.relative(ROOT, OUT)}`);

  const manifest = {};
  const errors = [];
  let done = 0;
  const queue = [...files];

  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const file = queue.shift();
      try {
        const { from, to } = await convert(file);
        manifest[from] = to;
      } catch (err) {
        errors.push(`${path.relative(SRC, file)} : ${err.message}`);
      }
      if (++done % 100 === 0) console.log(`  ${done}/${files.length}`);
    }
  }));

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));

  const size = dir => listImages(dir).reduce((s, f) => s + fs.statSync(f).size, 0);
  const mb = b => (b / 1024 / 1024).toFixed(0) + ' Mo';
  console.log(`\n✅ ${Object.keys(manifest).length} images converties`);
  console.log(`   Avant : ${mb(size(SRC))}  →  Après : ${mb(size(OUT))} (grandes + miniatures)`);
  if (errors.length) console.log(`❌ ${errors.length} erreur(s) :\n  ` + errors.join('\n  '));
})();
