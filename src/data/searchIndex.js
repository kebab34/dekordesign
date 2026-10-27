// Index de la recherche globale (chargé uniquement par la page /recherche).
// Chaque entrée : { group, title, subtitle, url, image, text } — `text` normalisé sert au filtrage.
import { productsData } from './collectionsIndex.js';
import { collectionsData } from './collectionsData.js';
import { sanitaireData } from './sanitaireData.js';
import { dusData } from './dusData.js';
import { armaturlerData } from './armaturlerData.js';
import { aksesuarData } from './aksesuarData.js';
import { tamamlayiciData } from './tamamlayiciData.js';
import { kobosData } from './kobosData.js';
import { sopranoData } from './sopranoData.js';
import { cuisineData } from './cuisineData.js';
import { menuiserieProducts, menuiserieCategories } from './menuiserieData.js';
import { exterieurProducts, exterieurCategories } from './exterieurData.js';
import { aderkaData } from './aderkaData.js';

// Minuscules, sans accents, ponctuation → espaces (« Grès cérame » → « gres ceramique »)
export const normalize = str => String(str || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const entry = (group, title, subtitle, url, image, ...keywords) => ({
  group, title, subtitle, url, image,
  name: normalize(title),
  text: normalize([title, subtitle, ...keywords.flat()].join(' ')),
});

const uniq = arr => [...new Set(arr.filter(Boolean))];

const collections = productsData.map(p => {
  const coll = collectionsData[p.name] || {};
  const products = coll.products || [];
  return entry('tiles', p.name, p.categories.join(' · '), `/collection/${encodeURIComponent(p.name)}`, p.image,
    'carrelage', p.material, p.categories, coll.commonSpecs?.design, coll.commonSpecs?.finition,
    uniq(products.map(x => x.color)), uniq(products.map(x => x.size)), uniq(products.map(x => x.surface)));
});

const bien = (data, basePath, family) => data.map(p => entry('bathroom', p.name, `${p.category} · ${family}`, `${basePath}/${p.id}`, p.image,
  p.fullName, p.category, p.specs?.['Série'], p.specs?.['Couleur'], p.specs?.['Type'], p.specs?.['Référence']));

export const searchIndex = [
  ...collections,
  ...bien(sanitaireData, '/sanitaire', 'Sanitaire'),
  ...bien(armaturlerData, '/armaturler', 'Robinetterie'),
  ...bien(dusData, '/douche', 'Douche'),
  ...bien(aksesuarData, '/bain-accessoires', 'Accessoires de bain'),
  ...bien(tamamlayiciData, '/accessoires', 'Produits complémentaires'),
  ...kobosData.map(p => entry('bathroom', p.name, 'Meuble de salle de bain · Kobos', `/meubles/${p.slug}`, p.image,
    'meuble salle de bain vasque', p.colors, p.dimensions, p.category)),
  ...cuisineData.map(p => entry('kitchens', p.name, `${p.category} · Atölye Mutfak`, `/cuisines/${p.id}`, p.image,
    'cuisine', Object.values(p.specs || {}))),
  ...sopranoData.map(p => entry('kitchens', p.name, `${p.style} · Soprano`, `/cuisines-soprano/${p.slug}`, p.image,
    'cuisine', p.colors, p.category)),
  ...menuiserieProducts.map(p => {
    const cat = menuiserieCategories.find(c => c.slug === p.mainCategory)?.name;
    return entry('joinery', p.name, cat, `/menuiserie/${p.id}`, p.image, 'menuiserie', p.subCategory);
  }),
  ...exterieurProducts.map(p => {
    const cat = exterieurCategories.find(c => c.slug === p.mainCategory)?.name;
    return entry('joinery', p.name, cat, `/exterieur/${p.id}`, p.image, 'exterieur terrasse');
  }),
  ...aderkaData.map(d => entry('joinery', d.name, `Porte pivot Aderka · ${d.series}`, `/portes-pivot/${d.series.toLowerCase()}/${d.slug}`, d.image,
    'porte pivot entree aluminium', d.series)),
];

// Tous les mots de la requête doivent être présents ; les titres qui commencent par la requête passent devant
export const search = (query, limit = 300) => {
  const q = normalize(query);
  if (q.length < 2) return [];
  const words = q.split(' ');
  return searchIndex
    .filter(e => words.every(w => e.text.includes(w)))
    .map(e => ({ e, score: (e.name.startsWith(q) ? 3 : 0) + (e.name.includes(q) ? 2 : 0) + (words.every(w => e.name.includes(w)) ? 1 : 0) }))
    .sort((a, b) => b.score - a.score || a.e.title.localeCompare(b.e.title))
    .slice(0, limit)
    .map(r => r.e);
};
