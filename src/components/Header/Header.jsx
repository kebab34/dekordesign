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
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState('');

  const closeMenu = () => { setMenuOpen(false); setMobileExpanded(''); };

  const toggleSection = (key) =>
    setMobileExpanded(prev => (prev === key ? '' : key));

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" onClick={closeMenu}>
          <img src={logo} alt="DEKOR & DESIGN" className="logo" />
        </Link>

        {/* Desktop nav */}
        <nav className="nav">
          <Link to="/" className="nav-link">ACCUEIL</Link>

          <NavDropdown label="COLLECTIONS" to="/collections">
            <Link to="/collections" className="dropdown-item">Toutes les collections</Link>
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

          <NavDropdown label="SALLE DE BAIN" to="/sanitaire">
            <Link to="/sanitaire" className="dropdown-item">Appareils sanitaires</Link>
            <Link to="/meubles" className="dropdown-item">Meubles de salle de bain</Link>
            <Link to="/armaturler" className="dropdown-item">Robinetterie</Link>
            <Link to="/douche" className="dropdown-item">Systèmes de douche</Link>
            <Link to="/accessoires" className="dropdown-item">Produits complémentaires</Link>
            <Link to="/bain-accessoires" className="dropdown-item">Accessoires de salle de bain</Link>
          </NavDropdown>

          <NavDropdown label="CUISINES" to="/cuisines">
            <Link to="/cuisines" className="dropdown-item">Carrelages cuisine</Link>
            <Link to="/cuisines-soprano" className="dropdown-item">Meubles de cuisine</Link>
          </NavDropdown>

          <NavDropdown label="MENUISERIE" to="/menuiserie">
            <Link to="/menuiserie/pvc" className="dropdown-item">Portes &amp; Fenêtres PVC</Link>
            <Link to="/menuiserie/alu" className="dropdown-item">Portes &amp; Fenêtres ALU</Link>
            <Link to="/menuiserie/volets" className="dropdown-item">Volets Roulants</Link>
            <Link to="/menuiserie/guillotine" className="dropdown-item">Systèmes Guillotine</Link>
            <Link to="/menuiserie/portes-garage" className="dropdown-item">Portes de Garage</Link>
            <Link to="/menuiserie/portes-entree" className="dropdown-item">Portes d'Entrée</Link>
            <Link to="/menuiserie/moustiquaires" className="dropdown-item">Moustiquaires</Link>
            <Link to="/menuiserie/solutions-verre" className="dropdown-item">Solutions Verre</Link>
          </NavDropdown>

          <Link to="/catalogues" className="nav-link">CATALOGUES</Link>
          <Link to="/realisations" className="nav-link">RÉALISATIONS</Link>
          <Link to="/contact" className="nav-link">CONTACT</Link>
        </nav>

        {/* Hamburger button */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="mobile-nav">
          <Link to="/" className="mobile-link" onClick={closeMenu}>ACCUEIL</Link>

          <div className="mobile-section">
            <button className="mobile-section-toggle" onClick={() => toggleSection('collections')}>
              COLLECTIONS
              <svg viewBox="0 0 10 6" width="8" height="5" className={mobileExpanded === 'collections' ? 'rotated' : ''}>
                <path d="M0 0l5 6 5-6z" fill="currentColor"/>
              </svg>
            </button>
            {mobileExpanded === 'collections' && (
              <div className="mobile-submenu">
                <Link to="/collections" className="mobile-sublink" onClick={closeMenu}>Toutes les collections</Link>
                {roomCategoriesData.map((cat, i) => (
                  <Link key={i} to={`/collections?category=${encodeURIComponent(cat.name)}`} className="mobile-sublink" onClick={closeMenu}>{cat.name}</Link>
                ))}
              </div>
            )}
          </div>

          <div className="mobile-section">
            <button className="mobile-section-toggle" onClick={() => toggleSection('bain')}>
              SALLE DE BAIN
              <svg viewBox="0 0 10 6" width="8" height="5" className={mobileExpanded === 'bain' ? 'rotated' : ''}>
                <path d="M0 0l5 6 5-6z" fill="currentColor"/>
              </svg>
            </button>
            {mobileExpanded === 'bain' && (
              <div className="mobile-submenu">
                <Link to="/sanitaire" className="mobile-sublink" onClick={closeMenu}>Appareils sanitaires</Link>
                <Link to="/meubles" className="mobile-sublink" onClick={closeMenu}>Meubles de salle de bain</Link>
                <Link to="/armaturler" className="mobile-sublink" onClick={closeMenu}>Robinetterie</Link>
                <Link to="/douche" className="mobile-sublink" onClick={closeMenu}>Systèmes de douche</Link>
                <Link to="/accessoires" className="mobile-sublink" onClick={closeMenu}>Produits complémentaires</Link>
                <Link to="/bain-accessoires" className="mobile-sublink" onClick={closeMenu}>Accessoires de salle de bain</Link>
              </div>
            )}
          </div>

          <div className="mobile-section">
            <button className="mobile-section-toggle" onClick={() => toggleSection('cuisines')}>
              CUISINES
              <svg viewBox="0 0 10 6" width="8" height="5" className={mobileExpanded === 'cuisines' ? 'rotated' : ''}>
                <path d="M0 0l5 6 5-6z" fill="currentColor"/>
              </svg>
            </button>
            {mobileExpanded === 'cuisines' && (
              <div className="mobile-submenu">
                <Link to="/cuisines" className="mobile-sublink" onClick={closeMenu}>Carrelages cuisine</Link>
                <Link to="/cuisines-soprano" className="mobile-sublink" onClick={closeMenu}>Meubles de cuisine</Link>
              </div>
            )}
          </div>

          <div className="mobile-section">
            <button className="mobile-section-toggle" onClick={() => toggleSection('menuiserie')}>
              MENUISERIE
              <svg viewBox="0 0 10 6" width="8" height="5" className={mobileExpanded === 'menuiserie' ? 'rotated' : ''}>
                <path d="M0 0l5 6 5-6z" fill="currentColor"/>
              </svg>
            </button>
            {mobileExpanded === 'menuiserie' && (
              <div className="mobile-submenu">
                <Link to="/menuiserie/pvc" className="mobile-sublink" onClick={closeMenu}>Portes &amp; Fenêtres PVC</Link>
                <Link to="/menuiserie/alu" className="mobile-sublink" onClick={closeMenu}>Portes &amp; Fenêtres ALU</Link>
                <Link to="/menuiserie/volets" className="mobile-sublink" onClick={closeMenu}>Volets Roulants</Link>
                <Link to="/menuiserie/guillotine" className="mobile-sublink" onClick={closeMenu}>Systèmes Guillotine</Link>
                <Link to="/menuiserie/portes-garage" className="mobile-sublink" onClick={closeMenu}>Portes de Garage</Link>
                <Link to="/menuiserie/portes-entree" className="mobile-sublink" onClick={closeMenu}>Portes d'Entrée</Link>
                <Link to="/menuiserie/moustiquaires" className="mobile-sublink" onClick={closeMenu}>Moustiquaires</Link>
                <Link to="/menuiserie/solutions-verre" className="mobile-sublink" onClick={closeMenu}>Solutions Verre</Link>
              </div>
            )}
          </div>

          <Link to="/catalogues" className="mobile-link" onClick={closeMenu}>CATALOGUES</Link>
          <Link to="/realisations" className="mobile-link" onClick={closeMenu}>RÉALISATIONS</Link>
          <Link to="/contact" className="mobile-link" onClick={closeMenu}>CONTACT</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
