import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsData } from '../../data/content';
import { collectionsData } from '../../data/collectionsData';
import './CollectionDetailPage.css';

const CollectionDetailPage = () => {
  const { collectionName } = useParams();
  const decodedName = decodeURIComponent(collectionName);
  const [selectedImage, setSelectedImage] = useState(null);

  const product = productsData.find(p => p.name === decodedName);
  const collData = collectionsData[decodedName];

  if (!product || !collData) {
    return (
      <section className="collection-detail-page">
        <div className="collection-not-found">
          <h2>Collection non trouvée</h2>
          <Link to="/collections" className="back-link">Retour aux collections</Link>
        </div>
      </section>
    );
  }

  // Détecte si on a des données produits détaillées
  const hasProducts = collData.products && collData.products.length > 0;

  // Image principale
  const mainImage = collData.mainImage
    || (hasProducts ? collData.products[0].thumbnail : null)
    || (collData.images && collData.images[0])
    || product.image;

  // Images galerie bento (3 images de côté) — sans doublons
  const rawSideImages = hasProducts
    ? collData.products.slice(0, 3).map(p => p.thumbnail)
    : (collData.images || []).slice(1, 4);

  // Déduplique par rapport à mainImage, complète avec product.image si besoin
  const uniqueSideImages = rawSideImages.filter(img => img && img !== mainImage);
  if (uniqueSideImages.length < 3 && product.image && product.image !== mainImage && !uniqueSideImages.includes(product.image)) {
    uniqueSideImages.push(product.image);
  }
  const bentoSideImages = uniqueSideImages.slice(0, 3);

  // Documents
  const documents = collData.documents || [];

  // Specs communes
  const commonSpecs = collData.commonSpecs || collData.specs || {};

  // Produits similaires
  const similarProducts = productsData
    .filter(p =>
      p.name !== product.name &&
      p.categories.some(cat => product.categories.includes(cat))
    )
    .slice(0, 4);

  const openLightbox = (src) => setSelectedImage(src);
  const closeLightbox = () => setSelectedImage(null);

  // Extrait taille depuis nom de fichier
  const extractSize = (filepath) => {
    const match = filepath.match(/(\d+)[xX](\d+)/);
    return match ? `${match[1]}x${match[2]}` : null;
  };

  // Extrait un label depuis le nom de fichier (pour collections sans products[])
  const extractLabel = (filepath) => {
    return filepath
      .split('/').pop()
      .replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/kopya|REV|rev|RENDER|render/gi, '')
      .replace(/\s*\(\d+\)\s*/g, '')
      .replace(/- R\d+$/i, '')
      .trim();
  };

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
        <div className="bento-item bento-item-main" onClick={() => openLightbox(mainImage)}>
          <img src={mainImage} alt={`${product.name} ambiance`} />
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
        {bentoSideImages.length > 0 && (
          <div className="bento-side">
            {bentoSideImages.map((img, i) => (
              <div key={i} className="bento-item bento-item-small" onClick={() => openLightbox(img)}>
                <img src={img} alt={`${product.name} vue ${i + 2}`} />
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
        )}
      </div>

      {/* Section Produits + Description */}
      <div className="products-description-section">
        <div className="variants-list">
          <h3 className="section-subtitle">Produits disponibles</h3>

          {/* Collections avec données détaillées (products[]) */}
          {hasProducts ? (
            <div className="variants-grid">
              {collData.products.map((prod) => (
                <Link
                  key={prod.id}
                  to={`/product/${encodeURIComponent(decodedName)}?p=${prod.id}`}
                  className="variant-card"
                >
                  <div className="variant-image variant-image-detailed">
                    <img src={prod.thumbnail} alt={prod.name} />
                  </div>
                  <div className="variant-info">
                    <span className="variant-name">{prod.name}</span>
                    <div className="variant-tags">
                      <span className="variant-size">{prod.size}</span>
                      {prod.surface && <span className="variant-surface">{prod.surface}</span>}
                      {prod.color && <span className="variant-color">{prod.color}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Collections avec images simples */
            <div className="variants-grid">
              {(collData.images || [product.image]).map((img, index) => {
                const filename = img.split('/').pop();
                const size = extractSize(filename);
                const label = extractLabel(img);
                const ratio = (() => {
                  const m = filename.match(/(\d+)[xX](\d+)/);
                  if (!m) return 1;
                  return parseInt(m[1]) / parseInt(m[2]);
                })();
                const scaleClass = ratio < 0.5 ? 'scale-small' : ratio < 0.9 ? 'scale-medium' : 'scale-default';

                return (
                  <Link
                    key={index}
                    to={`/product/${encodeURIComponent(decodedName)}?img=${index}`}
                    className="variant-card"
                  >
                    <div className={`variant-image ${scaleClass}`}>
                      <img src={img} alt={label} />
                    </div>
                    <div className="variant-info">
                      <span className="variant-name">{label}</span>
                      {size && <span className="variant-size">{size}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="collection-description">
          <h3 className="section-subtitle">Description</h3>
          <div className="description-content">
            <div className="usage-section">
              <span className="usage-label">Parfait pour</span>
              <div className="usage-tags">
                {product.categories.map((cat, i) => (
                  <span key={i} className="usage-tag">{cat}</span>
                ))}
              </div>
            </div>
            <p>
              La collection <strong>{product.name}</strong> allie esthétique contemporaine
              et performance technique. Disponible en plusieurs formats et coloris,
              elle s'adapte à tous vos espaces intérieurs et extérieurs.
            </p>
            {/* Specs communes si disponibles */}
            {Object.keys(commonSpecs).length > 0 && (
              <div className="common-specs">
                {commonSpecs.finition && (
                  <span className="spec-tag">Finition : {commonSpecs.finition}</span>
                )}
                {commonSpecs.rectifie && (
                  <span className="spec-tag">Rectifié : {commonSpecs.rectifie}</span>
                )}
                {commonSpecs.valeurV && (
                  <span className="spec-tag">Valeur V : {commonSpecs.valeurV}</span>
                )}
                {commonSpecs.design && (
                  <span className="spec-tag">Design : {commonSpecs.design}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section Documents */}
      {documents.length > 0 && (
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
                  {doc.size && <span className="document-meta">{doc.type || 'RAR'} • {doc.size}</span>}
                  {!doc.size && doc.type && <span className="document-meta">{doc.type}</span>}
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
      )}

      {/* Autres Collections */}
      <div className="other-collections-section">
        <div className="section-header">
          <div className="gold-line"></div>
          <h2 className="section-title">DÉCOUVREZ NOS AUTRES COLLECTIONS</h2>
        </div>
        <div className="other-collections-grid">
          {similarProducts.map((item) => (
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
          <Link to="/collections" className="view-all-btn">Voir toutes nos collections</Link>
        </div>
      </div>
    </section>
  );
};

export default CollectionDetailPage;
