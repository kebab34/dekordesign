// Réalisations (chantiers terminés) affichées sur /realisations.
// Tant que la liste est vide, la page n'apparaît ni dans le menu ni dans le sitemap.
//
// Ajouter un projet :
//   1. Mettre les photos dans realisations/<slug>/ à la racine du projet (dossier ignoré par git),
//      la photo de couverture nommée cover.jpg (ou .png)
//   2. node scripts/r2/realisations.js <slug>   → convertit en WebP, envoie sur R2 et affiche les clés
//   3. Ajouter l'entrée ci-dessous avec ces clés
//
// Format d'une entrée :
// {
//   slug: 'salle-de-bain-cannes-californie',        // adresse : /realisations/<slug>
//   title: 'Salle de bain en marbre — Cannes',
//   city: 'Cannes',
//   date: '2026-09',                                 // AAAA-MM
//   category: 'bathroom',                            // bathroom | kitchen | interior | exterior | joinery
//   description: 'Rénovation complète…',
//   cover: 'realisations/salle-de-bain-cannes-californie/cover',   // clé R2 sans extension
//   images: ['realisations/salle-de-bain-cannes-californie/1', …],
//   products: [                                     // facultatif : produits utilisés, liens internes
//     { label: 'Carrelage Calacatta Marmi 60x120', to: '/collection/Calacatta%20Marmi' },
//   ],
// }

export const realisations = [];

export const REALISATION_CATEGORIES = ['bathroom', 'kitchen', 'interior', 'exterior', 'joinery'];
