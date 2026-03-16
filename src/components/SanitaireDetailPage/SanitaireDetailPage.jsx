import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sanitaireData } from '../../data/sanitaireData';
import './SanitaireDetailPage.css';

const SanitaireDetailPage = () => {
  const { productId } = useParams();
  const [lightbox, setLightbox] = useState(false);

  const product = sanitaireData.find(p => p.id === parseInt(productId));

  if (!product) {
    return (
      <section className="sanitaire-detail-page">
        <div className="sanitaire-not-found">
          <h2>Produit non trouvé</h2>
          <Link to="/sanitaire" className="sanitaire-back-link">Retour à la salle de bain</Link>
        </div>
      </section>
    );
  }

  const similar = sanitaireData
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const specs = product.specs || {};

  return (
    <section className="sanitaire-detail-page">
      {/* Lightbox */}
      {lightbox && (
        <div className="sd-lightbox" onClick={() => setLightbox(false)}>
          <button className="sd-lightbox-close" onClick={() => setLightbox(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <img src={product.image} alt={product.name} onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* Breadcrumb */}
      <div className="sd-breadcrumb">
        <Link to="/">Accueil</Link>
        <span>/</span>
        <Link to="/sanitaire">Salle de Bain</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      {/* Contenu principal */}
      <div className="sd-main">
        {/* Image */}
        <div className="sd-image-wrap" onClick={() => setLightbox(true)}>
          <img src={product.image} alt={product.name} className="sd-image" />
          <div className="sd-zoom-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
        </div>

        {/* Infos */}
        <div className="sd-info">
          <span className="sd-category">{product.category}</span>
          <h1 className="sd-name">{product.name}</h1>
          {product.fullName !== product.name && (
            <p className="sd-fullname">{product.fullName.split(' - ').slice(1).join(' - ')}</p>
          )}

          <div className="sd-divider"></div>

          <div className="sd-specs">
            {Object.entries(specs).map(([key, val]) => (
              <div key={key} className="sd-spec-row">
                <span className="sd-spec-label">{key}</span>
                <span className="sd-spec-value">{val}</span>
              </div>
            ))}
            <div className="sd-spec-row">
              <span className="sd-spec-label">Marque</span>
              <span className="sd-spec-value">Bien Seramik</span>
            </div>
          </div>

          <div className="sd-divider"></div>

          <p className="sd-desc">
            Produit sanitaire de qualité supérieure, alliant design contemporain et durabilité.
            Pour plus d'informations ou pour obtenir un devis, contactez notre showroom.
          </p>

          <div className="sd-actions">
            {product.sheetUrl && (
              <a href={product.sheetUrl} download className="sd-sheet-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Fiche produit (.rar)
              </a>
            )}
            <Link to="/contact" className="sd-contact-btn">
              Demander un devis
            </Link>
          </div>
        </div>
      </div>

      {/* Produits similaires */}
      {similar.length > 0 && (
        <div className="sd-similar">
          <div className="sd-section-header">
            <div className="sd-gold-line"></div>
            <h2 className="sd-section-title">PRODUITS SIMILAIRES</h2>
          </div>
          <div className="sd-similar-grid">
            {similar.map(p => (
              <Link key={p.id} to={`/sanitaire/${p.id}`} className="sd-similar-card">
                <div className="sd-similar-img-wrap">
                  <img src={p.image} alt={p.name} />
                </div>
                <span className="sd-similar-name">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default SanitaireDetailPage;
