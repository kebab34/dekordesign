import React from 'react';
import './CTASection.css';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <div className="gold-line"></div>
        <h2 className="cta-title">CONCRÉTISONS VOTRE VISION</h2>
        <p className="cta-text">
          Notre équipe d'experts vous accompagne dans la réalisation de votre projet sur mesure
        </p>
        <Link to="/contact" className="view-all-btn">
          PRENDRE RENDEZ-VOUS
        </Link>
      </div>
    </section>
  );
};

export default CTASection;