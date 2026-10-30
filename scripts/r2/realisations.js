/**
 * Prépare les photos d'une réalisation : realisations/<slug>/*.jpg|png|webp (racine du projet)
 * → WebP 1600 px + miniature 600 px → R2 sous realisations/<slug>/<nom>(-sm).webp
 * puis affiche les clés à copier dans src/data/realisations.js.
 *
 * La photo de couverture doit s'appeler cover.* ; les autres sont triées par nom.
 * Usage : node scripts/r2/realisations.js <slug>
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { client, bucket } = require('./r2-client');

const slug = process.argv[2];
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage : node scripts/r2/realisations.js <slug>   (minuscules, chiffres et tirets)');
  process.exit(1);
}

const SRC = path.join(__dirname, '..', '..', 'realisations', slug);
if (!fs.existsSync(SRC)) {
  console.error(`Dossier introuvable : ${SRC}`);
  process.exit(1);
}

const SIZES = [
  { suffix: '',    width: 1600, quality: 82 },
  { suffix: '-sm', width: 600,  quality: 75 },
];
const keyName = file => path.parse(file).name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

(async () => {
  const files = fs.readdirSync(SRC).filter(f => /\.(jpe?g|png|webp|heic)$/i.test(f)).sort();
  if (!files.some(f => keyName(f) === 'cover')) {
    console.error('Il manque la photo de couverture (cover.jpg).');
    process.exit(1);
  }

  const keys = [];
  for (const file of files) {
    const base = `realisations/${slug}/${keyName(file)}`;
    for (const { suffix, width, quality } of SIZES) {
      const body = await sharp(path.join(SRC, file)).rotate()
        .resize({ width, withoutEnlargement: true }).webp({ quality }).toBuffer();
      await client.send(new PutObjectCommand({
        Bucket: bucket, Key: `${base}${suffix}.webp`, Body: body,
        ContentType: 'image/webp', CacheControl: 'public, max-age=31536000, immutable',
      }));
    }
    keys.push(base);
    console.log(`  ✅ ${file} → ${base}`);
  }

  const cover = keys.find(k => k.endsWith('/cover'));
  console.log('\nÀ copier dans src/data/realisations.js :');
  console.log(`  cover: '${cover}',`);
  console.log(`  images: [${keys.filter(k => k !== cover).map(k => `'${k}'`).join(', ')}],`);
})();
