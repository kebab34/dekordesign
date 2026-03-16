import React from 'react';
import { Link } from 'react-router-dom';
import { productCategoriesData } from '../../../data/content';
import './ProductCategories.css';

const ProductCategories = () => {
  return (
    <section className="dark-section">
      <div className="section-header">
        <div className="gold-line"></div>
        <h2 className="section-title">NOS EXPERTISES</h2>
        <p className="section-subtitle-light">L'excellence dans chaque détail</p>
      </div>
      <div className="products-grid">
        {productCategoriesData.map((category, index) => (
          <Link key={index} to={category.path} className="product-card">
            <div className="product-image-container">
              <img src={category.image} alt={category.name} className="product-image" />
              <div className="product-overlay">
                <span className="explore-button">EXPLORER</span>
              </div>
            </div>
            <div className="product-info">
              <h3 className="product-name">{category.name}</h3>
              <p className="product-description">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductCategories;