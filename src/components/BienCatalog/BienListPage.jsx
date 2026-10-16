import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../SEO/SEO';
import './BienListPage.css';

// Page liste générique pour les catalogues Bien Seramik (sanitaire, douche, robinetterie, accessoires…)
// Toute la configuration propre à chaque univers vient de `catalog` (voir ./catalogs/).

// Extrait les valeurs uniques triées pour un champ de specs
const uniqueVals = (data, field) =>
  [...new Set(data.map(p => p.specs[field]).filter(Boolean))].sort();

const FilterDropdown = ({ title, options, active, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bc-filter-group">
      <p className="bc-filter-label">{title}</p>
      <div className="bc-dropdown">
        <button
          className={`bc-dropdown-trigger ${open ? 'open' : ''}`}
          onClick={() => setOpen(o => !o)}
        >
          <span>{active || 'Tous'}</span>
          <svg className="bc-dropdown-arrow" viewBox="0 0 10 6">
            <path d="M0 0l5 6 5-6z" fill="currentColor"/>
          </svg>
        </button>
        {open && (
          <div className="bc-dropdown-content">
            {options.length > 6 && (
              <input
                className="bc-dropdown-search"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            )}
            <div className="bc-dropdown-list">
              <div
                className={`bc-dropdown-item ${!active ? 'active' : ''}`}
                onClick={() => { onSelect(''); setOpen(false); setSearch(''); }}
              >
                Tous
              </div>
              {filtered.map(opt => (
                <div
                  key={opt}
                  className={`bc-dropdown-item ${active === opt ? 'active' : ''}`}
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

const BienListPage = ({ catalog }) => {
  const { data, categories, basePath, seo, title, colorLabel, cardName, cardMetaField, dense } = catalog;

  const SERIES = useMemo(() => uniqueVals(data, 'Série'),   [data]);
  const COLORS = useMemo(() => uniqueVals(data, 'Couleur'), [data]);
  const TYPES  = useMemo(() => uniqueVals(data, 'Type'),    [data]);

  const [activeCategory, setActiveCategory] = useState('');
  const [activeSerie,    setActiveSerie]    = useState('');
  const [activeColor,    setActiveColor]    = useState('');
  const [activeType,     setActiveType]     = useState('');
  const [search,         setSearch]         = useState('');
  const [sidebarOpen,    setSidebarOpen]    = useState(false);

  const filtered = useMemo(() => data.filter(p => {
    if (activeCategory && p.category !== activeCategory) return false;
    if (activeSerie    && p.specs['Série']   !== activeSerie)    return false;
    if (activeColor    && p.specs['Couleur'] !== activeColor)    return false;
    if (activeType     && p.specs['Type']    !== activeType)     return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.fullName.toLowerCase().includes(q);
    }
    return true;
  }), [data, activeCategory, activeSerie, activeColor, activeType, search]);

  const activeCount = [activeCategory, activeSerie, activeColor, activeType, search].filter(Boolean).length;

  const clearAll = () => {
    setActiveCategory(''); setActiveSerie('');
    setActiveColor('');    setActiveType('');
    setSearch('');
  };

  return (
    <section className="bc-page">
      <SEO title={seo.title} description={seo.description} canonical={basePath} />
      <div className="bc-header">
        <div className="bc-gold-line"></div>
        <h2 className="bc-title">{title}</h2>
        <p className="bc-subtitle">
          {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="bc-layout">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className={`bc-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="bc-sidebar-header">
            <h3 className="bc-sidebar-title">FILTRES</h3>
            {activeCount > 0 && (
              <button className="bc-clear-btn" onClick={clearAll}>Effacer tout</button>
            )}
          </div>

          <FilterDropdown title="CATÉGORIE"          options={categories} active={activeCategory} onSelect={setActiveCategory} />
          <FilterDropdown title="SÉRIE / COLLECTION" options={SERIES}     active={activeSerie}    onSelect={setActiveSerie} />
          <FilterDropdown title={colorLabel}         options={COLORS}     active={activeColor}    onSelect={setActiveColor} />
          {TYPES.length > 0 && (
            <FilterDropdown title="TYPE DE PRODUIT"  options={TYPES}      active={activeType}     onSelect={setActiveType} />
          )}

          {/* Filtres actifs */}
          {activeCount > 0 && (
            <div className="bc-active-filters">
              {activeCategory && <span className="bc-tag">{activeCategory} <button onClick={() => setActiveCategory('')}>×</button></span>}
              {activeSerie    && <span className="bc-tag">{activeSerie} <button onClick={() => setActiveSerie('')}>×</button></span>}
              {activeColor    && <span className="bc-tag">{activeColor} <button onClick={() => setActiveColor('')}>×</button></span>}
              {activeType     && <span className="bc-tag">{activeType} <button onClick={() => setActiveType('')}>×</button></span>}
              {search         && <span className="bc-tag">"{search}" <button onClick={() => setSearch('')}>×</button></span>}
            </div>
          )}
          <button className="bc-filters-close-btn" onClick={() => setSidebarOpen(false)}>Fermer</button>
        </aside>

        {sidebarOpen && (
          <div className="bc-filters-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Main ────────────────────────────────────────── */}
        <div className="bc-main">
          <div className="bc-search-bar">
            <div className="bc-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bc-search-input"
              />
              {search && <button className="bc-search-clear" onClick={() => setSearch('')}>✕</button>}
            </div>
          </div>

          <div className={`bc-grid ${dense ? 'bc-grid--dense' : ''}`}>
            {filtered.map(product => (
              <Link key={product.id} to={`${basePath}/${product.id}`} className="bc-card">
                <div className="bc-img-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="bc-img"
                    loading="lazy"
                    onError={e => { e.target.style.opacity = '0.3'; }}
                  />
                </div>
                <div className="bc-card-info">
                  <span className="bc-card-cat">{product.category}</span>
                  <h3 className="bc-card-name">{cardName(product)}</h3>
                  {product.specs[cardMetaField] && (
                    <span className="bc-card-color">{product.specs[cardMetaField]}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="bc-empty">
              <p>Aucun produit trouvé.</p>
              <button onClick={clearAll}>Réinitialiser les filtres</button>
            </div>
          )}
        </div>
      </div>

      <button className="bc-filters-fab" onClick={() => setSidebarOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="10" y2="18"/>
        </svg>
        Filtres
        {activeCount > 0 && <span className="bc-filters-fab-badge">{activeCount}</span>}
      </button>
    </section>
  );
};

export default BienListPage;
