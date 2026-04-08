import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productsData } from '../../data/content';
import { collectionsData } from '../../data/collectionsData';
import './CollectionDetailPage.css';

const CollectionDetailPage = () => {
  const { t } = useTranslation();
  const { collectionName } = useParams();
  const decodedName = decodeURIComponent(collectionName);

  const [lightbox, setLightbox] = useState(null); // { images: [], index: 0 }

  const product = productsData.find(p => p.name === decodedName);
  const collData = collectionsData[decodedName];

  useEffect(() => { window.scrollTo(0, 0); }, [collectionName]);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setLightbox(lb => lb && lb.index < lb.images.length - 1 ? { ...lb, index: lb.index + 1 } : lb);
      if (e.key === 'ArrowLeft')  setLightbox(lb => lb && lb.index > 0 ? { ...lb, index: lb.index - 1 } : lb);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, closeLightbox]);

  if (!product || !collData) {
    return (
      <section className="cdp">
        <div className="cdp-not-found">
          <h2>Collection non trouvée</h2>
          <Link to="/collections" className="cdp-back-btn">{t('collectionDetail.back')}</Link>
        </div>
      </section>
    );
  }

  const hasProducts = collData.products && collData.products.length > 0;
  const mainImage = collData.mainImage || (hasProducts ? collData.products[0].thumbnail : null) || product.image;
  const documents = collData.documents || [];
  const commonSpecs = collData.commonSpecs || collData.specs || {};

  const similarProducts = productsData
    .filter(p => p.name !== product.name && p.categories.some(cat => product.categories.includes(cat)))
    .slice(0, 4);

  const openProduct = (prod) => {
    const images = prod.faces && prod.faces.length > 0 ? prod.faces : [prod.thumbnail];
    setLightbox({ images, index: 0 });
  };

  const openImage = (img) => setLightbox({ images: [img], index: 0 });

  // Nettoie le nom produit (retire le préfixe collection)
  const cleanName = (name) => name
    .replace(new RegExp(`^${decodedName.toUpperCase()}\\s+`, 'i'), '')
    .replace(/\s+/g, ' ').trim()
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());

  return (
    <section className="cdp">

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="cdp-lb" onClick={closeLightbox}>
          <button className="cdp-lb-close" onClick={closeLightbox}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <img
            src={lightbox.images[lightbox.index]}
            alt="Vue agrandie"
            className="cdp-lb-img"
            onClick={e => e.stopPropagation()}
          />
          {lightbox.images.length > 1 && (
            <>
              <button className="cdp-lb-nav cdp-lb-prev" disabled={lightbox.index === 0}
                onClick={e => { e.stopPropagation(); setLightbox(lb => ({ ...lb, index: lb.index - 1 })); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button className="cdp-lb-nav cdp-lb-next" disabled={lightbox.index === lightbox.images.length - 1}
                onClick={e => { e.stopPropagation(); setLightbox(lb => ({ ...lb, index: lb.index + 1 })); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              <div className="cdp-lb-dots">
                {lightbox.images.map((_, i) => (
                  <button key={i} className={`cdp-lb-dot ${i === lightbox.index ? 'active' : ''}`}
                    onClick={e => { e.stopPropagation(); setLightbox(lb => ({ ...lb, index: i })); }} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Hero ── */}
      <div className="cdp-hero" onClick={() => openImage(mainImage)}>
        <img src={mainImage} alt={product.name} className="cdp-hero-img" />
        <div className="cdp-hero-overlay">
          <div className="cdp-breadcrumb">
            <Link to="/">{t('collectionDetail.home')}</Link>
            <span>/</span>
            <Link to="/collections">Collections</Link>
            <span>/</span>
            <span>{product.name}</span>
          </div>
          <div className="cdp-hero-content">
            <span className="cdp-hero-label">Collection</span>
            <h1 className="cdp-hero-title">{product.name}</h1>
            <div className="cdp-hero-line"><span className="cdp-hero-diamond">◆</span></div>
            <p className="cdp-hero-sub">{product.categories.map(c => t(`roomCategories.${c}`, c)).join(' · ')}</p>
          </div>
          <div className="cdp-hero-zoom-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
            <span>{t('collectionDetail.viewRender')}</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="cdp-body">

        {/* Colonne gauche — produits */}
        <div className="cdp-left">
          <h2 className="cdp-section-title">
            <span>{t('collectionDetail.availableProducts', 'Produits disponibles')}</span>
            <span className="cdp-count">{hasProducts ? collData.products.length : (collData.images || []).length}</span>
          </h2>

          {hasProducts ? (
            <div className="cdp-grid">
              {collData.products.map((prod) => (
                <div key={prod.id} className="cdp-card" onClick={() => openProduct(prod)}>
                  <div className="cdp-card-img">
                    <img src={prod.thumbnail} alt={prod.name} loading="lazy" />
                    <div className="cdp-card-hover">
                      {prod.faces && prod.faces.length > 1 && (
                        <span className="cdp-faces-count">{prod.faces.length} faces</span>
                      )}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/>
                      </svg>
                    </div>
                  </div>
                  <div className="cdp-card-info">
                    <span className="cdp-card-name">{cleanName(prod.name)}</span>
                    <div className="cdp-card-tags">
                      {prod.color  && <span className="cdp-tag cdp-tag--color">{t(`colors.${prod.color}`, prod.color)}</span>}
                      {prod.surface && <span className="cdp-tag cdp-tag--surface">{t(`surfaces.${prod.surface}`, prod.surface)}</span>}
                      {prod.size   && <span className="cdp-tag cdp-tag--size">{prod.size}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cdp-grid">
              {(collData.images || [product.image]).map((img, i) => (
                <div key={i} className="cdp-card" onClick={() => openImage(img)}>
                  <div className="cdp-card-img">
                    <img src={img} alt={`Vue ${i + 1}`} loading="lazy" />
                    <div className="cdp-card-hover">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colonne droite — infos */}
        <div className="cdp-right">

          <div className="cdp-info-block">
            <span className="cdp-info-label">{t('collectionDetail.applications', 'Applications')}</span>
            <div className="cdp-usage-tags">
              {product.categories.map((cat, i) => (
                <span key={i} className="cdp-usage-tag">{t(`roomCategories.${cat}`, cat)}</span>
              ))}
            </div>
          </div>

          <div className="cdp-info-block">
            <span className="cdp-info-label">{t('collectionDetail.about', 'À propos')}</span>
            <p className="cdp-desc">
              {t('collectionDetail.aboutText', { name: product.name })}
            </p>
          </div>

          {Object.keys(commonSpecs).length > 0 && (
            <div className="cdp-info-block">
              <span className="cdp-info-label">{t('collectionDetail.specs', 'Caractéristiques')}</span>
              <div className="cdp-specs">
                {Object.entries(commonSpecs).map(([k, v]) => v && (
                  <div key={k} className="cdp-spec-row">
                    <span className="cdp-spec-key">{k}</span>
                    <span className="cdp-spec-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {documents.length > 0 && (
            <div className="cdp-info-block">
              <span className="cdp-info-label">{t('collectionDetail.documents')}</span>
              <div className="cdp-docs">
                {documents.map((doc, i) => (
                  <a key={i} href={doc.file} download className="cdp-doc">
                    <div className="cdp-doc-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div className="cdp-doc-info">
                      <span className="cdp-doc-name">{doc.name}</span>
                      <span className="cdp-doc-meta">{doc.type || t('collectionDetail.file')}{doc.size ? ` · ${doc.size}` : ''}</span>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="cdp-doc-dl">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Collections similaires ── */}
      {similarProducts.length > 0 && (
        <div className="cdp-similar">
          <div className="cdp-similar-header">
            <div className="cdp-gold-bar" />
            <h2 className="cdp-similar-title">{t('collectionDetail.otherCollections', 'AUTRES COLLECTIONS')}</h2>
            <div className="cdp-gold-bar" />
          </div>
          <div className="cdp-similar-grid">
            {similarProducts.map((item) => (
              <Link key={item.id} to={`/collection/${encodeURIComponent(item.name)}`} className="cdp-sim-card">
                <img src={item.image} alt={item.name} className="cdp-sim-img" />
                <div className="cdp-sim-overlay">
                  <span className="cdp-sim-name">{item.name}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="cdp-similar-cta">
            <Link to="/collections" className="cdp-view-all">{t('collectionDetail.viewAll')}</Link>
          </div>
        </div>
      )}

    </section>
  );
};

export default CollectionDetailPage;
