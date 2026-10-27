import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../SEO/SEO';
import { menuiserieCategories, menuiserieProducts } from '../../data/menuiserieData';
import './MenuiseriePage.css';
import { PAGE_SEO } from '../../config/seoPages';
import { useTranslation } from 'react-i18next';

const MenuiseriePage = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [activeCat, setActiveCat]       = useState('');
  const [activeSubCat, setActiveSubCat] = useState('');
  const [search, setSearch]             = useState('');

  // Sync URL ?cat= param → filter state
  useEffect(() => {
    const cat = new URLSearchParams(location.search).get('cat') || '';
    setActiveCat(cat);
    setActiveSubCat('');
  }, [location.search]);

  // Sub-categories for currently active main category
  const subCats = useMemo(() => {
    if (!activeCat) return [];
    const seen = new Set();
    return menuiserieProducts
      .filter(p => p.mainCategory === activeCat)
      .map(p => p.subCategory)
      .filter(sc => sc && !seen.has(sc) && seen.add(sc));
  }, [activeCat]);

  // Filtered products
  const filtered = useMemo(() => menuiserieProducts.filter(p => {
    if (activeCat    && p.mainCategory !== activeCat)    return false;
    if (activeSubCat && p.subCategory  !== activeSubCat) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        (menuiserieCategories.find(c => c.slug === p.mainCategory)?.name || '').toLowerCase().includes(q)
      );
    }
    return true;
  }), [activeCat, activeSubCat, search]);

  const hasFilters = activeCat || activeSubCat || search;

  const handleMainCat = (slug) => {
    setActiveCat(slug);
    setActiveSubCat('');
  };

  const clearAll = () => {
    setActiveCat('');
    setActiveSubCat('');
    setSearch('');
  };

  const catName = slug => t(`menuiserie.cats.${slug}`, menuiserieCategories.find(c => c.slug === slug)?.name || '');
  const activeCatLabel = activeCat ? catName(activeCat) : '';

  return (
    <section className="men-page">
      <SEO {...PAGE_SEO['/menuiserie']} canonical="/menuiserie" />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="men-header">
        <div className="men-gold-line"></div>
        <h1 className="men-title">{t('menuiserie.title')}</h1>
        <p className="men-subtitle">{t('menuiserie.subtitle')}</p>
      </div>

      {/* ── Catégories principales ──────────────────────────────── */}
      <div className="men-cats-wrap">
        <div className="men-cats">
          <button
            className={`men-cat-btn ${!activeCat ? 'active' : ''}`}
            onClick={() => handleMainCat('')}
          >
            {t('catalog.all')}
          </button>
          {menuiserieCategories.map(cat => (
            <button
              key={cat.slug}
              className={`men-cat-btn ${activeCat === cat.slug ? 'active' : ''}`}
              onClick={() => handleMainCat(cat.slug)}
            >
              {catName(cat.slug)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sous-catégories (PVC uniquement, plusieurs sous-cats) ── */}
      {subCats.length > 1 && (
        <div className="men-subcats-wrap">
          <div className="men-subcats">
            <button
              className={`men-subcat-btn ${!activeSubCat ? 'active' : ''}`}
              onClick={() => setActiveSubCat('')}
            >
              {t('catalog.allShort')}
            </button>
            {subCats.map(sc => (
              <button
                key={sc}
                className={`men-subcat-btn ${activeSubCat === sc ? 'active' : ''}`}
                onClick={() => setActiveSubCat(sc)}
              >
                {sc}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Barre de recherche + compteur ──────────────────────── */}
      <div className="men-toolbar">
        <div className="men-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder={t('catalog.searchProduct')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="men-search-input"
          />
          {search && (
            <button className="men-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="men-toolbar-right">
          <span className="men-count">
            {t('catalog.productsFound', { count: filtered.length })}
          </span>
          {hasFilters && (
            <button className="men-clear-btn" onClick={clearAll}>{t('catalog.clearAll')}</button>
          )}
        </div>
      </div>

      {/* ── Tags filtres actifs ────────────────────────────────── */}
      {hasFilters && (
        <div className="men-tags">
          {activeCat && (
            <span className="men-tag">
              {activeCatLabel}
              <button onClick={() => { setActiveCat(''); setActiveSubCat(''); }}>×</button>
            </span>
          )}
          {activeSubCat && (
            <span className="men-tag">
              {activeSubCat}
              <button onClick={() => setActiveSubCat('')}>×</button>
            </span>
          )}
          {search && (
            <span className="men-tag">
              &ldquo;{search}&rdquo;
              <button onClick={() => setSearch('')}>×</button>
            </span>
          )}
        </div>
      )}

      {/* ── Grille produits ───────────────────────────────────── */}
      <div className="men-grid">
        {filtered.map(product => (
          <Link key={product.id} to={`/menuiserie/${product.id}`} className="men-card">
            <div className={`men-img-wrapper ${product.cover ? 'men-img-wrapper--cover' : ''}`}>
              <img
                src={product.image}
                alt={product.name}
                className="men-img"
                loading="lazy"
                onError={e => { e.target.style.opacity = '0.1'; }}
              />
            </div>
            <div className="men-card-info">
              <span className="men-card-cat">
                {catName(product.mainCategory)}
              </span>
              <h3 className="men-card-name">{product.name}</h3>
              {product.subCategory !== menuiserieCategories.find(c => c.slug === product.mainCategory)?.name && (
                <span className="men-card-sub">{product.subCategory}</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="men-empty">
          <p>{t('catalog.noResults')}</p>
          <button onClick={clearAll}>{t('catalog.resetFilters')}</button>
        </div>
      )}
    </section>
  );
};

export default MenuiseriePage;
