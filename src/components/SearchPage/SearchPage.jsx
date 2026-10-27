import React, { useMemo, useState, useEffect, useDeferredValue, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../SEO/SEO';
import { search } from '../../data/searchIndex';
import './SearchPage.css';

const GROUPS = ['tiles', 'bathroom', 'kitchens', 'joinery'];
const PER_GROUP = 12;

const SearchPage = () => {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const urlQuery = params.get('q') || '';
  // Le champ garde sa propre valeur (saisie rapide sans perte de lettres) ; l'URL suit juste après
  const [query, setQuery] = useState(urlQuery);
  const [expanded, setExpanded] = useState({});
  const deferred = useDeferredValue(query);

  const pushed = useRef(urlQuery);
  // URL modifiée de l'extérieur (lien, retour arrière) → on met le champ à jour
  useEffect(() => {
    if (urlQuery !== pushed.current) { pushed.current = urlQuery; setQuery(urlQuery); }
  }, [urlQuery]);
  useEffect(() => {
    const id = setTimeout(() => {
      if (query !== urlQuery) { pushed.current = query; setParams(query ? { q: query } : {}, { replace: true }); }
    }, 250);
    return () => clearTimeout(id);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const results = useMemo(() => search(deferred), [deferred]);
  const grouped = GROUPS
    .map(g => ({ g, items: results.filter(r => r.group === g) }))
    .filter(x => x.items.length);

  const onChange = e => {
    setQuery(e.target.value);
    setExpanded({});
  };

  return (
    <section className="srch-page">
      <SEO title={t('search.title')} canonical="/recherche" noindex />
      <div className="srch-header">
        <div className="srch-gold-line"></div>
        <h1 className="srch-title">{t('search.title')}</h1>
        <div className="srch-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search"
            value={query}
            onChange={onChange}
            placeholder={t('search.placeholder')}
            aria-label={t('search.title')}
            autoFocus
          />
        </div>
        {query.trim().length >= 2 && (
          <p className="srch-count">{t('search.results', { count: results.length, query })}</p>
        )}
      </div>

      {query.trim().length < 2 ? (
        <p className="srch-hint">{t('search.hint')}</p>
      ) : results.length === 0 ? (
        <div className="srch-empty">
          <p>{t('search.none', { query })}</p>
          <Link to="/contact" className="srch-contact">{t('search.askUs')}</Link>
        </div>
      ) : (
        grouped.map(({ g, items }) => {
          const shown = expanded[g] ? items : items.slice(0, PER_GROUP);
          return (
            <div key={g} className="srch-group">
              <h2 className="srch-group-title">
                {t(`search.groups.${g}`)} <span>{items.length}</span>
              </h2>
              <div className="srch-grid">
                {shown.map(r => (
                  <Link key={r.url} to={r.url} className="srch-card">
                    <div className="srch-img">
                      {r.image && <img src={r.image} alt={r.title} loading="lazy" onError={e => { e.target.style.opacity = '0.2'; }} />}
                    </div>
                    <div className="srch-info">
                      <span className="srch-name">{r.title}</span>
                      {r.subtitle && <span className="srch-sub">{r.subtitle}</span>}
                    </div>
                  </Link>
                ))}
              </div>
              {items.length > shown.length && (
                <button className="srch-more" onClick={() => setExpanded(x => ({ ...x, [g]: true }))}>
                  {t('search.showAll', { count: items.length })}
                </button>
              )}
            </div>
          );
        })
      )}
    </section>
  );
};

export default SearchPage;
