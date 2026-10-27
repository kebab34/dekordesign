import React from 'react';
import SEO from '../SEO/SEO';
import './LegalPage.css';

// Mise en page commune des pages légales
const LegalLayout = ({ title, seoDescription, canonical, updated, children }) => (
  <section className="legal-page">
    <SEO title={title} description={seoDescription} canonical={canonical} />
    <div className="legal-header">
      <div className="legal-gold-line"></div>
      <h1 className="legal-title">{title}</h1>
      {updated && <p className="legal-updated">Dernière mise à jour : {updated}</p>}
    </div>
    <div className="legal-body">{children}</div>
  </section>
);

export default LegalLayout;
