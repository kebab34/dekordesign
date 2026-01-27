import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsData } from '../../../data/content';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [displayProducts, setDisplayProducts] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fonction pour obtenir 4 produits aléatoires
  const getRandomProducts = () => {
    const shuffled = [...productsData].sort(() => Math.random() - 0.5);
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
        <h2 className="section-title">COLLECTIONS SIGNATURE</h2>
        <p className="section-subtitle">Nos créations les plus emblématiques</p>
      </div>

      <div className={`featured-grid ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        {displayProducts.map((product) => (
          <Link
            to={`/collections?collection=${encodeURIComponent(product.collection)}`}
            key={product.id}
            className="featured-card"
          >
            <div className="featured-image-wrapper">
              <img src={product.image} alt={product.name} className="featured-image" />
              <div className="featured-overlay">
                <div className="featured-hover">
                  <h4 className="featured-name">{product.name}</h4>
                  <span className="featured-category">{product.category}</span>
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
