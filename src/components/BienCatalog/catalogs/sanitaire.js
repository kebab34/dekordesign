import { sanitaireData, sanitaireCategories } from '../../../data/sanitaireData';

const sanitaire = {
  data: sanitaireData,
  categories: sanitaireCategories,
  basePath: '/sanitaire',
  seo: {
    title: 'Appareils Sanitaires — Baignoires, Vasques & WC',
    description: "Gamme d'appareils sanitaires haut de gamme : baignoires, vasques, WC suspendus. Design contemporain pour votre salle de bain. DekorDesign Cannes.",
  },
  title: 'SALLE DE BAIN',
  colorLabel: 'COULEUR',
  cardName: p => p.name,
  cardMetaField: 'Type',
  dense: true,
  crumbLabel: 'Salle de Bain',
  backLabel: 'Retour à la salle de bain',
  description: 'Produit sanitaire de qualité supérieure, alliant design contemporain et durabilité.',
};

export default sanitaire;
