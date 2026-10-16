/**
 * Remplace dans src/data les URLs d'images de tuiles (jsDelivr ou /tiles/…) par les clés R2
 * produites par convert-images.js (.r2-build/manifest-tiles.json), ex. "tiles/abella/abella-blanc".
 * La recherche ignore la casse, ce qui corrige au passage les fichiers mal nommés.
 *
 * Usage : node scripts/r2/rewrite-tile-urls.js [--dry]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, '.r2-build', 'manifest-tiles.json'), 'utf8'));
const byLower = new Map(Object.entries(manifest).map(([from, to]) => [from.toLowerCase(), to]));

const FILES = ['src/data/collectionsData.js', 'src/data/content.js'];
const PATTERN = /(['"])(?:https:\/\/cdn\.jsdelivr\.net\/gh\/kebab34\/dekordesign@main\/public)?\/tiles\/([^'"]+)\1/g;
const dry = process.argv.includes('--dry');

const missing = new Set();
let total = 0;

for (const rel of FILES) {
  const file = path.join(ROOT, rel);
  const src = fs.readFileSync(file, 'utf8');
  let count = 0;
  const out = src.replace(PATTERN, (match, q, tilePath) => {
    const key = byLower.get(decodeURIComponent(tilePath).toLowerCase());
    if (!key) { missing.add(tilePath); return `${q}${q}`; } // image absente → vide, l'interface affiche son repli
    count++;
    return `${q}tiles/${key}${q}`;
  });
  total += count;
  console.log(`${rel} : ${count} URL(s) réécrite(s)`);
  if (!dry) fs.writeFileSync(file, out);
}

console.log(`\nTotal : ${total}`);
if (missing.size) console.log(`⚠ ${missing.size} image(s) introuvable(s), lien vidé :\n  ` + [...missing].join('\n  '));
