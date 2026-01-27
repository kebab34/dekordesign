import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { roomCategoriesData } from '../../data/content';
import './Header.css';
import logo from '../../image/logo2.png';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/">
          <img src={logo} alt="DEKOR & DESIGN" className="logo" />
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">ACCUEIL</Link>
          <div
            className="nav-item-dropdown"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <Link to="/collections" className="nav-link">COLLECTIONS</Link>
            {isDropdownOpen && (
              <div className="dropdown-menu">
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
              </div>
            )}
          </div>
          <Link to="/catalogues" className="nav-link">CATALOGUES</Link>
          <Link to="/realisations" className="nav-link">RÉALISATIONS</Link>
          <Link to="/contact" className="nav-link">CONTACT</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
