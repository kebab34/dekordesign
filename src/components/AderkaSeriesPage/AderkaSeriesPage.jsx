import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../SEO/SEO';
import { seriesCovers } from '../../data/aderkaData';
import './AderkaSeriesPage.css';

const SERIES_LIST = [
  {
    slug: 'exclusive',
    name: 'Exclusive',
    desc: 'Lignes architecturales épurées',
    count: 3,
  },
  {
    slug: 'stoneline',
    name: 'Stoneline',
    desc: 'Finition effet pierre naturelle',
    count: 3,
  },
  {
    slug: 'elegance',
    name: 'Elegance',
    desc: 'Élégance contemporaine — 10 modèles',
    count: 10,
  },
  {
    slug: 'woodline',
    name: 'Woodline',
    desc: 'Texture bois sur châssis aluminium',
    count: 3,
  },
];

const AderkaSeriesPage = () => (
  <section className="ase-page">
    <SEO
      title="Portes Pivot Aluminium — Aderka Door Systems"
      description="Portes pivot aluminium Aderka : 4 séries exclusives, 19 modèles. Exclusive, Stoneline, Elegance, Woodline. Design architectural haut de gamme à Alger."
      canonical="/portes-pivot"
    />
    <div className="ase-header">
      <div className="ase-gold-line" />
      <h1 className="ase-title">PORTES PIVOT ALUMINIUM</h1>
      <p className="ase-subtitle">Aderka Door Systems — 4 séries, 19 modèles</p>
    </div>

    <div className="ase-grid">
      {SERIES_LIST.map((s, i) => (
        <Link key={s.slug} to={`/portes-pivot/${s.slug}`} className="ase-card">
          <div className="ase-img-wrap">
            <img
              src={seriesCovers[s.name]}
              alt={s.name}
              className="ase-img"
              loading={i < 2 ? 'eager' : 'lazy'}
              onError={e => { e.target.style.opacity = '0.2'; }}
            />
            <div className="ase-overlay" />
            <div className="ase-info">
              <span className="ase-count">{s.count} modèles</span>
              <h2 className="ase-name">{s.name.toUpperCase()}</h2>
              <p className="ase-desc">{s.desc}</p>
              <span className="ase-cta">Découvrir la série</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default AderkaSeriesPage;
