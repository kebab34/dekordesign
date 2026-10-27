import { tamamlayiciData, tamamlayiciCategories } from '../../../data/tamamlayiciData.js';

// La liste /accessoires garde sa propre page (TamamlayiciPage) ; seule la page détail est générique
const tamamlayici = {
  data: tamamlayiciData,
  categories: tamamlayiciCategories,
  basePath: '/accessoires',
  crumbLabel: 'Accessoires salle de bain',
  backLabel: 'Retour aux accessoires',
  description: 'Accessoire de salle de bain de qualité supérieure.',
};

export default tamamlayici;
