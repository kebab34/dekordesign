import { tamamlayiciData, tamamlayiciCategories } from '../../../data/tamamlayiciData.js';

// La liste /accessoires garde sa propre page (TamamlayiciPage) ; seule la page détail est générique
const tamamlayici = {
  key: 'tamamlayici', // textes affichés : i18n bien.tamamlayici.*
  data: tamamlayiciData,
  categories: tamamlayiciCategories,
  basePath: '/accessoires',
  // Description des fiches pour le SEO (le texte affiché vient de i18n bien.<key>.description)
  description: 'Accessoire de salle de bain de qualité supérieure.',
};

export default tamamlayici;
