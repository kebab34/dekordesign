/**
 * Scrape les images des collections de carrelage depuis Bien Seramik
 * et met à jour le mapping collectionImages dans content.js
 * Usage: node scrape_collection_images.js
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = './public/collection';
const CONTENT_FILE = './src/data/content.js';

// Collections qui ont une image d'une autre collection (à corriger)
const COLLECTIONS_NEED_FIX = [
  'Agrilion', 'Agusta', 'Alboran', 'Aldonsa', 'Altus', 'Amethist',
  'Antibes', 'Anticatto', 'Aqua Marin', 'Arch', 'Aren', 'Artanes Oxide',
  'Bond', 'Brillo', 'Buxy', 'Carbon', 'Charm', 'Clio',
  'Dina', 'Elan', 'Elora', 'Epona', 'Europe', 'Flevo',
  'Fraxinus', 'Fuji', 'Gordion', 'Hypnos', 'Inca',
  'Kaleidos', 'Kallos', 'Karsos', 'Lamuna', 'Larimar Ocean', 'Larix',
  'Lefke', 'Limra', 'Lisbon', 'Logs', 'Loris', 'Luca',
  'Madero', 'Manhattan', 'Marmol', 'Marvel', 'Marvy', 'Merlo',
  'Mirko', 'Mood', 'Mora', 'Mystone',
  'Neva', 'Nevada', 'New Metro', 'Newport', 'Nile', 'Norden', 'Nuvola',
  'Onelia', 'Onixia', 'Orla',
  'Pamfilya', 'Pebble', 'Quark', 'Quarzt', 'Radiance', 'Rhea', 'Rio', 'Riva',
  'Rubi', 'Saaga', 'Sara', 'Sarda', 'Sealong', 'Serpatin', 'Shell',
  'Silyon', 'Simirna', 'Tavas', 'Tiger', 'Tsuga',
  'Vales', 'Vedra Grafit', 'Venis', 'Venüs', 'Vitray', 'Void', 'Volare', 'Wario',
];

// Pages de catégories Bien Seramik à scraper
const CATEGORY_PAGES = [
  'https://www.bienseramik.com.tr/karolar/banyo-karolari',
  'https://www.bienseramik.com.tr/karolar/mutfak-karolari',
  'https://www.bienseramik.com.tr/karolar/yer-karolari',
  'https://www.bienseramik.com.tr/karolar/dis-mekan-karolari',
  'https://www.bienseramik.com.tr/karolar/ic-mekan-duvar-karolari',
  'https://www.bienseramik.com.tr/karolar/klinker-karolari',
];

// Normalise un nom pour la comparaison (minuscules, sans espaces/tirets)
function normalize(str) {
  return str.toLowerCase()
    .replace(/[- ]/g, '')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

// Télécharge une image depuis une URL
function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, {
      rejectUnauthorized: false,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(dest); });
      file.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.abort(); reject(new Error('Timeout')); });
  });
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    protocolTimeout: 120000,
  });

  // Map: nom normalisé → { name, imageUrl, filename }
  const found = new Map();
  const needSet = new Set(COLLECTIONS_NEED_FIX.map(n => normalize(n)));
  const needMap = new Map(COLLECTIONS_NEED_FIX.map(n => [normalize(n), n]));

  console.log(`Recherche de ${COLLECTIONS_NEED_FIX.length} collections sur ${CATEGORY_PAGES.length} pages...\n`);

  for (const catUrl of CATEGORY_PAGES) {
    console.log(`\n── ${catUrl}`);
    try {
      const page = await browser.newPage();

      // Scrape toutes les pages de pagination
      let pageNum = 1;
      while (true) {
        const url = pageNum === 1 ? catUrl : `${catUrl}?page=${pageNum}`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(r => setTimeout(r, 800));

        const cards = await page.evaluate(() => {
          const results = [];
          // Les cartes produit sont dans .card.prd ou .prd-card
          document.querySelectorAll('.card.prd, .prd-card, .product-card').forEach(card => {
            const link = card.querySelector('a[href]');
            const img = card.querySelector('img');
            const titleEl = card.querySelector('.prd-name, .card-title, h3, .name');
            if (link && img) {
              const name = titleEl ? titleEl.textContent.trim() : (img.alt || '');
              let src = img.dataset.src || img.src || '';
              // Reconstruire l'URL CDN si c'est un phpThumb
              const match = src.match(/src=\.\.\/uploads\/([^&]+)/);
              if (match) {
                src = `https://bienseramik.b-cdn.net/uploads/${match[1]}?width=800&height=800`;
              }
              results.push({ name, src, href: link.href });
            }
          });
          return results;
        });

        if (cards.length === 0) break;

        let newFound = 0;
        for (const card of cards) {
          // Extrait le nom de collection (premier mot du titre généralement)
          const parts = card.name.split(/[\s-]+/);
          // Teste plusieurs variantes du nom
          const candidates = [
            normalize(card.name),
            normalize(parts[0]),
            normalize(parts.slice(0, 2).join('')),
          ];
          for (const cand of candidates) {
            if (needSet.has(cand) && !found.has(cand)) {
              const originalName = needMap.get(cand);
              found.set(cand, { name: originalName, imageUrl: card.src, href: card.href });
              console.log(`  ✓ ${originalName} → ${card.src.substring(0, 60)}...`);
              newFound++;
              break;
            }
          }
        }

        // Vérifie s'il y a une page suivante
        const hasNext = await page.evaluate(() => {
          const next = document.querySelector('.pagination .next:not(.disabled), a[rel="next"]');
          return !!next;
        });
        if (!hasNext) break;
        pageNum++;
      }

      await page.close();
    } catch (err) {
      console.log(`  ✗ ${err.message.substring(0, 60)}`);
    }
  }

  await browser.close();

  console.log(`\n── ${found.size}/${COLLECTIONS_NEED_FIX.length} collections trouvées`);

  // Télécharge les images et construit le mapping mis à jour
  const newMappings = {};
  let downloaded = 0;

  for (const [norm, info] of found) {
    if (!info.imageUrl || info.imageUrl.includes('placeholder')) continue;
    // Nom de fichier basé sur le nom de la collection
    const ext = info.imageUrl.match(/\.(png|jpg|jpeg|webp)/i)?.[1] || 'jpg';
    const filename = `${info.name.toUpperCase()}.${ext}`;
    const dest = path.join(OUTPUT_DIR, filename);

    process.stdout.write(`Téléchargement: ${info.name}... `);
    try {
      await downloadImage(info.imageUrl, dest);
      newMappings[info.name] = `/collection/${filename}`;
      console.log(`✓`);
      downloaded++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
    }
  }

  // Collections non trouvées
  const notFound = COLLECTIONS_NEED_FIX.filter(n => !found.has(normalize(n)));
  if (notFound.length > 0) {
    console.log(`\n── Non trouvées (${notFound.length}) :`);
    notFound.forEach(n => console.log(`  - ${n}`));
  }

  // Affiche le mapping à mettre à jour dans content.js
  if (Object.keys(newMappings).length > 0) {
    console.log('\n── Mettez à jour ces lignes dans collectionImages (content.js) :');
    Object.entries(newMappings).sort().forEach(([name, img]) => {
      console.log(`  '${name}': '${img}',`);
    });

    // Sauvegarde dans un fichier de patch
    const patch = Object.entries(newMappings)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, img]) => `  '${name}': '${img}',`)
      .join('\n');
    fs.writeFileSync('./collection_images_patch.txt', patch);
    console.log('\n✓ Patch sauvegardé dans collection_images_patch.txt');
  }

  console.log(`\n✓ ${downloaded} images téléchargées`);
})().catch(console.error);
