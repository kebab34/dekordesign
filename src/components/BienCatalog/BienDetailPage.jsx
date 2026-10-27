import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../SEO/SEO';
import './BienDetailPage.css';
import { quoteUrl } from '../../config/company';
import { bienProductSeo } from '../../config/seo';

// Page détail générique pour les catalogues Bien Seramik (voir ./catalogs/ pour la configuration)
const BienDetailPage = ({ catalog }) => {
  const { data, basePath, crumbLabel, backLabel, description } = catalog;
  const { productId } = useParams();
  const [lightbox, setLightbox] = useState(false);

  const product = data.find(p => p.id === parseInt(productId));

  if (!product) {
    return (
      <section className="bcd-page">
        <div className="bcd-not-found">
          <h2>Produit non trouvé</h2>
          <Link to={basePath} className="bcd-back-link">{backLabel}</Link>
        </div>
      </section>
    );
  }

  const similar = data
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const specs = product.specs || {};

  return (
    <section className="bcd-page">
      <SEO {...bienProductSeo(catalog, product)} />

      {lightbox && (
        <div className="bcd-lightbox" onClick={() => setLightbox(false)}>
          <button className="bcd-lightbox-close" onClick={() => setLightbox(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <img src={product.image} alt={product.name} onClick={e => e.stopPropagation()} />
        </div>
      )}

      <div className="bcd-breadcrumb">
        <Link to="/">Accueil</Link>
        <span>/</span>
        <Link to={basePath}>{crumbLabel}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="bcd-main">
        <div className="bcd-image-wrap" onClick={() => setLightbox(true)}>
          <img src={product.image} alt={product.name} className="bcd-image" />
          <div className="bcd-zoom-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
        </div>

        <div className="bcd-info">
          <span className="bcd-category">{product.category}</span>
          <h1 className="bcd-name">{product.name}</h1>
          {product.fullName !== product.name && (
            <p className="bcd-fullname">{product.fullName.split(' - ').slice(1).join(' - ')}</p>
          )}

          <div className="bcd-divider"></div>

          <div className="bcd-specs">
            {Object.entries(specs).map(([key, val]) => (
              <div key={key} className="bcd-spec-row">
                <span className="bcd-spec-label">{key}</span>
                <span className="bcd-spec-value">{val}</span>
              </div>
            ))}
            <div className="bcd-spec-row">
              <span className="bcd-spec-label">Marque</span>
              <span className="bcd-spec-value">Bien Seramik</span>
            </div>
          </div>

          <div className="bcd-divider"></div>

          <p className="bcd-desc">
            {description}
            {' '}Pour plus d'informations ou pour obtenir un devis, contactez notre showroom.
          </p>

          <div className="bcd-actions">
            {product.sheetUrl && (
              <a href={product.sheetUrl} download className="bcd-sheet-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Fiche produit (.rar)
              </a>
            )}
            <Link to={quoteUrl(`${product.fullName} (réf. ${product.specs?.['Référence'] || product.id})`)} className="bcd-contact-btn">
              Demander un devis
            </Link>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="bcd-similar">
          <div className="bcd-section-header">
            <div className="bcd-gold-line"></div>
            <h2 className="bcd-section-title">PRODUITS SIMILAIRES</h2>
          </div>
          <div className="bcd-similar-grid">
            {similar.map(p => (
              <Link key={p.id} to={`${basePath}/${p.id}`} className="bcd-similar-card">
                <div className="bcd-similar-img-wrap">
                  <img src={p.image} alt={p.name} loading="lazy" />
                </div>
                <span className="bcd-similar-name">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default BienDetailPage;
