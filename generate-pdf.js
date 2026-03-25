/**
 * Génération PDF du catalogue Dekor & Design
 * Méthode : screenshot par page → compilation pdf-lib
 * Usage   : node generate-pdf.js
 * Prérequis: npm start sur http://localhost:3000
 */

const puppeteer = require('puppeteer-core');
const { PDFDocument } = require('pdf-lib');
const fs   = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL         = 'http://localhost:3000/catalogue-carrelages.html';
const OUTPUT      = path.join(__dirname, 'public', 'catalogue-carrelages.pdf');

const PAGE_W = 1600;
const PAGE_H = 960;

// px → points PDF (72dpi)
const PTS_W = Math.round(PAGE_W * 72 / 96); // 1200 pt
const PTS_H = Math.round(PAGE_H * 72 / 96); // 720 pt

(async () => {
  console.log('Lancement de Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--force-color-profile=srgb',
      '--disable-gpu',
    ],
    protocolTimeout: 600000,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: PAGE_W, height: PAGE_H, deviceScaleFactor: 1 });

  console.log('Chargement de la page...');
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await new Promise(r => setTimeout(r, 2000));

  // Forcer le chargement de toutes les images
  console.log('Chargement des images...');
  await page.evaluate(() => {
    document.querySelectorAll('img').forEach(img => {
      img.loading = 'eager';
      const s = img.src;
      if (!img.complete || img.naturalWidth === 0) {
        img.src = ''; img.src = s;
      }
    });
  });

  // Scroll sur chaque page pour déclencher le lazy loading
  const pageCount = await page.evaluate(() =>
    document.querySelectorAll('.pg-l, .pg-p').length
  );
  console.log(`${pageCount} pages détectées — scroll en cours...`);

  for (let i = 0; i < pageCount; i++) {
    await page.evaluate(idx => {
      const pages = document.querySelectorAll('.pg-l, .pg-p');
      if (pages[idx]) pages[idx].scrollIntoView();
    }, i);
    if (i % 10 === 0) await new Promise(r => setTimeout(r, 150));
  }

  // Remonter en haut et attendre
  await page.evaluate(() => window.scrollTo(0, 0));
  console.log('Attente finale (4s)...');
  await new Promise(r => setTimeout(r, 4000));

  // Créer le PDF
  const pdfDoc = await PDFDocument.create();
  console.log('Screenshot de chaque page...');

  const handles = await page.$$('.pg-l, .pg-p');

  for (let i = 0; i < handles.length; i++) {
    if (i % 10 === 0) process.stdout.write(`  Page ${i+1}/${handles.length}...\r`);

    // Scroll vers la page pour s'assurer qu'elle est visible
    await handles[i].scrollIntoViewIfNeeded();
    await new Promise(r => setTimeout(r, 80));

    const shot = await handles[i].screenshot({ type: 'jpeg', quality: 92 });

    const jpg  = await pdfDoc.embedJpg(shot);
    const pg   = pdfDoc.addPage([PTS_W, PTS_H]);
    pg.drawImage(jpg, { x: 0, y: 0, width: PTS_W, height: PTS_H });
  }

  console.log(`\nEnregistrement du PDF...`);
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(OUTPUT, pdfBytes);

  await browser.close();
  console.log(`\n✓ PDF enregistré : ${OUTPUT}`);
  console.log(`  ${handles.length} pages — ${(pdfBytes.length / 1024 / 1024).toFixed(1)} Mo`);

})().catch(err => {
  console.error('\nErreur :', err.message);
  process.exit(1);
});
