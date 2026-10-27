import { aksesuarData, aksesuarCategories } from '../../../data/aksesuarData.js';
import { fullNameSuffix } from './shared.js';

const aksesuar = {
  key: 'aksesuar', // textes affichés : i18n bien.aksesuar.*
  data: aksesuarData,
  categories: aksesuarCategories,
  basePath: '/bain-accessoires',
  seo: {
    title: 'Accessoires de Bain — Miroirs & Porte-Serviettes',
    description: 'Accessoires de salle de bain design : miroirs, porte-serviettes, distributeurs. Collections complètes pour un espace harmonieux. DekorDesign Cannes.',
  },
  colorLabel: 'colorFinish',
  cardName: fullNameSuffix,
  cardMetaField: 'Couleur',
  // Description des fiches pour le SEO (le texte affiché vient de i18n bien.<key>.description)
  description: 'Accessoire de salle de bain de qualité supérieure, alliant design et fonctionnalité.',
};

export default aksesuar;
