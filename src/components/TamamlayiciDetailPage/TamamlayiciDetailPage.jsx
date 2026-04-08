import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tamamlayiciData } from '../../data/tamamlayiciData';
import './TamamlayiciDetailPage.css';

const TamamlayiciDetailPage = () => {
  const { productId } = useParams();
  const [lightbox, setLightbox] = useState(false);

  const product = tamamlayiciData.find(p => p.id === parseInt(productId));

  if (!product) {
    return (
      <section className="tdet-page">
        <div className="tdet-not-found">
          <h2>Produit non trouvé</h2>
          <Link to="/accessoires" className="tdet-back-link">Retour aux accessoires</Link>
        </div>
      </section>
    );
  }

  const similar = tamamlayiciData
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const specs = product.specs || {};

  return (
    <section className="tdet-page">
      {lightbox && (
        <div className="tdet-lightbox" onClick={() => setLightbox(false)}>
          <button className="tdet-lightbox-close" onClick={() => setLightbox(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <img src={product.image} alt={product.name} onClick={e => e.stopPropagation()} />
        </div>
      )}

      <div className="tdet-breadcrumb">
        <Link to="/">Accueil</Link>
        <span>/</span>
        <Link to="/accessoires">Accessoires salle de bain</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="tdet-main">
        <div className="tdet-image-wrap" onClick={() => setLightbox(true)}>
          <img src={product.image} alt={product.name} className="tdet-image" />
          <div className="tdet-zoom-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
        </div>

        <div className="tdet-info">
          <span className="tdet-category">{product.category}</span>
          <h1 className="tdet-name">{product.name}</h1>
          {product.fullName !== product.name && (
            <p className="tdet-fullname">{product.fullName.split(' - ').slice(1).join(' - ')}</p>
          )}

          <div className="tdet-divider"></div>

          <div className="tdet-specs">
            {Object.entries(specs).map(([key, val]) => (
              <div key={key} className="tdet-spec-row">
                <span className="tdet-spec-label">{key}</span>
                <span className="tdet-spec-value">{val}</span>
              </div>
            ))}
            <div className="tdet-spec-row">
              <span className="tdet-spec-label">Marque</span>
              <span className="tdet-spec-value">Bien Seramik</span>
            </div>
          </div>

          <div className="tdet-divider"></div>

          <p className="tdet-desc">
            Accessoire de salle de bain de qualité supérieure.
            Pour plus d'informations ou pour obtenir un devis, contactez notre showroom.
          </p>

          <div className="tdet-actions">
            {product.sheetUrl && (
              <a href={product.sheetUrl} download className="tdet-sheet-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Fiche produit (.rar)
              </a>
            )}
            <Link to="/contact" className="tdet-contact-btn">
              Demander un devis
            </Link>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="tdet-similar">
          <div className="tdet-section-header">
            <div className="tdet-gold-line"></div>
            <h2 className="tdet-section-title">PRODUITS SIMILAIRES</h2>
          </div>
          <div className="tdet-similar-grid">
            {similar.map(p => (
              <Link key={p.id} to={`/accessoires/${p.id}`} className="tdet-similar-card">
                <div className="tdet-similar-img-wrap">
                  <img src={p.image} alt={p.name} />
                </div>
                <span className="tdet-similar-name">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default TamamlayiciDetailPage;
