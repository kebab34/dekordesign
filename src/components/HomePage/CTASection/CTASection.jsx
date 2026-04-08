import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CTASection.css';

const CTASection = () => {
  const { t } = useTranslation();
  return (
    <section className="cta-section">
      <div className="cta-content">
        <div className="gold-line"></div>
        <h2 className="cta-title">{t('home.cta.title')}</h2>
        <p className="cta-text">{t('home.cta.text')}</p>
        <Link to="/contact" className="view-all-btn">
          {t('home.cta.button')}
        </Link>
      </div>
    </section>
  );
};

export default CTASection;