import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { aderkaData } from '../../data/aderkaData';
import './AderkaDetailPage.css';
import { quoteUrl } from '../../config/company';
import SEO from '../SEO/SEO';
import { aderkaDoorSeo } from '../../config/seo';
import { useTranslation } from 'react-i18next';

// Textes des séries (finition, style, description) : i18n aderka.series.<Série>
const SERIES_KEYS = ['Exclusive', 'Stoneline', 'Elegance', 'Woodline'];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    id: 'aluminium',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12a9 9 0 1018 0A9 9 0 003 12z" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    id: 'pivot',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    ),
    id: 'insulation',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    id: 'finishes',
  },
];

const AderkaDetailPage = () => {
  const { t } = useTranslation();
  const { series, slug } = useParams();
  const door = aderkaData.find(d => d.slug === slug);

  if (!door) {
    return (
      <div className="adkd-notfound">
        <p>{t('catalog.modelNotFound')}</p>
        <Link to="/portes-pivot">{t('aderka.back')}</Link>
      </div>
    );
  }

  const seriesKey = SERIES_KEYS.includes(door.series) ? door.series : 'Elegance';
  const st = key => t(`aderka.series.${seriesKey}.${key}`);

  const sameSeries = aderkaData.filter(d => d.slug !== slug && d.series === door.series);
  const otherSeries = aderkaData.filter(d => d.slug !== slug && d.series !== door.series);
  const related = [...sameSeries, ...otherSeries].slice(0, 4);

  return (
    <div className="adkd-page">
      <SEO {...aderkaDoorSeo(series, door)} />
      {/* ── Hero split ── */}
      <div className="adkd-hero">
        {/* Left — full-height image */}
        <div className="adkd-hero-img-col">
          <img
            src={door.image}
            alt={door.name}
            className="adkd-hero-img"
            onError={e => { e.target.style.opacity = '0.2'; }}
          />
          <div className="adkd-hero-img-overlay" />
        </div>

        {/* Right — info panel */}
        <div className="adkd-hero-info-col">
          {/* Breadcrumb */}
          <nav className="adkd-breadcrumb">
            <Link to="/">{t('catalog.home')}</Link>
            <span>›</span>
            <Link to="/portes-pivot">{t('aderka.crumb')}</Link>
            <span>›</span>
            <Link to={`/portes-pivot/${series}`}>{door.series}</Link>
            <span>›</span>
            <span>{door.name}</span>
          </nav>

          <div className="adkd-gold-line" />
          <span className="adkd-series-badge">{door.series} Series</span>
          <h1 className="adkd-name">{door.name.toUpperCase()}</h1>

          <p className="adkd-description">{st('description')}</p>

          {/* Specs grid */}
          <div className="adkd-specs">
            <div className="adkd-spec-item">
              <span className="adkd-spec-label">{t('aderka.specs.material')}</span>
              <span className="adkd-spec-value">{t('aderka.specs.aluminium')}</span>
            </div>
            <div className="adkd-spec-item">
              <span className="adkd-spec-label">{t('aderka.specs.finish')}</span>
              <span className="adkd-spec-value">{st('finish')}</span>
            </div>
            <div className="adkd-spec-item">
              <span className="adkd-spec-label">{t('aderka.specs.style')}</span>
              <span className="adkd-spec-value">{st('style')}</span>
            </div>
            <div className="adkd-spec-item">
              <span className="adkd-spec-label">{t('aderka.specs.dimensions')}</span>
              <span className="adkd-spec-value">{t('aderka.specs.custom')}</span>
            </div>
            <div className="adkd-spec-item">
              <span className="adkd-spec-label">{t('aderka.specs.series')}</span>
              <span className="adkd-spec-value">{door.series}</span>
            </div>
            <div className="adkd-spec-item">
              <span className="adkd-spec-label">{t('aderka.specs.usage')}</span>
              <span className="adkd-spec-value">{t('aderka.specs.exterior')}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="adkd-cta">
            <Link to={quoteUrl(`Porte pivot Aderka ${door.name}`)} className="adkd-btn-gold">
              {t('catalog.requestQuote')}
            </Link>
            <Link to={`/portes-pivot/${series}`} className="adkd-btn-outline">
              {t('aderka.specs.series')} {door.series}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Features bar ── */}
      <div className="adkd-features">
        {FEATURES.map((f, i) => (
          <div key={i} className="adkd-feature-item">
            <div className="adkd-feature-icon">{f.icon}</div>
            <div>
              <p className="adkd-feature-label">{t(`aderka.features.${f.id}.label`)}</p>
              <p className="adkd-feature-sub">{t(`aderka.features.${f.id}.sub`)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Related models ── */}
      {related.length > 0 && (
        <div className="adkd-related">
          <div className="adkd-related-header">
            <div className="adkd-gold-line" />
            <h2 className="adkd-related-title">{t('aderka.sameRange')}</h2>
          </div>
          <div className="adkd-related-grid">
            {related.map(r => (
              <Link key={r.id} to={`/portes-pivot/${r.series.toLowerCase()}/${r.slug}`} className="adkd-related-card">
                <div className="adkd-related-img-wrap">
                  <img src={r.image} alt={r.name} loading="lazy" />
                  <div className="adkd-related-overlay">
                    <span>{t('catalog.viewModel')}</span>
                  </div>
                </div>
                <div className="adkd-related-info">
                  <h3 className="adkd-related-name">{r.name}</h3>
                  <span className="adkd-related-series">{r.series}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AderkaDetailPage;
