import React from 'react';
import './CataloguePage.css';
import { catalogueGroups } from '../../data/catalogues';
import SEO from '../SEO/SEO';
import { PAGE_SEO } from '../../config/seoPages';
import { useTranslation } from 'react-i18next';

const CataloguePage = () => {
  const { t, i18n } = useTranslation();
  const size = mb => mb.toLocaleString(i18n.language, { maximumFractionDigits: 1 });
  return (
    <section className="catalogue-page">
      <SEO {...PAGE_SEO['/catalogues']} canonical="/catalogues" />
      <div className="catalogue-header">
        <div className="gold-line"></div>
        <h1 className="catalogue-title">{t('catalogues.title')}</h1>
        <p className="catalogue-subtitle">{t('catalogues.subtitle')}</p>
      </div>

      {catalogueGroups.map(({ group, format, items }) => (
        <div key={group} className={`catalogue-group catalogue-group--${group}`}>
          <h2 className="catalogue-group-title">{t(`catalogues.groups.${group}`)}</h2>
          <div className={`catalogue-grid catalogue-grid--${format}`}>
            {items.map((catalogue) => (
              <div key={catalogue.key} className="catalogue-card">
                <a
                  href={catalogue.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="catalogue-image-wrapper"
                >
                  <img
                    src={catalogue.image}
                    alt={t(`catalogues.names.${catalogue.key}`)}
                    className="catalogue-image"
                    loading="lazy"
                  />
                  <div className="catalogue-overlay">
                    <svg className="view-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span>{t('catalogues.view')}</span>
                  </div>
                </a>
                <div className="catalogue-info">
                  <h3 className="catalogue-name">{t(`catalogues.names.${catalogue.key}`)}</h3>
                  <p className="catalogue-meta">{t('catalogues.meta', { pages: catalogue.pages, size: size(catalogue.sizeMb) })}</p>
                  <a
                    href={catalogue.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="catalogue-download-btn"
                  >
                    <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                    </svg>
                    {t('catalogues.download')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default CataloguePage;
