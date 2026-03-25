/**
 * Génère src/data/kobosData.js depuis kobos_raw.json
 */
const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('./kobos_raw.json', 'utf8'));

// Traduction couleurs TR→FR
const COLOR_MAP = {
  'Dark Walnut': 'Noyer foncé',
  'New Dark Walnut': 'Noyer foncé',
  'Light Walnut': 'Noyer clair',
  'Carbon Grey': 'Gris carbone',
  'Carbon Grey Dark': 'Gris carbone foncé',
  'Stone Grey': 'Gris pierre',
  'Light Grey': 'Gris clair',
  'Smoke Grey': 'Gris fumé',
  'Indigo Grey': 'Gris indigo',
  'Blue Grey': 'Gris bleu',
  'Soft Grey': 'Gris doux',
  'Miling Oak': 'Chêne Miling',
  'Grey Oak': 'Chêne gris',
  'Beige': 'Beige',
  'White': 'Blanc',
  'Black': 'Noir',
};

// Descriptions FR par collection
const DESCRIPTIONS = {
  'Zen': 'Une collection aux lignes minimalistes qui apporte une touche personnelle à votre salle de bain. Avec ses modules fonctionnels et ses multiples options de miroir, elle offre un espace optimisé et des possibilités de décoration infinies.',
  'Up Down': 'Une collection innovante à double mouvement qui redéfinit l\'ergonomie. Les modules s\'adaptent à hauteur pour un confort maximal, avec des finitions soignées qui subliment chaque espace.',
  'Serenity': 'La sérénité dans toute sa splendeur. Une collection aux contours épurés qui invite au calme et à la détente, avec des finitions premium résistantes à l\'humidité.',
  'Vanessa': 'Une collection élégante qui allie modernité et fonctionnalité. Ses lignes douces et ses matériaux de qualité en font le choix idéal pour une salle de bain raffinée.',
  'Santa': 'Un design contemporain avec des touches contrastées. La collection Santa associe des teintes sobres pour créer un espace de bain à la fois design et chaleureux.',
  'Lumia': 'La collection Lumia illumine votre salle de bain avec ses surfaces lisses et ses reflets subtils. Une esthétique lumineuse au service du confort quotidien.',
  'Gloria': 'La gloire du design scandinave dans votre salle de bain. La collection Gloria se distingue par ses teintes naturelles et ses finitions douces qui réchauffent l\'atmosphère.',
  'Simple': 'Moins c\'est plus. La collection Simple est la quintessence de l\'élégance épurée, avec des lignes nettes et des matériaux naturels qui s\'intègrent dans tout intérieur.',
  'Noble': 'Une collection d\'une noblesse intemporelle. Des volumes généreux, des finitions irréprochables et un style distinctif pour ceux qui ne font aucun compromis sur la qualité.',
  'Meta': 'La collection Meta repousse les limites du design avec ses formes géométriques innovantes. Un meuble de salle de bain résolument avant-gardiste.',
  'Linear': 'Linéaire dans ses formes, infini dans ses possibilités. La collection Linear offre une modularité exceptionnelle pour s\'adapter à chaque configuration de salle de bain.',
  'Lignum': 'Lignum, du latin "bois", rend hommage aux essences naturelles. Cette collection apporte la chaleur du bois dans votre salle de bain avec une résistance à l\'humidité garantie.',
  'Infinity': 'Sans limites ni frontières, la collection Infinity propose une liberté totale dans l\'organisation de votre espace. Modulable à l\'infini pour un résultat toujours parfait.',
  'Harmony': 'L\'harmonie parfaite entre esthétique et fonctionnalité. Chaque élément de la collection Harmony est pensé pour s\'assembler en cohérence, créant un ensemble unifié et élégant.',
  'Pure Meta': 'La pureté des lignes métalliques rencontre le design organique. Pure Meta est une collection qui transcende les tendances pour proposer un style intemporel et sophistiqué.',
  'Glow': 'La collection Glow rayonne d\'une lumière intérieure. Ses surfaces soigneusement finies reflètent la lumière avec élégance, transformant votre salle de bain en un havre lumineux.',
  'Future': 'Conçu pour demain, disponible aujourd\'hui. La collection Future intègre les dernières innovations en matière de design et de fonctionnalité pour une expérience de bain résolument moderne.',
  'Eylül': 'Inspirée de la douceur du mois de septembre, la collection Eylül associe des tons naturels à des finitions contemporaines pour créer une atmosphère sereine et apaisante.',
  'Elegant': 'L\'élégance n\'est pas une option, c\'est une évidence. Cette collection allie des matériaux nobles à des lignes sophistiquées pour un résultat d\'une beauté intemporelle.',
  'Bella': 'Bella — belle en toutes langues. Une collection qui captive par ses formes gracieuses et ses teintes délicates, apportant une féminité raffinée à votre salle de bain.',
  'Frame': 'La collection Frame encadre l\'espace avec précision. Ses structures apparentes créent un effet architectural saisissant, transformant votre salle de bain en véritable œuvre d\'art.',
};

// Tailles disponibles communes
const SIZES_COMMON = ['60 cm', '80 cm', '100 cm'];

function cleanImages(images) {
  // Filtrer les petites images (45x45 = swatches)
  const filtered = images.filter(src => !src.includes('boyut=45,45'));
  // Dédupliquer les UUIDs (même UUID = même image, juste taille différente)
  const seen = new Set();
  const result = [];
  for (const src of filtered) {
    const uuidMatch = src.match(/uploads\/([a-f0-9-]+)\./);
    const uuid = uuidMatch ? uuidMatch[1] : src;
    if (!seen.has(uuid)) {
      seen.add(uuid);
      // Utiliser la version 800x800 pour toutes
      const large = src.replace(/\?boyut=\d+,\d+.*/, '?boyut=800,800');
      result.push(large);
    }
  }
  return result;
}

function cleanColors(colors) {
  // Filtrer les résidus TR
  const cleaned = colors
    .filter(c => c && !c.includes('ve ') && !c.includes('\n') && c.length < 30)
    .map(c => COLOR_MAP[c] || c);
  return [...new Set(cleaned)];
}

const kobosData = raw.map((item, idx) => ({
  id: idx + 1,
  name: item.name,
  slug: item.slug,
  href: item.href,
  image: cleanImages(item.images)[0] || '',
  images: cleanImages(item.images),
  description: DESCRIPTIONS[item.name] || '',
  dimensions: SIZES_COMMON,
  colors: cleanColors(item.colors),
  material: item.material || 'Mélamine',
  category: 'Meuble de salle de bain',
}));

const output = `// Généré automatiquement depuis kobosbanyo.com — ne pas éditer manuellement
export const kobosData = ${JSON.stringify(kobosData, null, 2)};
`;

fs.writeFileSync('./src/data/kobosData.js', output, 'utf8');
console.log(`✓ ${kobosData.length} collections générées dans src/data/kobosData.js`);
kobosData.forEach(p => {
  console.log(`  ${p.id}. ${p.name} — ${p.images.length} images, couleurs: ${p.colors.join(', ') || 'N/A'}`);
});
