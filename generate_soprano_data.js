const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('./soprano_raw.json', 'utf8'));

const DESCRIPTIONS = {
  'Skyline':      'Un design épuré aux lignes horizontales affirmées. La surface en laque mate et la texture soyeuse de Skyline offrent une expérience visuelle et tactile incomparable. Les étagères ouvertes et les solutions de rangement intelligentes en font une cuisine aussi pratique qu\'élégante.',
  'Neo Plus':     'Neo Plus pousse le minimalisme à son apogée avec des façades sans poignées et des surfaces parfaitement lisses. Une cuisine contemporaine qui allie technologie et esthétique pour un espace de vie parfaitement ordonné.',
  'Natura Elite': 'L\'élégance naturelle à son summum. Natura Elite associe les textures du bois aux finitions haut de gamme pour créer une cuisine chaleureuse et raffinée qui traverse les tendances sans jamais se démoder.',
  'Frame Slim':   'Frame Slim redéfinit la finesse. Ses cadres ultra-minces créent un effet de légèreté visuelle tout en offrant une rigidité et une durabilité exemplaires. Le choix des architectes d\'intérieur exigeants.',
  'Soft':         'La douceur dans chaque détail. La collection Soft mise sur des lignes arrondies, des couleurs apaisantes et des matériaux doux au toucher pour créer un environnement culinaire serein et accueillant.',
  'Frame':        'La collection Frame impose son identité par un cadrage structurel élégant qui crée une profondeur visuelle saisissante. Une cuisine architecturale qui transforme l\'espace cuisine en véritable œuvre.',
  'Sawoy':        'Inspirée des grandes cuisines professionnelles, Sawoy allie robustesse et élégance. Ses lignes nettes et ses finitions premium en font le choix idéal pour les passionnés de gastronomie.',
  'Natura':       'La chaleur authentique du bois dans votre cuisine. La collection Natura célèbre les essences naturelles avec des teintes et textures qui apportent vie et caractère à l\'espace culinaire.',
  'Legend':       'Legend est une déclaration d\'intention. Une cuisine iconique aux proportions généreuses et aux matériaux nobles qui impose sa présence et marque les esprits durablement.',
  'Joy':          'La joie de cuisiner commence avec Joy. Cette collection colorée et fonctionnelle apporte bonne humeur et légèreté dans la cuisine, avec des solutions de rangement astucieuses qui simplifient le quotidien.',
  'Grace':        'La grâce en mouvement. Des courbes délicates, des surfaces irréprochables et une palette de couleurs sophistiquée font de Grace la cuisine de ceux qui considèrent l\'esthétique comme une priorité absolue.',
  'Balance':      'L\'équilibre parfait entre tradition et modernité. Balance propose des lignes intemporelles, des matériaux durables et une palette de couleurs qui s\'adapte à tous les intérieurs avec naturel.',
  'Neo':          'Neo incarne l\'esprit du design contemporain avec ses façades épurées et ses lignes architecturales précises. Une cuisine urbaine et sophistiquée pour les amateurs de modernité assumée.',
  'Infinity S':   'Infinity S repousse les limites de l\'espace avec ses systèmes modulaires innovants. Une cuisine qui s\'adapte et se transforme selon vos besoins, offrant un potentiel de personnalisation sans fin.',
  'Infinity A':   'Sœur jumelle d\'Infinity S, la version A d\'Infinity propose une approche alternative de la modularité avec des solutions d\'angle innovantes et une gestion optimisée de chaque centimètre disponible.',
};

// Nettoyage des couleurs (suppression des doublons génériques)
function cleanColors(colors) {
  const blacklist = new Set(['Grey', 'Beige', 'Cream', 'White', 'Black', 'Matt', 'Glossy', 'Natural', 'Oak', 'Walnut']);
  // Garder d'abord les noms spécifiques Soprano
  const specific = colors.filter(c => !blacklist.has(c));
  const generic  = colors.filter(c => blacklist.has(c));
  // Si moins de 3 spécifiques, compléter avec génériques
  const result = [...specific];
  for (const g of generic) {
    if (result.length >= 8) break;
    if (!result.includes(g)) result.push(g);
  }
  return result.slice(0, 12);
}

const sopranoData = raw.map((item, idx) => ({
  id: idx + 1,
  name: item.name,
  slug: item.slug,
  href: `https://www.sopranomutfak.com/mutfak/${item.slug}`,
  image: item.images[0] || '',
  images: item.images,
  description: DESCRIPTIONS[item.name] || '',
  colors: cleanColors(item.colors),
  style: item.style,
  category: 'Meuble de cuisine',
}));

const output = `// Généré automatiquement depuis sopranomutfak.com — ne pas éditer manuellement
export const sopranoData = ${JSON.stringify(sopranoData, null, 2)};
`;

fs.writeFileSync('./src/data/sopranoData.js', output, 'utf8');
console.log(`✓ ${sopranoData.length} modèles générés dans src/data/sopranoData.js`);
sopranoData.forEach(p => {
  console.log(`  ${p.id}. ${p.name} — ${p.images.length} images, finitions: ${p.colors.slice(0,3).join(', ')}`);
});
