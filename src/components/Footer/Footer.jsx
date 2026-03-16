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
          <p className="footer-text">contact@dekordesign.fr</p>
          <p className="footer-text">+33 9 87 59 48 58</p>
          <p className="footer-text">4 Bd Etienne Astegiano, 06150 Cannes</p>
        </div>
        <div className="footer-column">
          <h4 className="footer-title">SUIVEZ-NOUS</h4>
          <div className="social-links">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">Instagram</a>
            <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer" className="social-link">Pinterest</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
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