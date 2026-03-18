import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { menuiserieProducts, menuiserieCategories } from '../../data/menuiserieData';
import './MenuiserieDetailPage.css';

const MenuiserieDetailPage = () => {
  const { productId } = useParams();
  const [lightbox, setLightbox] = useState(false);
  const [variantIdx, setVariantIdx] = useState(0);

  const product = menuiserieProducts.find(p => p.id === productId);
  const catLabel = menuiserieCategories.find(c => c.slug === product?.mainCategory)?.name;
  const similar = product
    ? menuiserieProducts.filter(p => p.mainCategory === product.mainCategory && p.id !== product.id).slice(0, 4)
    : [];

  // Reset variant quand on change de produit
  useEffect(() => { setVariantIdx(0); }, [productId]);

  // Escape pour fermer la lightbox
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => { if (e.key === 'Escape') setLightbox(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox]);

  // Bloquer le scroll quand lightbox ouverte
  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  if (!product) return null;

  const hasVariants = product.variants && product.variants.length > 0;
  const activeVariant = hasVariants ? product.variants[variantIdx] : null;
  const displayDesc  = activeVariant ? activeVariant.description  : product.description;
  const displaySpecs = activeVariant ? activeVariant.specs        : product.specs;

  return (
    <section className="mdet-page">
      {/* Breadcrumb */}
      <div className="mdet-breadcrumb">
        <Link to="/menuiserie" className="mdet-bread-link">Menuiserie</Link>
        <span className="mdet-bread-sep">/</span>
        <Link to={`/menuiserie?cat=${product.mainCategory}`} className="mdet-bread-link">{catLabel}</Link>
        <span className="mdet-bread-sep">/</span>
        <span className="mdet-bread-current">{product.name}</span>
      </div>

      {/* Main content */}
      <div className="mdet-content">
        {/* Image cliquable */}
        <div
          className={`mdet-img-wrapper ${product.cover ? 'mdet-img-wrapper--cover' : ''}`}
          onClick={() => setLightbox(true)}
          title="Voir en grand"
        >
          <img
            src={product.image}
            alt={product.name}
            className="mdet-img"
            onError={e => { e.target.style.opacity = '0.1'; }}
          />
          <div className="mdet-img-zoom-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </div>
        </div>

        <div className="mdet-info">
          <span className="mdet-cat">{catLabel}</span>
          <h1 className="mdet-name">{product.name}</h1>
          <div className="mdet-gold-line"></div>

          {/* Sélecteur de variantes */}
          {hasVariants && (
            <div className="mdet-variants">
              {product.variants.map((v, i) => (
                <button
                  key={v.label}
                  className={`mdet-variant-btn ${variantIdx === i ? 'active' : ''}`}
                  onClick={() => setVariantIdx(i)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}

          <p className="mdet-desc">{displayDesc}</p>

          {displaySpecs && Object.keys(displaySpecs).length > 0 && (
            <div className="mdet-specs">
              <h3 className="mdet-specs-title">CARACTÉRISTIQUES</h3>
              <table className="mdet-specs-table">
                <tbody>
                  {Object.entries(displaySpecs).map(([key, val]) => (
                    <tr key={key}>
                      <td className="mdet-spec-key">{key}</td>
                      <td className="mdet-spec-val">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Link to="/contact" className="mdet-cta">Demander un devis</Link>
        </div>
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <div className="mdet-similar">
          <h3 className="mdet-similar-title">AUTRES PRODUITS</h3>
          <div className="mdet-similar-grid">
            {similar.map(p => (
              <Link key={p.id} to={`/menuiserie/${p.id}`} className="mdet-similar-card">
                <div className="mdet-similar-img-wrap">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="mdet-similar-img"
                    loading="lazy"
                    onError={e => { e.target.style.opacity = '0.1'; }}
                  />
                </div>
                <span className="mdet-similar-name">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="mdet-lightbox" onClick={() => setLightbox(false)}>
          <button className="mdet-lightbox-close" onClick={() => setLightbox(false)} aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <img
            src={product.image}
            alt={product.name}
            className="mdet-lightbox-img"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default MenuiserieDetailPage;
