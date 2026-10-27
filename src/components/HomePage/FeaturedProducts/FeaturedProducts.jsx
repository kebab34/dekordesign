import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collectionCards } from '../../../data/content';
import './FeaturedProducts.css';
import { useTranslation } from 'react-i18next';

const FeaturedProducts = () => {
  const { t } = useTranslation();
  const [displayProducts, setDisplayProducts] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fonction pour obtenir 4 produits aléatoires
  const getRandomProducts = () => {
    const shuffled = [...collectionCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  };

  // Initialisation
  useEffect(() => {
    setDisplayProducts(getRandomProducts());
  }, []);

  // Change les produits toutes les 6 secondes avec animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setDisplayProducts(getRandomProducts());
        setIsAnimating(false);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section featured-section">
      <div className="section-header">
        <div className="gold-line"></div>
        <h2 className="section-title">{t('featured.title')}</h2>
        <p className="section-subtitle">{t('featured.subtitle')}</p>
      </div>

      <div className={`featured-grid ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        {displayProducts.map((product) => (
          <Link
            to={`/collections?collection=${encodeURIComponent(product.collection)}`}
            key={product.id}
            className="featured-card"
          >
            <div className="featured-image-wrapper">
              <img src={product.image} alt={product.name} className="featured-image" loading="lazy" />
              <div className="featured-overlay">
                <div className="featured-hover">
                  <h4 className="featured-name">{product.name}</h4>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="featured-cta">
        <Link to="/collections" className="view-all-btn">
          Voir toutes nos collections
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
