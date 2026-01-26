import React from 'react';
import { featuredProductsData } from '../../../data/content';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  return (
    <section className="section">
      <div className="section-header">
        <div className="gold-line"></div>
        <h2 className="section-title">COLLECTIONS SIGNATURE</h2>
        <p className="section-subtitle">Nos créations les plus emblématiques</p>
      </div>
      <div className="featured-grid">
        {featuredProductsData.map((product, index) => (
          <div key={index} className="featured-card">
            <div className="featured-image-wrapper">
              <img src={product.image} alt={product.name} className="featured-image" />
              <div className="featured-overlay">
                <div className="featured-hover">
                  <h4 className="featured-name">{product.name}</h4>
                  <span className="featured-category">{product.category}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;