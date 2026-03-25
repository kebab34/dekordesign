/**
 * Récupère les vraies URLs d'images depuis chaque page produit armaturler
 * Les images sont via phpThumb.php → on reconstruit l'URL CDN en .jpg
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DATA = './public/cat_preview/armaturler_products.json';

const products = JSON.parse(fs.readFileSync(DATA, 'utf8'));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    protocolTimeout: 120000,
  });

  console.log(`Récupération des images pour ${products.length} produits...`);
  let fixed = 0;

  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    process.stdout.write(`[${i+1}/${products.length}] `);

    try {
      const page = await browser.newPage();
      await page.goto(prod.href, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 500));

      const imgUrl = await page.evaluate(() => {
        // L'image produit a la classe "prd-img"
        const img = document.querySelector('img.prd-img');
        if (img && img.src) return img.src;
        return null;
      });

      if (imgUrl) {
        // phpThumb URL: cms/phpThumb.php?src=../uploads/BL11051101.jpg
        // → extraire le nom de fichier et construire l'URL CDN
        const match = imgUrl.match(/src=\.\.\/uploads\/([^&]+)/);
        if (match) {
          const filename = match[1];
          prod.image = `https://bienseramik.b-cdn.net/uploads/${filename}?width=800&height=800`;
          fixed++;
          console.log(`✓ ${filename}`);
        } else {
          // URL directe
          prod.image = imgUrl;
          fixed++;
          console.log(`✓ ${imgUrl.split('/').pop().substring(0, 40)}`);
        }
      } else {
        console.log(`✗ pas d'image prd-img`);
      }
      await page.close();
    } catch (err) {
      console.log(`✗ ${err.message.substring(0, 40)}`);
    }

    if (i % 20 === 19) await new Promise(r => setTimeout(r, 300));
  }

  await browser.close();

  fs.writeFileSync(DATA, JSON.stringify(products, null, 2));
  console.log(`\n✓ ${fixed}/${products.length} images récupérées`);
  console.log('Exemple:', products[0].image);
})().catch(console.error);
