import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { kobosData } from '../../data/kobosData';
import './KobosDetailPage.css';

const KobosDetailPage = () => {
  const { slug } = useParams();
  const product = kobosData.find(p => p.slug === slug);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!product) {
    return (
      <div className="kd-notfound">
        <p>Collection introuvable.</p>
        <Link to="/meubles">← Retour aux meubles</Link>
      </div>
    );
  }

  const similar = kobosData.filter(p => p.slug !== slug).slice(0, 4);

  return (
    <section className="kd-page">
      {/* Breadcrumb */}
      <nav className="kd-breadcrumb">
        <Link to="/">Accueil</Link>
        <span>›</span>
        <Link to="/meubles">Meubles de Salle de Bain</Link>
        <span>›</span>
        <span>{product.name}</span>
      </nav>

      <div className="kd-content">
        {/* Galerie */}
        <div className="kd-gallery">
          {/* Image principale */}
          <div className="kd-main-img-wrap" onClick={() => setLightbox(true)}>
            <img
              src={product.images[activeImg] || product.image}
              alt={product.name}
              className="kd-main-img"
            />
            <div className="kd-zoom-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="kd-thumbs">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className={`kd-thumb ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="kd-info">
          <div className="kd-gold-line"></div>
          <h1 className="kd-name">{product.name.toUpperCase()}</h1>
          <p className="kd-category">Meuble de salle de bain · Kobos</p>

          {product.description && (
            <p className="kd-description">{product.description}</p>
          )}

          {/* Dimensions */}
          <div className="kd-specs-block">
            <h3 className="kd-specs-title">DIMENSIONS DISPONIBLES</h3>
            <div className="kd-dims">
              {product.dimensions.map(d => (
                <span key={d} className="kd-dim-badge">{d}</span>
              ))}
            </div>
          </div>

          {/* Finitions */}
          {product.colors.length > 0 && (
            <div className="kd-specs-block">
              <h3 className="kd-specs-title">FINITIONS</h3>
              <div className="kd-colors">
                {product.colors.map(c => (
                  <span key={c} className="kd-color-badge">{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Matériau */}
          {product.material && (
            <div className="kd-specs-block">
              <h3 className="kd-specs-title">MATÉRIAU</h3>
              <p className="kd-material">{product.material}</p>
            </div>
          )}

          {/* CTA */}
          <div className="kd-cta">
            <a
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="kd-btn-outline"
            >
              Voir chez Kobos
            </a>
            <Link to="/contact" className="kd-btn-gold">
              Demander un devis
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="kd-lightbox" onClick={() => setLightbox(false)}>
          <button className="kd-lb-close" onClick={() => setLightbox(false)}>✕</button>
          <img
            src={product.images[activeImg] || product.image}
            alt={product.name}
            className="kd-lb-img"
            onClick={e => e.stopPropagation()}
          />
          {product.images.length > 1 && (
            <>
              <button
                className="kd-lb-prev"
                onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + product.images.length) % product.images.length); }}
              >‹</button>
              <button
                className="kd-lb-next"
                onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % product.images.length); }}
              >›</button>
            </>
          )}
        </div>
      )}

      {/* Collections similaires */}
      <div className="kd-similar">
        <h2 className="kd-similar-title">AUTRES COLLECTIONS</h2>
        <div className="kd-similar-grid">
          {similar.map(p => (
            <Link key={p.id} to={`/meubles/${p.slug}`} className="kd-similar-card">
              <div className="kd-similar-img-wrap">
                <img src={p.image} alt={p.name} loading="lazy" />
              </div>
              <h3 className="kd-similar-name">{p.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KobosDetailPage;
