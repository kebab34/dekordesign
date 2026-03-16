import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { roomCategoriesData } from '../../data/content';
import './Header.css';
import logo from '../../image/logo2.png';

const NavDropdown = ({ label, to, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="nav-item-dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link to={to} className="nav-link nav-link-arrow">
        {label}
        <svg className="nav-arrow" viewBox="0 0 10 6" width="8" height="5">
          <path d="M0 0l5 6 5-6z" fill="currentColor"/>
        </svg>
      </Link>
      {open && (
        <div className="dropdown-menu">
          {children}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/">
          <img src={logo} alt="DEKOR & DESIGN" className="logo" />
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">ACCUEIL</Link>

          {/* Collections dropdown */}
          <NavDropdown label="COLLECTIONS" to="/collections">
            <Link to="/collections" className="dropdown-item">
              Toutes les collections
            </Link>
            <div className="dropdown-divider"></div>
            {roomCategoriesData.map((category, index) => (
              <Link
                key={index}
                to={`/collections?category=${encodeURIComponent(category.name)}`}
                className="dropdown-item"
              >
                {category.name}
              </Link>
            ))}
          </NavDropdown>

          {/* Salle de bain dropdown */}
          <NavDropdown label="SALLE DE BAIN" to="/sanitaire">
            <Link to="/sanitaire" className="dropdown-item">
              Appareils sanitaires
            </Link>
            <Link to="/armaturler" className="dropdown-item">
              Robinetterie
            </Link>
            <Link to="/douche" className="dropdown-item">
              Systèmes de douche
            </Link>
            <Link to="/accessoires" className="dropdown-item">
              Produits complémentaires
            </Link>
            <Link to="/bain-accessoires" className="dropdown-item">
              Accessoires de salle de bain
            </Link>
          </NavDropdown>

          <Link to="/catalogues" className="nav-link">CATALOGUES</Link>
          <Link to="/realisations" className="nav-link">RÉALISATIONS</Link>
          <Link to="/contact" className="nav-link">CONTACT</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
