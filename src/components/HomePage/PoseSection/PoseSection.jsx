import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { poseTiles } from '../../../data/poseTiles';
import { tileUrl } from '../../../config/assets';
import useInView from '../../../motion/useInView';
import CountUp from '../../../motion/CountUp';
import './PoseSection.css';

const COLS = 8;

// « L'art de la pose » : de vrais carreaux du catalogue viennent se poser un à un sur un sol en
// perspective, en diagonale depuis un angle comme sur un chantier ; puis les joints se tracent et un
// reflet de lumière balaie la surface polie. Les chiffres du catalogue défilent en parallèle.
const PoseSection = () => {
  const { t, i18n } = useTranslation();
  const [ref, inView] = useInView({ threshold: 0.3 });
  const locale = i18n.language === 'en' ? 'en-GB' : 'fr-FR';

  const stats = [
    { to: 244, label: t('pose.stats.collections') },
    { to: 1800, suffix: '+', label: t('pose.stats.references') },
    { to: 7, label: t('pose.stats.brands') },
  ];

  return (
    <section ref={ref} className={`pose ${inView ? 'pose--in' : ''}`}>
      <div className="pose-floor-wrap" aria-hidden="true">
        <div className="pose-floor">
          <div className="pose-grout" />
          {poseTiles.map((tile, i) => {
            const row = Math.floor(i / COLS), col = i % COLS;
            return (
              <div
                key={tile.key}
                className="pose-tile"
                style={{ '--d': `${(row + col) * 85}ms` }}
              >
                <img src={tileUrl(tile.key, 'sm')} alt="" loading="lazy" draggable="false" />
              </div>
            );
          })}
          <div className="pose-sheen" />
        </div>
      </div>

      <div className="pose-content">
        <span className="pose-kicker">{t('pose.kicker')}</span>
        <h2 className="pose-title">{t('pose.title')}</h2>
        <div className="pose-line" />
        <p className="pose-text">{t('pose.text')}</p>
        <div className="pose-stats">
          {stats.map(s => (
            <div key={s.label} className="pose-stat">
              <span className="pose-num"><CountUp to={s.to} suffix={s.suffix} start={inView} locale={locale} /></span>
              <span className="pose-label">{s.label}</span>
            </div>
          ))}
        </div>
        <Link to="/collections" className="pose-cta">{t('pose.cta')}</Link>
      </div>
    </section>
  );
};

export default PoseSection;
