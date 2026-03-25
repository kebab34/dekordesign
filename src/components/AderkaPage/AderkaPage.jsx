import React, { useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { aderkaData } from '../../data/aderkaData';
import './AderkaPage.css';

const SERIES = [
  { slug: 'exclusive', name: 'Exclusive' },
  { slug: 'stoneline', name: 'Stoneline' },
  { slug: 'elegance',  name: 'Elegance' },
  { slug: 'woodline',  name: 'Woodline' },
];

const AderkaPage = () => {
  const { series } = useParams();
  const navigate = useNavigate();

  const currentSeries = SERIES.find(s => s.slug === series);

  const filtered = useMemo(() =>
    currentSeries
      ? aderkaData.filter(d => d.series === currentSeries.name)
      : aderkaData,
    [currentSeries]
  );

  return (
    <section className="ade-page">
      <div className="ade-header">
        <div className="ade-gold-line" />
        <h1 className="ade-title">
          {currentSeries ? currentSeries.name.toUpperCase() : 'PORTES PIVOT'}
        </h1>
        <p className="ade-subtitle">
          {filtered.length} modèle{filtered.length > 1 ? 's' : ''} — Aderka Door Systems
        </p>
      </div>

      {/* Filter tabs */}
      <div className="ade-filters">
        {SERIES.map(s => (
          <button
            key={s.slug}
            className={`ade-filter-btn ${series === s.slug ? 'active' : ''}`}
            onClick={() => navigate(`/portes-pivot/${s.slug}`)}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Back link */}
      <div className="ade-back">
        <Link to="/portes-pivot" className="ade-back-link">← Toutes les séries</Link>
      </div>

      {/* Grid */}
      <div className="ade-grid">
        {filtered.map(door => (
          <Link key={door.id} to={`/portes-pivot/${series}/${door.slug}`} className="ade-card">
            <div className="ade-img-wrapper">
              <img
                src={door.image}
                alt={door.name}
                className="ade-img"
                loading="lazy"
                onError={e => { e.target.style.opacity = '0.15'; }}
              />
              {/* Hover overlay */}
              <div className="ade-overlay">
                <span className="ade-overlay-label">Voir le modèle</span>
              </div>
              {/* Name at bottom (mobile) */}
              <div className="ade-name-overlay">
                <p className="ade-name-mob">{door.name}</p>
              </div>
            </div>
            <div className="ade-card-info">
              <h3 className="ade-card-name">{door.name}</h3>
              <p className="ade-card-series">{door.series}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AderkaPage;
