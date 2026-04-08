import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productCategoriesData } from '../../../data/content';
import './ProductCategories.css';

const ProductCategories = () => {
  const { t } = useTranslation();
  return (
    <section className="dark-section">
      <div className="pc-section-header">
        <div className="gold-line"></div>
        <h2 className="section-title">{t('home.expertises')}</h2>
        <p className="section-subtitle-light">{t('home.expertisesSubtitle')}</p>
      </div>
      <div className="products-grid">
        {productCategoriesData.map((category, index) => (
          <Link key={index} to={category.path} className="product-card">
            <div className="product-image-container">
              <img src={category.image} alt={category.name} className="product-image" loading="lazy" />
              <div className="product-overlay">
                <span className="explore-button">{t('home.explore')}</span>
              </div>
              <div className="product-name-bar">
                <h3 className="product-name">{t(`productCategories.${category.name}`, category.name)}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductCategories;