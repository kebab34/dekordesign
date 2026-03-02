import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { collectionsData } from '../../data/collectionsData';
import './ProductDetailPage.css';

// ─────────────────────────────────────────────
// Données complètes pour Abella (hardcodées car
// pas encore dans le format products[])
// ─────────────────────────────────────────────
const abellaProducts = [
  {
    id: 0,
    name: 'ABELLA 40x120',
    color: 'Blanc',
    size: '40x120',
    surface: 'Fon',
    typeCarrelage: 'Carrelage mural',
    thumbnail: '/abella/ABELLA 40X120 - FACE 1.jpg',
    faces: ['/abella/ABELLA 40X120 - FACE 1.jpg'],
    specifications: {
      'Code produit': 'W168ZDRAD30X0XMAAW10',
      'Série': 'Abella',
      'Dimensions': '40x120 cm',
      'Épaisseur': '0,7 cm',
      'Valeur V': 'V3',
      'Couleur': 'Blanc',
      'Type de produit': 'Carrelage mural',
      'Texture': 'Marbre',
      'Rectifié': 'Oui',
      'Finition': 'Mat',
    },
    packaging: {
      'm² par boîte': '1,92',
      'm² par palette': '53,76',
      'Poids par boîte': '26 kg',
      'Poids par palette': '753 kg',
    },
  },
  {
    id: 1,
    name: 'ABELLA DEKOFON 40x120',
    color: 'Blanc',
    size: '40x120',
    surface: 'Dekofon',
    typeCarrelage: 'Carrelage mural',
    thumbnail: '/abella/ABELLA DEKOFON 40X120 - FACE 1.jpg',
    faces: ['/abella/ABELLA DEKOFON 40X120 - FACE 1.jpg'],
    specifications: {
      'Code produit': 'W168QDRAD3040XMAAW10',
      'Série': 'Abella',
      'Dimensions': '40x120 cm',
      'Épaisseur': '0,8 cm',
      'Valeur V': 'V3',
      'Couleur': 'Blanc',
      'Type de produit': 'Carrelage mural',
      'Texture': 'Marbre',
      'Rectifié': 'Oui',
      'Finition': 'Mat',
    },
    packaging: {
      'm² par boîte': '1,92',
      'm² par palette': '48',
      'Poids par boîte': '28 kg',
      'Poids par palette': '725 kg',
    },
  },
  {
    id: 2,
    name: 'ABELLA 60x60',
    color: 'Blanc',
    size: '60x60',
    surface: null,
    typeCarrelage: 'Porcelaine émaillée',
    thumbnail: '/abella/ABELLA 60X60 - FACE 1.jpg',
    faces: ['/abella/ABELLA 60X60 - FACE 1.jpg'],
    specifications: {
      'Code produit': 'P015ZDRAD30X0XMAAW10',
      'Série': 'Abella',
      'Dimensions': '60x60 cm',
      'Épaisseur': '0,7 cm',
      'Valeur V': 'V3',
      'Couleur': 'Blanc',
      'Type de produit': 'Porcelaine émaillée',
      'Texture': 'Marbre',
      'Rectifié': 'Oui',
      'Finition': 'Mat',
    },
    packaging: {
      'm² par boîte': '1,8',
      'm² par palette': '57,6',
      'Poids par boîte': '28,45 kg',
      'Poids par palette': '910,4 kg',
    },
  },
];

// ─────────────────────────────────────────────
// Utilitaires
// ─────────────────────────────────────────────
const extractSize = (filepath) => {
  const match = (filepath || '').match(/(\d+)[xX](\d+)/);
  return match ? `${match[1]}x${match[2]}` : null;
};

const extractTitle = (filepath) => {
  return (filepath || '')
    .split('/').pop()
    .replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/kopya|REV|rev|RENDER|render/gi, '')
    .replace(/\s*\(\d+\)\s*/g, '')
    .replace(/- R\d+$/i, '')
    .trim();
};

// ─────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────
const ProductDetailPage = () => {
  const { productName } = useParams();
  const [searchParams] = useSearchParams();
  const [openAccordion, setOpenAccordion] = useState('options');
  const [selectedFace, setSelectedFace] = useState(0);

  const collectionName = decodeURIComponent(productName);
  const collData = collectionsData[collectionName];

  if (!collData) {
    return (
      <section className="product-detail-page">
        <div className="product-not-found">
          <h2>Produit non trouvé</h2>
          <Link to="/collections" className="back-link">Retour aux collections</Link>
        </div>
      </section>
    );
  }

  // Récupère la liste des produits selon la collection
  const products = collectionName === 'Abella'
    ? abellaProducts
    : (collData.products || null);

  // Index du produit sélectionné
  const productIndex = parseInt(searchParams.get('p') ?? searchParams.get('img') ?? '0', 10);
  const imgIndex = parseInt(searchParams.get('img') ?? '0', 10);

  // Produit courant
  let currentProduct = null;
  let currentImage = null;
  let displayTitle = '';
  let displaySize = '';

  if (products) {
    currentProduct = products[productIndex] || products[0];
    currentImage = currentProduct.faces[selectedFace] || currentProduct.thumbnail;
    displayTitle = currentProduct.name;
    displaySize = currentProduct.size;
  } else {
    // Collection sans products[] — fallback images[]
    const allImages = collData.images || [];
    currentImage = allImages[imgIndex] || allImages[0];
    displayTitle = extractTitle(currentImage);
    displaySize = extractSize(currentImage);
  }

  const toggleAccordion = (key) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  // Variantes de couleur pour le même taille
  const colorVariants = products
    ? products.filter(p => p.size === (currentProduct?.size))
    : null;

  // Tailles disponibles (une par taille unique)
  const sizeVariants = products
    ? [...new Map(products.map(p => [p.size, p])).values()]
    : null;

  return (
    <section className="product-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Accueil</Link>
        <span className="separator">/</span>
        <Link to="/collections">Collections</Link>
        <span className="separator">/</span>
        <Link to={`/collection/${encodeURIComponent(collectionName)}`}>{collectionName}</Link>
        <span className="separator">/</span>
        <span className="current">{displayTitle}</span>
      </div>

      <div className="product-detail-container">
        {/* Image principale + miniatures des faces */}
        <div className="product-image-section">
          <div className="product-image-wrapper">
            {currentImage && <img src={currentImage} alt={displayTitle} />}
          </div>

          {/* Miniatures des faces (si plusieurs faces) */}
          {currentProduct?.faces?.length > 1 && (
            <div className="product-thumbnails">
              {currentProduct.faces.map((face, i) => (
                <button
                  key={i}
                  className={`thumbnail-btn ${i === selectedFace ? 'active' : ''}`}
                  onClick={() => setSelectedFace(i)}
                >
                  <img src={face} alt={`Face ${i + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* Miniatures des autres images (collections sans products[]) */}
          {!products && (collData.images || []).length > 1 && (
            <div className="product-thumbnails">
              {(collData.images || []).map((img, i) => (
                <Link
                  key={i}
                  to={`/product/${encodeURIComponent(collectionName)}?img=${i}`}
                  className={`thumbnail-btn ${i === imgIndex ? 'active' : ''}`}
                >
                  <img src={img} alt={`Vue ${i + 1}`} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="product-info-section">
          <h1 className="product-title">{displayTitle}</h1>
          {displaySize && <p className="product-size-badge">{displaySize} cm</p>}
          {currentProduct?.typeCarrelage && (
            <p className="product-type-badge">{currentProduct.typeCarrelage}</p>
          )}

          {/* Accordéon 1: Options */}
          <div className="accordion-item">
            <button
              className={`accordion-header ${openAccordion === 'options' ? 'active' : ''}`}
              onClick={() => toggleAccordion('options')}
            >
              <span>Options du produit</span>
              <svg className="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points={openAccordion === 'options' ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
              </svg>
            </button>
            <div className={`accordion-content ${openAccordion === 'options' ? 'open' : ''}`}>
              <div className="options-grid">

                {/* Sélecteur de taille */}
                {sizeVariants && sizeVariants.length > 1 && (
                  <div className="option-item option-item-full">
                    <span className="option-label">Taille</span>
                    <div className="size-buttons">
                      {sizeVariants.map((p) => (
                        <Link
                          key={p.id}
                          to={`/product/${encodeURIComponent(collectionName)}?p=${p.id}`}
                          className={`size-btn ${p.size === displaySize ? 'active' : ''}`}
                        >
                          {p.size}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sélecteur de couleur */}
                {colorVariants && colorVariants.length > 1 && (
                  <div className="option-item option-item-full">
                    <span className="option-label">Coloris</span>
                    <div className="size-buttons">
                      {colorVariants.map((p) => (
                        <Link
                          key={p.id}
                          to={`/product/${encodeURIComponent(collectionName)}?p=${p.id}`}
                          className={`size-btn ${p.id === (currentProduct?.id) ? 'active' : ''}`}
                        >
                          {p.color}{p.surface && p.surface !== 'Fon' ? ` ${p.surface}` : ''}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Finition */}
                {(currentProduct?.specifications?.Finition || collData.commonSpecs?.finition) && (
                  <div className="option-item">
                    <span className="option-label">Finition</span>
                    <span className="option-value">
                      {currentProduct?.specifications?.Finition || collData.commonSpecs?.finition}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Accordéon 2: Caractéristiques techniques */}
          <div className="accordion-item">
            <button
              className={`accordion-header ${openAccordion === 'specs' ? 'active' : ''}`}
              onClick={() => toggleAccordion('specs')}
            >
              <span>Caractéristiques techniques</span>
              <svg className="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points={openAccordion === 'specs' ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
              </svg>
            </button>
            <div className={`accordion-content ${openAccordion === 'specs' ? 'open' : ''}`}>
              {currentProduct?.specifications ? (
                <div className="specs-list">
                  {Object.entries(currentProduct.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-label">{key}</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="specs-pending">
                  <p>Les caractéristiques techniques détaillées seront disponibles prochainement.</p>
                  <p>Pour toute information, <Link to="/contact">contactez-nous</Link>.</p>
                </div>
              )}
            </div>
          </div>

          {/* Accordéon 3: Emballage (si dispo) */}
          {currentProduct?.packaging && (
            <div className="accordion-item">
              <button
                className={`accordion-header ${openAccordion === 'packaging' ? 'active' : ''}`}
                onClick={() => toggleAccordion('packaging')}
              >
                <span>Emballage</span>
                <svg className="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points={openAccordion === 'packaging' ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
                </svg>
              </button>
              <div className={`accordion-content ${openAccordion === 'packaging' ? 'open' : ''}`}>
                <div className="specs-list">
                  {Object.entries(currentProduct.packaging).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-label">{key}</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Accordéon 4: Documents */}
          {(collData.documents || []).length > 0 && (
            <div className="accordion-item">
              <button
                className={`accordion-header ${openAccordion === 'docs' ? 'active' : ''}`}
                onClick={() => toggleAccordion('docs')}
              >
                <span>Documents</span>
                <svg className="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points={openAccordion === 'docs' ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
                </svg>
              </button>
              <div className={`accordion-content ${openAccordion === 'docs' ? 'open' : ''}`}>
                <div className="docs-list">
                  {collData.documents.map((doc, i) => (
                    <a key={i} href={doc.file} download className="doc-link">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      <span>{doc.name}</span>
                      {doc.size && <span className="doc-size">{doc.size}</span>}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Link to="/contact" className="contact-btn">Demander un devis</Link>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
