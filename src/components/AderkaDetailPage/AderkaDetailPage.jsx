import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { aderkaData } from '../../data/aderkaData';
import './AderkaDetailPage.css';

const SERIES_SPECS = {
  Exclusive: {
    finition: 'Laquée mat',
    style: 'Architecturale',
    description: "La série Exclusive incarne l'alliance entre rigueur architecturale et sophistication absolue. Ses lignes épurées et ses proportions maîtrisées en font un élément signature pour les entrées haut de gamme. Chaque modèle est conçu pour s'imposer comme une pièce maîtresse, alliant résistance et esthétique intemporelle.",
  },
  Stoneline: {
    finition: 'Effet pierre naturelle',
    style: 'Minérale',
    description: "Stoneline réinvente la porte pivot en intégrant une finition effet pierre naturelle d'une authenticité remarquable. Ce traitement de surface unique confère à chaque porte un caractère minéral fort, transformant l'entrée en une déclaration artistique tout en conservant toutes les performances techniques de l'aluminium.",
  },
  Elegance: {
    finition: 'Moderne élégante',
    style: 'Contemporaine',
    description: "La série Elegance décline la porte pivot en dix expressions distinctes, toutes animées par un même fil conducteur : l'élégance contemporaine sans ostentation. Des formes travaillées, des jeux de matières subtils et une finition soignée font de chaque modèle une invitation à l'entrée qui marque les esprits durablement.",
  },
  Woodline: {
    finition: 'Effet bois authentique',
    style: 'Naturelle',
    description: "Woodline combine la chaleur du bois avec les performances inégalées de l'aluminium. Sa texture bois authentique est obtenue par un procédé de thermolaquage haute définition qui reproduit fidèlement les veines et nuances du bois naturel. Idéale pour les intérieurs modernes qui recherchent la chaleur sans les contraintes d'entretien.",
  },
};

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    label: 'Aluminium haute résistance',
    sub: 'Profilés aluminium renforcés',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12a9 9 0 1018 0A9 9 0 003 12z" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    label: 'Système pivot haute performance',
    sub: 'Rotation 360° — pivot dissimulé',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    ),
    label: 'Isolation thermique & acoustique',
    sub: 'Rupture de pont thermique',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    label: 'Finitions sur-mesure',
    sub: 'Coloris RAL au choix',
  },
];

const AderkaDetailPage = () => {
  const { series, slug } = useParams();
  const door = aderkaData.find(d => d.slug === slug);

  if (!door) {
    return (
      <div className="adkd-notfound">
        <p>Modèle introuvable.</p>
        <Link to="/portes-pivot">← Retour aux séries</Link>
      </div>
    );
  }

  const specs = SERIES_SPECS[door.series] || SERIES_SPECS.Elegance;

  const sameSeries = aderkaData.filter(d => d.slug !== slug && d.series === door.series);
  const otherSeries = aderkaData.filter(d => d.slug !== slug && d.series !== door.series);
  const related = [...sameSeries, ...otherSeries].slice(0, 4);

  return (
    <div className="adkd-page">
      {/* ── Hero split ── */}
      <div className="adkd-hero">
        {/* Left — full-height image */}
        <div className="adkd-hero-img-col">
          <img
            src={door.image}
            alt={door.name}
            className="adkd-hero-img"
            onError={e => { e.target.style.opacity = '0.2'; }}
          />
          <div className="adkd-hero-img-overlay" />
        </div>

        {/* Right — info panel */}
        <div className="adkd-hero-info-col">
          {/* Breadcrumb */}
          <nav className="adkd-breadcrumb">
            <Link to="/">Accueil</Link>
            <span>›</span>
            <Link to="/portes-pivot">Portes Pivot</Link>
            <span>›</span>
            <Link to={`/portes-pivot/${series}`}>{door.series}</Link>
            <span>›</span>
            <span>{door.name}</span>
          </nav>

          <div className="adkd-gold-line" />
          <span className="adkd-series-badge">{door.series} Series</span>
          <h1 className="adkd-name">{door.name.toUpperCase()}</h1>

          <p className="adkd-description">{specs.description}</p>

          {/* Specs grid */}
          <div className="adkd-specs">
            <div className="adkd-spec-item">
              <span className="adkd-spec-label">Matériau</span>
              <span className="adkd-spec-value">Aluminium</span>
            </div>
            <div className="adkd-spec-item">
              <span className="adkd-spec-label">Finition</span>
              <span className="adkd-spec-value">{specs.finition}</span>
            </div>
            <div className="adkd-spec-item">
              <span className="adkd-spec-label">Style</span>
              <span className="adkd-spec-value">{specs.style}</span>
            </div>
            <div className="adkd-spec-item">
              <span className="adkd-spec-label">Dimensions</span>
              <span className="adkd-spec-value">Sur-mesure</span>
            </div>
            <div className="adkd-spec-item">
              <span className="adkd-spec-label">Série</span>
              <span className="adkd-spec-value">{door.series}</span>
            </div>
            <div className="adkd-spec-item">
              <span className="adkd-spec-label">Usage</span>
              <span className="adkd-spec-value">Extérieur</span>
            </div>
          </div>

          {/* CTA */}
          <div className="adkd-cta">
            <Link to="/contact" className="adkd-btn-gold">
              Demander un devis
            </Link>
            <Link to={`/portes-pivot/${series}`} className="adkd-btn-outline">
              Série {door.series}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Features bar ── */}
      <div className="adkd-features">
        {FEATURES.map((f, i) => (
          <div key={i} className="adkd-feature-item">
            <div className="adkd-feature-icon">{f.icon}</div>
            <div>
              <p className="adkd-feature-label">{f.label}</p>
              <p className="adkd-feature-sub">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Related models ── */}
      {related.length > 0 && (
        <div className="adkd-related">
          <div className="adkd-related-header">
            <div className="adkd-gold-line" />
            <h2 className="adkd-related-title">MODÈLES DE LA MÊME GAMME</h2>
          </div>
          <div className="adkd-related-grid">
            {related.map(r => (
              <Link key={r.id} to={`/portes-pivot/${r.series.toLowerCase()}/${r.slug}`} className="adkd-related-card">
                <div className="adkd-related-img-wrap">
                  <img src={r.image} alt={r.name} loading="lazy" />
                  <div className="adkd-related-overlay">
                    <span>Voir le modèle</span>
                  </div>
                </div>
                <div className="adkd-related-info">
                  <h3 className="adkd-related-name">{r.name}</h3>
                  <span className="adkd-related-series">{r.series}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AderkaDetailPage;
