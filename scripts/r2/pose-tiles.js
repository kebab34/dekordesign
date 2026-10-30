/**
 * Textures carrées pour l'animation « L'art de la pose » de l'accueil.
 * Les miniatures produit sont des carrés avec le carreau au centre et des marges unies :
 * on retire les marges (trim), on recadre au centre en carré 320 px, puis on envoie sur R2
 * sous pose/<nom>-sm.webp et on réécrit les clés de src/data/poseTiles.js.
 *
 * Source : .r2-build/tiles/ (images converties par convert-images.js)
 * Usage : node scripts/r2/pose-tiles.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { client, bucket } = require('./r2-client');

const ROOT = path.join(__dirname, '..', '..');
const DATA = path.join(ROOT, 'src', 'data', 'poseTiles.js');

(async () => {
  let src = fs.readFileSync(DATA, 'utf8');
  const keys = [...src.matchAll(/key: '(tiles\/[^']+)'/g)].map(m => m[1]);
  if (!keys.length) throw new Error('Aucune clé tiles/… dans poseTiles.js (déjà converti ?)');

  for (const key of keys) {
    const file = path.join(ROOT, '.r2-build', `${key}.webp`);
    const trimmed = await sharp(file).trim({ threshold: 12 }).toBuffer();
    const body = await sharp(trimmed)
      .resize(320, 320, { fit: 'cover', position: 'centre' })
      .webp({ quality: 82 }).toBuffer();
    const name = `pose/${key.split('/').pop()}`;
    await client.send(new PutObjectCommand({
      Bucket: bucket, Key: `${name}-sm.webp`, Body: body,
      ContentType: 'image/webp', CacheControl: 'public, max-age=31536000, immutable',
    }));
    src = src.replace(`key: '${key}'`, `key: '${name}'`);
    console.log(`  ✅ ${key} → ${name}-sm.webp (${(body.length / 1024).toFixed(0)} Ko)`);
  }

  src = src.replace(
    "// 32 carreaux réels du catalogue (miniatures R2) pour l'animation « L'art de la pose » de l'accueil.",
    "// 32 carreaux réels du catalogue pour l'animation « L'art de la pose » de l'accueil.\n// Textures carrées recadrées (marges retirées) sur R2 : pose/<nom>-sm.webp, générées par scripts/r2/pose-tiles.js.");
  fs.writeFileSync(DATA, src);
  console.log(`\n${keys.length} textures envoyées, src/data/poseTiles.js mis à jour`);
})();
