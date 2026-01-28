import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { productName } = useParams();
  const decodedName = decodeURIComponent(productName);

  // États pour les accordéons
  const [openAccordion, setOpenAccordion] = useState('options');

  // Données du produit (à remplacer par des données dynamiques plus tard)
  const productData = {
    'ABELLA 40x120': {
      image: '/abella/ABELLA 40X120 - FACE 1.jpg',
      collection: 'Abella',
      currentSize: '40x120',
      currentSurface: 'Fon',
      availableSizes: [
        { size: '40x120', productName: 'ABELLA 40x120' },
        { size: '60x60', productName: 'ABELLA 60x60' }
      ],
      availableSurfaces: [
        { surface: 'Fon', productName: 'ABELLA 40x120' },
        { surface: 'Dekofon', productName: 'ABELLA DEKOFON 40x120' }
      ],
      options: {
        finition: 'Mat',
        couleur: 'Blanc'
      },
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
        'Finition': 'Mat'
      },
      packaging: {
        'm² par boîte': '1,92',
        'm² par palette': '53,76',
        'Poids par boîte': '26 kg',
        'Poids par palette': '753 kg'
      }
    },
    'ABELLA DEKOFON 40x120': {
      image: '/abella/ABELLA DEKOFON 40X120 - FACE 1.jpg',
      collection: 'Abella',
      currentSize: '40x120',
      currentSurface: 'Dekofon',
      availableSizes: [
        { size: '40x120', productName: 'ABELLA DEKOFON 40x120' }
      ],
      availableSurfaces: [
        { surface: 'Fon', productName: 'ABELLA 40x120' },
        { surface: 'Dekofon', productName: 'ABELLA DEKOFON 40x120' }
      ],
      options: {
        finition: 'Mat',
        couleur: 'Blanc'
      },
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
        'Finition': 'Mat'
      },
      packaging: {
        'm² par boîte': '1,92',
        'm² par palette': '48',
        'Poids par boîte': '28 kg',
        'Poids par palette': '725 kg'
      }
    },
    'ABELLA 60x60': {
      image: '/abella/ABELLA 60X60 - FACE 1.jpg',
      collection: 'Abella',
      currentSize: '60x60',
      currentSurface: null,
      availableSizes: [
        { size: '40x120', productName: 'ABELLA 40x120' },
        { size: '60x60', productName: 'ABELLA 60x60' }
      ],
      availableSurfaces: null,
      options: {
        finition: 'Mat',
        couleur: 'Blanc'
      },
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
        'Finition': 'Mat'
      },
      packaging: {
        'm² par boîte': '1,8',
        'm² par palette': '57,6',
        'Poids par boîte': '28,45 kg',
        'Poids par palette': '910,4 kg'
      }
    }
  };

  // Trouver le produit
  const product = productData[decodedName];

  const toggleAccordion = (accordion) => {
    setOpenAccordion(openAccordion === accordion ? null : accordion);
  };

  if (!product) {
    return (
      <section className="product-detail-page">
        <div className="product-not-found">
          <h2>Produit non trouvé</h2>
          <Link to="/collections" className="back-link">Retour aux collections</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="product-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Accueil</Link>
        <span className="separator">/</span>
        <Link to="/collections">Collections</Link>
        <span className="separator">/</span>
        <Link to={`/collection/${encodeURIComponent(product.collection)}`}>{product.collection}</Link>
        <span className="separator">/</span>
        <span className="current">{decodedName}</span>
      </div>

      <div className="product-detail-container">
        {/* Image du produit */}
        <div className="product-image-section">
          <div className="product-image-wrapper">
            <img src={product.image} alt={decodedName} />
          </div>
        </div>

        {/* Informations du produit */}
        <div className="product-info-section">
          <h1 className="product-title">{decodedName}</h1>

          {/* Accordéon 1: Options du produit */}
          <div className="accordion-item">
            <button
              className={`accordion-header ${openAccordion === 'options' ? 'active' : ''}`}
              onClick={() => toggleAccordion('options')}
            >
              <span>Option du produit</span>
              <svg className="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points={openAccordion === 'options' ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
              </svg>
            </button>
            <div className={`accordion-content ${openAccordion === 'options' ? 'open' : ''}`}>
              <div className="options-grid">
                <div className="option-item option-item-full">
                  <span className="option-label">Taille</span>
                  <div className="size-buttons">
                    {product.availableSizes.map((sizeOption) => (
                      <Link
                        key={sizeOption.size}
                        to={`/product/${encodeURIComponent(sizeOption.productName)}`}
                        className={`size-btn ${sizeOption.size === product.currentSize ? 'active' : ''}`}
                      >
                        {sizeOption.size}
                      </Link>
                    ))}
                  </div>
                </div>
                {product.availableSurfaces && (
                  <div className="option-item option-item-full">
                    <span className="option-label">Surface</span>
                    <div className="size-buttons">
                      {product.availableSurfaces.map((surfaceOption) => (
                        <Link
                          key={surfaceOption.surface}
                          to={`/product/${encodeURIComponent(surfaceOption.productName)}`}
                          className={`size-btn ${surfaceOption.surface === product.currentSurface ? 'active' : ''}`}
                        >
                          {surfaceOption.surface}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                <div className="option-item">
                  <span className="option-label">Finition</span>
                  <span className="option-value">{product.options.finition}</span>
                </div>
                <div className="option-item">
                  <span className="option-label">Couleur</span>
                  <span className="option-value">{product.options.couleur}</span>
                </div>
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
              <div className="specs-list">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Accordéon 3: Emballage */}
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
                {Object.entries(product.packaging).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bouton de contact */}
          <Link to="/contact" className="contact-btn">
            Demander un devis
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
