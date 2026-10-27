import { dusData, dusCategories } from '../../../data/dusData.js';
import { fullNameSuffix } from './shared.js';

const dus = {
  key: 'dus', // textes affichés : i18n bien.dus.*
  data: dusData,
  categories: dusCategories,
  basePath: '/douche',
  seo: {
    title: 'Systèmes de Douche Premium — Colonnes & Parois',
    description: 'Systèmes de douche premium : colonnes, parois en verre, receveurs extra-plats. Solutions douche complètes chez DekorDesign Cannes.',
  },
  colorLabel: 'colorFinish',
  cardName: fullNameSuffix,
  cardMetaField: 'Couleur',
  // Description des fiches pour le SEO (le texte affiché vient de i18n bien.<key>.description)
  description: 'Système de douche de qualité supérieure, conçu pour allier esthétique et performance.',
};

export default dus;
