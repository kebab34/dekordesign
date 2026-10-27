// Règles SEO partagées par le composant <SEO> et par scripts/seo/build-seo.mjs
import { SITE_URL } from './company.js';
import { tileUrl } from './assets.js';

export const DEFAULT_TITLE = 'DekorDesign — Carrelage & Aménagement Intérieur Cannes';
export const DEFAULT_DESCRIPTION = 'DekorDesign, votre showroom à Cannes : carrelages, sanitaires, meubles de salle de bain, cuisines sur mesure, robinetterie, pergolas et menuiserie. 244 collections disponibles.';
export const DEFAULT_IMAGE = `${SITE_URL}/logo-dekor.png`;

export const seoTitle = title => (title ? `${title} | DekorDesign` : DEFAULT_TITLE);

// Coupe une description à la longueur affichée par Google, sans couper un mot
export const truncate = (text = '', max = 155) => {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : clean.slice(0, clean.lastIndexOf(' ', max - 1)) + '…';
};

// ── SEO des fiches produits : { title, description, canonical, image } ─────────

export const collectionSeo = (product, collData) => {
  const products = collData.products || [];
  const sizes = [...new Set(products.map(p => p.size).filter(Boolean))];
  const renderKeys = (collData.renders || []).filter(Boolean);
  const image = renderKeys.length
    ? tileUrl(renderKeys[0])
    : (tileUrl(collData.mainImage || products[0]?.thumbnail) || product.image);
  return {
    title: `Carrelage ${product.name} — Collection`,
    description: `Carrelage ${product.name} : ${products.length ? products.length + ' références' : 'collection'}`
      + `${sizes.length ? ', formats ' + sizes.slice(0, 4).join(', ') : ''}`
      + `${product.categories.length ? ', pour ' + product.categories.join(', ').toLowerCase() : ''}`
      + '. À découvrir au showroom DekorDesign à Cannes.',
    canonical: `/collection/${encodeURIComponent(product.name)}`,
    image,
  };
};

export const bienProductSeo = (catalog, p) => ({
  title: `${p.name} — ${p.category}`,
  description: `${p.fullName} — ${catalog.description}`,
  canonical: `${catalog.basePath}/${p.id}`,
  image: p.image,
});

export const cuisineSeo = p => ({
  title: `Cuisine ${p.name} — Atölye Mutfak`,
  description: truncate(p.description || `Cuisine ${p.name}, style ${p.category}. Conception sur mesure au showroom DekorDesign à Cannes.`),
  canonical: `/cuisines/${p.id}`,
  image: p.image,
});

export const kobosSeo = p => ({
  title: `Meuble de salle de bain ${p.name} — Kobos`,
  description: truncate(p.description || `Meuble de salle de bain Kobos ${p.name}.`),
  canonical: `/meubles/${p.slug}`,
  image: p.image || p.images?.[0],
});

export const sopranoSeo = p => ({
  title: `Cuisine ${p.name} — Soprano`,
  description: truncate(p.description || `Cuisine Soprano ${p.name}, style ${p.style}.`),
  canonical: `/cuisines-soprano/${p.slug}`,
  image: p.images?.[0] || p.image,
});

export const menuiserieSeo = (p, catLabel) => ({
  title: `${p.name}${catLabel ? ' — ' + catLabel : ''}`,
  description: truncate(p.description),
  canonical: `/menuiserie/${p.id}`,
  image: p.image,
});

export const exterieurSeo = (p, catLabel) => ({
  title: `${p.name}${catLabel ? ' — ' + catLabel : ''}`,
  description: truncate(p.description),
  canonical: `/exterieur/${p.id}`,
  image: p.image,
});

export const aderkaSeriesSeo = (seriesSlug, seriesName, doors) => ({
  title: `Portes pivot Aderka ${seriesName}`,
  description: `Portes pivot en aluminium Aderka — série ${seriesName} : ${doors.length} modèles sur mesure, à découvrir au showroom DekorDesign à Cannes.`,
  canonical: `/portes-pivot/${seriesSlug}`,
  image: doors[0]?.image,
});

export const aderkaDoorSeo = (seriesSlug, door) => ({
  title: `Porte pivot ${door.name} — Aderka ${door.series}`,
  description: `Porte pivot aluminium Aderka ${door.name}, série ${door.series}. Fabrication sur mesure, pose et devis par le showroom DekorDesign à Cannes.`,
  canonical: `/portes-pivot/${seriesSlug}/${door.slug}`,
  image: door.image,
});
