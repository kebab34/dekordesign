import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { company, fullAddress } from '../../config/company';
import './Footer.css';
import logo from '../../image/logo2.png';

const SOCIAL_LABELS = { instagram: 'Instagram', facebook: 'Facebook', pinterest: 'Pinterest', linkedin: 'LinkedIn' };

const Footer = () => {
  const { t } = useTranslation();
  // Seuls les réseaux renseignés dans config/company.js sont affichés
  const socials = Object.entries(company.social).filter(([, url]) => url);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <img src={logo} alt="DEKOR & DESIGN" className="logo" width="361" height="81" />
          <p className="footer-tagline">{t('footer.tagline')}</p>
          <div className="gold-line"></div>
        </div>
        <div className="footer-column">
          <h2 className="footer-title">{t('footer.showroom')}</h2>
          <p className="footer-text">Cannes, Côte d'Azur</p>
          <p className="footer-text">{t('footer.byAppointment')}</p>
          <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="footer-text footer-link">
            {t('footer.directions')} →
          </a>
        </div>
        <div className="footer-column">
          <h2 className="footer-title">{t('footer.contact')}</h2>
          <a href={`mailto:${company.email}`} className="footer-text footer-link">{company.email}</a>
          <a href={`tel:${company.phoneHref}`} className="footer-text footer-link">{company.phone}</a>
          <p className="footer-text">{fullAddress}</p>
        </div>
        {socials.length > 0 && (
          <div className="footer-column">
            <h2 className="footer-title">{t('footer.followUs')}</h2>
            <div className="social-links">
              {socials.map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="social-link">{SOCIAL_LABELS[key]}</a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="footer-bottom">
        <p className="footer-copy">{t('footer.rights', { year: new Date().getFullYear() })}</p>
        <nav className="footer-legal">
          <Link to="/mentions-legales">{t('footer.legal')}</Link>
          <span>·</span>
          <Link to="/confidentialite">{t('footer.privacy')}</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
