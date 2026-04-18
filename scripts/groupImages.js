/**
 * Script pour regrouper les images de /public/collection/ par collection
 * et générer la structure collectionsData.js
 *
 * Usage: node scripts/groupImages.js
 */

const fs = require('fs');
const path = require('path');

// Normalise une chaîne pour la comparaison (majuscules, sans accents, espaces normalisés)
function normalize(str) {
  return str
    .toUpperCase()
    .replace(/[ÜÚÙÛü]/g, 'U')
    .replace(/[İIÎÏı]/g, 'I')
    .replace(/[ŞŚŜşś]/g, 'S')
    .replace(/[ĞĠğ]/g, 'G')
    .replace(/[ÇÇç]/g, 'C')
    .replace(/[ÖÓÒÔÕö]/g, 'O')
    .replace(/[ÂÀÄÃÅâàäã]/g, 'A')
    .replace(/[ÊÈËÉêèëé]/g, 'E')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Liste des collections (depuis content.js)
const collectionNames = [
  'Abella', 'Adel', 'Adela', 'Adonis', 'Adria', 'Agrilion', 'Agusta', 'Alba', 'Albero', 'Alboran',
  'Aldonsa', 'Alin', 'Altus', 'Alyssa', 'Amethist', 'Antares', 'Antiasit', 'Antibes', 'Anticatto',
  'Antique Carrara', 'Aqua Marin', 'Arch', 'Arcides', 'Arcos', 'Aren', 'Aristo', 'Arno',
  'Artanes Oxide', 'Assos', 'Astoria', 'Atelier', 'Atlantik', 'Avanos', 'Belgium Stone', 'Belita',
  'Bellatrix', 'Bengal', 'Beton', 'Black Star', 'Boho', 'Bona Dea', 'Bond', 'Bosco', 'Brano',
  'Bravas', 'Brillo', 'Buxy', 'Calacatta Marmi', 'Camouflage', 'Capella', 'Cappadocia', 'Carbon',
  'Casta', 'Catalpa', 'Chakra', 'Charlotte', 'Charm', 'Chester', 'Cleopatra', 'Clio', 'Concept',
  'Coper', 'Country', 'Crag', 'Crotone', 'Darkness', 'Delbin', 'Destiny', 'Dina', 'Diva', 'Dora',
  'Dove', 'Elan', 'Eleganza', 'Elitra', 'Elora', 'Enzo', 'Epona', 'Estel', 'Europe', 'Everest',
  'Fair', 'Famous', 'Fenix', 'Flevo', 'Fortuna', 'Fraxinus', 'Fresno', 'Fuji', 'Gaudi', 'Gemma',
  'Geo Wood', 'Gordion', 'Grace', 'Grand', 'Grassland', 'Greta', 'Hampton', 'Harley', 'Helen',
  'Helios', 'Herringwood', 'Himalaya', 'Hormigon Molde', 'Hypnos', 'Imperial', 'Inca', 'Iroko',
  'Joya', 'Juno', 'Kaleidos', 'Kallos', 'Kapteyn', 'Karsos', 'Klein', 'La Vita', 'Lamuna',
  'Larimar Ocean', 'Larix', 'Las Palmas', 'Lefke', 'Limra', 'Lisbon', 'Logs', 'Loreto', 'Loris',
  'Luca', 'Madero', 'Madran', 'Magellan', 'Magnifique', 'Manhattan', 'Marmol', 'Marvel', 'Marvy',
  'Maryo', 'Maxi', 'Merlo', 'Mia', 'Milenario', 'Minimo', 'Miramar', 'Miranda', 'Mirko',
  'Modellato', 'Mood', 'Mora', 'Motto', 'Mystone', 'Naos', 'Napoli', 'Natura Wood', 'Neva',
  'Nevada', 'New Metro', 'Newport', 'Nile', 'Nomerles', 'Norden', 'Nuvola', 'Oasis', 'Odin',
  'Olbia', 'Olivia', 'Olmo', 'Onelia', 'Onixia', 'Orfe', 'Orla', 'Palazzo', 'Palmer', 'Pamfilya',
  'Paris', 'Parisian', 'Paros', 'Pastel', 'Pebble', 'Pera', 'Picasso', 'Piegato', 'Quark',
  'Quarzt', 'Radiance', 'Regnum', 'Rhea', 'Rio', 'Riva', 'Root', 'Rubi', 'Saaga', 'Sakura',
  'Salamanca', 'Salt Cave', 'Sante', 'Sara', 'Sarda', 'Saten', 'Sativa', 'Sealong', 'Sempre',
  'Serpatin', 'Shell', 'Side', 'Silyon', 'Simirna', 'Stacy', 'Star', 'Star Line', 'Statuario Goya',
  'Storm Rock', 'Strato', 'Stuart', 'Süper Beyaz', 'Swan', 'Tavas', 'Terra', 'Thanos', 'Tiana',
  'Tiffany', 'Tiger', 'Tsuga', 'Turin', 'Twist', 'Urban', 'Vales', 'Valor', 'Vedra Grafit',
  'Venis', 'Venüs', 'Verona', 'Vigo', 'Vintage', 'Violeta', 'Vitray', 'Void', 'Volare', 'Walter',
  'Wario', 'White Star', 'Windy', 'Yoga Wood', 'Yuta', 'Zenith', 'Zigana'
];

// Mapping manuel pour les cas ambigus (collection → noms de fichiers à inclure)
const manualOverrides = {
  'Adel':        ['ADELA 30X90 GREY.jpg'],  // partagé avec Adela
  'Adela':       ['ADELA 30X90 GREY.jpg'],
  'Agrilion':    ['ARCIDES LATTE 60X60.jpg'],
  'Agusta':      ['ASTORIA 30x90 KAHVE 3D.jpg'],
  'Alboran':     ['ALBERO 60X60-2.jpg'],
  'Aldonsa':     ['ALYSSA GREY  60X60.jpg'],
  'Altus':       ['ARISTO 60X120.jpg'],
  'Amethist':    ['AMAZONITE 60X120.jpg'],
  'Antiasit':    ['Anti-Asit 33x33-1.jpg'],
  'Antibes':     ['ancona.png'],
  'Anticatto':   ['ANTICOTTO MISTO 60X60-1.jpg'],
  'Antique Carrara': ['antique carrera.png'],
  'Aqua Marin':  ['NAVI BLUE 30X90 - RENDER.jpg'],
  'Arch':        ['arcos.png'],
  'Arcides':     ['ARCIDES LATTE 60X60.jpg', 'ARCIDES SMOKE 30X60 .jpg'],
  'Aren':        ['ARNO 50X50.jpg'],
  'Artanes Oxide': ['ARCIDES SMOKE 30X60 .jpg'],
  'Assos':       ['assos.png'],
  'Atelier':     ['Atelier-Pearl.JPG'],
  'Atlantik':    ['atlantik.png'],
  'Avanos':      ['avanos.png'],
  'Belgium Stone': ['BELGIUM_STONE.JPG', 'BELGIUM BLACK DETAY.JPG', 'BELGIUM GRI DETAY.JPG'],
  'Bravas':      ['BARBERA 60x60-1.jpg'],
  'Brillo':      ['BELLINI LIGHT GREY.jpg'],
  'Buxy':        ['BERGAMA 40X120.jpg'],
  'Carbon':      ['DARKNESS 60X120.jpg'],
  'Charm':       ['CLEOPATRA-60x120-RENDER-01.jpg'],
  'Clio':        ['clinker.png'],
  'Coper':       ['coper.png'],
  'Crotone':     ['crotone.png'],
  'Dina':        ['DETROIT 60X120-1.jpg'],
  'Diva':        ['diva.png'],
  'Dove':        ['dove.png'],
  'Elan':        ['eleganza.png'],
  'Elitra':      ['elitra.png'],
  'Elora':       ['eleganza.png'],
  'Epona':       ['estel.png'],
  'Estel':       ['estel.png'],
  'Europe':      ['everest.png'],
  'Everest':     ['everest.png'],
  'Flevo':       ['FORTUNA 60x120.jpg', 'FORTUNA 60X120-2.jpg'],
  'Fraxinus':    ['FRESNO 50X50.jpg'],
  'Fuji':        ['freddo.png'],
  'Gemma':       ['gemma.png'],
  'Geo Wood':    ['GeoWood.jpg'],
  'Gordion':     ['GOBLIN 50X50.jpg'],
  'Grace':       ['grace.png'],
  'Greta':       ['greta.png'],
  'Harley':      ['HERRINGWOOD 50X50.jpg'],
  'Himalaya':    ['himalaya.png'],
  'Hormigon Molde': ['homey.png'],
  'Hypnos':      ['ICON 60X60.jpg'],
  'Imperial':    ['İmperial-Detay-2.jpg', 'İmperial-Detay-3.jpg'],
  'Inca':        ['IROKO PEARL 20X120.jpg'],
  'Kaleidos':    ['KIARA 60x60.jpg'],
  'Kallos':      ['KAPTEYN 60X120.png'],
  'Karsos':      ['KARIS BIANCO 30X90 - R1.jpg'],
  'La Vita':     ['LA-VITA-30X90-R1.jpg', 'LA-VITA-30X90-R2.jpg'],
  'Lamuna':      ['LUNA 30X60.jpg'],
  'Larimar Ocean': ['LOLITE 60X120.jpg', 'LOLITE 60X120-2.jpg'],
  'Larix':       ['LEXA 40X120 - R1 kopya.jpg', 'LEXA 40X120 - R2 kopya.jpg', 'LEXA 40X120 - R3 kopya.jpg'],
  'Lefke':       ['LIVORNO 61X61.jpg'],
  'Limra':       ['LORETO 61X61.jpg'],
  'Lisbon':      ['LUZON 60X120-1 .jpg'],
  'Logs':        ['BOSCO 20X120 -1.jpg', 'BOSCO 20X120 -2 RENK AYRIMI REV.jpg'],
  'Loris':       ['LORETO 61X61.jpg'],
  'Luca':        ['LUZON 60X120-1 .jpg'],
  'Madero':      ['madran.png'],
  'Madran':      ['madran.png'],
  'Manhattan':   ['MELANGE-60X60.JPG'],
  'Marmol':      ['MARLEN 30X90.jpg'],
  'Marvel':      ['MARLEN 30X90.jpg'],
  'Marvy':       ['MARLEN 30X90.jpg'],
  'Maryo':       ['MAXI 60X60.jpg', 'MAXI-30X60.jpg'],
  'Merlo':       ['METIS 30X90 DARK-LIGHT.jpg'],
  'Milenario':   ['milenario.png'],
  'Miramar':     ['miramar.png'],
  'Mirko':       ['MOONSTONE 30X90-1.jpg', 'MOONSTONE 30X90-2.jpg'],
  'Modellato':   ['modellato.png'],
  'Mood':        ['MOONSTONE 30X90-1.jpg', 'MOONSTONE 30X90-2.jpg'],
  'Mora':        ['motto.png'],
  'Motto':       ['motto.png'],
  'Mystone':     ['MYSTIC 60X120 RENK AYRIMI -1.jpg', 'MYSTIC 60X12 RENK AYRIMI-2.jpg'],
  'Naos':        ['naos.png'],
  'Neva':        ['NELIDA 40X120 .jpg'],
  'Nevada':      ['NOVOCEMENTO 60x60x2.jpg'],
  'New Metro':   ['NOMERLES 60X120.jpg'],
  'Newport':     ['NOMERLES 60X120.jpg'],
  'Nile':        ['NAVI BLUE 30X90 - RENDER.jpg'],
  'Norden':      ['NOVOCEMENTO 60x60x2.jpg'],
  'Nuvola':      ['NEBIOSSO BOOKMATCH R1 kopya.JPG', 'NEBIOSSO BOOKMATCH R2 kopya.JPG', 'NEBIOSSO BOOKMATCH BANYO.JPG'],
  'Oasis':       ['OASIS MURDUM 30X90 - RENDER kopya.jpg'],
  'Onelia':      ['ORFE 40X120.jpg'],
  'Onixia':      ['BLACK ONYX 60x120 R1.jpg', 'BLACK ONYX 60x120 R2.jpg'],
  'Orla':        ['PALAZZO GREY-IVORY 60X120 GENEL.jpg'],
  'Pamfilya':    ['PANGEA 40X120 R1 kopya.jpg', 'PANGEA 40X120   (2).jpg'],
  'Pebble':      ['PERLA 30X60.jpg'],
  'Quark':       ['quartz-1655.jpg'],
  'Quarzt':      ['quartz-1655.jpg'],
  'Radiance':    ['ROCK CANDY 60X120.jpg', 'ROCK CANDY 60X120-1.jpg', 'ROCK CANDY 60X120-2 REV.jpg', 'ROCK CANDY 60X120-3 .jpg', 'ROCK CANDY 60X120-4.jpg'],
  'Regnum':      ['regnum.png'],
  'Rhea':        ['ROOT 60X120 ASH.jpg'],
  'Rio':         ['RIVA 60X120.jpg'],
  'Riva':        ['ROOT 60X120 CREMA.jpg'],
  'Rubi':        ['RUSTIC ART 120X180.jpg', 'RUSTIC ART 2 120X180.jpg', 'RUSTIC ART BOOKMATCH 120X180.jpg'],
  'Saaga':       ['sakura.png'],
  'Sara':        ['SARDA 60X120.jpg'],
  'Sarden':      ['SATIVA 61X61.jpg', 'SATIVA 61X61-2.jpg', 'sativa-bone.jpg'],
  'Saten':       ['ALATURCA-SATEN.jpg'],
  'Antares':     ['ANTICOTTO MISTO 60X60-1.jpg'],
  'Arcos':       ['arcos.png'],
  'Bond':        ['BOSCO 20X120 -1.jpg'],
  'Camouflage':  ['camouflage.png'],
  'Capella':     ['capella.png'],
  'Loreto':      ['LORETO 61X61.jpg'],
  'Sakura':      ['sakura.png'],
  'Sarda':       ['SATIVA 61X61.jpg', 'SATIVA 61X61-2.jpg'],
  'Star':        ['star.png'],
  'Venis':       ['VERONA 30X60.jpg'],
  'Yuta':        ['yuta.png'],
  'Sealong':     ['SLANA 60X120.jpg'],
  'Serpatin':    ['SAUDI TRAVERTEN 60X120 .jpg'],
  'Shell':       ['SLANA 60X120.jpg'],
  'Side':        ['STACY 50X50.jpg', 'STACY 50X50-2.jpg'],
  'Silyon':      ['STRABON 30X90.jpg'],
  'Simirna':     ['STARLINE 30X90.jpg'],
  'Star Line':   ['STARLINE 30X90.jpg'],
  'Storm Rock':  ['Rock Dark Natura 40x120.jpg', 'Rock Light Natura 40x120.jpg'],
  'Strato':      ['STRABON 30X90.jpg'],
  'Süper Beyaz': ['SUPER BEYAZ 60X120.jpg'],
  'Tavas':       ['TEADORA 60X60.jpg'],
  'Thanos':      ['thanos.png'],
  'Tiger':       ['TORINO 100X100.jpg'],
  'Tsuga':       ['TRESSA 60X120-3.jpg'],
  'Vales':       ['VALDEZ 120X180.jpg'],
  'Vedra Grafit': ['VERSAILLES 120X180.jpg', 'VERSAILLES 120X180-2.jpg', 'VERSAILLES 120X180 -3.jpg'],
  'Venüs':       ['VESTA COOPER 30X90.jpg', 'VESTA-COPPER-30x90-RENDER.jpg', 'VESTA-PEARL-30x90-RENDER.jpg', 'VESTA-TITANIUM-30X90-RENDER.jpg'],
  'Vintage':     ['VIOLETA 60X60 CAFE .jpg', 'VIOLETA 60X60  GRIS.jpg'],
  'Vitray':      ['whisper.jpg'],
  'Void':        ['Wilbur-Latte-60x120.jpg'],
  'Volare':      ['VERSAILLES 120X180-2.jpg'],
  'Wario':       ['whisper.jpg'],
  'White Star':  ['WHITESTAR 120X180 3D R2.jpg', 'BLACK - WHITE STAR 120X180 R1.jpg', 'BLACK - WHITE STAR 120X180 R2-2.jpg'],
  'Windy':       ['Wilbur-Latte-60x120.jpg'],
  'Yoga Wood':   ['GeoWood.jpg'],
};

// Collections avec auto-matching par nom (le nom de fichier commence par le nom de la collection)
const autoMatchCollections = [
  'Abella', 'Adonis', 'Adria', 'Alba', 'Albero', 'Alin', 'Alyssa', 'Arcides', 'Aristo', 'Arno',
  'Astoria', 'Belgium Stone', 'Belita', 'Bellatrix', 'Bengal', 'Beton', 'Black Star', 'Boho',
  'Bona Dea', 'Bosco', 'Brano', 'Calacatta Marmi', 'Cappadocia', 'Casta', 'Catalpa', 'Chakra',
  'Charlotte', 'Chester', 'Cleopatra', 'Concept', 'Country', 'Crag', 'Darkness', 'Delbin',
  'Destiny', 'Dora', 'Eleganza', 'Enzo', 'Fair', 'Famous', 'Fenix', 'Fortuna', 'Fresno',
  'Gaudi', 'Grand', 'Grassland', 'Hampton', 'Helen', 'Helios', 'Herringwood', 'Iroko',
  'Joya', 'Juno', 'Kapteyn', 'Klein', 'Las Palmas', 'Magellan', 'Magnifique', 'Maxi',
  'Mia', 'Minimo', 'Miranda', 'Napoli', 'Natura Wood', 'Nomerles', 'Odin', 'Olbia', 'Olivia',
  'Olmo', 'Orfe', 'Palazzo', 'Palmer', 'Paris', 'Parisian', 'Paros', 'Pastel', 'Pera', 'Picasso',
  'Piegato', 'Root', 'Salamanca', 'Salt Cave', 'Sante', 'Sativa', 'Sempre', 'Stacy',
  'Statuario Goya', 'Stuart', 'Swan', 'Terra', 'Tiana', 'Tiffany', 'Turin', 'Twist',
  'Urban', 'Valor', 'Verona', 'Vigo', 'Violeta', 'Walter', 'Zenith', 'Zigana',
];

const collectionDir = path.join(__dirname, '../public/collection');
const allFiles = fs.readdirSync(collectionDir);

const result = {};

for (const name of collectionNames) {
  let images = [];

  // 1. Manual override
  if (manualOverrides[name]) {
    images = [...new Set([...images, ...manualOverrides[name]])];
  }

  // 2. Auto-match si dans la liste
  if (autoMatchCollections.includes(name)) {
    const normName = normalize(name);
    const matched = allFiles.filter(file => {
      const normFile = normalize(file.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/, ''));
      return normFile.startsWith(normName);
    });
    images = [...new Set([...images, ...matched])];
  }

  // Dédoublonne et trie
  images = [...new Set(images)].sort();

  result[name] = {
    images,
    count: images.length
  };
}

// Affiche le résultat
console.log('\n=== RÉSUMÉ DU GROUPAGE ===\n');
let noImages = [];
let withImages = [];

for (const [name, data] of Object.entries(result)) {
  if (data.count === 0) {
    noImages.push(name);
  } else {
    withImages.push(`${name} (${data.count} image${data.count > 1 ? 's' : ''})`);
  }
}

console.log(`✅ Collections avec images: ${withImages.length}`);
withImages.forEach(s => console.log(`  - ${s}`));

console.log(`\n❌ Collections SANS images: ${noImages.length}`);
noImages.forEach(n => console.log(`  - ${n}`));

// Génère le fichier JS
let output = `// Auto-généré par scripts/groupImages.js
// Structure des données par collection
// Images groupées depuis /public/collection/

export const collectionsData = {\n`;

for (const name of collectionNames) {
  const data = result[name];
  const slug = name.toLowerCase()
    .replace(/[üúùû]/g, 'u')
    .replace(/[ıiîï]/g, 'i')
    .replace(/[şś]/g, 's')
    .replace(/[ğġ]/g, 'g')
    .replace(/[çć]/g, 'c')
    .replace(/[öóòô]/g, 'o')
    .replace(/[âàäã]/g, 'a')
    .replace(/[êèëé]/g, 'e')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const imagesStr = data.images
    .map(img => `    '/collection/${img}'`)
    .join(',\n');

  output += `  '${name}': {
    slug: '${slug}',
    images: [\n${imagesStr || "    // Ajouter les images ici"}
    ],
    documents: [
      // Exemple: { name: 'Fiche Produit', file: '/collections/${slug}/docs/fiche.pdf', size: '' }
    ],
    specs: {
      // À remplir depuis le PDF produit
      // finition: '',
      // epaisseur: '',
      // rectifie: '',
      // typesProduit: '',
    }
  },\n`;
}

output += `};\n`;

const outputPath = path.join(__dirname, '../src/data/collectionsData.js');
fs.writeFileSync(outputPath, output, 'utf8');
console.log(`\n✅ Fichier généré: src/data/collectionsData.js`);
