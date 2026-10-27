/**
 * Remplace dans src/data les URLs d'images fournisseurs par leur copie R2
 * (d'après .r2-build/manifest-external.json, produit par mirror-external.js).
 *
 *  - URL littérale → `${ASSET_BASE}/ext/…webp`  (import de ASSET_BASE ajouté au fichier)
 *  - Cas construits dans le code, traités explicitement :
 *      aderkaData.js   makeImg(hash) + seriesCovers
 *      exterieurData.js constante B (Genius Pergola)
 *  Seules les URLs effectivement copiées sur R2 sont remplacées.
 *
 * Usage : node scripts/r2/rewrite-external-urls.js [--dry]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const DATA = path.join(ROOT, 'src', 'data');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, '.r2-build', 'manifest-external.json'), 'utf8'));
const dry = process.argv.includes('--dry');
const IMPORT = "import { ASSET_BASE } from '../config/assets.js';";
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const files = fs.readdirSync(DATA).filter(f => f.endsWith('.js'));
const report = [];

for (const f of files) {
  const file = path.join(DATA, f);
  let src = fs.readFileSync(file, 'utf8');
  let count = 0;

  // 1. Littéraux exacts
  for (const [url, key] of Object.entries(manifest)) {
    const re = new RegExp(`(['"\`])${esc(url)}\\1`, 'g');
    src = src.replace(re, () => { count++; return `\`\${ASSET_BASE}/${key}\``; });
  }

  // 2. Aderka : URLs construites à partir du hash Wix
  if (f === 'aderkaData.js') {
    const hashes = [...src.matchAll(/makeImg\(\s*['"]([^'"]+)['"]\s*\)/g)].map(m => m[1]);
    const urlOf = h => `https://static.wixstatic.com/media/${h}/v1/fill/w_500,h_897,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/door.png`;
    const missing = hashes.filter(h => !manifest[urlOf(h)]);
    if (hashes.length && !missing.length) {
      src = src.replace(/const makeImg = \(hash\) =>\s*`https:\/\/static\.wixstatic\.com[^`]*`;/,
        "const makeImg = (hash) =>\n  `${ASSET_BASE}/ext/aderka/${hash.replace(/~mv2\\.\\w+$/, '').toLowerCase()}.webp`;");
      count += hashes.length;
    } else if (missing.length) report.push(`⚠ aderkaData : ${missing.length} image(s) non copiée(s), makeImg inchangé`);
  }

  // 3. Genius Pergola : const B + `${B}/nom.ext`
  if (f === 'exterieurData.js') {
    const B = 'https://www.geniuspergola.com/img';
    const names = [...src.matchAll(/\$\{B\}\/([^`'"]+)/g)].map(m => m[1]);
    const missing = names.filter(n => !manifest[`${B}/${n}`]);
    if (names.length && !missing.length) {
      src = src.replace(`const B = '${B}';`, "const B = `${ASSET_BASE}/ext/genius`;");
      src = src.replace(/\$\{B\}\/([^`'"]+)\.(png|jpe?g|webp)/gi, (m, n) => `\${B}/${n.toLowerCase()}.webp`);
      count += names.length;
    } else if (missing.length) report.push(`⚠ exterieurData : ${missing.length} image(s) non copiée(s), B inchangé`);
  }

  if (!count) continue;
  const existingImport = src.match(/import \{([^}]*)\} from '\.\.\/config\/assets(\.js)?';/);
  if (existingImport && !/\bASSET_BASE\b/.test(existingImport[1])) {
    src = src.replace(existingImport[0], existingImport[0].replace('{', '{ ASSET_BASE,'));
  } else if (!existingImport) {
    // Après les commentaires d'en-tête
    const lines = src.split(/\r?\n/);
    const nl = src.includes('\r\n') ? '\r\n' : '\n';
    let i = 0;
    while (i < lines.length && /^\s*(\/\/|$)/.test(lines[i])) i++;
    lines.splice(i, 0, IMPORT, '');
    src = lines.join(nl);
  }
  report.unshift(`${f.padEnd(22)} ${count} image(s)`);
  if (!dry) fs.writeFileSync(file, src);
}

console.log(report.join('\n'));
// Ce qui reste chez les fournisseurs
const left = files.flatMap(f => [...fs.readFileSync(path.join(DATA, f), 'utf8')
  .matchAll(/https?:\/\/(bienseramik\.b-cdn\.net|www\.sopranomutfak\.com\/uploads|cdn\.techex\.com\.tr|www\.atolyemutfak\.com\.tr\/uploads|static\.wixstatic\.com|www\.geniuspergola\.com)[^'"`\s]*/g)]
  .map(m => `${f}: ${m[0]}`));
if (!dry) console.log(`\nImages encore chez un fournisseur : ${left.length}`), left.slice(0, 10).forEach(l => console.log('  ' + l));
