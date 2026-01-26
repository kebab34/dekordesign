import React from 'react';
import './Header.css';
import logo from '../../image/logo2.png';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={logo} alt="DEKOR & DESIGN" className="logo" />
        <nav className="nav">
          <a href="#accueil" className="nav-link">ACCUEIL</a>
          <a href="#collections" className="nav-link">COLLECTIONS</a>
          <a href="#realisations" className="nav-link">RÉALISATIONS</a>
          <a href="#contact" className="nav-link">CONTACT</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;