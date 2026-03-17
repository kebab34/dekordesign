import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { sopranoData } from '../../data/sopranoData';
import './SopranoPage.css';

const allStyles = [...new Set(sopranoData.map(p => p.style))].sort();
const allColors = [...new Set(sopranoData.flatMap(p => p.colors))].filter(Boolean).sort();

const SopranoPage = () => {
  const [activeStyle, setActiveStyle] = useState('');
  const [activeColor, setActiveColor] = useState('');
  const [search,      setSearch]      = useState('');

  const filtered = useMemo(() => sopranoData.filter(p => {
    if (activeStyle && p.style !== activeStyle) return false;
    if (activeColor && !p.colors.includes(activeColor)) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [activeStyle, activeColor, search]);

  const clearAll = () => { setActiveStyle(''); setActiveColor(''); setSearch(''); };
  const hasFilters = activeStyle || activeColor || search;

  return (
    <section className="sop-page">
      <div className="sop-header">
        <div className="sop-gold-line"></div>
        <h2 className="sop-title">CUISINES SUR MESURE</h2>
        <p className="sop-subtitle">
          {filtered.length} modèle{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="sop-layout">
        {/* Sidebar */}
        <aside className="sop-sidebar">
          <div className="sop-sidebar-head">
            <h3 className="sop-sidebar-title">FILTRES</h3>
            {hasFilters && (
              <button className="sop-clear" onClick={clearAll}>Effacer tout</button>
            )}
          </div>

          {/* Recherche */}
          <div className="sop-filter-group">
            <p className="sop-filter-label">RECHERCHE</p>
            <div className="sop-search">
              <input
                type="text"
                placeholder="Nom du modèle..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="sop-search-input"
              />
              {search && <button className="sop-search-clear" onClick={() => setSearch('')}>✕</button>}
            </div>
          </div>

          {/* Style */}
          <div className="sop-filter-group">
            <p className="sop-filter-label">STYLE</p>
            <div className="sop-option-list">
              <div className={`sop-option ${!activeStyle ? 'active' : ''}`} onClick={() => setActiveStyle('')}>Tous</div>
              {allStyles.map(s => (
                <div key={s} className={`sop-option ${activeStyle === s ? 'active' : ''}`} onClick={() => setActiveStyle(s)}>{s}</div>
              ))}
            </div>
          </div>

          {/* Finition */}
          <div className="sop-filter-group">
            <p className="sop-filter-label">FINITION</p>
            <div className="sop-option-list">
              <div className={`sop-option ${!activeColor ? 'active' : ''}`} onClick={() => setActiveColor('')}>Toutes</div>
              {allColors.map(c => (
                <div key={c} className={`sop-option ${activeColor === c ? 'active' : ''}`} onClick={() => setActiveColor(c)}>{c}</div>
              ))}
            </div>
          </div>

          {/* Tags actifs */}
          {hasFilters && (
            <div className="sop-tags">
              {activeStyle && <span className="sop-tag">{activeStyle} <button onClick={() => setActiveStyle('')}>×</button></span>}
              {activeColor && <span className="sop-tag">{activeColor} <button onClick={() => setActiveColor('')}>×</button></span>}
              {search      && <span className="sop-tag">"{search}" <button onClick={() => setSearch('')}>×</button></span>}
            </div>
          )}
        </aside>

        {/* Grille */}
        <div className="sop-main">
          <div className="sop-grid">
            {filtered.map(product => (
              <Link key={product.id} to={`/cuisines-soprano/${product.slug}`} className="sop-card">
                <div className="sop-img-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="sop-img"
                    loading="lazy"
                    onError={e => { e.target.style.opacity = '0.2'; }}
                  />
                  {product.images.length > 1 && (
                    <span className="sop-img-count">{product.images.length} photos</span>
                  )}
                  <span className="sop-style-badge">{product.style}</span>
                </div>
                <div className="sop-card-info">
                  <h3 className="sop-card-name">{product.name}</h3>
                  {product.colors.length > 0 && (
                    <p className="sop-card-colors">{product.colors.slice(0, 4).join(' · ')}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="sop-empty">
              <p>Aucun modèle trouvé.</p>
              <button onClick={clearAll}>Réinitialiser</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SopranoPage;
