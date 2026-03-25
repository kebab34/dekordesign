/**
 * Met à jour les mappings collectionImages dans content.js
 */
const fs = require('fs');

let content = fs.readFileSync('./src/data/content.js', 'utf8');

const updates = [
  ["'Alboran': '/collection/ALBERO 60X60-2.jpg',",      "'Alboran': '/collection/ALBORAN.jpg',"],
  ["'Aldonsa': '/collection/ALYSSA GREY  60X60.jpg',",  "'Aldonsa': '/collection/ALDONSA.jpg',"],
  ["'Altus': '/collection/ARISTO 60X120.jpg',",          "'Altus': '/collection/ALTUS.jpg',"],
  ["'Antibes': '/collection/ancona.png',",               "'Antibes': '/collection/ANTIBES.jpg',"],
  ["'Anticatto': '/collection/ANTICOTTO MISTO 60X60-1.jpg',", "'Anticatto': '/collection/ANTICATTO.png',"],
  ["'Aqua Marin': '/collection/NAVI BLUE 30X90 - RENDER.jpg',", "'Aqua Marin': '/collection/AQUA MARIN.jpg',"],
  ["'Arch': '/collection/arcos.png',",                   "'Arch': '/collection/ARCH.png',"],
  ["'Aren': '/collection/ARNO 50X50.jpg',",              "'Aren': '/collection/AREN.png',"],
  ["'Bond': '/collection/BOSCO 20X120 -1.jpg',",         "'Bond': '/collection/BOND.png',"],
  ["'Brillo': '/collection/BELLINI LIGHT GREY.jpg',",    "'Brillo': '/collection/BRILLO.png',"],
  ["'Buxy': '/collection/BERGAMA 40X120.jpg',",          "'Buxy': '/collection/BUXY.png',"],
  ["'Carbon': '/collection/DARKNESS 60X120.jpg',",       "'Carbon': '/collection/CARBON.png',"],
  ["'Charm': '/collection/CLEOPATRA-60x120-RENDER-01.jpg',", "'Charm': '/collection/CHARM.png',"],
  ["'Clio': '/collection/clinker.png',",                 "'Clio': '/collection/CLIO.jpg',"],
  ["'Dina': '/collection/DETROIT 60X120-1.jpg',",        "'Dina': '/collection/DINA.jpg',"],
  ["'Elan': '/collection/eleganza.png',",                "'Elan': '/collection/ELAN.jpg',"],
  ["'Elora': '/collection/eleganza.png',",               "'Elora': '/collection/ELORA.png',"],
  ["'Epona': '/collection/estel.png',",                  "'Epona': '/collection/EPONA.jpg',"],
  ["'Europe': '/collection/everest.png',",               "'Europe': '/collection/EUROPE.png',"],
  ["'Fraxinus': '/collection/FRESNO 50X50.jpg',",        "'Fraxinus': '/collection/FRAXINUS.png',"],
  ["'Fuji': '/collection/freddo.png',",                  "'Fuji': '/collection/FUJI.jpg',"],
  ["'Gordion': '/collection/GOBLIN 50X50.jpg',",         "'Gordion': '/collection/GORDION.png',"],
  ["'Hypnos': '/collection/ICON 60X60.jpg',",            "'Hypnos': '/collection/HYPNOS.png',"],
  ["'Inca': '/collection/IROKO PEARL 20X120.jpg',",      "'Inca': '/collection/INCA.png',"],
  ["'Kaleidos': '/collection/KIARA 60x60.jpg',",         "'Kaleidos': '/collection/KALEIDOS.jpg',"],
  ["'Karsos': '/collection/KARIS BIANCO 30X90 - R1.jpg',", "'Karsos': '/collection/KARSOS.jpg',"],
  ["'Larimar Ocean': '/collection/LOLITE 60X120.jpg',",  "'Larimar Ocean': '/collection/LARIMAR OCEAN.jpg',"],
  ["'Larix': '/collection/LEXA 40X120 - R1 kopya.jpg',", "'Larix': '/collection/LARIX.png',"],
  ["'Limra': '/collection/LORETO 61X61.jpg',",           "'Limra': '/collection/LIMRA.png',"],
  ["'Lisbon': '/collection/LUZON 60X120-1 .jpg',",       "'Lisbon': '/collection/LISBON.jpg',"],
  ["'Logs': '/collection/BOSCO 20X120 -1.jpg',",         "'Logs': '/collection/LOGS.png',"],
  ["'Loris': '/collection/LORETO 61X61.jpg',",           "'Loris': '/collection/LORIS.jpg',"],
  ["'Luca': '/collection/LUZON 60X120-1 .jpg',",         "'Luca': '/collection/LUCA.png',"],
  ["'Madero': '/collection/madran.png',",                "'Madero': '/collection/MADERO.png',"],
  ["'Marmol': '/collection/MARLEN 30X90.jpg',",          "'Marmol': '/collection/MARMOL.png',"],
  ["'Marvel': '/collection/MARLEN 30X90.jpg',",          "'Marvel': '/collection/MARVEL.png',"],
  ["'Marvy': '/collection/MARLEN 30X90.jpg',",           "'Marvy': '/collection/MARVY.png',"],
  ["'Merlo': '/collection/METIS 30X90 DARK-LIGHT.jpg',", "'Merlo': '/collection/MERLO.jpg',"],
  ["'Mirko': '/collection/MOONSTONE 30X90-1.jpg',",      "'Mirko': '/collection/MIRKO.png',"],
  ["'Mood': '/collection/MOONSTONE 30X90-1.jpg',",       "'Mood': '/collection/MOOD.png',"],
  ["'Mora': '/collection/motto.png',",                   "'Mora': '/collection/MORA.jpg',"],
  ["'Neva': '/collection/NELIDA 40X120 .jpg',",          "'Neva': '/collection/NEVA.png',"],
  ["'Nevada': '/collection/NOVOCEMENTO 60x60x2.jpg',",   "'Nevada': '/collection/NEVADA.png',"],
  ["'New Metro': '/collection/NOMERLES 60X120.jpg',",    "'New Metro': '/collection/NEW METRO.jpg',"],
  ["'Newport': '/collection/NOMERLES 60X120.jpg',",      "'Newport': '/collection/NEWPORT.png',"],
  ["'Nile': '/collection/NAVI BLUE 30X90 - RENDER.jpg',","'Nile': '/collection/NILE.png',"],
  ["'Norden': '/collection/NOVOCEMENTO 60x60x2.jpg',",   "'Norden': '/collection/NORDEN.png',"],
  ["'Nuvola': '/collection/NEBIOSSO BOOKMATCH R1 kopya.JPG',", "'Nuvola': '/collection/NUVOLA.png',"],
  ["'Onelia': '/collection/ORFE 40X120.jpg',",           "'Onelia': '/collection/ONELIA.jpg',"],
  ["'Onixia': '/collection/BLACK ONYX 60x120 R1.jpg',",  "'Onixia': '/collection/ONIXIA.png',"],
  ["'Orla': '/collection/PALAZZO GREY-IVORY 60X120 GENEL.jpg',", "'Orla': '/collection/ORLA.png',"],
  ["'Pamfilya': '/collection/PANGEA 40X120 R1 kopya.jpg',", "'Pamfilya': '/collection/PAMFILYA.png',"],
  ["'Quark': '/collection/quartz-1655.jpg',",            "'Quark': '/collection/QUARK.png',"],
  ["'Rio': '/collection/RIVA 60X120.jpg',",              "'Rio': '/collection/RIO.jpg',"],
  ["'Riva': '/collection/ROOT 60X120 CREMA.jpg',",       "'Riva': '/collection/RIVA.png',"],
  ["'Rubi': '/collection/RUSTIC ART 120X180.jpg',",      "'Rubi': '/collection/RUBI.jpg',"],
  ["'Saaga': '/collection/sakura.png',",                 "'Saaga': '/collection/SAAGA.png',"],
  ["'Sara': '/collection/SARDA 60X120.jpg',",            "'Sara': '/collection/SARA.jpg',"],
  ["'Sealong': '/collection/SLANA 60X120.jpg',",         "'Sealong': '/collection/SEALONG.png',"],
  ["'Silyon': '/collection/STRABON 30X90.jpg',",         "'Silyon': '/collection/SILYON.jpg',"],
  ["'Simirna': '/collection/STARLINE 30X90.jpg',",       "'Simirna': '/collection/SIMIRNA.png',"],
  ["'Tiger': '/collection/TORINO 100X100.jpg',",         "'Tiger': '/collection/TIGER.png',"],
  ["'Tsuga': '/collection/TRESSA 60X120-3.jpg',",        "'Tsuga': '/collection/TSUGA.png',"],
  ["'Vales': '/collection/VALDEZ 120X180.jpg',",         "'Vales': '/collection/VALES.jpg',"],
  ["'Venüs': '/collection/VESTA COOPER 30X90.jpg',",     "'Venüs': '/collection/VENÜS.jpg',"],
  ["'Vitray': '/collection/whisper.jpg',",               "'Vitray': '/collection/VITRAY.jpg',"],
  ["'Void': '/collection/Wilbur-Latte-60x120.jpg',",     "'Void': '/collection/VOID.png',"],
  ["'Volare': '/collection/VERSAILLES 120X180-2.jpg',",  "'Volare': '/collection/VOLARE.jpg',"],
  ["'Wario': '/collection/whisper.jpg',",                "'Wario': '/collection/WARIO.jpg',"],
];

let count = 0;
for (const [oldStr, newStr] of updates) {
  if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    count++;
  } else {
    console.log('Non trouvé:', oldStr.substring(0, 50));
  }
}

fs.writeFileSync('./src/data/content.js', content, 'utf8');
console.log(`✓ ${count}/${updates.length} lignes mises à jour`);
