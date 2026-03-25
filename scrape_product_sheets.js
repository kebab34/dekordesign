/**
 * Scrape les liens "ürün föyü" (fiches produit PDF) depuis chaque page Bien Seramik
 * Usage: node scrape_product_sheets.js
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME  = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const INPUT   = './public/cat_preview/banyo_details.json';
const OUTPUT  = './public/cat_preview/banyo_details.json'; // on enrichit le même fichier

const products = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--ignore-certificate-errors'],
    protocolTimeout: 120000,
  });

  // D'abord, inspecter la première page pour voir la structure
  console.log('=== INSPECTION DE LA PREMIÈRE PAGE ===');
  const page = await browser.newPage();
  await page.goto(products[0].href, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  const debug = await page.evaluate(() => {
    const result = {
      allLinks: [],
      allButtons: [],
      downloadArea: '',
    };

    // Tous les liens avec href contenant pdf, download, foy, brochure, etc.
    document.querySelectorAll('a').forEach(a => {
      const href = a.href || '';
      const text = a.textContent.trim().substring(0, 80);
      const cls = a.className || '';
      if (
        href.includes('pdf') || href.includes('download') ||
        href.includes('foy') || href.includes('brochure') ||
        text.toLowerCase().includes('foy') || text.toLowerCase().includes('pdf') ||
        text.toLowerCase().includes('indir') || text.toLowerCase().includes('download') ||
        cls.includes('download') || cls.includes('foy')
      ) {
        result.allLinks.push({ href, text, cls });
      }
    });

    // Boutons avec texte pertinent
    document.querySelectorAll('button, [role="button"]').forEach(b => {
      const text = b.textContent.trim().substring(0, 80);
      if (
        text.toLowerCase().includes('foy') || text.toLowerCase().includes('pdf') ||
        text.toLowerCase().includes('indir') || text.toLowerCase().includes('download')
      ) {
        result.allButtons.push({ text, cls: b.className });
      }
    });

    // Zone téléchargement possible
    const dlZone = document.querySelector(
      '[class*="download"], [class*="foy"], [class*="dokuman"], [class*="document"], ' +
      '[class*="brochure"], [id*="download"], [id*="foy"]'
    );
    if (dlZone) result.downloadArea = dlZone.innerHTML.substring(0, 500);

    // Aussi chercher dans le HTML brut
    const bodyText = document.body.innerHTML;
    const pdfMatches = bodyText.match(/https?:\/\/[^\s"'<>]+\.pdf[^\s"'<>]*/gi) || [];
    result.pdfUrls = [...new Set(pdfMatches)].slice(0, 10);

    // Chercher "foy" dans les href
    const foyLinks = [...document.querySelectorAll('a[href*="foy"], a[href*="pdf"], a[href*="download"]')]
      .map(a => ({ href: a.href, text: a.textContent.trim().substring(0, 60) }));
    result.foyLinks = foyLinks.slice(0, 20);

    return result;
  });

  console.log('Liens trouvés:', JSON.stringify(debug.allLinks, null, 2));
  console.log('Boutons trouvés:', JSON.stringify(debug.allButtons, null, 2));
  console.log('PDFs dans HTML:', JSON.stringify(debug.pdfUrls, null, 2));
  console.log('Liens foy/pdf/download:', JSON.stringify(debug.foyLinks, null, 2));
  console.log('Zone DL:', debug.downloadArea.substring(0, 300));

  // Dump du HTML de la page pour analyse
  const bodySnippet = await page.evaluate(() => {
    // Chercher les sections qui mentionnent "foy" ou "ürün"
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const results = [];
    let node;
    while (node = walker.nextNode()) {
      const t = node.textContent.trim();
      if (t.toLowerCase().includes('foy') || t.toLowerCase().includes('ürün föy')) {
        const parent = node.parentElement;
        results.push({
          text: t.substring(0, 100),
          parentTag: parent.tagName,
          parentClass: parent.className,
          parentHtml: parent.outerHTML.substring(0, 200),
        });
      }
    }
    return results.slice(0, 20);
  });

  console.log('\nMentions "foy" dans le texte:', JSON.stringify(bodySnippet, null, 2));

  await page.close();
  await browser.close();
})().catch(console.error);
