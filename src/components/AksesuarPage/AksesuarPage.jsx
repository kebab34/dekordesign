import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../SEO/SEO';
import { aksesuarData, aksesuarCategories } from '../../data/aksesuarData';
import './AksesuarPage.css';

// Extrait les valeurs uniques triées pour un champ de specs
const uniqueVals = (field) =>
  [...new Set(aksesuarData.map(p => p.specs[field]).filter(Boolean))].sort();

const SERIES  = uniqueVals('Série');
const COLORS  = uniqueVals('Couleur');
const TYPES   = uniqueVals('Type');

const FilterDropdown = ({ title, options, active, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="aks-filter-group">
      <p className="aks-filter-label">{title}</p>
      <div className="aks-dropdown">
        <button
          className={`aks-dropdown-trigger ${open ? 'open' : ''}`}
          onClick={() => setOpen(o => !o)}
        >
          <span>{active || 'Tous'}</span>
          <svg className="aks-dropdown-arrow" viewBox="0 0 10 6">
            <path d="M0 0l5 6 5-6z" fill="currentColor"/>
          </svg>
        </button>
        {open && (
          <div className="aks-dropdown-content">
            {options.length > 6 && (
              <input
                className="aks-dropdown-search"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            )}
            <div className="aks-dropdown-list">
              <div
                className={`aks-dropdown-item ${!active ? 'active' : ''}`}
                onClick={() => { onSelect(''); setOpen(false); setSearch(''); }}
              >
                Tous
              </div>
              {filtered.map(opt => (
                <div
                  key={opt}
                  className={`aks-dropdown-item ${active === opt ? 'active' : ''}`}
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

const AksesuarPage = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSerie,    setActiveSerie]    = useState('');
  const [activeColor,    setActiveColor]    = useState('');
  const [activeType,     setActiveType]     = useState('');
  const [search,         setSearch]         = useState('');
  const [sidebarOpen,    setSidebarOpen]    = useState(false);

  const filtered = useMemo(() => aksesuarData.filter(p => {
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
    <section className="aks-page">
      <SEO
        title="Accessoires de Bain — Miroirs & Porte-Serviettes"
        description="Accessoires de salle de bain design : miroirs, porte-serviettes, distributeurs. Collections complètes pour un espace harmonieux. DekorDesign Alger."
        canonical="/bain-accessoires"
      />
      <div className="aks-header">
        <div className="aks-gold-line"></div>
        <h2 className="aks-title">ACCESSOIRES SALLE DE BAIN</h2>
        <p className="aks-subtitle">
          {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="aks-layout">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className={`aks-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="aks-sidebar-header">
            <h3 className="aks-sidebar-title">FILTRES</h3>
            {hasFilters && (
              <button className="aks-clear-btn" onClick={clearAll}>Effacer tout</button>
            )}
          </div>

          {/* Catégorie */}
          <FilterDropdown
            title="CATÉGORIE"
            options={aksesuarCategories}
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
          {TYPES.length > 0 && (
            <FilterDropdown
              title="TYPE DE PRODUIT"
              options={TYPES}
              active={activeType}
              onSelect={setActiveType}
            />
          )}

          {/* Filtres actifs */}
          {hasFilters && (
            <div className="aks-active-filters">
              {activeCategory && <span className="aks-tag">{activeCategory} <button onClick={() => setActiveCategory('')}>×</button></span>}
              {activeSerie    && <span className="aks-tag">{activeSerie} <button onClick={() => setActiveSerie('')}>×</button></span>}
              {activeColor    && <span className="aks-tag">{activeColor} <button onClick={() => setActiveColor('')}>×</button></span>}
              {activeType     && <span className="aks-tag">{activeType} <button onClick={() => setActiveType('')}>×</button></span>}
              {search         && <span className="aks-tag">"{search}" <button onClick={() => setSearch('')}>×</button></span>}
            </div>
          )}
          <button className="aks-filters-close-btn" onClick={() => setSidebarOpen(false)}>Fermer</button>
        </aside>

        {sidebarOpen && (
          <div className="aks-filters-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Main ────────────────────────────────────────── */}
        <div className="aks-main">
          {/* Barre de recherche */}
          <div className="aks-search-bar">
            <div className="aks-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="aks-search-input"
              />
              {search && <button className="aks-search-clear" onClick={() => setSearch('')}>✕</button>}
            </div>
          </div>

          {/* Grille */}
          <div className="aks-grid">
            {filtered.map(product => (
              <Link key={product.id} to={`/bain-accessoires/${product.id}`} className="aks-card">
                <div className="aks-img-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aks-img"
                    loading="lazy"
                    onError={e => { e.target.style.opacity = '0.3'; }}
                  />
                </div>
                <div className="aks-card-info">
                  <span className="aks-card-cat">{product.category}</span>
                  <h3 className="aks-card-name">{product.fullName.split(' - ').slice(1).join(' - ') || product.name}</h3>
                  {product.specs['Couleur'] && (
                    <span className="aks-card-color">{product.specs['Couleur']}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="aks-empty">
              <p>Aucun produit trouvé.</p>
              <button onClick={clearAll}>Réinitialiser les filtres</button>
            </div>
          )}
        </div>
      </div>

      <button className="aks-filters-fab" onClick={() => setSidebarOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="10" y2="18"/>
        </svg>
        Filtres
        {[activeCategory, activeSerie, activeColor, activeType, search].filter(Boolean).length > 0 && (
          <span className="aks-filters-fab-badge">{[activeCategory, activeSerie, activeColor, activeType, search].filter(Boolean).length}</span>
        )}
      </button>
    </section>
  );
};

export default AksesuarPage;
