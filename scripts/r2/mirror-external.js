/**
 * Copie sur R2 les images hébergées chez les fournisseurs (liste produite par collect-external.mjs) :
 * téléchargement → WebP 1200 px max → R2 sous ext/<fournisseur>/<nom>.webp
 *
 * Résultat : .r2-build/manifest-external.json  { urlOrigine: "ext/…/nom.webp" }
 * Les images déjà copiées sont ignorées ; en cas d'échec l'URL d'origine est conservée.
 *
 * Usage : node scripts/r2/mirror-external.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { client, bucket } = require('./r2-client');

const ROOT = path.join(__dirname, '..', '..');
const LIST = path.join(ROOT, '.r2-build', 'external-urls.json');
const MANIFEST = path.join(ROOT, '.r2-build', 'manifest-external.json');
const CONCURRENCY = 4;

// Nom de fichier stable déduit de l'URL, par fournisseur
const RULES = {
  'bienseramik.b-cdn.net':   u => ['bienseramik', path.parse(u.pathname).name],
  'www.sopranomutfak.com':   u => ['soprano',     path.parse(u.pathname).name],
  'cdn.techex.com.tr':       u => ['kobos',       path.parse(u.pathname).name],
  'www.atolyemutfak.com.tr': u => ['atolye',      path.parse(u.pathname).name],
  'www.geniuspergola.com':   u => ['genius',      path.parse(u.pathname).name],
  'static.wixstatic.com':    u => ['aderka',      u.pathname.split('/')[2].replace(/~mv2\.\w+$/, '')],
};

const keyFor = url => {
  const u = new URL(url);
  const rule = RULES[u.host];
  if (!rule) throw new Error(`Hôte non géré : ${u.host}`);
  const [dir, name] = rule(u);
  return `ext/${dir}/${name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-')}.webp`;
};

async function listExisting() {
  const keys = new Set();
  let token;
  do {
    const res = await client.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: 'ext/', ContinuationToken: token }));
    (res.Contents || []).forEach(o => keys.add(o.Key));
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return keys;
}

(async () => {
  const urls = Object.keys(JSON.parse(fs.readFileSync(LIST, 'utf8')));
  const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};

  // Deux URLs différentes ne doivent jamais viser la même clé
  const owners = {};
  for (const url of urls) {
    const key = keyFor(url);
    if (owners[key] && owners[key] !== url) throw new Error(`Collision de nom : ${key}\n  ${owners[key]}\n  ${url}`);
    owners[key] = url;
  }

  const existing = await listExisting();
  const todo = urls.filter(u => !existing.has(keyFor(u)));
  urls.filter(u => existing.has(keyFor(u))).forEach(u => { manifest[u] = keyFor(u); });
  console.log(`${urls.length} images, ${urls.length - todo.length} déjà sur R2, ${todo.length} à copier`);

  const errors = [];
  let done = 0, before = 0, after = 0;
  const queue = [...todo];
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const url = queue.shift();
      const key = keyFor(url);
      try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (DekorDesign asset mirror)' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const input = Buffer.from(await res.arrayBuffer());
        const body = await sharp(input).rotate().resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 }).toBuffer();
        await client.send(new PutObjectCommand({
          Bucket: bucket, Key: key, Body: body,
          ContentType: 'image/webp', CacheControl: 'public, max-age=31536000, immutable',
        }));
        manifest[url] = key;
        before += input.length; after += body.length;
      } catch (err) {
        errors.push(`${err.message}  ${url}`);
      }
      if (++done % 100 === 0) console.log(`  ${done}/${todo.length}`);
    }
  }));

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  const mb = b => (b / 1024 / 1024).toFixed(1) + ' Mo';
  console.log(`\n✅ ${todo.length - errors.length} copiée(s) — ${mb(before)} téléchargés → ${mb(after)} en WebP`);
  console.log(`   Manifest : ${Object.keys(manifest).length}/${urls.length} images disponibles sur R2`);
  if (errors.length) console.log(`❌ ${errors.length} échec(s), URL d'origine conservée :\n  ` + errors.join('\n  '));
})();
