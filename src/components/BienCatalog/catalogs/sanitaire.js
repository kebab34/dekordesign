import { sanitaireData, sanitaireCategories } from '../../../data/sanitaireData.js';

const sanitaire = {
  key: 'sanitaire', // textes affichés : i18n bien.sanitaire.*
  data: sanitaireData,
  categories: sanitaireCategories,
  basePath: '/sanitaire',
  seo: {
    title: 'Appareils Sanitaires — Baignoires, Vasques & WC',
    description: "Gamme d'appareils sanitaires haut de gamme : baignoires, vasques, WC suspendus. Design contemporain pour votre salle de bain. DekorDesign Cannes.",
  },
  colorLabel: 'color',
  cardName: p => p.name,
  cardMetaField: 'Type',
  dense: true,
  // Description des fiches pour le SEO (le texte affiché vient de i18n bien.<key>.description)
  description: 'Produit sanitaire de qualité supérieure, alliant design contemporain et durabilité.',
};

export default sanitaire;
