import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { tamamlayiciData, tamamlayiciCategories } from '../../data/tamamlayiciData';
import './TamamlayiciPage.css';

const TamamlayiciPage = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');

  const filtered = tamamlayiciData.filter(p => {
    const matchCat = !activeCategory || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section className="tamamlayici-page">
      <div className="tamamlayici-header">
        <div className="tgold-line"></div>
        <h2 className="tamamlayici-title">ACCESSOIRES SALLE DE BAIN</h2>
        <p className="tamamlayici-subtitle">
          {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="tamamlayici-controls">
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
      </div>

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
    </section>
  );
};

export default TamamlayiciPage;
