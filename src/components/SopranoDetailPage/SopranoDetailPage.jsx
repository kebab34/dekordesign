import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sopranoData } from '../../data/sopranoData';
import './SopranoDetailPage.css';

const SopranoDetailPage = () => {
  const { slug } = useParams();
  const product = sopranoData.find(p => p.slug === slug);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox,  setLightbox]  = useState(false);

  if (!product) {
    return (
      <div className="spd-notfound">
        <p>Modèle introuvable.</p>
        <Link to="/cuisines-soprano">← Retour aux cuisines</Link>
      </div>
    );
  }

  const similar = sopranoData.filter(p => p.slug !== slug).slice(0, 4);

  return (
    <section className="spd-page">
      {/* Breadcrumb */}
      <nav className="spd-breadcrumb">
        <Link to="/">Accueil</Link>
        <span>›</span>
        <Link to="/cuisines-soprano">Cuisines sur Mesure</Link>
        <span>›</span>
        <span>{product.name}</span>
      </nav>

      <div className="spd-content">
        {/* Galerie */}
        <div className="spd-gallery">
          <div className="spd-main-img-wrap" onClick={() => setLightbox(true)}>
            <img src={product.images[activeImg]} alt={product.name} className="spd-main-img" />
            <div className="spd-zoom-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="spd-thumbs">
              {product.images.map((img, i) => (
                <div key={i} className={`spd-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="spd-info">
          <div className="spd-gold-line"></div>
          <span className="spd-style-tag">{product.style}</span>
          <h1 className="spd-name">{product.name.toUpperCase()}</h1>
          <p className="spd-category">Cuisine sur mesure · Soprano</p>

          {product.description && (
            <p className="spd-description">{product.description}</p>
          )}

          {product.colors.length > 0 && (
            <div className="spd-specs-block">
              <h3 className="spd-specs-title">FINITIONS DISPONIBLES</h3>
              <div className="spd-colors">
                {product.colors.map(c => (
                  <span key={c} className="spd-color-badge">{c}</span>
                ))}
              </div>
            </div>
          )}

          <div className="spd-specs-block">
            <h3 className="spd-specs-title">FABRICATION</h3>
            <p className="spd-material">Sur mesure · Laque mate, bois, MDF premium</p>
          </div>

          <div className="spd-cta">
            <Link to="/contact" className="spd-btn-gold">Demander un devis</Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="spd-lightbox" onClick={() => setLightbox(false)}>
          <button className="spd-lb-close" onClick={() => setLightbox(false)}>✕</button>
          <img src={product.images[activeImg]} alt={product.name} className="spd-lb-img" onClick={e => e.stopPropagation()} />
          {product.images.length > 1 && (
            <>
              <button className="spd-lb-prev" onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + product.images.length) % product.images.length); }}>‹</button>
              <button className="spd-lb-next" onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % product.images.length); }}>›</button>
            </>
          )}
        </div>
      )}

      {/* Modèles similaires */}
      <div className="spd-similar">
        <h2 className="spd-similar-title">AUTRES MODÈLES</h2>
        <div className="spd-similar-grid">
          {similar.map(p => (
            <Link key={p.id} to={`/cuisines-soprano/${p.slug}`} className="spd-similar-card">
              <div className="spd-similar-img-wrap">
                <img src={p.image} alt={p.name} loading="lazy" />
              </div>
              <h3 className="spd-similar-name">{p.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SopranoDetailPage;
