import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { exterieurProducts, exterieurCategories } from '../../data/exterieurData';
import './ExterieurDetailPage.css';

const ExterieurDetailPage = () => {
  const { productId } = useParams();
  const [lightbox, setLightbox] = useState(false);

  const product = exterieurProducts.find(p => p.id === productId);
  const catLabel = exterieurCategories.find(c => c.slug === product?.mainCategory)?.name;
  const similar = product
    ? exterieurProducts.filter(p => p.mainCategory === product.mainCategory && p.id !== product.id).slice(0, 4)
    : [];

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => { if (e.key === 'Escape') setLightbox(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  if (!product) return null;

  return (
    <section className="edet-page">
      {/* Breadcrumb */}
      <div className="edet-breadcrumb">
        <Link to="/exterieur" className="edet-bread-link">Extérieur</Link>
        <span className="edet-bread-sep">/</span>
        <Link to={`/exterieur?cat=${product.mainCategory}`} className="edet-bread-link">{catLabel}</Link>
        <span className="edet-bread-sep">/</span>
        <span className="edet-bread-current">{product.name}</span>
      </div>

      {/* Main content */}
      <div className="edet-content">
        {/* Image */}
        <div
          className="edet-img-wrapper"
          onClick={() => setLightbox(true)}
          title="Voir en grand"
        >
          <img
            src={product.image}
            alt={product.name}
            className="edet-img"
            onError={e => { e.target.style.opacity = '0.1'; }}
          />
          <div className="edet-img-zoom-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </div>
        </div>

        <div className="edet-info">
          <span className="edet-cat">{catLabel}</span>
          <h1 className="edet-name">{product.name}</h1>
          <div className="edet-gold-line"></div>

          <p className="edet-desc">{product.description}</p>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="edet-specs">
              <h3 className="edet-specs-title">CARACTÉRISTIQUES</h3>
              <table className="edet-specs-table">
                <tbody>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <tr key={key}>
                      <td className="edet-spec-key">{key}</td>
                      <td className="edet-spec-val">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Link to="/contact" className="edet-cta">Demander un devis</Link>
        </div>
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <div className="edet-similar">
          <h3 className="edet-similar-title">AUTRES PRODUITS</h3>
          <div className="edet-similar-grid">
            {similar.map(p => (
              <Link key={p.id} to={`/exterieur/${p.id}`} className="edet-similar-card">
                <div className="edet-similar-img-wrap">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="edet-similar-img"
                    loading="lazy"
                    onError={e => { e.target.style.opacity = '0.1'; }}
                  />
                </div>
                <span className="edet-similar-name">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="edet-lightbox" onClick={() => setLightbox(false)}>
          <button className="edet-lightbox-close" onClick={() => setLightbox(false)} aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <img
            src={product.image}
            alt={product.name}
            className="edet-lightbox-img"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default ExterieurDetailPage;
