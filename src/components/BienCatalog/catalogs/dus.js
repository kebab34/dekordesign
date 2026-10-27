import { dusData, dusCategories } from '../../../data/dusData.js';
import { fullNameSuffix } from './shared.js';

const dus = {
  data: dusData,
  categories: dusCategories,
  basePath: '/douche',
  seo: {
    title: 'Systèmes de Douche Premium — Colonnes & Parois',
    description: 'Systèmes de douche premium : colonnes, parois en verre, receveurs extra-plats. Solutions douche complètes chez DekorDesign Cannes.',
  },
  title: 'SYSTÈMES DE DOUCHE',
  colorLabel: 'COULEUR / FINITION',
  cardName: fullNameSuffix,
  cardMetaField: 'Couleur',
  crumbLabel: 'Systèmes de douche',
  backLabel: 'Retour aux systèmes de douche',
  description: 'Système de douche de qualité supérieure, conçu pour allier esthétique et performance.',
};

export default dus;
