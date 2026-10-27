/**
 * Étape post-build SEO (lancée par `npm run build`) :
 *  1. Recense toutes les pages du site à partir des données (collections, produits…)
 *  2. Écrit build/<page>/index.html : copie de index.html avec le titre, la description,
 *     l'URL canonique et l'image de partage propres à la page (lus par Google, WhatsApp,
 *     Facebook… sans exécuter le JavaScript)
 *  3. Génère build/sitemap.xml avec toutes ces pages
 *
 * Les règles SEO viennent de src/config/seo.js et src/config/seoPages.js, les mêmes que
 * celles du composant <SEO> : le HTML pré-généré et la page affichée concordent.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BUILD = path.join(ROOT, 'build');
const load = rel => import(pathToFileURL(path.join(ROOT, 'src', rel)).href);

const { SITE_URL } = await load('config/company.js');
const { PAGE_SEO } = await load('config/seoPages.js');
const seo = await load('config/seo.js');
const { collectionsData } = await load('data/collectionsData.js');
const { productsData } = await load('data/collectionsIndex.js');
const { cuisineData } = await load('data/cuisineData.js');
const { kobosData } = await load('data/kobosData.js');
const { sopranoData } = await load('data/sopranoData.js');
const { menuiserieProducts, menuiserieCategories } = await load('data/menuiserieData.js');
const { exterieurProducts, exterieurCategories } = await load('data/exterieurData.js');
const { aderkaData } = await load('data/aderkaData.js');
const catalogs = await Promise.all(['sanitaire', 'dus', 'armaturler', 'aksesuar', 'tamamlayici']
  .map(n => load(`components/BienCatalog/catalogs/${n}.js`).then(m => m.default)));

// ── 1. Inventaire des pages ────────────────────────────────────────────────────
const pages = [];
const add = (meta, priority = 0.6) => pages.push({ ...meta, priority });

for (const [canonical, meta] of Object.entries(PAGE_SEO)) {
  const legal = canonical === '/mentions-legales' || canonical === '/confidentialite';
  add({ ...meta, canonical }, canonical === '/' ? 1 : legal ? 0.2 : 0.8);
}

for (const product of productsData) {
  const collData = collectionsData[product.name];
  if (collData) add(seo.collectionSeo(product, collData), 0.7);
}

for (const catalog of catalogs) {
  if (catalog.seo) add({ ...catalog.seo, canonical: catalog.basePath }, 0.8);
  catalog.data.forEach(p => add(seo.bienProductSeo(catalog, p), 0.5));
}

cuisineData.forEach(p => add(seo.cuisineSeo(p)));
kobosData.forEach(p => add(seo.kobosSeo(p)));
sopranoData.forEach(p => add(seo.sopranoSeo(p)));
menuiserieProducts.forEach(p => add(seo.menuiserieSeo(p, menuiserieCategories.find(c => c.slug === p.mainCategory)?.name)));
exterieurProducts.forEach(p => add(seo.exterieurSeo(p, exterieurCategories.find(c => c.slug === p.mainCategory)?.name)));

const seriesNames = [...new Set(aderkaData.map(d => d.series))];
for (const name of seriesNames) {
  const slug = name.toLowerCase();
  const doors = aderkaData.filter(d => d.series === name);
  add(seo.aderkaSeriesSeo(slug, name, doors), 0.7);
  doors.forEach(d => add(seo.aderkaDoorSeo(slug, d)));
}

// Doublons éventuels : on garde la première occurrence
const seen = new Set();
const unique = pages.filter(p => !seen.has(p.canonical) && seen.add(p.canonical));

// ── 2. HTML par page ───────────────────────────────────────────────────────────
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const template = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8');
// Le HTML de CRA est minifié (commentaires supprimés) : on repère le <title> et les balises data-rh
const TITLE = /<title>[\s\S]*?<\/title>/;
const RH_TAGS = /<(?:meta|link)\s[^>]*data-rh=["']?true["']?[^>]*>/g;
if (!TITLE.test(template) || !(template.match(RH_TAGS) || []).length) {
  throw new Error('Balises SEO (<title> et data-rh) introuvables dans build/index.html');
}

const headFor = page => {
  const title = esc(seo.seoTitle(page.title));
  const desc = esc(page.description || seo.DEFAULT_DESCRIPTION);
  const url = esc(`${SITE_URL}${page.canonical}`);
  const img = esc(page.image || seo.DEFAULT_IMAGE);
  return `<title>${title}</title>`
    + `<meta data-rh="true" name="description" content="${desc}"/>`
    + `<link data-rh="true" rel="canonical" href="${url}"/>`
    + `<meta data-rh="true" property="og:url" content="${url}"/>`
    + `<meta data-rh="true" property="og:title" content="${title}"/>`
    + `<meta data-rh="true" property="og:description" content="${desc}"/>`
    + `<meta data-rh="true" property="og:image" content="${img}"/>`
    + `<meta data-rh="true" name="twitter:title" content="${title}"/>`
    + `<meta data-rh="true" name="twitter:description" content="${desc}"/>`
    + `<meta data-rh="true" name="twitter:image" content="${img}"/>`;
};

// Gabarit : on retire les balises de la page d'accueil et on laisse un point d'insertion à la place du <title>
const base = template.replace(RH_TAGS, '').replace(TITLE, '%%SEO%%');

let written = 0;
for (const page of unique) {
  const html = base.replace('%%SEO%%', () => headFor(page));
  if (page.canonical === '/') {
    fs.writeFileSync(path.join(BUILD, 'index.html'), html);
  } else {
    // Le serveur cherche le fichier sous le chemin décodé (« Yoga Wood », pas « Yoga%20Wood »)
    const dir = path.join(BUILD, ...page.canonical.split('/').filter(Boolean).map(decodeURIComponent));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
  written++;
}

// ── 3. Sitemap ─────────────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique.map(p => `  <url><loc>${esc(SITE_URL + p.canonical)}</loc><lastmod>${today}</lastmod><priority>${p.priority.toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(BUILD, 'sitemap.xml'), sitemap);

console.log(`SEO : ${written} pages pré-générées, sitemap de ${unique.length} URLs`);
