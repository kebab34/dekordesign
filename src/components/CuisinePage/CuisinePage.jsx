import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cuisineData, cuisineCategories } from '../../data/cuisineData';
import './CuisinePage.css';

const uniqueVals = (field) =>
  [...new Set(cuisineData.map(p => p.specs[field]).filter(Boolean))].sort();

const FINITIONS = uniqueVals('Finition');
const POIGNEES  = uniqueVals('Poignées');

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

const CuisinePage = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('');
  const [activeFinition, setActiveFinition] = useState('');
  const [activePoignees, setActivePoignees] = useState('');
  const [search,         setSearch]         = useState('');
  const [sidebarOpen,    setSidebarOpen]    = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const style = params.get('style');
    if (style && cuisineCategories.includes(style)) {
      setActiveCategory(style);
    }
  }, [location.search]);

  const filtered = useMemo(() => cuisineData.filter(p => {
    if (activeCategory && p.category !== activeCategory) return false;
    if (activeFinition  && p.specs['Finition']  !== activeFinition)  return false;
    if (activePoignees  && p.specs['Poignées']  !== activePoignees)  return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  }), [activeCategory, activeFinition, activePoignees, search]);

  const hasFilters = activeCategory || activeFinition || activePoignees || search;

  const clearAll = () => {
    setActiveCategory('');
    setActiveFinition('');
    setActivePoignees('');
    setSearch('');
  };

  return (
    <section className="cui-page">
      <div className="cui-header">
        <div className="cui-gold-line"></div>
        <h2 className="cui-title">CUISINES</h2>
        <p className="cui-subtitle">
          {filtered.length} modèle{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="cui-layout">
        <button className="cui-sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
          {sidebarOpen ? 'Masquer les filtres' : 'Afficher les filtres'}
        </button>

        <aside className={`cui-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="cui-sidebar-header">
            <h3 className="cui-sidebar-title">FILTRES</h3>
            {hasFilters && (
              <button className="cui-clear-btn" onClick={clearAll}>Effacer tout</button>
            )}
          </div>

          <FilterDropdown
            title="STYLE"
            options={cuisineCategories}
            active={activeCategory}
            onSelect={setActiveCategory}
          />

          <FilterDropdown
            title="FINITION"
            options={FINITIONS}
            active={activeFinition}
            onSelect={setActiveFinition}
          />

          <FilterDropdown
            title="POIGNÉES"
            options={POIGNEES}
            active={activePoignees}
            onSelect={setActivePoignees}
          />

          {hasFilters && (
            <div className="cui-active-filters">
              {activeCategory && <span className="cui-tag">{activeCategory} <button onClick={() => setActiveCategory('')}>×</button></span>}
              {activeFinition  && <span className="cui-tag">{activeFinition} <button onClick={() => setActiveFinition('')}>×</button></span>}
              {activePoignees  && <span className="cui-tag">{activePoignees} <button onClick={() => setActivePoignees('')}>×</button></span>}
              {search          && <span className="cui-tag">"{search}" <button onClick={() => setSearch('')}>×</button></span>}
            </div>
          )}
        </aside>

        <div className="cui-main">
          <div className="cui-search-bar">
            <div className="cui-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Rechercher un modèle..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="cui-search-input"
              />
              {search && <button className="cui-search-clear" onClick={() => setSearch('')}>✕</button>}
            </div>
          </div>

          <div className="cui-grid">
            {filtered.map(product => (
              <Link key={product.id} to={`/cuisines/${product.id}`} className="cui-card">
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
                </div>
                <div className="cui-card-info">
                  <span className="cui-card-cat">{product.category}</span>
                  <h3 className="cui-card-name">{product.name}</h3>
                  <span className="cui-card-finish">{product.specs['Finition']}</span>
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
    </section>
  );
};

export default CuisinePage;
