import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dusData } from '../../data/dusData';
import './DusDetailPage.css';

const DusDetailPage = () => {
  const { productId } = useParams();
  const [lightbox, setLightbox] = useState(false);

  const product = dusData.find(p => p.id === parseInt(productId));

  if (!product) {
    return (
      <section className="dusd-page">
        <div className="dusd-not-found">
          <h2>Produit non trouvé</h2>
          <Link to="/douche" className="dusd-back-link">Retour aux systèmes de douche</Link>
        </div>
      </section>
    );
  }

  const similar = dusData
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const specs = product.specs || {};

  return (
    <section className="dusd-page">
      {lightbox && (
        <div className="dusd-lightbox" onClick={() => setLightbox(false)}>
          <button className="dusd-lightbox-close" onClick={() => setLightbox(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <img src={product.image} alt={product.name} onClick={e => e.stopPropagation()} />
        </div>
      )}

      <div className="dusd-breadcrumb">
        <Link to="/">Accueil</Link>
        <span>/</span>
        <Link to="/douche">Systèmes de douche</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="dusd-main">
        <div className="dusd-image-wrap" onClick={() => setLightbox(true)}>
          <img src={product.image} alt={product.name} className="dusd-image" />
          <div className="dusd-zoom-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
        </div>

        <div className="dusd-info">
          <span className="dusd-category">{product.category}</span>
          <h1 className="dusd-name">{product.name}</h1>
          {product.fullName !== product.name && (
            <p className="dusd-fullname">{product.fullName.split(' - ').slice(1).join(' - ')}</p>
          )}

          <div className="dusd-divider"></div>

          <div className="dusd-specs">
            {Object.entries(specs).map(([key, val]) => (
              <div key={key} className="dusd-spec-row">
                <span className="dusd-spec-label">{key}</span>
                <span className="dusd-spec-value">{val}</span>
              </div>
            ))}
            <div className="dusd-spec-row">
              <span className="dusd-spec-label">Marque</span>
              <span className="dusd-spec-value">Bien Seramik</span>
            </div>
          </div>

          <div className="dusd-divider"></div>

          <p className="dusd-desc">
            Système de douche de qualité supérieure, conçu pour allier esthétique et performance.
            Pour plus d'informations ou pour obtenir un devis, contactez notre showroom.
          </p>

          <div className="dusd-actions">
            {product.sheetUrl && (
              <a href={product.sheetUrl} download className="dusd-sheet-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Fiche produit (.rar)
              </a>
            )}
            <Link to="/contact" className="dusd-contact-btn">
              Demander un devis
            </Link>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="dusd-similar">
          <div className="dusd-section-header">
            <div className="dusd-gold-line"></div>
            <h2 className="dusd-section-title">PRODUITS SIMILAIRES</h2>
          </div>
          <div className="dusd-similar-grid">
            {similar.map(p => (
              <Link key={p.id} to={`/douche/${p.id}`} className="dusd-similar-card">
                <div className="dusd-similar-img-wrap">
                  <img src={p.image} alt={p.name} />
                </div>
                <span className="dusd-similar-name">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default DusDetailPage;
