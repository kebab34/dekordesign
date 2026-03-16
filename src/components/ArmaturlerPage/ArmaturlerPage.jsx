import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { armaturlerData, armaturlerCategories } from '../../data/armaturlerData';
import './ArmaturlerPage.css';

// Extrait les valeurs uniques triées pour un champ de specs
const uniqueVals = (field) =>
  [...new Set(armaturlerData.map(p => p.specs[field]).filter(Boolean))].sort();

const SERIES  = uniqueVals('Série');
const COLORS  = uniqueVals('Couleur');
const TYPES   = uniqueVals('Type');

const FilterDropdown = ({ title, options, active, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="arm-filter-group">
      <p className="arm-filter-label">{title}</p>
      <div className="arm-dropdown">
        <button
          className={`arm-dropdown-trigger ${open ? 'open' : ''}`}
          onClick={() => setOpen(o => !o)}
        >
          <span>{active || 'Tous'}</span>
          <svg className="arm-dropdown-arrow" viewBox="0 0 10 6">
            <path d="M0 0l5 6 5-6z" fill="currentColor"/>
          </svg>
        </button>
        {open && (
          <div className="arm-dropdown-content">
            {options.length > 6 && (
              <input
                className="arm-dropdown-search"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            )}
            <div className="arm-dropdown-list">
              <div
                className={`arm-dropdown-item ${!active ? 'active' : ''}`}
                onClick={() => { onSelect(''); setOpen(false); setSearch(''); }}
              >
                Tous
              </div>
              {filtered.map(opt => (
                <div
                  key={opt}
                  className={`arm-dropdown-item ${active === opt ? 'active' : ''}`}
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

const ArmaturlerPage = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSerie,    setActiveSerie]    = useState('');
  const [activeColor,    setActiveColor]    = useState('');
  const [activeType,     setActiveType]     = useState('');
  const [search,         setSearch]         = useState('');
  const [sidebarOpen,    setSidebarOpen]    = useState(false);

  const filtered = useMemo(() => armaturlerData.filter(p => {
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
    <section className="arm-page">
      <div className="arm-header">
        <div className="arm-gold-line"></div>
        <h2 className="arm-title">ROBINETTERIE &amp; DOUCHE</h2>
        <p className="arm-subtitle">
          {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="arm-layout">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <button className="arm-sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
          {sidebarOpen ? 'Masquer les filtres' : 'Afficher les filtres'}
        </button>

        <aside className={`arm-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="arm-sidebar-header">
            <h3 className="arm-sidebar-title">FILTRES</h3>
            {hasFilters && (
              <button className="arm-clear-btn" onClick={clearAll}>Effacer tout</button>
            )}
          </div>

          {/* Catégorie */}
          <FilterDropdown
            title="CATÉGORIE"
            options={armaturlerCategories}
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
            <div className="arm-active-filters">
              {activeCategory && <span className="arm-tag">{activeCategory} <button onClick={() => setActiveCategory('')}>×</button></span>}
              {activeSerie    && <span className="arm-tag">{activeSerie} <button onClick={() => setActiveSerie('')}>×</button></span>}
              {activeColor    && <span className="arm-tag">{activeColor} <button onClick={() => setActiveColor('')}>×</button></span>}
              {activeType     && <span className="arm-tag">{activeType} <button onClick={() => setActiveType('')}>×</button></span>}
              {search         && <span className="arm-tag">"{search}" <button onClick={() => setSearch('')}>×</button></span>}
            </div>
          )}
        </aside>

        {/* ── Main ────────────────────────────────────────── */}
        <div className="arm-main">
          {/* Barre de recherche */}
          <div className="arm-search-bar">
            <div className="arm-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="arm-search-input"
              />
              {search && <button className="arm-search-clear" onClick={() => setSearch('')}>✕</button>}
            </div>
          </div>

          {/* Grille */}
          <div className="arm-grid">
            {filtered.map(product => (
              <Link key={product.id} to={`/armaturler/${product.id}`} className="arm-card">
                <div className="arm-img-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="arm-img"
                    loading="lazy"
                    onError={e => { e.target.style.opacity = '0.3'; }}
                  />
                </div>
                <div className="arm-card-info">
                  <span className="arm-card-cat">{product.category}</span>
                  <h3 className="arm-card-name">{product.fullName.split(' - ').slice(1).join(' - ') || product.name}</h3>
                  {product.specs['Couleur'] && (
                    <span className="arm-card-color">{product.specs['Couleur']}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="arm-empty">
              <p>Aucun produit trouvé.</p>
              <button onClick={clearAll}>Réinitialiser les filtres</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArmaturlerPage;
