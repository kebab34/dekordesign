const puppeteer = require('puppeteer-core');
const fs = require('fs');

const collections = [
  'Abella','Adel','Adela','Adonis','Adria','Agrilion','Agusta','Alba','Albero','Alboran',
  'Aldonsa','Alin','Altus','Alyssa','Amethist','Antares','Antiasit','Antibes','Anticatto',
  'Antique Carrara','Aqua Marin','Arch','Arcides','Arcos','Aren','Aristo','Arno',
  'Artanes Oxide','Assos','Astoria','Atelier','Atlantik','Avanos','Belgium Stone','Belita',
  'Bellatrix','Bengal','Beton','Black Star','Boho','Bona Dea','Bond','Bosco','Brano',
  'Bravas','Brillo','Buxy','Calacatta Marmi','Camouflage','Capella','Cappadocia','Carbon',
  'Casta','Catalpa','Chakra','Charlotte','Charm','Chester','Cleopatra','Clio','Concept',
  'Coper','Country','Crag','Crotone','Darkness','Delbin','Destiny','Dina','Diva','Dora',
  'Dove','Elan','Eleganza','Elitra','Elora','Enzo','Epona','Estel','Europe','Everest',
  'Fair','Famous','Fenix','Flevo','Fortuna','Fraxinus','Fresno','Fuji','Gaudi','Gemma',
  'Geo Wood','Gordion','Grace','Grand','Grassland','Greta','Hampton','Harley','Helen',
  'Helios','Herringwood','Himalaya','Hormigon Molde','Hypnos','Imperial','Inca','Iroko',
  'Joya','Juno','Kaleidos','Kallos','Kapteyn','Karsos','Klein','La Vita','Lamuna',
  'Larimar Ocean','Larix','Las Palmas','Lefke','Limra','Lisbon','Logs','Loreto','Loris',
  'Luca','Madero','Madran','Magellan','Magnifique','Manhattan','Marmol','Marvel','Marvy',
  'Maryo','Maxi','Merlo','Mia','Milenario','Minimo','Miramar','Miranda','Mirko','Modellato',
  'Mood','Mora','Motto','Mystone','Naos','Napoli','Natura Wood','Neva','Nevada','New Metro',
  'Newport','Nile','Nomerles','Norden','Nuvola','Oasis','Odin','Olbia','Olivia','Olmo',
  'Onelia','Onixia','Orfe','Orla','Palazzo','Palmer','Pamfilya','Paris','Parisian','Paros',
  'Pastel','Pebble','Pera','Picasso','Piegato','Quark','Quarzt','Radiance','Regnum','Rhea',
  'Rio','Riva','Root','Rubi','Saaga','Sakura','Salamanca','Salt Cave','Sante','Sara',
  'Sarda','Saten','Sativa','Sealong','Sempre','Serpantin','Shell','Side','Silyon','Simirna',
  'Stacy','Star','Star Line','Statuario Goya','Storm Rock','Strato','Stuart','Süper Beyaz',
  'Swan','Tavas','Terra','Thanos','Tiana','Tiffany','Tiger','Tsuga','Turin','Twist',
  'Urban','Vales','Valor','Vedra Grafit','Venis','Venüs','Verona','Vigo','Vintage',
  'Violeta','Vitray','Void','Volare','Walter','Wario','White Star','Windy','Yoga Wood',
  'Yuta','Zenith','Zigana'
];

function toSlug(name) {
  return name.toLowerCase()
    .replace(/ü/g,'u').replace(/ö/g,'o').replace(/ş/g,'s').replace(/ç/g,'c')
    .replace(/ğ/g,'g').replace(/ı/g,'i').replace(/İ/g,'i')
    .replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
}

async function scrapeCollection(page, name) {
  const slug = toSlug(name);
  const url = `https://www.bienseramik.com.tr/karolar/banyo-karolari/${slug}`;
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 800));

    const img = await page.evaluate(() => {
      // Main collection image — the big one at top (not logo, not thumbnail with ?width=)
      const imgs = Array.from(document.querySelectorAll('img'));
      const cdn = imgs.filter(i =>
        i.src.includes('bienseramik.b-cdn.net/uploads') &&
        !i.src.includes('logo') &&
        !i.src.includes('?width=') &&
        !i.src.includes('ana-kategori') &&
        !i.src.includes('banyo-aksesuarlari')
      );
      return cdn.length > 0 ? cdn[0].src : null;
    });

    return { name, slug, url, img };
  } catch(e) {
    return { name, slug, url, img: null, error: e.message };
  }
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    headless: true
  });

  const results = [];
  const CONCURRENCY = 4;

  for (let i = 0; i < collections.length; i += CONCURRENCY) {
    const batch = collections.slice(i, i + CONCURRENCY);
    const pages = await Promise.all(batch.map(() => browser.newPage()));

    const batchResults = await Promise.all(
      batch.map((name, j) => scrapeCollection(pages[j], name))
    );

    await Promise.all(pages.map(p => p.close()));
    results.push(...batchResults);

    const done = Math.min(i + CONCURRENCY, collections.length);
    process.stderr.write(`\r${done}/${collections.length} collections...`);
  }

  process.stderr.write('\n');
  await browser.close();

  fs.writeFileSync('collection_images_result.json', JSON.stringify(results, null, 2));
  console.log('Saved to collection_images_result.json');

  // Print mismatches vs current content.js
  console.log('\n=== RESULTS ===');
  results.forEach(r => {
    if (!r.img) console.log(`[MISSING] ${r.name} → no image found`);
    else console.log(`[OK] ${r.name} → ${r.img}`);
  });
})().catch(console.error);
