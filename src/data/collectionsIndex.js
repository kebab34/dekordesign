// Index des collections dépendant de collectionsData (≈470 Ko).
// Séparé de content.js pour que le Header et la page d'accueil ne chargent pas toute la base carrelage.
import { collectionsData } from './collectionsData.js';
import { collectionNames, collectionImages } from './content.js';
import { tileUrl } from '../config/assets.js';

// Liste des tailles disponibles (depuis les vraies données collections)
const _allSizes = Object.values(collectionsData).flatMap(c => (c.products || []).map(p => p.size)).filter(Boolean);
export const sizeOptions = [...new Set(_allSizes)].sort((a, b) => {
  const [aw, ah] = a.split('x').map(Number);
  const [bw, bh] = b.split('x').map(Number);
  return (aw * ah) - (bw * bh);
});

// Produits avec tous les attributs pour le filtrage
export const productsData = collectionNames.map((name, index) => {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const collData = Object.values(collectionsData).find(c => c.slug === slug) || {};
  const products = collData.products || [];

  // Tailles réelles depuis les produits de la collection
  const sizes = [...new Set(products.map(p => p.size).filter(Boolean))];

  // Matière depuis la surface des produits
  const surfaces = [...new Set(products.map(p => p.surface).filter(Boolean))];
  const material = surfaces.length > 0 ? surfaces[0] : 'Grès cérame';

  // Catégories depuis collectionsData
  const categories = collData.categories || [];

  return {
    id: index + 1,
    name: name,
    image: tileUrl(collectionImages[name] || 'tiles/concept/concept-render', 'sm'),
    categories: categories.length > 0 ? categories : ['Intérieur', 'Salle de Bain'],
    collection: name,
    sizes: sizes.length > 0 ? sizes : ['60x60'],
    material: material,
  };
});
