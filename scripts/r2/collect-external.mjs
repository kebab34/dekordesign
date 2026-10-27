/**
 * Exécute les fichiers de données et liste toutes les URLs d'images hébergées chez des tiers.
 * Résultat : .r2-build/external-urls.json  { url: [fichiers qui l'utilisent] }
 * Usage : node scripts/r2/collect-external.mjs
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..', '..');
const DATA = path.join(ROOT, 'src', 'data');
// Fichiers sans import relatif, exécutables tels quels par Node
const FILES = ['aderkaData', 'aksesuarData', 'armaturlerData', 'cuisineData', 'dusData', 'exterieurData',
               'kobosData', 'menuiserieData', 'sanitaireData', 'sopranoData', 'tamamlayiciData'];
const IMAGE = /\.(png|jpe?g|webp|gif|avif)(\?|$)/i;
const SKIP_HOSTS = ['images.unsplash.com']; // banque d'images, faite pour être liée directement

const found = {};
const walk = (v, file) => {
  if (typeof v === 'string') {
    if (/^https?:\/\//.test(v) && IMAGE.test(v) && !SKIP_HOSTS.includes(new URL(v).host)) (found[v] ||= new Set()).add(file);
  } else if (Array.isArray(v)) v.forEach(x => walk(x, file));
  else if (v && typeof v === 'object') Object.values(v).forEach(x => walk(x, file));
};

for (const f of FILES) {
  const mod = await import(pathToFileURL(path.join(DATA, f + '.js')).href);
  Object.values(mod).forEach(v => walk(v, f));
}
// content.js importe d'autres modules : on lit ses littéraux directement
const content = fs.readFileSync(path.join(DATA, 'content.js'), 'utf8');
for (const [, url] of content.matchAll(/['"`](https?:\/\/[^'"`]+)['"`]/g)) walk(url, 'content');

const out = Object.fromEntries(Object.entries(found).map(([u, s]) => [u, [...s]]));
fs.writeFileSync(path.join(ROOT, '.r2-build', 'external-urls.json'), JSON.stringify(out, null, 2));
const byHost = {};
Object.keys(out).forEach(u => { const h = new URL(u).host; byHost[h] = (byHost[h] || 0) + 1; });
console.log(`${Object.keys(out).length} images externes uniques`);
Object.entries(byHost).sort((a, b) => b[1] - a[1]).forEach(([h, n]) => console.log(`  ${String(n).padStart(4)}  ${h}`));
