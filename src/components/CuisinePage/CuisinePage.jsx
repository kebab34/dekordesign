import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../SEO/SEO';
import { cuisineData } from '../../data/cuisineData';
import { sopranoData } from '../../data/sopranoData';
import './CuisinePage.css';

// ── Normalisation des deux sources ───────────────────────────────────────────
const allProducts = [
  ...cuisineData.map(p => ({
    key: `atolye-${p.id}`,
    name: p.name,
    image: p.image,
    style: p.category,
    finition: p.specs['Finition'] || '',
    colors: [],
    marque: 'Atölye Mutfak',
    path: `/cuisines/${p.id}`,
  })),
  ...sopranoData.map(p => ({
    key: `soprano-${p.id}`,
    name: p.name,
    image: p.image,
    style: p.style,
    finition: '',
    colors: p.colors,
    marque: 'Soprano',
    path: `/cuisines-soprano/${p.slug}`,
  })),
];

const STYLES    = [...new Set(allProducts.map(p => p.style))].sort();
const FINITIONS = [...new Set(cuisineData.map(p => p.specs['Finition']).filter(Boolean))].sort();
const COULEURS  = [...new Set(sopranoData.flatMap(p => p.colors))].filter(Boolean).sort();

// ── Dropdown générique ────────────────────────────────────────────────────────
const FilterDropdown = ({ title, options, active, onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="cui-filter-group">
      <p className="cui-filter-label">{title}</p>
      <div className="cui-dropdown">
        <button
          className={`cui-dropdown-trigger ${open ? 'open' : ''}`}
          onClick={() => setOpen(o => !o)}
        >
          <span>{active || 'Tous'}</span>
          <svg className="cui-dropdown-arrow" viewBox="0 0 10 6">
            <path d="M0 0l5 6 5-6z" fill="currentColor"/>
          </svg>
        </button>
        {open && (
          <div className="cui-dropdown-content">
            <div className="cui-dropdown-list">
              <div
                className={`cui-dropdown-item ${!active ? 'active' : ''}`}
                onClick={() => { onSelect(''); setOpen(false); }}
              >
                Tous
              </div>
              {options.map(opt => (
                <div
                  key={opt}
                  className={`cui-dropdown-item ${active === opt ? 'active' : ''}`}
                  onClick={() => { onSelect(opt); setOpen(false); }}
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

// ── Page ──────────────────────────────────────────────────────────────────────
const CuisinePage = () => {
  const location = useLocation();
  const [activeMarque,   setActiveMarque]   = useState('');
  const [activeStyle,    setActiveStyle]    = useState('');
  const [activeFinition, setActiveFinition] = useState('');
  const [activeCouleur,  setActiveCouleur]  = useState('');
  const [search,         setSearch]         = useState('');
  const [sidebarOpen,    setSidebarOpen]    = useState(false);

  // Sync URL params (?marque=atolye|soprano, ?style=...)
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const m = p.get('marque') || '';
    if (m === 'atolye') setActiveMarque('Atölye Mutfak');
    else if (m === 'soprano') setActiveMarque('Soprano');
    else setActiveMarque('');
    setActiveStyle(p.get('style') || '');
  }, [location.search]);

  const filtered = useMemo(() => allProducts.filter(p => {
    if (activeMarque   && p.marque !== activeMarque) return false;
    if (activeStyle    && p.style  !== activeStyle)  return false;
    if (activeFinition && p.finition !== activeFinition) return false;
    if (activeCouleur  && !p.colors.includes(activeCouleur)) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [activeMarque, activeStyle, activeFinition, activeCouleur, search]);

  const hasFilters = activeMarque || activeStyle || activeFinition || activeCouleur || search;

  const clearAll = () => {
    setActiveMarque('');
    setActiveStyle('');
    setActiveFinition('');
    setActiveCouleur('');
    setSearch('');
  };

  // Les finitions/couleurs ne sont pertinentes que si la marque correspondante est visible
  const showFinition = !activeMarque || activeMarque === 'Atölye Mutfak';
  const showCouleur  = !activeMarque || activeMarque === 'Soprano';

  return (
    <section className="cui-page">
      <SEO
        title="Cuisines sur Mesure — Atölye Mutfak & Soprano"
        description="Cuisines sur mesure haut de gamme : 31 modèles Atölye Mutfak & Soprano. Tous styles et finitions. Conception et installation à Cannes."
        canonical="/cuisines"
      />
      <div className="cui-header">
        <div className="cui-gold-line"></div>
        <h2 className="cui-title">CUISINES SUR MESURE</h2>
        <p className="cui-subtitle">
          {filtered.length} modèle{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="cui-layout">
        <aside className={`cui-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="cui-sidebar-header">
            <h3 className="cui-sidebar-title">FILTRES</h3>
            {hasFilters && (
              <button className="cui-clear-btn" onClick={clearAll}>Effacer tout</button>
            )}
          </div>

          {/* Recherche */}
          <div className="cui-filter-group">
            <p className="cui-filter-label">RECHERCHE</p>
            <div className="cui-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Nom du modèle..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="cui-search-input"
              />
              {search && <button className="cui-search-clear" onClick={() => setSearch('')}>✕</button>}
            </div>
          </div>

          {/* Marque */}
          <div className="cui-filter-group">
            <p className="cui-filter-label">MARQUE</p>
            <div className="cui-option-list">
              {['Atölye Mutfak', 'Soprano'].map(m => (
                <div
                  key={m}
                  className={`cui-option ${activeMarque === m ? 'active' : ''}`}
                  onClick={() => {
                    setActiveMarque(prev => prev === m ? '' : m);
                    setActiveFinition('');
                    setActiveCouleur('');
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>

          <FilterDropdown title="STYLE" options={STYLES} active={activeStyle} onSelect={setActiveStyle} />

          {showFinition && (
            <FilterDropdown title="FINITION" options={FINITIONS} active={activeFinition} onSelect={setActiveFinition} />
          )}

          {showCouleur && (
            <FilterDropdown title="COULEUR" options={COULEURS} active={activeCouleur} onSelect={setActiveCouleur} />
          )}

          {hasFilters && (
            <div className="cui-active-filters">
              {activeMarque   && <span className="cui-tag">{activeMarque}   <button onClick={() => setActiveMarque('')}>×</button></span>}
              {activeStyle    && <span className="cui-tag">{activeStyle}    <button onClick={() => setActiveStyle('')}>×</button></span>}
              {activeFinition && <span className="cui-tag">{activeFinition} <button onClick={() => setActiveFinition('')}>×</button></span>}
              {activeCouleur  && <span className="cui-tag">{activeCouleur}  <button onClick={() => setActiveCouleur('')}>×</button></span>}
              {search         && <span className="cui-tag">"{search}"       <button onClick={() => setSearch('')}>×</button></span>}
            </div>
          )}

          <button className="cui-filters-close-btn" onClick={() => setSidebarOpen(false)}>Fermer</button>
        </aside>

        {sidebarOpen && (
          <div className="cui-filters-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="cui-main">
          <div className="cui-grid">
            {filtered.map(product => (
              <Link key={product.key} to={product.path} className="cui-card">
                <div className="cui-img-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="cui-img"
                    loading="lazy"
                    onError={e => { e.target.style.opacity = '0.3'; }}
                  />
                  <div className="cui-card-overlay">
                    <span className="cui-card-discover">Découvrir</span>
                  </div>
                  <span className="cui-marque-badge">{product.marque}</span>
                </div>
                <div className="cui-card-info">
                  <span className="cui-card-cat">{product.style}</span>
                  <h3 className="cui-card-name">{product.name}</h3>
                  <span className="cui-card-finish">
                    {product.finition || (product.colors.length > 0 ? product.colors.slice(0, 3).join(' · ') : '')}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="cui-empty">
              <p>Aucun modèle trouvé.</p>
              <button onClick={clearAll}>Réinitialiser les filtres</button>
            </div>
          )}
        </div>
      </div>

      <button className="cui-filters-fab" onClick={() => setSidebarOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="10" y2="18"/>
        </svg>
        Filtres
        {[activeMarque, activeStyle, activeFinition, activeCouleur, search].filter(Boolean).length > 0 && (
          <span className="cui-filters-fab-badge">
            {[activeMarque, activeStyle, activeFinition, activeCouleur, search].filter(Boolean).length}
          </span>
        )}
      </button>
    </section>
  );
};

export default CuisinePage;
