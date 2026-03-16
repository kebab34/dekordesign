import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { dusData, dusCategories } from '../../data/dusData';
import './DusPage.css';

// Extrait les valeurs uniques triées pour un champ de specs
const uniqueVals = (field) =>
  [...new Set(dusData.map(p => p.specs[field]).filter(Boolean))].sort();

const SERIES  = uniqueVals('Série');
const COLORS  = uniqueVals('Couleur');
const TYPES   = uniqueVals('Type');

const FilterDropdown = ({ title, options, active, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="dus-filter-group">
      <p className="dus-filter-label">{title}</p>
      <div className="dus-dropdown">
        <button
          className={`dus-dropdown-trigger ${open ? 'open' : ''}`}
          onClick={() => setOpen(o => !o)}
        >
          <span>{active || 'Tous'}</span>
          <svg className="dus-dropdown-arrow" viewBox="0 0 10 6">
            <path d="M0 0l5 6 5-6z" fill="currentColor"/>
          </svg>
        </button>
        {open && (
          <div className="dus-dropdown-content">
            {options.length > 6 && (
              <input
                className="dus-dropdown-search"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            )}
            <div className="dus-dropdown-list">
              <div
                className={`dus-dropdown-item ${!active ? 'active' : ''}`}
                onClick={() => { onSelect(''); setOpen(false); setSearch(''); }}
              >
                Tous
              </div>
              {filtered.map(opt => (
                <div
                  key={opt}
                  className={`dus-dropdown-item ${active === opt ? 'active' : ''}`}
                  onClick={() => { onSelect(opt); setOpen(false); setSearch(''); }}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DusPage = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSerie,    setActiveSerie]    = useState('');
  const [activeColor,    setActiveColor]    = useState('');
  const [activeType,     setActiveType]     = useState('');
  const [search,         setSearch]         = useState('');
  const [sidebarOpen,    setSidebarOpen]    = useState(false);

  const filtered = useMemo(() => dusData.filter(p => {
    if (activeCategory && p.category !== activeCategory) return false;
    if (activeSerie    && p.specs['Série']   !== activeSerie)    return false;
    if (activeColor    && p.specs['Couleur'] !== activeColor)    return false;
    if (activeType     && p.specs['Type']    !== activeType)     return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.fullName.toLowerCase().includes(q);
    }
    return true;
  }), [activeCategory, activeSerie, activeColor, activeType, search]);

  const hasFilters = activeCategory || activeSerie || activeColor || activeType || search;

  const clearAll = () => {
    setActiveCategory(''); setActiveSerie('');
    setActiveColor('');    setActiveType('');
    setSearch('');
  };

  return (
    <section className="dus-page">
      <div className="dus-header">
        <div className="dus-gold-line"></div>
        <h2 className="dus-title">SYSTÈMES DE DOUCHE</h2>
        <p className="dus-subtitle">
          {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="dus-layout">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <button className="dus-sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
          {sidebarOpen ? 'Masquer les filtres' : 'Afficher les filtres'}
        </button>

        <aside className={`dus-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="dus-sidebar-header">
            <h3 className="dus-sidebar-title">FILTRES</h3>
            {hasFilters && (
              <button className="dus-clear-btn" onClick={clearAll}>Effacer tout</button>
            )}
          </div>

          {/* Catégorie */}
          <FilterDropdown
            title="CATÉGORIE"
            options={dusCategories}
            active={activeCategory}
            onSelect={setActiveCategory}
          />

          {/* Série */}
          <FilterDropdown
            title="SÉRIE / COLLECTION"
            options={SERIES}
            active={activeSerie}
            onSelect={setActiveSerie}
          />

          {/* Couleur */}
          <FilterDropdown
            title="COULEUR / FINITION"
            options={COLORS}
            active={activeColor}
            onSelect={setActiveColor}
          />

          {/* Type */}
          <FilterDropdown
            title="TYPE DE PRODUIT"
            options={TYPES}
            active={activeType}
            onSelect={setActiveType}
          />

          {/* Filtres actifs */}
          {hasFilters && (
            <div className="dus-active-filters">
              {activeCategory && <span className="dus-tag">{activeCategory} <button onClick={() => setActiveCategory('')}>×</button></span>}
              {activeSerie    && <span className="dus-tag">{activeSerie} <button onClick={() => setActiveSerie('')}>×</button></span>}
              {activeColor    && <span className="dus-tag">{activeColor} <button onClick={() => setActiveColor('')}>×</button></span>}
              {activeType     && <span className="dus-tag">{activeType} <button onClick={() => setActiveType('')}>×</button></span>}
              {search         && <span className="dus-tag">"{search}" <button onClick={() => setSearch('')}>×</button></span>}
            </div>
          )}
        </aside>

        {/* ── Main ────────────────────────────────────────── */}
        <div className="dus-main">
          {/* Barre de recherche */}
          <div className="dus-search-bar">
            <div className="dus-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="dus-search-input"
              />
              {search && <button className="dus-search-clear" onClick={() => setSearch('')}>✕</button>}
            </div>
          </div>

          {/* Grille */}
          <div className="dus-grid">
            {filtered.map(product => (
              <Link key={product.id} to={`/douche/${product.id}`} className="dus-card">
                <div className="dus-img-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="dus-img"
                    loading="lazy"
                    onError={e => { e.target.style.opacity = '0.3'; }}
                  />
                </div>
                <div className="dus-card-info">
                  <span className="dus-card-cat">{product.category}</span>
                  <h3 className="dus-card-name">{product.fullName.split(' - ').slice(1).join(' - ') || product.name}</h3>
                  {product.specs['Couleur'] && (
                    <span className="dus-card-color">{product.specs['Couleur']}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="dus-empty">
              <p>Aucun produit trouvé.</p>
              <button onClick={clearAll}>Réinitialiser les filtres</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DusPage;
