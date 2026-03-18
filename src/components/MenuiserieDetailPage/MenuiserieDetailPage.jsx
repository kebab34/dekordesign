import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { menuiserieProducts, menuiserieCategories } from '../../data/menuiserieData';
import './MenuiserieDetailPage.css';

const MenuiserieDetailPage = () => {
  const { productId } = useParams();

  const product = menuiserieProducts.find(p => p.id === productId);
  if (!product) return null;

  const catLabel = menuiserieCategories.find(c => c.slug === product.mainCategory)?.name;

  const similar = menuiserieProducts
    .filter(p => p.mainCategory === product.mainCategory && p.id !== product.id)
    .slice(0, 4);

  return (
    <section className="mdet-page">
      {/* Breadcrumb */}
      <div className="mdet-breadcrumb">
        <Link to="/menuiserie" className="mdet-bread-link">Menuiserie</Link>
        <span className="mdet-bread-sep">/</span>
        <Link to={`/menuiserie?cat=${product.mainCategory}`} className="mdet-bread-link">{catLabel}</Link>
        <span className="mdet-bread-sep">/</span>
        <span className="mdet-bread-current">{product.name}</span>
      </div>

      {/* Main content */}
      <div className="mdet-content">
        <div className="mdet-img-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="mdet-img"
            onError={e => { e.target.style.opacity = '0.1'; }}
          />
        </div>

        <div className="mdet-info">
          <span className="mdet-cat">{catLabel}</span>
          <h1 className="mdet-name">{product.name}</h1>
          <div className="mdet-gold-line"></div>
          <p className="mdet-desc">{product.description}</p>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mdet-specs">
              <h3 className="mdet-specs-title">CARACTÉRISTIQUES</h3>
              <table className="mdet-specs-table">
                <tbody>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <tr key={key}>
                      <td className="mdet-spec-key">{key}</td>
                      <td className="mdet-spec-val">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Link to="/contact" className="mdet-cta">Demander un devis</Link>
        </div>
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <div className="mdet-similar">
          <h3 className="mdet-similar-title">AUTRES PRODUITS</h3>
          <div className="mdet-similar-grid">
            {similar.map(p => (
              <Link key={p.id} to={`/menuiserie/${p.id}`} className="mdet-similar-card">
                <div className="mdet-similar-img-wrap">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="mdet-similar-img"
                    loading="lazy"
                    onError={e => { e.target.style.opacity = '0.1'; }}
                  />
                </div>
                <span className="mdet-similar-name">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default MenuiserieDetailPage;
