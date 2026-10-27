// Fiche entreprise unique : Footer, Contact, mentions légales, confidentialité et données structurées
// lisent toutes ces valeurs. Un champ vide ('' ou null) n'est simplement pas affiché.

export const SITE_URL = 'https://www.dekordesign.fr';

export const company = {
  brand: 'Dekor & Design',

  // ── Identité légale (mentions légales) — À COMPLÉTER ──────────────────────
  legalName: '',          // Raison sociale exacte, ex. « DEKOR DESIGN SAS »
  legalForm: '',          // Forme juridique, ex. « SAS au capital de 10 000 € »
  siret: '',              // 14 chiffres
  rcs: '',                // ex. « RCS Cannes 123 456 789 »
  vatNumber: '',          // ex. « FR12 123456789 »
  publicationDirector: '', // Nom du directeur de la publication (souvent le gérant / président)

  // ── Coordonnées ───────────────────────────────────────────────────────────
  email: 'contact@dekordesign.fr',
  phone: '+33 9 87 59 48 58',
  phoneHref: '+33987594858',
  whatsapp: '',           // Numéro mobile au format international sans « + », ex. 33612345678
  address: {
    street: '4 Bd Etienne Astegiano',
    postalCode: '06150',
    city: 'Cannes',
    country: 'France',
  },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=4+Bd+Etienne+Astegiano+06150+Cannes',
  geo: { lat: 43.5528, lng: 7.0174 },

  // ── Horaires (page Contact + données Google) — À VÉRIFIER ─────────────────
  // Chaque jour : liste de créneaux [ouverture, fermeture] ; [] = fermé
  hours: {
    Monday:    [['09:30', '12:00'], ['14:00', '18:30']],
    Tuesday:   [['09:30', '12:00'], ['14:00', '18:30']],
    Wednesday: [['09:30', '12:00'], ['14:00', '18:30']],
    Thursday:  [['09:30', '12:00'], ['14:00', '18:30']],
    Friday:    [['09:30', '12:00'], ['14:00', '18:30']],
    Saturday:  [['09:30', '12:00'], ['14:00', '18:30']],
    Sunday:    [],
  },

  // ── Réseaux sociaux : laisser vide tant que le compte n'existe pas ────────
  social: {
    instagram: '',        // ex. https://www.instagram.com/dekordesign
    facebook: '',
    pinterest: '',
    linkedin: '',
  },

  // ── Hébergement (obligatoire dans les mentions légales) ───────────────────
  hosts: [
    { role: 'Hébergement du site', name: 'Vercel Inc.', address: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis', url: 'https://vercel.com' },
    { role: 'Hébergement des images et documents', name: 'Cloudflare, Inc.', address: '101 Townsend St, San Francisco, CA 94107, États-Unis', url: 'https://www.cloudflare.com' },
  ],
};

export const fullAddress = `${company.address.street}, ${company.address.postalCode} ${company.address.city}`;

// Lien « Demander un devis » préremplissant le formulaire de contact avec le produit
export const quoteUrl = product => `/contact?produit=${encodeURIComponent(product)}`;
