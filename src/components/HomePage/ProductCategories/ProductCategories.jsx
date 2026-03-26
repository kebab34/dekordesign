import React from 'react';
import { Link } from 'react-router-dom';
import { productCategoriesData } from '../../../data/content';
import './ProductCategories.css';

const ProductCategories = () => {
  return (
    <section className="dark-section">
      <div className="pc-section-header">
        <div className="gold-line"></div>
        <h2 className="section-title">NOS EXPERTISES</h2>
        <p className="section-subtitle-light">L'excellence dans chaque détail</p>
      </div>
      <div className="products-grid">
        {productCategoriesData.map((category, index) => (
          <Link key={index} to={category.path} className="product-card">
            <div className="product-image-container">
              <img src={category.image} alt={category.name} className="product-image" loading="lazy" />
              <div className="product-overlay">
                <span className="explore-button">EXPLORER</span>
              </div>
              <div className="product-name-bar">
                <h3 className="product-name">{category.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductCategories;