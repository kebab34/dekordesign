import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { kobosData } from '../../data/kobosData';
import './KobosPage.css';

const allColors = [...new Set(kobosData.flatMap(p => p.colors))].filter(Boolean).sort();

const KobosPage = () => {
  const [activeColor, setActiveColor] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => kobosData.filter(p => {
    if (activeColor && !p.colors.includes(activeColor)) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [activeColor, search]);

  return (
    <section className="kobos-page">
      <div className="kobos-header">
        <div className="kobos-gold-line"></div>
        <h2 className="kobos-title">MEUBLES DE SALLE DE BAIN</h2>
        <p className="kobos-subtitle">
          {filtered.length} collection{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="kobos-layout">
        {/* Sidebar */}
        <aside className="kobos-sidebar">
          <div className="kobos-sidebar-head">
            <h3 className="kobos-sidebar-title">FILTRES</h3>
            {(activeColor || search) && (
              <button className="kobos-clear" onClick={() => { setActiveColor(''); setSearch(''); }}>
                Effacer tout
              </button>
            )}
          </div>

          {/* Recherche */}
          <div className="kobos-filter-group">
            <p className="kobos-filter-label">RECHERCHE</p>
            <div className="kobos-search">
              <input
                type="text"
                placeholder="Nom de la collection..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="kobos-search-input"
              />
              {search && <button className="kobos-search-clear" onClick={() => setSearch('')}>✕</button>}
            </div>
          </div>

          {/* Couleur */}
          <div className="kobos-filter-group">
            <p className="kobos-filter-label">FINITION</p>
            <div className="kobos-color-list">
              <div
                className={`kobos-color-item ${!activeColor ? 'active' : ''}`}
                onClick={() => setActiveColor('')}
              >
                Toutes
              </div>
              {allColors.map(c => (
                <div
                  key={c}
                  className={`kobos-color-item ${activeColor === c ? 'active' : ''}`}
                  onClick={() => setActiveColor(c)}
                >
                  {c}
                </div>
              ))}
            </div>
          </div>

          {/* Tags actifs */}
          {(activeColor || search) && (
            <div className="kobos-tags">
              {activeColor && (
                <span className="kobos-tag">
                  {activeColor}
                  <button onClick={() => setActiveColor('')}>×</button>
                </span>
              )}
              {search && (
                <span className="kobos-tag">
                  "{search}"
                  <button onClick={() => setSearch('')}>×</button>
                </span>
              )}
            </div>
          )}
        </aside>

        {/* Grille */}
        <div className="kobos-main">
          <div className="kobos-grid">
            {filtered.map(product => (
              <Link key={product.id} to={`/meubles/${product.slug}`} className="kobos-card">
                <div className="kobos-img-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="kobos-img"
                    loading="lazy"
                    onError={e => { e.target.style.opacity = '0.2'; }}
                  />
                  {product.images.length > 1 && (
                    <span className="kobos-img-count">{product.images.length} photos</span>
                  )}
                </div>
                <div className="kobos-card-info">
                  <h3 className="kobos-card-name">{product.name}</h3>
                  {product.colors.length > 0 && (
                    <p className="kobos-card-colors">
                      {product.colors.slice(0, 3).join(' · ')}
                    </p>
                  )}
                  <p className="kobos-card-sizes">
                    {product.dimensions.join(' — ')}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="kobos-empty">
              <p>Aucune collection trouvée.</p>
              <button onClick={() => { setActiveColor(''); setSearch(''); }}>Réinitialiser</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default KobosPage;
