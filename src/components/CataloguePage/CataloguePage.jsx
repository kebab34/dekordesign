import React from 'react';
import './CataloguePage.css';
import { assetUrl } from '../../config/assets';
import generalCatalogueImage from '../../image/catalogue/general.png';
import boisCatalogueImage from '../../image/catalogue/bois.png';
import oversizeCatalogueImage from '../../image/catalogue/oversize.png';
import salleDeBainCatalogueImage from '../../image/catalogue/bain.png';
import muralCatalogueImage from '../../image/catalogue/mur.png';  
import SEO from '../SEO/SEO';
import { PAGE_SEO } from '../../config/seoPages';
import { useTranslation } from 'react-i18next';

const catalogues = [
  {
    id: 1,
    key: 'general',
    image: generalCatalogueImage,
    pdf: assetUrl('catalogues/genel-katalog.pdf')
  },
  {
    id: 2,
    key: 'bois',
    image: boisCatalogueImage,
    pdf: assetUrl('catalogues/ahsap-katalogu.pdf')
  },
  {
    id: 3,
    key: 'oversize',
    image: oversizeCatalogueImage,
    pdf: assetUrl('catalogues/oversize-katalogu.pdf')
  },
  {
    id: 4,
    key: 'bain',
    image: salleDeBainCatalogueImage,
    pdf: assetUrl('catalogues/banyo-katalogu.pdf')
  },
  {
    id: 5,
    key: 'mural',
    image: muralCatalogueImage,
    pdf: assetUrl('catalogues/duvar-katalogu.pdf')
  }
];

const CataloguePage = () => {
  const { t } = useTranslation();
  return (
    <section className="catalogue-page">
      <SEO {...PAGE_SEO['/catalogues']} canonical="/catalogues" />
      <div className="catalogue-header">
        <div className="gold-line"></div>
        <h1 className="catalogue-title">{t('catalogues.title')}</h1>
        <p className="catalogue-subtitle">{t('catalogues.subtitle')}</p>
      </div>

      <div className="catalogue-grid">
        {catalogues.map((catalogue) => (
          <div key={catalogue.id} className="catalogue-card">
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
    </section>
  );
};

export default CataloguePage;
