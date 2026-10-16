/**
 * Vérifie l'accès au bucket R2 : écrit, relit puis supprime un petit fichier de test.
 * Usage : node scripts/r2/test-connection.js
 */

const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { client, bucket } = require('./r2-client');

const KEY = '_test/connexion.txt';

(async () => {
  try {
    await client.send(new PutObjectCommand({ Bucket: bucket, Key: KEY, Body: 'ok', ContentType: 'text/plain' }));
    console.log('✅ Écriture');

    const res = await client.send(new GetObjectCommand({ Bucket: bucket, Key: KEY }));
    const body = await res.Body.transformToString();
    console.log(body === 'ok' ? '✅ Lecture' : `❌ Lecture : contenu inattendu "${body}"`);

    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: KEY }));
    console.log('✅ Suppression');

    const list = await client.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 5 }));
    console.log(`✅ Bucket "${bucket}" accessible — ${list.KeyCount || 0} objet(s)`);
  } catch (err) {
    console.error(`❌ ${err.name}: ${err.message}`);
    process.exit(1);
  }
})();
