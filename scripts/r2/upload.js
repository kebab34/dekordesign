/**
 * Envoie les fichiers vers le bucket R2. Les fichiers déjà présents avec la même taille sont ignorés,
 * on peut donc relancer le script sans tout renvoyer.
 *
 * Usage :
 *   node scripts/r2/upload.js tiles        → .r2-build/tiles/**          → tiles/…
 *   node scripts/r2/upload.js catalogues   → public/catalogue/*.pdf      → catalogues/…
 *   node scripts/r2/upload.js fiches       → public/docs/<slug>/<slug>-foy.pdf → fiches/<slug>.pdf
 */

const fs = require('fs');
const path = require('path');
const { PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { client, bucket } = require('./r2-client');

const ROOT = path.join(__dirname, '..', '..');
const CONCURRENCY = 8;
const CACHE = 'public, max-age=31536000, immutable';
const TYPES = { '.webp': 'image/webp', '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg' };

const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const full = path.join(dir, e.name);
  return e.isDirectory() ? walk(full) : [full];
});

// Construit la liste { file, key } selon la cible
const TARGETS = {
  tiles: () => {
    const base = path.join(ROOT, '.r2-build', 'tiles');
    return walk(base)
      .filter(f => f.endsWith('.webp'))
      .map(f => ({ file: f, key: 'tiles/' + path.relative(base, f).split(path.sep).join('/') }));
  },
  catalogues: () => {
    const base = path.join(ROOT, 'public', 'catalogue');
    return fs.readdirSync(base)
      .filter(n => n.endsWith('.pdf'))
      .map(n => ({ file: path.join(base, n), key: `catalogues/${n.toLowerCase()}` }));
  },
  fiches: () => {
    const base = path.join(ROOT, 'public', 'docs');
    return fs.readdirSync(base).flatMap(slug => {
      const file = path.join(base, slug, `${slug}-foy.pdf`);
      return fs.existsSync(file) ? [{ file, key: `fiches/${slug.toLowerCase()}.pdf` }] : [];
    });
  },
};

async function listExisting(prefix) {
  const existing = new Map();
  let token;
  do {
    const res = await client.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken: token }));
    (res.Contents || []).forEach(o => existing.set(o.Key, o.Size));
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return existing;
}

(async () => {
  const target = process.argv[2];
  if (!TARGETS[target]) {
    console.error(`Cible inconnue. Choix : ${Object.keys(TARGETS).join(', ')}`);
    process.exit(1);
  }

  const items = TARGETS[target]();
  const existing = await listExisting(`${items[0]?.key.split('/')[0]}/`);
  const todo = items.filter(({ file, key }) => existing.get(key) !== fs.statSync(file).size);
  const totalMb = todo.reduce((s, i) => s + fs.statSync(i.file).size, 0) / 1024 / 1024;
  console.log(`${target} : ${items.length} fichiers, ${items.length - todo.length} déjà en ligne, ${todo.length} à envoyer (${totalMb.toFixed(0)} Mo)`);

  const errors = [];
  let done = 0;
  const queue = [...todo];
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const { file, key } = queue.shift();
      try {
        await client.send(new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: fs.readFileSync(file),
          ContentType: TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
          CacheControl: CACHE,
        }));
      } catch (err) {
        errors.push(`${key} : ${err.message}`);
      }
      if (++done % 100 === 0) console.log(`  ${done}/${todo.length}`);
    }
  }));

  console.log(`✅ ${todo.length - errors.length} envoyé(s)`);
  if (errors.length) {
    console.log(`❌ ${errors.length} erreur(s) (relancer le script pour réessayer) :\n  ` + errors.slice(0, 20).join('\n  '));
    process.exit(1);
  }
})();
