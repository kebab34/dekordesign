import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { roomCategoriesData } from '../../../data/content';
import './RoomCategories.css';

const RoomCategories = () => {
  const { t } = useTranslation();
  return (
    <section className="section">
      <div className="section-header">
        <div className="gold-line"></div>
        <h2 className="section-title">{t('roomCategories.sectionTitle', 'ESPACES PAR DESTINATION')}</h2>
        <p className="section-subtitle">{t('roomCategories.sectionSubtitle', 'Des solutions sur mesure pour chaque environnement')}</p>
      </div>
      <div className="room-grid">
        {roomCategoriesData.map((room, index) => (
          <Link
            key={index}
            to={`/collections?category=${encodeURIComponent(room.name)}`}
            className="room-card"
          >
            <img src={room.image} alt={room.name} className="room-image" loading="lazy" />
            <div className="room-overlay">
              <h3 className="room-name">{t(`roomCategories.${room.name}`, room.name)}</h3>
              <div className="room-line"></div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RoomCategories;