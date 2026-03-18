import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { menuiserieData } from '../../data/menuiserieData';
import './MenuiserieSubPage.css';

const MenuiserieSubPage = () => {
  const { slug } = useParams();
  const [activeSubcat, setActiveSubcat] = useState('');
  const [search, setSearch] = useState('');

  const section = menuiserieData[slug];

  if (!section) {
    return (
      <section className="msub-page">
        <div className="msub-empty">
          <p>Catégorie introuvable.</p>
          <Link to="/menuiserie" className="msub-back-link">Retour à la menuiserie</Link>
        </div>
      </section>
    );
  }

  const subcats = [...new Set(section.products.map(p => p.category))];

  const filtered = section.products.filter(p => {
    if (activeSubcat && p.category !== activeSubcat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <section className="msub-page">
      <div className="msub-header">
        <div className="msub-breadcrumb">
          <Link to="/menuiserie" className="msub-bread-link">Menuiserie</Link>
          <span className="msub-bread-sep">/</span>
          <span className="msub-bread-current">{section.title}</span>
        </div>
        <div className="msub-gold-line"></div>
        <h1 className="msub-title">{section.title.toUpperCase()}</h1>
        <p className="msub-subtitle">{section.subtitle}</p>
      </div>

      {/* Filter bar — only shown if multiple sub-categories */}
      {subcats.length > 1 && (
        <div className="msub-filter-bar">
          <button
            className={`msub-filter-btn ${!activeSubcat ? 'active' : ''}`}
            onClick={() => setActiveSubcat('')}
          >
            Tous
          </button>
          {subcats.map(sc => (
            <button
              key={sc}
              className={`msub-filter-btn ${activeSubcat === sc ? 'active' : ''}`}
              onClick={() => setActiveSubcat(sc)}
            >
              {sc}
            </button>
          ))}
        </div>
      )}

      {/* Search — shown only for large catalogues */}
      {section.products.length > 10 && (
        <div className="msub-search-wrap">
          <div className="msub-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher un modèle..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="msub-search-input"
            />
            {search && (
              <button className="msub-search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>
      )}

      <div className="msub-grid">
        {filtered.map(product => (
          <Link
            key={product.id}
            to={`/menuiserie/${slug}/${product.id}`}
            className="msub-card"
          >
            <div className="msub-img-wrapper">
              <img
                src={product.image}
                alt={product.name}
                className="msub-img"
                loading="lazy"
                onError={e => { e.target.style.opacity = '0.15'; }}
              />
            </div>
            <div className="msub-card-info">
              <span className="msub-card-cat">{product.category}</span>
              <h3 className="msub-card-name">{product.name}</h3>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="msub-empty">
          <p>Aucun produit trouvé.</p>
          <button onClick={() => { setSearch(''); setActiveSubcat(''); }}>
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </section>
  );
};

export default MenuiserieSubPage;
