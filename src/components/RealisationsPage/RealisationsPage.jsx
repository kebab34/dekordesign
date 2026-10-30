import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../SEO/SEO';
import { realisations, REALISATION_CATEGORIES } from '../../data/realisations';
import { tileUrl } from '../../config/assets';
import { PAGE_SEO } from '../../config/seoPages';
import './RealisationsPage.css';

const formatDate = (ym, lang) => {
  if (!ym) return '';
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, (m || 1) - 1).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { month: 'long', year: 'numeric' });
};

const RealisationsPage = () => {
  const { t, i18n } = useTranslation();
  const [cat, setCat] = useState('');
  const cats = REALISATION_CATEGORIES.filter(c => realisations.some(r => r.category === c));
  const list = realisations
    .filter(r => !cat || r.category === cat)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return (
    <section className="real-page">
      <SEO {...PAGE_SEO['/realisations']} canonical="/realisations" noindex={!realisations.length} />
      <div className="real-header">
        <div className="real-gold-line"></div>
        <h1 className="real-title">{t('realisations.title')}</h1>
        <p className="real-subtitle">{t('realisations.subtitle')}</p>
      </div>

      {!realisations.length ? (
        <div className="real-empty">
          <p>{t('realisations.soon')}</p>
          <Link to="/contact" className="real-btn">{t('realisations.cta')}</Link>
        </div>
      ) : (
        <>
          {cats.length > 1 && (
            <div className="real-filters">
              <button className={!cat ? 'active' : ''} onClick={() => setCat('')}>{t('catalog.allShort')}</button>
              {cats.map(c => (
                <button key={c} className={cat === c ? 'active' : ''} onClick={() => setCat(c)}>
                  {t(`realisations.categories.${c}`)}
                </button>
              ))}
            </div>
          )}
          <div className="real-grid">
            {list.map(r => (
              <Link key={r.slug} to={`/realisations/${r.slug}`} className="real-card">
                <div className="real-img">
                  <img src={tileUrl(r.cover, 'sm')} alt={r.title} loading="lazy" />
                  <span className="real-count">{t('catalog.photos', { count: (r.images || []).length + 1 })}</span>
                </div>
                <div className="real-info">
                  <span className="real-meta">
                    {t(`realisations.categories.${r.category}`)} · {r.city}{r.date ? ` · ${formatDate(r.date, i18n.language)}` : ''}
                  </span>
                  <h2 className="real-name">{r.title}</h2>
                </div>
              </Link>
            ))}
          </div>
          <div className="real-bottom">
            <p>{t('realisations.yourProject')}</p>
            <Link to="/contact" className="real-btn">{t('realisations.cta')}</Link>
          </div>
        </>
      )}
    </section>
  );
};

export { formatDate };
export default RealisationsPage;
