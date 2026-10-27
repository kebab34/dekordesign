import { armaturlerData, armaturlerCategories } from '../../../data/armaturlerData.js';
import { fullNameSuffix } from './shared.js';

const armaturler = {
  key: 'armaturler', // textes affichés : i18n bien.armaturler.*
  data: armaturlerData,
  categories: armaturlerCategories,
  basePath: '/armaturler',
  seo: {
    title: 'Robinetterie de Luxe — Or Brossé, Noir Mat, Chrome',
    description: 'Robinetterie haut de gamme : mitigeurs, thermostatiques, colonnes de douche. Finitions or brossé, noir mat, chrome poli. DekorDesign Cannes.',
  },
  colorLabel: 'colorFinish',
  cardName: fullNameSuffix,
  cardMetaField: 'Couleur',
  // Description des fiches pour le SEO (le texte affiché vient de i18n bien.<key>.description)
  description: 'Robinet de qualité supérieure, conçu pour allier esthétique et performance.',
};

export default armaturler;
