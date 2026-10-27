import { armaturlerData, armaturlerCategories } from '../../../data/armaturlerData.js';
import { fullNameSuffix } from './shared.js';

const armaturler = {
  data: armaturlerData,
  categories: armaturlerCategories,
  basePath: '/armaturler',
  seo: {
    title: 'Robinetterie de Luxe — Or Brossé, Noir Mat, Chrome',
    description: 'Robinetterie haut de gamme : mitigeurs, thermostatiques, colonnes de douche. Finitions or brossé, noir mat, chrome poli. DekorDesign Cannes.',
  },
  title: 'ROBINETTERIE & DOUCHE',
  colorLabel: 'COULEUR / FINITION',
  cardName: fullNameSuffix,
  cardMetaField: 'Couleur',
  crumbLabel: 'Robinetterie & Douche',
  backLabel: 'Retour à la robinetterie',
  description: 'Robinet de qualité supérieure, conçu pour allier esthétique et performance.',
};

export default armaturler;
