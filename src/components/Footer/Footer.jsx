import React from 'react';
import './Footer.css';
import logo from '../../image/logo2.png';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <img src={logo} alt="DEKOR & DESIGN" className="logo" />
          <p className="footer-tagline">L'art de vivre sublimé</p>
          <div className="gold-line"></div>
        </div>
        <div className="footer-column">
          <h4 className="footer-title">SHOWROOM</h4>
          <p className="footer-text">Cannes, Côte d'Azur</p>
          <p className="footer-text">Sur rendez-vous uniquement</p>
        </div>
        <div className="footer-column">
          <h4 className="footer-title">CONTACT</h4>
          <p className="footer-text">contact@dekor-design.fr</p>
          <p className="footer-text">+33 (0)4 XX XX XX XX</p>
        </div>
        <div className="footer-column">
          <h4 className="footer-title">SUIVEZ-NOUS</h4>
          <div className="social-links">
            <a href="#" className="social-link">Instagram</a>
            <a href="#" className="social-link">Pinterest</a>
            <a href="#" className="social-link">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copy">© 2025 Dekor & Design. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;