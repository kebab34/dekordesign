// Hébergement des fichiers statiques (images, PDF) sur Cloudflare R2.
// Surchargeable via REACT_APP_ASSET_BASE (ex. dans Vercel) sans toucher au code.
export const ASSET_BASE = (process.env.REACT_APP_ASSET_BASE || 'https://assets.dekordesign.fr').replace(/\/$/, '');

// Les données stockent des clés relatives sans extension ("tiles/abella/abella-blanc").
// size 'sm' → miniature 600 px (grilles), 'lg' → 1600 px (hero, lightbox).
// Une URL absolue ou un chemin local est renvoyé tel quel.
export const tileUrl = (key, size = 'lg') => {
  if (!key || /^(https?:)?\//.test(key)) return key;
  return `${ASSET_BASE}/${key}${size === 'sm' ? '-sm' : ''}.webp`;
};

// Fichier quelconque du bucket (PDF…) : clé avec extension ("catalogues/genel-katalog.pdf")
export const assetUrl = key => `${ASSET_BASE}/${key}`;
