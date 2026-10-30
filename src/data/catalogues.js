import { assetUrl } from '../config/assets';
import generalCatalogueImage from '../image/catalogue/general.png';
import boisCatalogueImage from '../image/catalogue/bois.png';
import oversizeCatalogueImage from '../image/catalogue/oversize.png';
import salleDeBainCatalogueImage from '../image/catalogue/bain.png';
import muralCatalogueImage from '../image/catalogue/mur.png';

// Catalogues PDF hébergés sur R2 (catalogues/<slug>.pdf, couverture catalogues/covers/<slug>.webp).
// Nouveau catalogue : le déposer dans public/catalogue, l'ajouter à scripts/r2/catalogues-prep.py,
// lancer ce script puis `node scripts/r2/upload.js catalogues-build`, et reporter ici pages et taille.
// Noms affichés : i18n catalogues.names.<key> ; titres de groupe : catalogues.groups.<group>.
const r2 = slug => ({ pdf: assetUrl(`catalogues/${slug}.pdf`), image: assetUrl(`catalogues/covers/${slug}.webp`) });

export const catalogueGroups = [
  {
    group: 'collections2026',
    format: 'portrait',
    items: [
      { key: 'salleDeBains2026', ...r2('salle-de-bains-2026'), pages: 50, sizeMb: 15.8 },
      { key: 'solsMurs2026', ...r2('sols-murs-2026'), pages: 84, sizeMb: 19.3 },
      { key: 'cuisines2026', ...r2('cuisines-2026'), pages: 44, sizeMb: 13.2 },
      { key: 'menuiserie2026', ...r2('menuiserie-2026'), pages: 24, sizeMb: 4.7 },
      { key: 'portesEntree2026', ...r2('portes-entree-2026'), pages: 20, sizeMb: 3.6 },
      { key: 'exterieur2026', ...r2('exterieur-2026'), pages: 27, sizeMb: 4.1 },
    ],
  },
  {
    group: 'stone',
    format: 'landscape',
    items: [
      { key: 'pierreNaturelle', ...r2('pierre-naturelle'), pages: 86, sizeMb: 15.3 },
      { key: 'granit', ...r2('granit'), pages: 127, sizeMb: 13.2 },
      { key: 'exotic', ...r2('exotic-collection'), pages: 241, sizeMb: 23.1 },
      { key: 'galets', ...r2('galets'), pages: 15, sizeMb: 2.7 },
      { key: 'paysager', ...r2('amenagement-paysager'), pages: 20, sizeMb: 4.2 },
    ],
  },
  {
    group: 'tiles',
    format: 'portrait',
    items: [
      { key: 'general', image: generalCatalogueImage, pdf: assetUrl('catalogues/genel-katalog.pdf'), pages: 143, sizeMb: 97.6 },
      { key: 'bois', image: boisCatalogueImage, pdf: assetUrl('catalogues/ahsap-katalogu.pdf'), pages: 16, sizeMb: 1.2 },
      { key: 'oversize', image: oversizeCatalogueImage, pdf: assetUrl('catalogues/oversize-katalogu.pdf'), pages: 44, sizeMb: 26.7 },
      { key: 'bain', image: salleDeBainCatalogueImage, pdf: assetUrl('catalogues/banyo-katalogu.pdf'), pages: 121, sizeMb: 40.8 },
      { key: 'mural', image: muralCatalogueImage, pdf: assetUrl('catalogues/duvar-katalogu.pdf'), pages: 87, sizeMb: 38.6 },
    ],
  },
];
