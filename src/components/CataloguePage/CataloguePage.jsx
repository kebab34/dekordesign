import React from 'react';
import './CataloguePage.css';

const catalogues = [
  {
    id: 1,
    name: 'Catalogue Général',
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600&q=80',
    pdf: '/catalogue/genel-katalog.pdf'
  },
  {
    id: 2,
    name: 'Catalogue Bois',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80',
    pdf: '/catalogue/ahsap-katalogu.pdf'
  },
  {
    id: 3,
    name: 'Catalogue Oversize',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
    pdf: '/catalogue/oversize-katalogu.pdf'
  },
  {
    id: 4,
    name: 'Catalogue Salle de Bain',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80',
    pdf: '/catalogue/banyo-katalogu.pdf'
  },
  {
    id: 5,
    name: 'Catalogue Mural',
    image: 'https://images.unsplash.com/photo-1615875474908-9ef74b97172f?w=600&q=80',
    pdf: '/catalogue/duvar-katalogu.pdf'
  }
];

const CataloguePage = () => {
  return (
    <section className="catalogue-page">
      <div className="catalogue-header">
        <div className="gold-line"></div>
        <h2 className="catalogue-title">NOS CATALOGUES</h2>
        <p className="catalogue-subtitle">Téléchargez nos catalogues pour découvrir l'ensemble de nos collections</p>
      </div>

      <div className="catalogue-grid">
        {catalogues.map((catalogue) => (
          <div key={catalogue.id} className="catalogue-card">
            <a
              href={catalogue.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="catalogue-image-wrapper"
            >
              <img
                src={catalogue.image}
                alt={catalogue.name}
                className="catalogue-image"
              />
              <div className="catalogue-overlay">
                <svg className="view-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>Voir le catalogue</span>
              </div>
            </a>
            <div className="catalogue-info">
              <h3 className="catalogue-name">{catalogue.name}</h3>
              <a
                href={catalogue.pdf}
                download
                className="catalogue-download-btn"
              >
                <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Télécharger
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CataloguePage;
