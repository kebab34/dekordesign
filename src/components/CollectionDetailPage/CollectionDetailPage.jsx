import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsData } from '../../data/content';
import './CollectionDetailPage.css';

const CollectionDetailPage = () => {
  const { collectionName } = useParams();
  const decodedName = decodeURIComponent(collectionName);

  // Trouver le produit de cette collection
  const product = productsData.find(p => p.name === decodedName);

  // Images spécifiques par collection (carrelages)
  const collectionTileImages = {
    'Abella': [
      '/abella/ABELLA 40X120 - FACE 1.jpg',
      '/abella/ABELLA 60X60 - FACE 1.jpg',
      '/abella/ABELLA DEKOFON 40X120 - FACE 1.jpg'
    ]
  };

  // Récupérer les images de carrelage pour cette collection
  const tileImages = collectionTileImages[decodedName] || [product?.image, product?.image];

  // Si la collection n'existe pas
  if (!product) {
    return (
      <section className="collection-detail-page">
        <div className="collection-not-found">
          <h2>Collection non trouvée</h2>
          <Link to="/collections" className="back-link">Retour aux collections</Link>
        </div>
      </section>
    );
  }

  // Produits similaires (même catégorie, différente collection)
  const similarProducts = productsData
    .filter(p =>
      p.name !== product.name &&
      p.categories.some(cat => product.categories.includes(cat))
    )
    .slice(0, 8);

  // Variantes du produit (différentes tailles/matières)
  const variants = tileImages.map((img, index) => {
    const fileName = img.split('/').pop().replace('.jpg', '').replace('.png', '');
    return {
      id: index + 1,
      name: fileName,
      image: img,
      material: product.material
    };
  });

  // Documents disponibles (simulés)
  const documents = [
    { name: 'Fiche technique', type: 'PDF', size: '2.4 MB', icon: 'pdf' },
    { name: 'Guide de pose', type: 'PDF', size: '1.8 MB', icon: 'pdf' },
    { name: 'Certificat CE', type: 'PDF', size: '0.5 MB', icon: 'pdf' }
  ];

  return (
    <section className="collection-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Accueil</Link>
        <span className="separator">/</span>
        <Link to="/collections">Collections</Link>
        <span className="separator">/</span>
        <span className="current">{product.name}</span>
      </div>

      {/* Section Hero - Photos */}
      <div className="hero-section">
        <div className="hero-main-image">
          <img src={product.image} alt={`${product.name} ambiance`} />
          <div className="hero-collection-name">
            <span className="hero-name-text">{product.name}</span>
          </div>
        </div>
        <div className="hero-side-images">
          <div className="side-image">
            <img src={tileImages[0]} alt={`${product.name} carrelage 1`} />
          </div>
          <div className="side-image">
            <img src={tileImages[1] || tileImages[0]} alt={`${product.name} carrelage 2`} />
          </div>
        </div>
      </div>

      {/* Section Produits + Description */}
      <div className="products-description-section">
        <div className="variants-list">
          <h3 className="section-subtitle">Produits disponibles</h3>
          <div className="variants-grid">
            {variants.map((variant) => (
              <div key={variant.id} className="variant-card">
                <div className="variant-image">
                  <img src={variant.image} alt={variant.name} />
                </div>
                <div className="variant-info">
                  <span className="variant-name">{variant.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="collection-description">
          <h3 className="section-subtitle">Description</h3>
          <div className="description-content">
            <div className="usage-section">
              <span className="usage-label">Parfait pour</span>
              <div className="usage-tags">
                {product.categories.map((cat, index) => (
                  <span key={index} className="usage-tag">{cat}</span>
                ))}
              </div>
            </div>

            <p>
              Cette surface, où le blanc intemporel rencontre sa forme la plus pure, apporte fraîcheur et élégance aux espaces. Son veinage naturel offre une esthétique unique à chaque cadre.
            </p>
          </div>
        </div>
      </div>

      {/* Section Documents */}
      <div className="documents-section">
        <h3 className="section-subtitle">Documents à télécharger</h3>
        <div className="documents-grid">
          {documents.map((doc, index) => (
            <div key={index} className="document-card">
              <div className="document-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <div className="document-info">
                <span className="document-name">{doc.name}</span>
                <span className="document-meta">{doc.type} • {doc.size}</span>
              </div>
              <button className="document-download">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section Collections Similaires */}
      <div className="similar-section">
        <div className="similar-header">
          <h3 className="section-subtitle">Collections similaires</h3>
          <Link to="/collections" className="view-all-link">Voir toutes les collections</Link>
        </div>
        <div className="similar-grid">
          {similarProducts.map((item) => (
            <Link
              key={item.id}
              to={`/collection/${encodeURIComponent(item.name)}`}
              className="similar-card"
            >
              <div className="similar-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="similar-info">
                <span className="similar-name">{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionDetailPage;
