import { aksesuarData, aksesuarCategories } from '../../../data/aksesuarData';
import { fullNameSuffix } from './shared';

const aksesuar = {
  data: aksesuarData,
  categories: aksesuarCategories,
  basePath: '/bain-accessoires',
  seo: {
    title: 'Accessoires de Bain — Miroirs & Porte-Serviettes',
    description: 'Accessoires de salle de bain design : miroirs, porte-serviettes, distributeurs. Collections complètes pour un espace harmonieux. DekorDesign Cannes.',
  },
  title: 'ACCESSOIRES SALLE DE BAIN',
  colorLabel: 'COULEUR / FINITION',
  cardName: fullNameSuffix,
  cardMetaField: 'Couleur',
  crumbLabel: 'Accessoires Salle de Bain',
  backLabel: 'Retour aux accessoires',
  description: 'Accessoire de salle de bain de qualité supérieure, alliant design et fonctionnalité.',
};

export default aksesuar;
