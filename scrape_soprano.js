/**
 * Scrape les cuisines depuis sopranomutfak.com
 * Usage: node scrape_soprano.js
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'https://www.sopranomutfak.com';

const MODELS = [
  { slug: 'skyline',      name: 'Skyline' },
  { slug: 'neo-plus',     name: 'Neo Plus' },
  { slug: 'natura-elite', name: 'Natura Elite' },
  { slug: 'frame-slim',   name: 'Frame Slim' },
  { slug: 'soft',         name: 'Soft' },
  { slug: 'frame',        name: 'Frame' },
  { slug: 'sawoy',        name: 'Sawoy' },
  { slug: 'natura',       name: 'Natura' },
  { slug: 'legend',       name: 'Legend' },
  { slug: 'joy',          name: 'Joy' },
  { slug: 'grace',        name: 'Grace' },
  { slug: 'balance',      name: 'Balance' },
  { slug: 'neo',          name: 'Neo' },
  { slug: 'infinity-s',   name: 'Infinity S' },
  { slug: 'infinity-a',   name: 'Infinity A' },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    protocolTimeout: 60000,
  });

  const results = [];

  for (const model of MODELS) {
    const url = `${BASE}/mutfak/${model.slug}`;
    console.log(`Scraping: ${model.name} — ${url}`);

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1400, height: 900 });
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000));

      const data = await page.evaluate((modelName, modelSlug, baseUrl) => {
        // ── Images ──────────────────────────────────────────────
        const images = [];
        const seen = new Set();

        const addImg = (src) => {
          if (!src) return;
          // Normaliser l'URL
          try { src = new URL(src, baseUrl).href; } catch(e) { return; }
          if (seen.has(src)) return;
          if (src.includes('logo') || src.includes('icon') || src.includes('favicon')) return;
          if (!src.match(/\.(jpg|jpeg|png|webp)/i)) return;
          // Exclure les très petites images (swatches)
          seen.add(src);
          images.push(src);
        };

        // Images dans les sliders/galleries
        document.querySelectorAll(
          '.swiper-slide img, .slider img, .gallery img, .product-image img, ' +
          '[class*="hero"] img, [class*="banner"] img, [class*="main"] img, ' +
          '[class*="photo"] img, [class*="img"] img, img[src*="mutfak"], img[src*="kitchen"]'
        ).forEach(img => {
          addImg(img.src || img.dataset.src || img.dataset.lazySrc);
        });

        // Fallback: toutes les images du body
        if (images.length < 2) {
          document.querySelectorAll('img').forEach(img => {
            addImg(img.src || img.dataset.src);
          });
        }

        // ── Description ─────────────────────────────────────────
        let description = '';
        const descSelectors = [
          '.product-description', '.description', '[class*="desc"]',
          '.detail p', '.content p', 'section p', 'article p'
        ];
        for (const sel of descSelectors) {
          const el = document.querySelector(sel);
          if (el) {
            const txt = el.textContent.trim();
            if (txt.length > 60 && !txt.includes('@') && !txt.includes('©')) {
              description = txt;
              break;
            }
          }
        }
        if (!description) {
          document.querySelectorAll('p').forEach(p => {
            const txt = p.textContent.trim();
            if (!description && txt.length > 60 && !txt.includes('@') && !txt.includes('©') && !txt.includes('cookie')) {
              description = txt;
            }
          });
        }

        // ── Couleurs ─────────────────────────────────────────────
        const colors = [];
        // Chercher les swatches / étiquettes de couleur
        document.querySelectorAll(
          '[class*="color"] [class*="name"], [class*="renk"] span, ' +
          '[class*="swatch"] span, [class*="finish"] span, ' +
          '.color-name, .renk-adi, [class*="color-label"]'
        ).forEach(el => {
          const txt = el.textContent.trim();
          if (txt && txt.length < 40 && !txt.toLowerCase().includes('renk')) colors.push(txt);
        });

        // Chercher dans le texte les couleurs listées
        const allText = document.body.innerText;
        if (colors.length === 0) {
          const colorKeywords = [
            'Bianco', 'Black', 'Golden Beige', 'Java', 'Pearl Beige', 'Platin',
            'Smoke Grey', 'Snow Cream', 'Star Grey', 'Stone Grey', 'Vega',
            'White', 'Anthracite', 'Oak', 'Walnut', 'Cream', 'Grey', 'Beige',
            'Matt', 'Glossy', 'Natural'
          ];
          colorKeywords.forEach(kw => {
            if (allText.includes(kw) && !colors.includes(kw)) colors.push(kw);
          });
        }

        // ── Style ───────────────────────────────────────────────
        let style = 'Moderne';
        const allTextLow = allText.toLowerCase();
        if (allTextLow.includes('klasik') || allTextLow.includes('classic')) style = 'Classique';
        else if (allTextLow.includes('natura') || allTextLow.includes('wood') || allTextLow.includes('ahşap')) style = 'Naturel';
        else if (allTextLow.includes('slim') || allTextLow.includes('minimal')) style = 'Contemporain';

        return {
          name: modelName,
          slug: modelSlug,
          images: images.slice(0, 10),
          description: description.substring(0, 400),
          colors: [...new Set(colors)].slice(0, 15),
          style,
        };
      }, model.name, model.slug, BASE);

      console.log(`  ✓ ${data.images.length} images, couleurs: ${data.colors.slice(0,3).join(', ') || 'N/A'}`);
      results.push(data);
      await page.close();

    } catch (err) {
      console.log(`  ✗ ${err.message}`);
      results.push({ name: model.name, slug: model.slug, images: [], description: '', colors: [], style: 'Moderne' });
    }
  }

  await browser.close();

  fs.writeFileSync('./soprano_raw.json', JSON.stringify(results, null, 2));
  console.log(`\n✓ ${results.filter(r => r.images.length > 0).length}/${results.length} modèles avec images`);
  console.log('✓ Données sauvegardées dans soprano_raw.json');
})().catch(console.error);
