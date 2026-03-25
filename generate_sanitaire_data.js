/**
 * Génère src/data/sanitaireData.js depuis banyo_details.json
 * Usage: node generate_sanitaire_data.js
 */

const fs = require('fs');
const INPUT  = './public/cat_preview/banyo_details.json';
const OUTPUT = './src/data/sanitaireData.js';

const raw = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// ─── Traductions clés ────────────────────────────────────────────────────────
const KEY_MAP = {
  'Référence': 'Référence',
  'Série': 'Série',
  'Ebat': 'Dimensions',
  'Anma Boyutu': 'Taille nominale',
  'Couleur': 'Couleur',
  'Ürün Typei': 'Type',
  'Ürün Type': 'Type',
  'Ürün Özellik': 'Caractéristique',
  'Poids brut': 'Poids brut (kg)',
  'Poids net': 'Poids net (kg)',
  'Kalınlık': null,            // toujours vide → ignorer
  'Kutu Ağırlık': null,        // poids carton → ignorer
  'Palet Ağırlık': null,       // poids palette → ignorer
  'Paket içi Adet (Yurt İçi)': null,
  'Paket içi Adet (Yurt Dışı)': null,
};

// ─── Traductions valeurs ─────────────────────────────────────────────────────
const VAL_MAP = {
  // Couleurs
  'Beyaz': 'Blanc',
  'Siyah': 'Noir',
  'Gri': 'Gris',
  // Rim
  'No-Rim': 'Sans bride',
  'Rimli': 'Avec bride',
  'Vorteks Flush Sistem': 'Système Vortex',
  // Montage
  'Açık Montaj': 'Montage ouvert',
  'Gizli Montaj': 'Montage caché',
  'Asma': 'Suspendu',
  'Yerden': 'Au sol',
  // Types lavabo
  'Gövde Üstü Lavabo': 'Vasque à poser',
  'Tam Tezgah Üstü Lavabo': 'Vasque intégrée',
  'Tezgah Altı Lavabo': 'Vasque sous-plan',
  'Duvara Montajlı Lavabo': 'Lavabo mural',
  'Monoblok Lavabo': 'Lavabo monobloc',
  'Konsollu Lavabo': 'Lavabo sur console',
  'Dolaplı Lavabo': 'Lavabo avec meuble',
  'Gömme Lavabo': 'Vasque semi-encastrée',
  'Tezgah Üstü Lavabo': 'Vasque à poser',
  // Caractéristiques lavabo
  'Batarya Delikli': 'Avec trou pour robinet',
  'Batarya Deliksiz': 'Sans trou pour robinet',
  'Taşma Kanallı': 'Avec trop-plein',
  'Taşmasız': 'Sans trop-plein',
  // Formes
  'Oval': 'Ovale',
  'Oblong': 'Oblong',
  'Yuvarlak': 'Rond',
  'Kare': 'Carré',
  'Dikdörtgen': 'Rectangulaire',
  'Asimetrik': 'Asymétrique',
  // Types urinoir
  'Pisuvar': 'Urinoir',
  'Pisuvar Ara Bölme': 'Cloison urinoir',
  'Üstten Su Girişli': 'Alimentation par le dessus',
  'Arkadan Su Girişli': 'Alimentation par l\'arrière',
  'Elektronik': 'Électronique',
  // Matériaux
  'Seramik': 'Céramique',
  'Porselen': 'Porcelaine',
  // Autres
  'Evet': 'Oui',
  'Hayır': 'Non',
  'Tek Parça': 'Une pièce',
  'Klozet': 'WC',
  'Asma Klozet': 'WC suspendu',
  'Duvara Sıfır Klozet': 'WC compact',
  'Kombi Klozet': 'WC combiné',
  'Hela Taşı': 'Cuvette à la turque',
  'Bide': 'Bidet',
  'Engelliler İçin': 'PMR',
  'Çevre Yıkamalı': 'Avec rinçage périmétral',
};

function translateValue(v) {
  if (!v || v.trim() === '' || v.trim() === 'cm' || v.trim() === 'kg') return null;
  // Traduction exacte
  if (VAL_MAP[v.trim()]) return VAL_MAP[v.trim()];
  // Remplacement partiel
  let result = v.trim();
  for (const [tr, fr] of Object.entries(VAL_MAP)) {
    result = result.replace(new RegExp('\\b' + tr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g'), fr);
  }
  return result;
}

function cleanSpecs(rawSpecs) {
  const out = {};
  for (const [rawKey, rawVal] of Object.entries(rawSpecs)) {
    // Nettoyer la clé (enlever le :)
    const cleanKey = rawKey.replace(/:$/, '').trim();
    // Traduire la clé
    const mappedKey = KEY_MAP[cleanKey];
    if (mappedKey === null) continue;          // champ à ignorer
    const finalKey = mappedKey || cleanKey;    // garder tel quel si pas dans map
    // Traduire la valeur
    const finalVal = translateValue(rawVal);
    if (!finalVal) continue;                   // valeur vide → ignorer
    out[finalKey] = finalVal;
  }
  return out;
}

// ─── Catégories ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  'WC Suspendu',
  'WC Compact',
  'Lavabo',
  'Urinoir & Cloisons',
  'Cuvette à la turque',
  'Bidet',
];

// ─── Extraire nom court ───────────────────────────────────────────────────────
function shortName(fullname) {
  return fullname.split(' - ')[0].trim();
}

// ─── Générer entries ──────────────────────────────────────────────────────────
const entries = raw.map((p, i) => {
  // Image haute résolution
  const imgHD = p.img.replace('?width=400&height=400', '?width=800&height=800');

  // Fiche produit RAR depuis la référence
  const cleanedSpecs = cleanSpecs(p.specs);
  const ref = cleanedSpecs['Référence'];
  const sheetUrl = ref
    ? `https://www.bienseramik.com.tr/uploads/${ref}-foy.rar`
    : null;

  return {
    id: i + 1,
    name: shortName(p.name),
    fullName: p.name,
    category: p.categoryLabel,
    image: imgHD,
    href: p.href,
    specs: cleanedSpecs,
    sheetUrl,
  };
});

// ─── Écrire le fichier ────────────────────────────────────────────────────────
const lines = [
  '// Généré automatiquement — ne pas éditer manuellement',
  `export const sanitaireData = ${JSON.stringify(entries, null, 2)};`,
  '',
  `export const sanitaireCategories = ${JSON.stringify(CATEGORIES)};`,
  '',
];

fs.writeFileSync(OUTPUT, lines.join('\n'));
console.log(`✓ ${OUTPUT} — ${entries.length} produits`);

// Stats
const withSpecs = entries.filter(p => Object.keys(p.specs).length > 0).length;
console.log(`  Avec specs : ${withSpecs}/${entries.length}`);
console.log(`  Exemple produit 1 :`, JSON.stringify(entries[0].specs, null, 2));
