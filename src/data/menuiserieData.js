const M = '/images/menuiserie';

// Real product images from mikapen.net (hosted locally to avoid hotlink block)
// — Portes PVC
const PVC_PORTE_70   = `${M}/porte-70mm.jpg`;
const PVC_PORTE_85   = `${M}/porte-85mm.jpg`;
// — Fenêtres PVC
const FEN_2000       = `${M}/fenetre-2000.png`;
const FEN_4000       = `${M}/fenetre-4000.png`;
const FEN_4000_MONO  = `${M}/fenetre-4000-mono.jpg`;
const FEN_4000_RENO  = `${M}/fenetre-4000-reno.jpg`;
const FEN_7000       = `${M}/fenetre-7000.jpeg`;
const FEN_8000_NL    = `${M}/fenetre-8000-nl.jpeg`;
// — Coulissants PVC
const COL_MULTI      = `${M}/coulissant-multi-slide.png`;
const COL_SMART      = `${M}/coulissant-smart-slide.jpeg`;
const COL_LEVANT     = `${M}/coulissant-levant.png`;
const COL_IDEAL4000  = `${M}/coulissant-ideal4000.jpg`;

const ALU_CS77       = `${M}/alu-fen-produit.png`;   // fenêtre produit (contain)
const ALU_CS77_TILT  = `${M}/alu-porte-produit.jpg`;  // porte scène (cover)
const ALU_CS77_SLIDE = `${M}/alu-col-big-doors.jpg`;  // coulissant scène (cover)

const VOLET_MONO     = `${M}/volet-monoblock.jpeg`;
const VOLET_APPLIQUE = `${M}/volet-monoblock.jpeg`;  // image applique indisponible sur serveur
const VOLET_COFFRE   = `${M}/volet-coffre.jpeg`;
const VOLET_LINTEAU  = `${M}/volet-demi-linteau.jpeg`;

const GUILLOTINE     = `${M}/guillotine.jpg`;

const GARAGE_SECT    = `${M}/garage-sectionnel.jpeg`;
const GARAGE_ENROUL  = `${M}/garage-enroulable.jpeg`;

const MOUST_PLISSE   = `${M}/moustiquaire-plisse.jpeg`;
const MOUST_STORE    = `${M}/moustiquaire-store.jpeg`;

const VERRE_CLASSIQUE  = `${M}/verre-isicam.jpeg`;    // double vitrage
const VERRE_FEUILLETE  = `${M}/verre-lamine.jpeg`;    // verre feuilleté
const VERRE_TREMPE     = `${M}/verre-trempe.jpeg`;    // verre trempé
const VERRE_SOLAIRE    = `${M}/verre-lowe.jpeg`;      // contrôle solaire / Low-E
const VERRE_DECORATIF  = `${M}/verre-reflekte.jpeg`;  // réfléchissant / décoratif
const VERRE_ANTI       = `${M}/solutions-verre.png`;  // acoustique / anti-effraction

// Portes d'entrée — 52 modèles avec images produit réelles
// image N → entree-N.jpg, nom basé sur codes mikapen.net
const DOOR_DATA = [
  { n:  1, code: '1210'  },
  { n:  2, code: '1351'  },
  { n:  3, code: '1831'  },
  { n:  4, code: '1829'  },
  { n:  5, code: '9030'  },
  { n:  6, code: '9040'  },
  { n:  7, code: '8011'  },
  { n:  8, code: '8013'  },
  { n:  9, code: 'S-9060'},
  { n: 10, code: 'X-4010'},
  { n: 11, code: 'X-4015'},
  { n: 12, code: 'X-4030'},
  { n: 13, code: '3611'  },
  { n: 14, code: 'S-3910'},
  { n: 15, code: 'S-4010'},
  { n: 16, code: 'S-4015'},
  { n: 17, code: '1917'  },
  { n: 18, code: '2811'  },
  { n: 19, code: 'X-8656'},
  { n: 20, code: 'X-8874'},
  { n: 21, code: 'X-8727'},
  { n: 22, code: 'D-8874'},
  { n: 23, code: '2812'  },
  { n: 24, code: '3511'  },
  { n: 25, code: 'X-4040'},
  { n: 26, code: 'X-4070'},
  { n: 27, code: 'X-5030'},
  { n: 28, code: 'X-5040'},
  { n: 29, code: 'D-7010'},
  { n: 30, code: 'D-8890'},
  { n: 31, code: 'D-8891'},
  { n: 32, code: 'D-8727'},
  { n: 33, code: '3711'  },
  { n: 34, code: '9010'  },
  { n: 35, code: '9011'  },
  { n: 36, code: '9020'  },
  { n: 37, code: 'S-4070'},
  { n: 38, code: 'S-4050'},
  { n: 39, code: 'S-7210'},
  { n: 40, code: 'S-9050'},
  { n: 41, code: 'X-5060'},
  { n: 42, code: 'X-5080'},
  { n: 43, code: 'X-7010'},
  { n: 44, code: 'X-7210'},
  { n: 45, code: 'D-1010'},
  { n: 46, code: 'D-1011'},
  { n: 47, code: 'D-1012'},
  { n: 48, code: 'M-10'  },
  { n: 49, code: 'M-16'  },
  { n: 50, code: 'M-13'  },
  { n: 51, code: 'M-62'  },
  { n: 52, code: 'M-62B' },
];

export const menuiserieCategories = [
  { slug: 'pvc',           name: 'Portes & Fenêtres PVC' },
  { slug: 'alu',           name: 'Portes & Fenêtres ALU' },
  { slug: 'volets',        name: 'Volets Roulants' },
  { slug: 'guillotine',    name: 'Systèmes Guillotine' },
  { slug: 'portes-garage', name: 'Portes de Garage' },
  { slug: 'portes-entree', name: "Portes d'Entrée" },
  { slug: 'moustiquaires', name: 'Moustiquaires' },
  { slug: 'solutions-verre', name: 'Solutions Verre' },
];

export const menuiserieProducts = [
  // ── PVC — Portes ─────────────────────────────────────────────────────
  {
    id: 'porte-aluplast-70',
    name: 'Porte PVC Aluplast 70mm',
    mainCategory: 'pvc',
    subCategory: 'Portes PVC',
    image: PVC_PORTE_70,
    description: 'Profil PVC Aluplast 70mm — 5 chambres, isolation thermique Uf ≤ 1,3 W/m²K',
    specs: { Profil: 'Aluplast 70mm', Chambres: '5', 'Uf (W/m²K)': '≤ 1,3', Vitrage: 'Double ou Triple' },
  },
  {
    id: 'porte-aluplast-85',
    name: 'Porte PVC Aluplast 85mm',
    mainCategory: 'pvc',
    subCategory: 'Portes PVC',
    image: PVC_PORTE_85,
    description: 'Profil PVC Aluplast 85mm — 6 chambres, isolation thermique Uf ≤ 0,95 W/m²K',
    specs: { Profil: 'Aluplast 85mm', Chambres: '6', 'Uf (W/m²K)': '≤ 0,95', Vitrage: 'Triple' },
  },
  // ── PVC — Fenêtres ───────────────────────────────────────────────────
  {
    id: 'fenetre-ideal-2000',
    name: 'Fenêtre IDEAL 2000',
    mainCategory: 'pvc',
    subCategory: 'Fenêtres PVC',
    image: FEN_2000,
    description: 'Gamme entrée de gamme — 5 chambres, performant et économique',
    specs: { Profil: 'IDEAL 2000', Chambres: '5', Vitrage: 'Double' },
  },
  {
    id: 'fenetre-ideal-4000',
    name: 'Fenêtre IDEAL 4000',
    mainCategory: 'pvc',
    subCategory: 'Fenêtres PVC',
    image: FEN_4000,
    description: 'Gamme standard — 5 chambres optimisées, excellent rapport qualité/prix',
    specs: { Profil: 'IDEAL 4000', Chambres: '5', Vitrage: 'Double ou Triple' },
  },
  {
    id: 'fenetre-ideal-4000-mono',
    name: 'Fenêtre IDEAL 4000 Mono',
    mainCategory: 'pvc',
    subCategory: 'Fenêtres PVC',
    image: FEN_4000_MONO,
    description: 'Profil monocolore blanc — design épuré et contemporain',
    specs: { Profil: 'IDEAL 4000 Mono', Couleur: 'Blanc', Vitrage: 'Double ou Triple' },
  },
  {
    id: 'fenetre-ideal-4000-reno',
    name: 'Fenêtre IDEAL 4000 Reno',
    mainCategory: 'pvc',
    subCategory: 'Fenêtres PVC',
    image: FEN_4000_RENO,
    description: 'Profil rénovation — pose sur dormant existant sans travaux lourds',
    specs: { Profil: 'IDEAL 4000 Reno', Application: 'Rénovation', Vitrage: 'Double ou Triple' },
  },
  {
    id: 'fenetre-ideal-7000',
    name: 'Fenêtre IDEAL 7000',
    mainCategory: 'pvc',
    subCategory: 'Fenêtres PVC',
    image: FEN_7000,
    description: 'Gamme premium — 7 chambres, triple vitrage, Uf ≤ 1,1 W/m²K',
    specs: { Profil: 'IDEAL 7000', Chambres: '7', 'Uf (W/m²K)': '≤ 1,1', Vitrage: 'Triple' },
  },
  {
    id: 'fenetre-ideal-8000',
    name: 'Fenêtre IDEAL 8000',
    mainCategory: 'pvc',
    subCategory: 'Fenêtres PVC',
    image: FEN_8000_NL,
    description: 'Gamme haut de gamme — 8 chambres, Uf ≤ 0,91 W/m²K, performance maximale',
    specs: { Profil: 'IDEAL 8000', Chambres: '8', 'Uf (W/m²K)': '≤ 0,91', Vitrage: 'Triple' },
  },
  // ── PVC — Coulissants ────────────────────────────────────────────────
  {
    id: 'coulissant-multi-slide',
    name: 'Multi Slide',
    mainCategory: 'pvc',
    subCategory: 'Coulissants PVC',
    image: COL_MULTI,
    description: "Baie coulissante multi-vantaux — grandes ouvertures panoramiques jusqu'à 4 vantaux",
    specs: { Système: 'Multi Slide', 'Max. vantaux': '4', 'Uw (W/m²K)': '≤ 1,2' },
  },
  {
    id: 'coulissant-smart-slide',
    name: 'Smart Slide',
    mainCategory: 'pvc',
    subCategory: 'Coulissants PVC',
    cover: true,
    image: COL_SMART,
    description: 'Coulissant semi-automatisé — ouverture et fermeture assistées par simple contact',
    specs: { Système: 'Smart Slide', Commande: 'Semi-automatique' },
  },
  {
    id: 'coulissant-levant',
    name: 'Levant-Coulissante',
    mainCategory: 'pvc',
    subCategory: 'Coulissants PVC',
    image: COL_LEVANT,
    description: "Vantail levant-coulissant — étanchéité optimale grâce au joint compressé en position fermée",
    specs: { Système: 'Levant-Coulissant', Étanchéité: 'Haute' },
  },
  {
    id: 'coulissant-ideal-4000',
    name: 'IDEAL 4000 Coulissant',
    mainCategory: 'pvc',
    subCategory: 'Coulissants PVC',
    cover: true,
    image: COL_IDEAL4000,
    description: 'Version coulissante du profil IDEAL 4000 — solution économique pour baies coulissantes',
    specs: { Profil: 'IDEAL 4000', Système: 'Coulissant' },
  },
  // ── ALU ──────────────────────────────────────────────────────────────
  {
    id: 'cs77-hi',
    name: 'CS77 Hi',
    mainCategory: 'alu',
    subCategory: 'Aluminium',
    image: ALU_CS77,
    description: 'Fenêtre et porte-fenêtre haute isolation — Uf ≤ 1,0 W/m²K, triple vitrage',
    specs: { Système: 'Reynaers CS77 Hi', 'Uf (W/m²K)': '≤ 1,0', Application: 'Fenêtre / Porte-fenêtre', Vitrage: 'Triple' },
  },
  {
    id: 'cs77-tilt-turn',
    name: 'CS77 Tilt & Turn',
    mainCategory: 'alu',
    subCategory: 'Aluminium',
    cover: true,
    image: ALU_CS77_TILT,
    description: "Oscillo-battant aluminium — polyvalence maximale, ouverture à la française ou en soufflet",
    specs: { Système: 'Reynaers CS77', Ouverture: 'Oscillo-battant', Vitrage: 'Double ou Triple' },
  },
  {
    id: 'cs77-slide',
    name: 'CS77 Slide',
    mainCategory: 'alu',
    subCategory: 'Aluminium',
    cover: true,
    image: ALU_CS77_SLIDE,
    description: 'Baie coulissante aluminium — grandes ouvertures, allure architecturale premium',
    specs: { Système: 'Reynaers CS77 Slide', Application: 'Baie coulissante', Vitrage: 'Double ou Triple' },
  },
  // ── Volets (une carte, 4 variantes avec images distinctes) ───────────
  {
    id: 'volets',
    name: 'Volets Roulants',
    mainCategory: 'volets',
    subCategory: 'Volets Roulants',
    cover: true,
    image: VOLET_MONO,
    description: 'Protection solaire et thermique — 4 solutions de pose selon votre configuration.',
    specs: {},
    variants: [
      {
        label: 'Monoblock',
        image: VOLET_MONO,
        description: 'Coffre intégré dans le dormant — finition impeccable, aucun coffre apparent. Idéal pour la construction neuve.',
        specs: { Type: 'Monoblock', Coffre: 'Intégré', Pose: 'Neuve' },
      },
      {
        label: 'Pose en Applique',
        image: VOLET_APPLIQUE,
        description: 'Coffre posé en applique sur le mur — solution idéale pour la rénovation sans travaux lourds.',
        specs: { Type: 'Applique', Coffre: 'Apparent', Pose: 'Rénovation' },
      },
      {
        label: 'Coffre Titan',
        image: VOLET_COFFRE,
        description: 'Coffre renforcé haute résistance — performances thermiques et mécaniques accrues. Compatible toutes poses.',
        specs: { Type: 'Coffre Titan', Résistance: 'Haute', Application: 'Toutes poses' },
      },
      {
        label: 'Demi Linteau',
        image: VOLET_LINTEAU,
        description: 'Coffre demi-linteau semi-encastré — profil discret sous le plafond ou le plancher haut.',
        specs: { Type: 'Demi Linteau', Coffre: 'Semi-encastré' },
      },
    ],
  },
  // ── Guillotine ────────────────────────────────────────────────────────
  {
    id: 'guillotine',
    name: 'Systèmes Guillotine',
    mainCategory: 'guillotine',
    subCategory: 'Systèmes Guillotine',
    cover: true,
    image: GUILLOTINE,
    description: `Le système de vitrage à guillotine automatique (Fenêtre coulissant vertical) est un système de vitrage coulissant vertical motorisé fonctionnant avec une télécommande. Lorsque le système est en position ouverte (les vantaux sont en bas), il agit comme une balustrade ; lorsque les vantaux sont fermés, il agit comme une fenêtre.

C'est un nouveau système pour la fermeture des Cafés, Restaurants, Vérandas, Pergolas, Balcons, Extensions, etc.

Le système peut être fabriqué avec du verre de 8mm ou double vitrage 5+12+5mm. Possibilité d'avoir 2, 3 ou 4 vantaux, avec une ouverture jusqu'à 4000mm de largeur et 4000mm de hauteur.

Tous les profils sont couverts par un joint EPDM et des brosses offrant une isolation maximale. La clarté de la vue est maximisée grâce à la conception minimale des profils verticaux et horizontaux, assurant une vue panoramique à 98%. G-Motion system garantit un mouvement silencieux et confortable.

Le système répond aux normes européennes et a été testé pour la perméabilité à l'eau (class 9A), à l'air (class 3), la résistance au vent et aux chocs (I3/I5). Certifié par l'Institut PFB Allemagne.`,
    specs: {},
    variants: [
      {
        label: '2 Panneaux',
        image: GUILLOTINE,
        description: 'Baie guillotine 2 vantaux coulissants — idéale pour terrasses et vérandas. Ouverture complète à 100 %.',
        specs: { Panneaux: '2', Application: 'Terrasse / Véranda', Ouverture: '100 %' },
      },
      {
        label: '3 Panneaux',
        image: GUILLOTINE,
        description: 'Baie guillotine 3 vantaux — grandes baies vitrées panoramiques pour espaces lumineux.',
        specs: { Panneaux: '3', Application: 'Grande baie vitrée', Ouverture: '100 %' },
      },
      {
        label: '4 Panneaux',
        image: GUILLOTINE,
        description: "Baie guillotine 4 vantaux — ouverture maximale pour les très grandes surfaces. L'espace s'efface.",
        specs: { Panneaux: '4', Application: 'Très grande baie', Ouverture: '100 %' },
      },
    ],
  },
  // ── Portes de Garage (une carte, 2 variantes) ─────────────────────────
  {
    id: 'portes-garage',
    name: 'Portes de Garage',
    mainCategory: 'portes-garage',
    subCategory: 'Portes de Garage',
    cover: true,
    image: GARAGE_SECT,
    description: 'Solutions de fermeture garage — sectionnelle ou enroulable selon votre espace.',
    specs: {},
    variants: [
      {
        label: 'Sectionnelle',
        image: GARAGE_SECT,
        description: "Les panneaux des portes de garage sont constitués de panneaux à cassettes avec protection anti-pincement et peuvent être doublés et/ou des fenêtres décoratives à double paroi peuvent être appliquées sur les panneaux en option. Les portes de garage sont fabriquées selon les dimensions avec des panneaux sandwich et des accessoires avec des certificats de qualité Européens.",
        specs: { Type: 'Sectionnelle', Mouvement: 'Vertical', Isolation: 'Renforcée', Motorisation: 'En option' },
      },
      {
        label: 'Enroulable',
        image: GARAGE_ENROUL,
        description: "La porte de garage enroulable fonctionne comme un volet, avec des lamelles en aluminium et isolation thermique. Les lamelles vont se loger au sein d'un coffre lors de l'ouverture. C'est une solution qui permet d'optimiser l'espace dans vos allées et garages.",
        specs: { Type: 'Enroulable', Mouvement: 'Enroulement', Motorisation: 'Disponible' },
      },
    ],
  },
  // ── Portes d'Entrée — 52 modèles avec images produit réelles ─────────
  ...DOOR_DATA.map(({ n, code }) => ({
    id: `porte-entree-${n}`,
    name: `Modèle ${code}`,
    mainCategory: 'portes-entree',
    subCategory: "Portes d'Entrée",
    image: `${M}/entree-${n}.jpg`,
    description: `Porte d'entrée ${code} — finition premium, serrure multi-points`,
    specs: { Modèle: code, Fermeture: 'Multi-points', Finition: 'Laquée' },
  })),
  // ── Moustiquaires (une carte, 2 variantes) ────────────────────────────
  {
    id: 'moustiquaires',
    name: 'Moustiquaires',
    mainCategory: 'moustiquaires',
    subCategory: 'Moustiquaires',
    image: MOUST_PLISSE,
    description: "Protection contre les insectes — 2 systèmes adaptés à chaque type d'ouverture.",
    specs: {},
    variants: [
      {
        label: 'Plissée',
        image: MOUST_PLISSE,
        description: "Leur construction à seuil bas élimine la barrière pour les personnes âgées, les handicapés ou les enfants. Grâce à un système unique de glissières lisses, ils peuvent s'ouvrir dans différentes directions et être verrouillés à n'importe quel endroit. Des brosses supplémentaires garantissent une étanchéité à 100 %, et l'espacement approprié des moustiquaires assure une bonne circulation de l'air. Les moustiquaires plissées sont faciles à monter et à démonter. Ainsi, la moustiquaire peut être facilement retirée pour l'hiver ou lors du nettoyage des fenêtres.",
        specs: { Type: 'Plissée', Étanchéité: '100 %', Montage: 'Facile' },
      },
      {
        label: 'Enroulable semi-automatique',
        image: MOUST_STORE,
        description: "La moustiquaire enroulable verticale est guidée par des coulisses aluminium avec brosse d'étanchéité. Le joint balai sur la barre de charge et les supports d'extrémité télescopiques lui assurent une parfaite étanchéité, même si le tableau de la fenêtre n'est pas d'équerre. La toile est renforcée et l'armature surdimensionnée au niveau de tous ses composants. Elle est munie de brosses de rétention anti vent et d'un lestage de la barre de charge pour une tension optimale de la toile.",
        specs: { Type: 'Enroulable semi-automatique', Guidage: 'Coulisses aluminium', Étanchéité: 'Joint balai' },
      },
    ],
  },
  // ── Solutions Verre ───────────────────────────────────────────────────
  {
    id: 'verre-classique',
    name: 'Verre Classique',
    mainCategory: 'solutions-verre',
    subCategory: 'Solutions Verre',
    cover: true,
    image: VERRE_CLASSIQUE,
    description: "Un vitrage isolant est composé de deux (double vitrage) ou trois (triple vitrage) feuilles de verre minces séparées par une lame d'air ou de gaz déshydraté via un espaceur. Un joint assure l'étanchéité et la cohésion de l'ensemble.",
    specs: { Type: 'Classique', Vitrage: 'Double', 'Ug (W/m²K)': '1,1' },
  },
  {
    id: 'verre-feuillte',
    name: 'Verre Feuilleté',
    mainCategory: 'solutions-verre',
    subCategory: 'Solutions Verre',
    cover: true,
    image: VERRE_FEUILLETE,
    description: "Les verres de sécurité sont des vitrages obtenus par empilage alterné de feuilles de verres et de films en polyvinyle de butyral (PVB). Le film PVB a pour rôle de maintenir le vitrage en place après qu'un choc ait brisé le verre lui-même, le verre feuilleté assure ainsi une protection passive, possibilité d'utiliser avec une double vitrage ou une feuilleté sur deux face. Les verres peuvent, avant assemblage, être trempés ou renforcés thermiquement.",
    specs: { Type: 'Feuilleté', Sécurité: 'Anti-bris', Norme: 'EN 356' },
  },
  {
    id: 'verre-trempe',
    name: 'Verre Trempé',
    mainCategory: 'solutions-verre',
    subCategory: 'Solutions Verre',
    cover: true,
    image: VERRE_TREMPE,
    description: "Le verre trempé est du verre traité en vue d'améliorer ses propriétés mécaniques. Le verre trempé est de deux à cinq fois plus résistant qu'un verre ordinaire. Il fait partie des verres de sécurité.\n\nLa trempe thermique est obtenue par le passage du verre dans un four aux environs de 600 °C suivi d'un refroidissement brutal et rapide.",
    specs: { Type: 'Trempé', Résistance: '5× standard', Norme: 'EN 12150' },
  },
  {
    id: 'verre-controle-solaire',
    name: 'Vitrage Low-E',
    mainCategory: 'solutions-verre',
    subCategory: 'Solutions Verre',
    cover: true,
    image: VERRE_SOLAIRE,
    description: "Nommé aussi « verre à faible émissivité », le verre Low-e est un verre clair comportant sur une de ses faces une couche d'oxyde métallique d'une extrême finesse. Cette pellicule favorise le passage de la lumière externe tout en bloquant les rayons ultraviolets et le rayonnement thermique.\n\nUn verre ordinaire possède une émissivité de 0,84 (84 % de rayonnement). L'émissivité d'un verre Low-e étant de 4 %, il conserve 96 % de la chaleur reçue et n'en laisse s'échapper que 4 % vers l'extérieur.",
    specs: { Type: 'Contrôle Solaire', 'Facteur solaire g': '≤ 0,35', 'TL (%)': '≥ 60' },
  },
  {
    id: 'verre-decoratif',
    name: 'Vitrage Réfléchissant',
    mainCategory: 'solutions-verre',
    subCategory: 'Solutions Verre',
    cover: true,
    image: VERRE_DECORATIF,
    description: "Lors du procédé de fabrication, les fabricants de verre ajoutent certains oxydes de métaux réfléchissants sur une surface d'un verre clair ou teinté ou dans la masse du verre (pyrolytique), ce qui contribue à augmenter le taux de réflexion. Cette réflexion permet de réfléchir un pourcentage des rayons émis par différentes sources. Une très grande variété de verres réfléchissants est offerte par Mikapen.",
    specs: { Type: 'Décoratif', Finitions: 'Multiples' },
  },
  {
    id: 'verre-anti-effraction',
    name: 'Vitrage Acoustique',
    mainCategory: 'solutions-verre',
    subCategory: 'Solutions Verre',
    cover: true,
    image: VERRE_ANTI,
    description: "Le verre feuilleté acoustique, appelé également verre feuilleté silence, convient pour les logements conventionnels et les bâtiments administratifs implantés à proximité de sites bruyants tels que les gares, aéroports ou centres commerciaux. Grâce à sa structure spécifique feuilletée, il constitue un excellent isolant phonique de haut niveau.",
    specs: { Type: 'Anti-Effraction', Classe: 'P2A à P8B', Norme: 'EN 356' },
  },
];
