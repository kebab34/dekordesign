import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { sanitaireData, sanitaireCategories } from '../../data/sanitaireData';
import './SanitairePage.css';

const uniqueVals = (field) =>
  [...new Set(sanitaireData.map(p => p.specs[field]).filter(Boolean))].sort();

const SERIES = uniqueVals('Série');
const COLORS = uniqueVals('Couleur');
const TYPES  = uniqueVals('Type');

const FilterDropdown = ({ title, options, active, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="san-filter-group">
      <p className="san-filter-label">{title}</p>
      <div className="san-dropdown">
        <button
          className={`san-dropdown-trigger ${open ? 'open' : ''}`}
          onClick={() => setOpen(o => !o)}
        >
          <span>{active || 'Tous'}</span>
          <svg className="san-dropdown-arrow" viewBox="0 0 10 6">
            <path d="M0 0l5 6 5-6z" fill="currentColor"/>
          </svg>
        </button>
        {open && (
          <div className="san-dropdown-content">
            {options.length > 6 && (
              <input
                className="san-dropdown-search"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            )}
            <div className="san-dropdown-list">
              <div
                className={`san-dropdown-item ${!active ? 'active' : ''}`}
                onClick={() => { onSelect(''); setOpen(false); setSearch(''); }}
              >
                Tous
              </div>
              {filtered.map(opt => (
                <div
                  key={opt}
                  className={`san-dropdown-item ${active === opt ? 'active' : ''}`}
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

const SanitairePage = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSerie,    setActiveSerie]    = useState('');
  const [activeColor,    setActiveColor]    = useState('');
  const [activeType,     setActiveType]     = useState('');
  const [search,         setSearch]         = useState('');
  const [sidebarOpen,    setSidebarOpen]    = useState(false);

  const filtered = useMemo(() => sanitaireData.filter(p => {
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
    <section className="san-page">
      <div className="san-header">
        <div className="san-gold-line"></div>
        <h2 className="san-title">SALLE DE BAIN</h2>
        <p className="san-subtitle">
          {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="san-layout">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className={`san-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="san-sidebar-header">
            <h3 className="san-sidebar-title">FILTRES</h3>
            {hasFilters && (
              <button className="san-clear-btn" onClick={clearAll}>Effacer tout</button>
            )}
          </div>

          <FilterDropdown
            title="CATÉGORIE"
            options={sanitaireCategories}
            active={activeCategory}
            onSelect={setActiveCategory}
          />

          <FilterDropdown
            title="SÉRIE / COLLECTION"
            options={SERIES}
            active={activeSerie}
            onSelect={setActiveSerie}
          />

          <FilterDropdown
            title="COULEUR"
            options={COLORS}
            active={activeColor}
            onSelect={setActiveColor}
          />

          <FilterDropdown
            title="TYPE DE PRODUIT"
            options={TYPES}
            active={activeType}
            onSelect={setActiveType}
          />

          {hasFilters && (
            <div className="san-active-filters">
              {activeCategory && <span className="san-tag">{activeCategory} <button onClick={() => setActiveCategory('')}>×</button></span>}
              {activeSerie    && <span className="san-tag">{activeSerie} <button onClick={() => setActiveSerie('')}>×</button></span>}
              {activeColor    && <span className="san-tag">{activeColor} <button onClick={() => setActiveColor('')}>×</button></span>}
              {activeType     && <span className="san-tag">{activeType} <button onClick={() => setActiveType('')}>×</button></span>}
              {search         && <span className="san-tag">"{search}" <button onClick={() => setSearch('')}>×</button></span>}
            </div>
          )}
          <button className="san-filters-close-btn" onClick={() => setSidebarOpen(false)}>Fermer</button>
        </aside>

        {sidebarOpen && (
          <div className="san-filters-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Main ────────────────────────────────────────── */}
        <div className="san-main">
          {/* Barre de recherche */}
          <div className="san-search-bar">
            <div className="san-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="san-search-input"
              />
              {search && <button className="san-search-clear" onClick={() => setSearch('')}>✕</button>}
            </div>
          </div>

          {/* Grille */}
          <div className="san-grid">
            {filtered.map(product => (
              <Link key={product.id} to={`/sanitaire/${product.id}`} className="san-card">
                <div className="san-img-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="san-img"
                    loading="lazy"
                    onError={e => { e.target.style.opacity = '0.3'; }}
                  />
                </div>
                <div className="san-card-info">
                  <span className="san-card-cat">{product.category}</span>
                  <h3 className="san-card-name">{product.name}</h3>
                  {product.specs['Type'] && (
                    <span className="san-card-type">{product.specs['Type']}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="san-empty">
              <p>Aucun produit trouvé.</p>
              <button onClick={clearAll}>Réinitialiser les filtres</button>
            </div>
          )}
        </div>
      </div>

      <button className="san-filters-fab" onClick={() => setSidebarOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="10" y2="18"/>
        </svg>
        Filtres
        {[activeCategory, activeSerie, activeColor, activeType, search].filter(Boolean).length > 0 && (
          <span className="san-filters-fab-badge">{[activeCategory, activeSerie, activeColor, activeType, search].filter(Boolean).length}</span>
        )}
      </button>
    </section>
  );
};

export default SanitairePage;
