import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../SEO/SEO';
import { seriesCovers } from '../../data/aderkaData';
import './AderkaSeriesPage.css';
import { PAGE_SEO } from '../../config/seoPages';
import { useTranslation } from 'react-i18next';

const SERIES_LIST = [
  {
    slug: 'exclusive',
    name: 'Exclusive',
    count: 3,
  },
  {
    slug: 'stoneline',
    name: 'Stoneline',
    count: 3,
  },
  {
    slug: 'elegance',
    name: 'Elegance',
    count: 10,
  },
  {
    slug: 'woodline',
    name: 'Woodline',
    count: 3,
  },
];

const AderkaSeriesPage = () => {
  const { t } = useTranslation();
  return (
  <section className="ase-page">
    <SEO {...PAGE_SEO['/portes-pivot']} canonical="/portes-pivot" />
    <div className="ase-header">
      <div className="ase-gold-line" />
      <h1 className="ase-title">{t('aderka.title')}</h1>
      <p className="ase-subtitle">{t('aderka.subtitle')}</p>
    </div>

    <div className="ase-grid">
      {SERIES_LIST.map((s, i) => (
        <Link key={s.slug} to={`/portes-pivot/${s.slug}`} className="ase-card">
          <div className="ase-img-wrap">
            <img
              src={seriesCovers[s.name]}
              alt={s.name}
              className="ase-img"
              loading={i < 2 ? 'eager' : 'lazy'}
              onError={e => { e.target.style.opacity = '0.2'; }}
            />
            <div className="ase-overlay" />
            <div className="ase-info">
              <span className="ase-count">{t('catalog.modelsFound', { count: s.count })}</span>
              <h2 className="ase-name">{s.name.toUpperCase()}</h2>
              <p className="ase-desc">{t(`aderka.seriesDesc.${s.name}`)}</p>
              <span className="ase-cta">{t('aderka.discoverSeries')}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>
  );
};

export default AderkaSeriesPage;
