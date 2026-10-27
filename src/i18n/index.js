import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './fr';
import en from './en';

// Langue mémorisée (le stockage local peut être bloqué en navigation privée)
let savedLang = 'fr';
try { savedLang = localStorage.getItem('lang') || 'fr'; } catch { /* stockage indisponible */ }

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    lng: savedLang,
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
  });

// Garde <html lang> synchronisé avec la langue affichée (lecteurs d'écran, moteurs de recherche)
document.documentElement.lang = i18n.language;
i18n.on('languageChanged', lng => { document.documentElement.lang = lng; });

export default i18n;
