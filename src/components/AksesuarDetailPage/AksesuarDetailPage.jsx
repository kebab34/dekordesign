import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { aksesuarData } from '../../data/aksesuarData';
import './AksesuarDetailPage.css';

const AksesuarDetailPage = () => {
  const { productId } = useParams();
  const [lightbox, setLightbox] = useState(false);

  const product = aksesuarData.find(p => p.id === parseInt(productId));

  if (!product) {
    return (
      <section className="aksd-page">
        <div className="aksd-not-found">
          <h2>Produit non trouvé</h2>
          <Link to="/bain-accessoires" className="aksd-back-link">Retour aux accessoires</Link>
        </div>
      </section>
    );
  }

  const similar = aksesuarData
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const specs = product.specs || {};

  return (
    <section className="aksd-page">
      {lightbox && (
        <div className="aksd-lightbox" onClick={() => setLightbox(false)}>
          <button className="aksd-lightbox-close" onClick={() => setLightbox(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <img src={product.image} alt={product.name} onClick={e => e.stopPropagation()} />
        </div>
      )}

      <div className="aksd-breadcrumb">
        <Link to="/">Accueil</Link>
        <span>/</span>
        <Link to="/bain-accessoires">Accessoires Salle de Bain</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="aksd-main">
        <div className="aksd-image-wrap" onClick={() => setLightbox(true)}>
          <img src={product.image} alt={product.name} className="aksd-image" />
          <div className="aksd-zoom-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
        </div>

        <div className="aksd-info">
          <span className="aksd-category">{product.category}</span>
          <h1 className="aksd-name">{product.name}</h1>
          {product.fullName !== product.name && (
            <p className="aksd-fullname">{product.fullName.split(' - ').slice(1).join(' - ')}</p>
          )}

          <div className="aksd-divider"></div>

          <div className="aksd-specs">
            {Object.entries(specs).map(([key, val]) => (
              <div key={key} className="aksd-spec-row">
                <span className="aksd-spec-label">{key}</span>
                <span className="aksd-spec-value">{val}</span>
              </div>
            ))}
            <div className="aksd-spec-row">
              <span className="aksd-spec-label">Marque</span>
              <span className="aksd-spec-value">Bien Seramik</span>
            </div>
          </div>

          <div className="aksd-divider"></div>

          <p className="aksd-desc">
            Accessoire de salle de bain de qualité supérieure, alliant design et fonctionnalité.
            Pour plus d'informations ou pour obtenir un devis, contactez notre showroom.
          </p>

          <div className="aksd-actions">
            {product.sheetUrl && (
              <a href={product.sheetUrl} download className="aksd-sheet-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Fiche produit (.rar)
              </a>
            )}
            <Link to="/contact" className="aksd-contact-btn">
              Demander un devis
            </Link>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="aksd-similar">
          <div className="aksd-section-header">
            <div className="aksd-gold-line"></div>
            <h2 className="aksd-section-title">PRODUITS SIMILAIRES</h2>
          </div>
          <div className="aksd-similar-grid">
            {similar.map(p => (
              <Link key={p.id} to={`/bain-accessoires/${p.id}`} className="aksd-similar-card">
                <div className="aksd-similar-img-wrap">
                  <img src={p.image} alt={p.name} />
                </div>
                <span className="aksd-similar-name">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default AksesuarDetailPage;
