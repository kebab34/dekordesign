import React from 'react';
import { Link } from 'react-router-dom';
import { menuiserieCategories } from '../../data/menuiserieData';
import './MenuiseriePage.css';

const MenuiseriePage = () => {
  return (
    <section className="men-page">
      <div className="men-header">
        <div className="men-gold-line"></div>
        <h1 className="men-title">MENUISERIE</h1>
        <p className="men-subtitle">Fenêtres, portes et solutions sur mesure</p>
      </div>

      <div className="men-grid">
        {menuiserieCategories.map(cat => (
          <Link key={cat.slug} to={`/menuiserie/${cat.slug}`} className="men-card">
            <div className="men-img-wrapper">
              <img
                src={cat.image}
                alt={cat.name}
                className="men-img"
                loading="lazy"
                onError={e => { e.target.style.opacity = '0'; }}
              />
              <div className="men-overlay">
                <h3 className="men-card-title">{cat.name}</h3>
                <div className="men-card-line"></div>
                <p className="men-card-desc">{cat.description}</p>
                <span className="men-card-cta">DÉCOUVRIR</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MenuiseriePage;
