import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cuisineData } from '../../data/cuisineData';
import './CuisineDetailPage.css';

const CuisineDetailPage = () => {
  const { productId } = useParams();
  const [lightbox, setLightbox] = useState(false);

  const product = cuisineData.find(p => p.id === parseInt(productId));

  if (!product) {
    return (
      <section className="cuisine-detail-page">
        <div className="cdet-not-found">
          <h2>Modèle non trouvé</h2>
          <Link to="/cuisines" className="cdet-back-link">Retour aux cuisines</Link>
        </div>
      </section>
    );
  }

  const similar = cuisineData
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <section className="cuisine-detail-page">
      {/* Lightbox */}
      {lightbox && (
        <div className="cdet-lightbox" onClick={() => setLightbox(false)}>
          <button className="cdet-lightbox-close" onClick={() => setLightbox(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <img src={product.image} alt={product.name} onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* Breadcrumb */}
      <div className="cdet-breadcrumb">
        <Link to="/">Accueil</Link>
        <span>/</span>
        <Link to="/cuisines">Cuisines</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      {/* Contenu principal */}
      <div className="cdet-main">
        {/* Image */}
        <div className="cdet-image-wrap" onClick={() => setLightbox(true)}>
          <img src={product.image} alt={product.name} className="cdet-image" />
          <div className="cdet-zoom-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
        </div>

        {/* Infos */}
        <div className="cdet-info">
          <span className="cdet-category">{product.category}</span>
          <h1 className="cdet-name">{product.name}</h1>

          <div className="cdet-divider"></div>

          <p className="cdet-desc">{product.description}</p>

          <div className="cdet-divider"></div>

          <div className="cdet-specs">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="cdet-spec-row">
                <span className="cdet-spec-label">{key}</span>
                <span className="cdet-spec-value">{val}</span>
              </div>
            ))}
          </div>

          <div className="cdet-divider"></div>

          <div className="cdet-actions">
            <Link to="/contact" className="cdet-contact-btn">
              Demander un devis
            </Link>
          </div>
        </div>
      </div>

      {/* Modèles similaires */}
      {similar.length > 0 && (
        <div className="cdet-similar">
          <div className="cdet-section-header">
            <div className="cdet-gold-line"></div>
            <h2 className="cdet-section-title">DANS LE MÊME STYLE</h2>
          </div>
          <div className="cdet-similar-grid">
            {similar.map(p => (
              <Link key={p.id} to={`/cuisines/${p.id}`} className="cdet-similar-card">
                <div className="cdet-similar-img-wrap">
                  <img src={p.image} alt={p.name} />
                  <div className="cdet-similar-overlay"></div>
                </div>
                <span className="cdet-similar-name">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default CuisineDetailPage;
