/**
 * Client Cloudflare R2 (API compatible S3) partagé par les scripts d'upload.
 * Lit les identifiants dans .env.r2 à la racine du projet (fichier ignoré par git).
 */

const fs = require('fs');
const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3');

const ENV_FILE = path.join(__dirname, '..', '..', '.env.r2');

function loadEnv() {
  if (!fs.existsSync(ENV_FILE)) throw new Error(`Fichier introuvable : ${ENV_FILE}`);
  const env = {};
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(R2_[A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  for (const key of ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET']) {
    if (!env[key]) throw new Error(`${key} manquant dans .env.r2`);
  }
  return env;
}

const env = loadEnv();

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

module.exports = { client, bucket: env.R2_BUCKET };
