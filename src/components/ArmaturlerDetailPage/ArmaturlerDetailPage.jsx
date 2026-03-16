import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { armaturlerData } from '../../data/armaturlerData';
import './ArmaturlerDetailPage.css';

const ArmaturlerDetailPage = () => {
  const { productId } = useParams();
  const [lightbox, setLightbox] = useState(false);

  const product = armaturlerData.find(p => p.id === parseInt(productId));

  if (!product) {
    return (
      <section className="armd-page">
        <div className="armd-not-found">
          <h2>Produit non trouvé</h2>
          <Link to="/armaturler" className="armd-back-link">Retour à la robinetterie</Link>
        </div>
      </section>
    );
  }

  const similar = armaturlerData
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const specs = product.specs || {};

  return (
    <section className="armd-page">
      {lightbox && (
        <div className="armd-lightbox" onClick={() => setLightbox(false)}>
          <button className="armd-lightbox-close" onClick={() => setLightbox(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <img src={product.image} alt={product.name} onClick={e => e.stopPropagation()} />
        </div>
      )}

      <div className="armd-breadcrumb">
        <Link to="/">Accueil</Link>
        <span>/</span>
        <Link to="/armaturler">Robinetterie &amp; Douche</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="armd-main">
        <div className="armd-image-wrap" onClick={() => setLightbox(true)}>
          <img src={product.image} alt={product.name} className="armd-image" />
          <div className="armd-zoom-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
        </div>

        <div className="armd-info">
          <span className="armd-category">{product.category}</span>
          <h1 className="armd-name">{product.name}</h1>
          {product.fullName !== product.name && (
            <p className="armd-fullname">{product.fullName.split(' - ').slice(1).join(' - ')}</p>
          )}

          <div className="armd-divider"></div>

          <div className="armd-specs">
            {Object.entries(specs).map(([key, val]) => (
              <div key={key} className="armd-spec-row">
                <span className="armd-spec-label">{key}</span>
                <span className="armd-spec-value">{val}</span>
              </div>
            ))}
            <div className="armd-spec-row">
              <span className="armd-spec-label">Marque</span>
              <span className="armd-spec-value">Bien Seramik</span>
            </div>
          </div>

          <div className="armd-divider"></div>

          <p className="armd-desc">
            Robinet de qualité supérieure, conçu pour allier esthétique et performance.
            Pour plus d'informations ou pour obtenir un devis, contactez notre showroom.
          </p>

          <div className="armd-actions">
            {product.sheetUrl && (
              <a href={product.sheetUrl} download className="armd-sheet-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Fiche produit (.rar)
              </a>
            )}
            <Link to="/contact" className="armd-contact-btn">
              Demander un devis
            </Link>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="armd-similar">
          <div className="armd-section-header">
            <div className="armd-gold-line"></div>
            <h2 className="armd-section-title">PRODUITS SIMILAIRES</h2>
          </div>
          <div className="armd-similar-grid">
            {similar.map(p => (
              <Link key={p.id} to={`/armaturler/${p.id}`} className="armd-similar-card">
                <div className="armd-similar-img-wrap">
                  <img src={p.image} alt={p.name} />
                </div>
                <span className="armd-similar-name">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ArmaturlerDetailPage;
