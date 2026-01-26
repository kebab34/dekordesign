import React from 'react';
import './CTASection.css';

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <div className="gold-line"></div>
        <h2 className="cta-title">CONCRÉTISONS VOTRE VISION</h2>
        <p className="cta-text">
          Notre équipe d'experts vous accompagne dans la réalisation de votre projet sur mesure
        </p>
        <button className="cta-button">PRENDRE RENDEZ-VOUS</button>
      </div>
    </section>
  );
};

export default CTASection;