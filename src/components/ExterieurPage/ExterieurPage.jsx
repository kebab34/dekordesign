import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../SEO/SEO';
import { exterieurProducts, exterieurCategories } from '../../data/exterieurData';
import './ExterieurPage.css';
import { PAGE_SEO } from '../../config/seoPages';
import { useTranslation } from 'react-i18next';

const ExterieurPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeCat, setActiveCat] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const cat = new URLSearchParams(location.search).get('cat') || '';
    setActiveCat(cat);
    setSearch('');
  }, [location.search]);

  const filtered = exterieurProducts.filter(p => {
    if (activeCat && p.mainCategory !== activeCat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const catName = slug => t(`exterieur.cats.${slug}`, exterieurCategories.find(c => c.slug === slug)?.name || '');
  const catLabel = activeCat ? catName(activeCat) : '';

  return (
    <section className="ext-page">
      <SEO {...PAGE_SEO['/exterieur']} canonical="/exterieur" />
      {/* Header */}
      <div className="ext-header">
        <div className="ext-gold-line"></div>
        <h1 className="ext-title">{t('exterieur.title')}</h1>
        <p className="ext-subtitle">{t('exterieur.subtitle')}</p>
      </div>

      {/* Category tabs */}
      <div className="ext-cats-wrap">
        <div className="ext-cats">
          <button
            className={`ext-cat-btn ${activeCat === '' ? 'active' : ''}`}
            onClick={() => setActiveCat('')}
          >
            {t('catalog.seeAll')}
          </button>
          {exterieurCategories.map(cat => (
            <button
              key={cat.slug}
              className={`ext-cat-btn ${activeCat === cat.slug ? 'active' : ''}`}
              onClick={() => setActiveCat(cat.slug)}
            >
              {catName(cat.slug)}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="ext-toolbar">
        <div className="ext-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="ext-search-input"
            placeholder={t('catalog.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="ext-search-clear" onClick={() => setSearch('')}>×</button>
          )}
        </div>
        <div className="ext-toolbar-right">
          <span className="ext-count">{t('catalog.productsFound', { count: filtered.length })}</span>
          {(activeCat || search) && (
            <button className="ext-clear-btn" onClick={() => { setActiveCat(''); setSearch(''); }}>
              {t('catalog.reset')}
            </button>
          )}
        </div>
      </div>

      {/* Active filter tag */}
      {(activeCat || search) && (
        <div className="ext-tags">
          {activeCat && (
            <span className="ext-tag">
              {catLabel}
              <button onClick={() => setActiveCat('')}>×</button>
            </span>
          )}
          {search && (
            <span className="ext-tag">
              "{search}"
              <button onClick={() => setSearch('')}>×</button>
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="ext-grid">
          {filtered.map(p => (
            <Link key={p.id} to={`/exterieur/${p.id}`} className="ext-card">
              <div className={`ext-img-wrapper ${p.cover ? 'ext-img-wrapper--cover' : ''}`}>
                <img
                  src={p.image}
                  alt={p.name}
                  className="ext-img"
                  loading="lazy"
                  onError={e => { e.target.style.opacity = '0.1'; }}
                />
              </div>
              <div className="ext-card-info">
                <span className="ext-card-cat">
                  {catName(p.mainCategory)}
                </span>
                <h3 className="ext-card-name">{p.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="ext-empty">
          <p>{t('catalog.noResults')}</p>
          <button onClick={() => { setActiveCat(''); setSearch(''); }}>{t('catalog.resetFilters')}</button>
        </div>
      )}
    </section>
  );
};

export default ExterieurPage;
