/**
 * Scrape les meubles de salle de bain depuis kobosbanyo.com
 * Usage: node scrape_kobos.js
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'https://www.kobosbanyo.com';

const COLLECTIONS = [
  { slug: 'zen',        name: 'Zen' },
  { slug: 'up-down',   name: 'Up Down' },
  { slug: 'serenity',  name: 'Serenity' },
  { slug: 'vanessa',   name: 'Vanessa' },
  { slug: 'santa',     name: 'Santa' },
  { slug: 'lumia',     name: 'Lumia' },
  { slug: 'gloria',    name: 'Gloria' },
  { slug: 'simple',    name: 'Simple' },
  { slug: 'noble',     name: 'Noble' },
  { slug: 'meta',      name: 'Meta' },
  { slug: 'linear',    name: 'Linear' },
  { slug: 'lignum',    name: 'Lignum' },
  { slug: 'infinity',  name: 'Infinity' },
  { slug: 'harmony',   name: 'Harmony' },
  { slug: 'pure-meta', name: 'Pure Meta' },
  { slug: 'glow',      name: 'Glow' },
  { slug: 'future',    name: 'Future' },
  { slug: 'eylul',     name: 'Eylül' },
  { slug: 'elegant',   name: 'Elegant' },
  { slug: 'bella',     name: 'Bella' },
  { slug: 'frame',     name: 'Frame' },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    protocolTimeout: 60000,
  });

  const results = [];

  for (const col of COLLECTIONS) {
    const url = `${BASE}/urun-detay/${col.slug}`;
    console.log(`Scraping: ${col.name} — ${url}`);

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1400, height: 900 });
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1500));

      const data = await page.evaluate((colName, colSlug, baseUrl) => {
        // Images du carousel/galerie
        const images = [];
        document.querySelectorAll(
          '.product-gallery img, .swiper-slide img, .gallery img, .product-images img, .carousel img, [class*="gallery"] img, [class*="slider"] img, [class*="product"] img'
        ).forEach(img => {
          const src = img.src || img.dataset.src || img.dataset.lazySrc || '';
          if (src && !src.includes('logo') && !src.includes('icon') && !src.includes('flag') && src.length > 10) {
            if (!images.includes(src)) images.push(src);
          }
        });

        // Image principale (fallback)
        if (images.length === 0) {
          document.querySelectorAll('img').forEach(img => {
            const src = img.src || '';
            if (src && src.match(/\.(jpg|jpeg|png|webp)/i) &&
                !src.includes('logo') && !src.includes('icon') && !src.includes('flag')) {
              if (!images.includes(src)) images.push(src);
            }
          });
        }

        // Description
        let description = '';
        const descEl = document.querySelector(
          '.product-description, .description, [class*="desc"], .product-detail p, .detail-text'
        );
        if (descEl) description = descEl.textContent.trim();
        if (!description) {
          const paras = document.querySelectorAll('p');
          for (const p of paras) {
            const txt = p.textContent.trim();
            if (txt.length > 50 && !txt.includes('©')) { description = txt; break; }
          }
        }

        // Dimensions / tailles
        const dimensions = [];
        document.querySelectorAll('[class*="dimension"], [class*="size"], [class*="boyut"]').forEach(el => {
          const txt = el.textContent.trim();
          if (txt) dimensions.push(txt);
        });
        // Chercher des patterns comme "60 cm", "80 cm", "100 cm"
        const allText = document.body.innerText;
        const dimMatches = allText.match(/\b(\d{2,3})\s*cm\b/g);
        if (dimMatches) {
          dimMatches.forEach(m => {
            if (!dimensions.includes(m)) dimensions.push(m);
          });
        }

        // Couleurs / finitions
        const colors = [];
        document.querySelectorAll(
          '[class*="color"] span, [class*="finish"] span, [class*="renk"] span, .product-colors li, .color-option'
        ).forEach(el => {
          const txt = el.textContent.trim();
          if (txt && txt.length < 50) colors.push(txt);
        });
        // Chercher les noms de couleurs dans le texte
        const colorKeywords = ['Walnut', 'Carbon', 'Grey', 'White', 'Black', 'Oak', 'Beige', 'Antracit', 'Beyaz', 'Ceviz', 'Gri'];
        if (colors.length === 0) {
          colorKeywords.forEach(kw => {
            const regex = new RegExp(`[A-Za-z]+ ${kw}|${kw} [A-Za-z]+|${kw}`, 'i');
            const match = allText.match(regex);
            if (match) colors.push(match[0]);
          });
        }

        // Caractéristiques / features
        const features = [];
        document.querySelectorAll(
          '[class*="feature"] li, [class*="spec"] li, [class*="ozellik"] li, .product-features li, ul li'
        ).forEach(el => {
          const txt = el.textContent.trim();
          if (txt && txt.length > 5 && txt.length < 100) features.push(txt);
        });

        // Matériau
        let material = '';
        if (allText.includes('Melamin') || allText.includes('Melamine')) material = 'Mélamine';
        else if (allText.includes('MDF')) material = 'MDF';
        else if (allText.includes('Ahşap') || allText.includes('Wood')) material = 'Bois';

        return {
          name: colName,
          slug: colSlug,
          href: `${baseUrl}/urun-detay/${colSlug}`,
          images: images.slice(0, 8),
          description,
          dimensions: [...new Set(dimensions)].slice(0, 6),
          colors: [...new Set(colors)].slice(0, 10),
          features: [...new Set(features)].slice(0, 10),
          material,
        };
      }, col.name, col.slug, BASE);

      // Log résultat
      console.log(`  ✓ ${data.images.length} images, couleurs: ${data.colors.join(', ') || 'N/A'}`);
      results.push(data);
      await page.close();

    } catch (err) {
      console.log(`  ✗ ${err.message}`);
      results.push({ name: col.name, slug: col.slug, href: `${BASE}/urun-detay/${col.slug}`, images: [], description: '', dimensions: [], colors: [], features: [], material: '' });
    }
  }

  await browser.close();

  // Sauvegarde JSON brut
  fs.writeFileSync('./kobos_raw.json', JSON.stringify(results, null, 2));
  console.log(`\n✓ Données brutes sauvegardées dans kobos_raw.json`);
  console.log(`✓ ${results.filter(r => r.images.length > 0).length}/${results.length} collections avec images`);
})().catch(console.error);
