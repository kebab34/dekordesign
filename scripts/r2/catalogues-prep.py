"""
Prépare les catalogues PDF pour R2 : copie sous un nom propre et génère la couverture (page 1 en WebP).

Usage :
  python scripts/r2/catalogues-prep.py      → .r2-build/catalogues/<slug>.pdf + covers/<slug>.webp
  node scripts/r2/upload.js catalogues-build → envoi vers catalogues/…

Affiche pour chaque catalogue le nombre de pages et la taille, à reporter dans src/data/catalogues.js.
"""
import io
import os
import shutil
import sys

import fitz  # PyMuPDF
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
SRC = os.path.join(ROOT, 'public', 'catalogue')
OUT = os.path.join(ROOT, '.r2-build', 'catalogues')
COVER_WIDTH = 900

# Fichier déposé dans public/catalogue → slug publié
CATALOGUES = {
    'Dekor-Design_Catalogue_Cuisines_2026.pdf': 'cuisines-2026',
    'Dekor-Design_Catalogue_Exterieur_2026.pdf': 'exterieur-2026',
    'Dekor-Design_Catalogue_Menuiserie_2026.pdf': 'menuiserie-2026',
    'Dekor-Design_Catalogue_Portes-d-entree_2026.pdf': 'portes-entree-2026',
    'Dekor-Design_Catalogue_Revetements-sols-murs_2026.pdf': 'sols-murs-2026',
    'Dekor-Design_Catalogue_Salle-de-bains_2026.pdf': 'salle-de-bains-2026',
    'Dekor-Design_Granite-Live-Picture-Catalogue (2).pdf': 'granit',
    'Dekor-Design_Landscaping-Products-Catalogue (2).pdf': 'amenagement-paysager',
    'Dekor-Design_Natural-Stone-Live-Picture-Catalogue (2).pdf': 'pierre-naturelle',
    'Dekor-Design_Pebbles-Stone-Catalogue (2).pdf': 'galets',
    'Dekor-Design_The-Exotic-Collection (3).pdf': 'exotic-collection',
    # Catalogues carrelage déjà en ligne (couverture fournie à part) : seulement pages et taille
    'genel-katalog.pdf': None,
    'ahsap-katalogu.pdf': None,
    'oversize-katalogu.pdf': None,
    'banyo-katalogu.pdf': None,
    'duvar-katalogu.pdf': None,
}

os.makedirs(os.path.join(OUT, 'covers'), exist_ok=True)
missing = []
for name, slug in CATALOGUES.items():
    src = os.path.join(SRC, name)
    if not os.path.exists(src):
        missing.append(name)
        continue
    doc = fitz.open(src)
    size_mb = os.path.getsize(src) / 1024 / 1024
    if slug:
        shutil.copyfile(src, os.path.join(OUT, f'{slug}.pdf'))
        page = doc[0]
        pix = page.get_pixmap(matrix=fitz.Matrix(COVER_WIDTH / page.rect.width, COVER_WIDTH / page.rect.width))
        img = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')
        img.save(os.path.join(OUT, 'covers', f'{slug}.webp'), 'WEBP', quality=82, method=6)
        ratio = f'{img.width}/{img.height}'
    else:
        ratio = '-'
    print(f'{slug or name:24} pages: {doc.page_count:4}  taille: {size_mb:6.1f} Mo  couverture: {ratio}')

if missing:
    print('Introuvable(s) :', ', '.join(missing))
    sys.exit(1)
