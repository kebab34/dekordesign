import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../SEO/SEO';
import { tamamlayiciData, tamamlayiciCategories } from '../../data/tamamlayiciData';
import './TamamlayiciPage.css';

const TamamlayiciPage = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = tamamlayiciData.filter(p => {
    const matchCat = !activeCategory || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section className="tamamlayici-page">
      <SEO
        title="Produits Complémentaires — Réservoirs & Accessoires"
        description="Produits complémentaires salle de bain : réservoirs, plomberie et accessoires. Tout pour compléter votre installation sanitaire. DekorDesign Cannes."
        canonical="/accessoires"
      />
      <div className="tamamlayici-header">
        <div className="tgold-line"></div>
        <h2 className="tamamlayici-title">ACCESSOIRES SALLE DE BAIN</h2>
        <p className="tamamlayici-subtitle">
          {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className={`tamamlayici-controls ${sidebarOpen ? 'open' : ''}`}>
        <div className="tamamlayici-cats">
          <button
            className={`tcat-btn ${activeCategory === '' ? 'active' : ''}`}
            onClick={() => setActiveCategory('')}
          >
            Tout
          </button>
          {tamamlayiciCategories.map(cat => (
            <button
              key={cat}
              className={`tcat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="tamamlayici-search">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="tsearch-input"
          />
          {search && (
            <button className="tsearch-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <button className="tamamlayici-filters-close-btn" onClick={() => setSidebarOpen(false)}>Fermer</button>
      </div>

      {sidebarOpen && (
        <div className="tamamlayici-filters-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="tamamlayici-grid">
        {filtered.map(product => (
          <Link
            key={product.id}
            to={`/accessoires/${product.id}`}
            className="tamamlayici-card"
          >
            <div className="tamamlayici-img-wrapper">
              <img
                src={product.image}
                alt={product.name}
                className="tamamlayici-img"
                loading="lazy"
                onError={e => { e.target.style.opacity = '0.3'; }}
              />
            </div>
            <div className="tamamlayici-card-info">
              <span className="tamamlayici-card-cat">{product.category}</span>
              <h3 className="tamamlayici-card-name">{product.name}</h3>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="tamamlayici-empty">
          <p>Aucun produit trouvé.</p>
          <button onClick={() => { setActiveCategory(''); setSearch(''); }}>
            Réinitialiser
          </button>
        </div>
      )}

      <button className="tamamlayici-filters-fab" onClick={() => setSidebarOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="10" y2="18"/>
        </svg>
        Filtres
        {[activeCategory, search].filter(Boolean).length > 0 && (
          <span className="tamamlayici-filters-fab-badge">{[activeCategory, search].filter(Boolean).length}</span>
        )}
      </button>
    </section>
  );
};

export default TamamlayiciPage;
