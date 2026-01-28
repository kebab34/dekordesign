import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsData } from '../../data/content';
import './CollectionDetailPage.css';

const CollectionDetailPage = () => {
  const { collectionName } = useParams();
  const decodedName = decodeURIComponent(collectionName);
  const [selectedImage, setSelectedImage] = useState(null);

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
  const tileImages = collectionTileImages[decodedName] || [product?.image];

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
    .slice(0, 6);

  // Lightbox
  const openLightbox = (src) => setSelectedImage(src);
  const closeLightbox = () => setSelectedImage(null);

  return (
    <section className="collection-detail-page">
      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <img src={selectedImage} alt="Vue agrandie" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Accueil</Link>
        <span className="separator">/</span>
        <Link to="/collections">Collections</Link>
        <span className="separator">/</span>
        <span className="current">{product.name}</span>
      </div>

      {/* Galerie Bento Grid */}
      <div className="bento-gallery">
        <div className="bento-item bento-item-main" onClick={() => openLightbox(product.image)}>
          <img src={product.image} alt={`${product.name} ambiance`} />
          <div className="bento-overlay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <div className="collection-name-overlay">
            <span className="collection-name-text">{product.name}</span>
          </div>
        </div>
        <div className="bento-side">
          {[tileImages[0], tileImages[1] || tileImages[0], tileImages[2] || product.image].map((img, index) => (
            <div
              key={index}
              className="bento-item bento-item-small"
              onClick={() => openLightbox(img)}
            >
              <img src={img} alt={`${product.name} détail ${index + 1}`} />
              <div className="bento-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Produits + Description */}
      <div className="products-description-section">
        <div className="variants-list">
          <h3 className="section-subtitle">Produits disponibles</h3>
          <div className="variants-grid">
            {tileImages.map((img, index) => {
              const fileName = img.split('/').pop().replace('.jpg', '').replace('.png', '');

              // Extraire les dimensions du nom de fichier (ex: "40X120", "60X60")
              const sizeMatch = fileName.match(/(\d+)[xX](\d+)/);
              let scaleClass = 'scale-default';
              let size = '';
              let productName = fileName;

              if (sizeMatch) {
                const width = parseInt(sizeMatch[1]);
                const height = parseInt(sizeMatch[2]);
                const ratio = width / height;
                size = `${width}x${height}`;

                // Extraire le nom sans la taille et sans "- FACE X"
                productName = fileName
                  .replace(/\d+[xX]\d+/g, '')
                  .replace(/- FACE \d+/gi, '')
                  .replace(/-/g, '')
                  .trim();

                if (ratio < 0.5) {
                  // Format très allongé comme 30x90, 40x120
                  scaleClass = 'scale-small';
                } else if (ratio < 0.9) {
                  // Format rectangulaire comme 30x60
                  scaleClass = 'scale-medium';
                }
                // ratio >= 0.9 = carré ou presque, garde scale-default
              }

              // Nom complet pour le lien (ex: "ABELLA 40X120")
              const fullProductName = `${productName} ${size}`.trim();

              return (
                <Link
                  key={index}
                  to={`/product/${encodeURIComponent(fullProductName)}`}
                  className="variant-card"
                >
                  <div className={`variant-image ${scaleClass}`}>
                    <img src={img} alt={fileName} />
                  </div>
                  <div className="variant-info">
                    <span className="variant-name">{productName}</span>
                    {size && <span className="variant-size">{size}</span>}
                  </div>
                </Link>
              );
            })}
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
              Cette surface, où le blanc intemporel rencontre sa forme la plus pure, apporte fraîcheur et élégance aux espaces. Son veinage naturel offre une esthétique unique à chaque cadre.            </p>
          </div>
        </div>
      </div>

      {/* Section Documents */}
      <div className="documents-section">
        <h3 className="section-subtitle">Documents à télécharger</h3>
        <div className="documents-grid">
          {[
            { name: 'Fiche Produit', type: 'RAR', size: '5.9 Mo', file: '/abella/abella-foy.rar' },
            { name: 'Texture', type: 'RAR', size: '12.4 Mo', file: '/abella/abella-texture.rar' },
            { name: 'Render', type: 'RAR', size: '3.5 Mo', file: '/abella/abella-render.rar' }
          ].map((doc, index) => (
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
              <a href={doc.file} download className="document-download">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Section Autres Collections */}
      <div className="other-collections-section">
        <div className="section-header">
          <div className="gold-line"></div>
          <h2 className="section-title">DÉCOUVREZ NOS AUTRES COLLECTIONS</h2>
        </div>

        <div className="other-collections-grid">
          {similarProducts.slice(0, 4).map((item) => (
            <Link
              key={item.id}
              to={`/collection/${encodeURIComponent(item.name)}`}
              className="other-collection-card"
            >
              <div className="other-collection-image-wrapper">
                <img src={item.image} alt={item.name} className="other-collection-image" />
                <div className="other-collection-overlay">
                  <div className="other-collection-hover">
                    <h4 className="other-collection-name">{item.name}</h4>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="other-collections-cta">
          <Link to="/collections" className="view-all-btn">
            Voir toutes nos collections
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CollectionDetailPage;
