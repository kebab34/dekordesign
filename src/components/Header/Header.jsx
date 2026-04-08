import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

const LangSwitcher = () => {
  const { i18n } = useTranslation();
  const current = i18n.language;

  const toggle = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <div className="lang-switcher">
      <button
        className={`lang-btn ${current === 'fr' ? 'lang-btn--active' : ''}`}
        onClick={() => toggle('fr')}
      >
        FR
      </button>
      <span className="lang-sep">|</span>
      <button
        className={`lang-btn ${current === 'en' ? 'lang-btn--active' : ''}`}
        onClick={() => toggle('en')}
      >
        EN
      </button>
    </div>
  );
};

const Header = () => {
  const { t } = useTranslation();
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
          <Link to="/" className="nav-link">{t('nav.home')}</Link>

          <NavDropdown label={t('nav.collections')} to="/collections">
            <Link to="/collections" className="dropdown-item">{t('nav.allCollections')}</Link>
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

          <NavDropdown label={t('nav.bathroom')} to="/sanitaire">
            <Link to="/sanitaire" className="dropdown-item">{t('nav.sanitaryAppliances')}</Link>
            <Link to="/meubles" className="dropdown-item">{t('nav.bathroomFurniture')}</Link>
            <Link to="/armaturler" className="dropdown-item">{t('nav.faucets')}</Link>
            <Link to="/douche" className="dropdown-item">{t('nav.showerSystems')}</Link>
            <Link to="/accessoires" className="dropdown-item">{t('nav.complementaryProducts')}</Link>
            <Link to="/bain-accessoires" className="dropdown-item">{t('nav.bathroomAccessories')}</Link>
          </NavDropdown>

          <NavDropdown label={t('nav.kitchens')} to="/cuisines">
            <Link to="/cuisines" className="dropdown-item">{t('nav.seeAll')}</Link>
            <div className="dropdown-divider"></div>
            <Link to="/cuisines?marque=atolye" className="dropdown-item">Atölye Mutfak</Link>
            <Link to="/cuisines?marque=soprano" className="dropdown-item">Soprano</Link>
          </NavDropdown>

          <NavDropdown label={t('nav.joinery')} to="/menuiserie">
            <Link to="/menuiserie" className="dropdown-item">{t('nav.seeAll')}</Link>
            <div className="dropdown-divider"></div>
            <Link to="/menuiserie?cat=pvc" className="dropdown-item">{t('nav.pvcDoors')}</Link>
            <Link to="/menuiserie?cat=alu" className="dropdown-item">{t('nav.aluDoors')}</Link>
            <Link to="/menuiserie?cat=volets" className="dropdown-item">{t('nav.rollerShutters')}</Link>
            <Link to="/menuiserie?cat=guillotine" className="dropdown-item">{t('nav.guillotineSystems')}</Link>
            <Link to="/menuiserie?cat=portes-garage" className="dropdown-item">{t('nav.garageDoors')}</Link>
            <Link to="/menuiserie?cat=portes-entree" className="dropdown-item">{t('nav.entryDoors')}</Link>
            <Link to="/menuiserie?cat=moustiquaires" className="dropdown-item">{t('nav.mosquitoNets')}</Link>
            <Link to="/menuiserie?cat=solutions-verre" className="dropdown-item">{t('nav.glassSolutions')}</Link>
            <div className="dropdown-divider"></div>
            <Link to="/portes-pivot" className="dropdown-item">{t('nav.pivotDoors')}</Link>
          </NavDropdown>

          <NavDropdown label={t('nav.exterior')} to="/exterieur">
            <Link to="/exterieur" className="dropdown-item">{t('nav.seeAll')}</Link>
            <div className="dropdown-divider"></div>
            <Link to="/exterieur?cat=pergola" className="dropdown-item">{t('nav.pergolas')}</Link>
            <Link to="/exterieur?cat=protection" className="dropdown-item">{t('nav.sunProtection')}</Link>
          </NavDropdown>

          <Link to="/catalogues" className="nav-link">{t('nav.catalogues')}</Link>
          <Link to="/realisations" className="nav-link">{t('nav.realizations')}</Link>
          <Link to="/contact" className="nav-link">{t('nav.contact')}</Link>

          <LangSwitcher />
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
          <Link to="/" className="mobile-link" onClick={closeMenu}>{t('nav.home')}</Link>

          <div className="mobile-section">
            <button className="mobile-section-toggle" onClick={() => toggleSection('collections')}>
              {t('nav.collections')}
              <svg viewBox="0 0 10 6" width="8" height="5" className={mobileExpanded === 'collections' ? 'rotated' : ''}>
                <path d="M0 0l5 6 5-6z" fill="currentColor"/>
              </svg>
            </button>
            {mobileExpanded === 'collections' && (
              <div className="mobile-submenu">
                <Link to="/collections" className="mobile-sublink" onClick={closeMenu}>{t('nav.allCollections')}</Link>
                {roomCategoriesData.map((cat, i) => (
                  <Link key={i} to={`/collections?category=${encodeURIComponent(cat.name)}`} className="mobile-sublink" onClick={closeMenu}>{cat.name}</Link>
                ))}
              </div>
            )}
          </div>

          <div className="mobile-section">
            <button className="mobile-section-toggle" onClick={() => toggleSection('bain')}>
              {t('nav.bathroom')}
              <svg viewBox="0 0 10 6" width="8" height="5" className={mobileExpanded === 'bain' ? 'rotated' : ''}>
                <path d="M0 0l5 6 5-6z" fill="currentColor"/>
              </svg>
            </button>
            {mobileExpanded === 'bain' && (
              <div className="mobile-submenu">
                <Link to="/sanitaire" className="mobile-sublink" onClick={closeMenu}>{t('nav.sanitaryAppliances')}</Link>
                <Link to="/meubles" className="mobile-sublink" onClick={closeMenu}>{t('nav.bathroomFurniture')}</Link>
                <Link to="/armaturler" className="mobile-sublink" onClick={closeMenu}>{t('nav.faucets')}</Link>
                <Link to="/douche" className="mobile-sublink" onClick={closeMenu}>{t('nav.showerSystems')}</Link>
                <Link to="/accessoires" className="mobile-sublink" onClick={closeMenu}>{t('nav.complementaryProducts')}</Link>
                <Link to="/bain-accessoires" className="mobile-sublink" onClick={closeMenu}>{t('nav.bathroomAccessories')}</Link>
              </div>
            )}
          </div>

          <div className="mobile-section">
            <button className="mobile-section-toggle" onClick={() => toggleSection('cuisines')}>
              {t('nav.kitchens')}
              <svg viewBox="0 0 10 6" width="8" height="5" className={mobileExpanded === 'cuisines' ? 'rotated' : ''}>
                <path d="M0 0l5 6 5-6z" fill="currentColor"/>
              </svg>
            </button>
            {mobileExpanded === 'cuisines' && (
              <div className="mobile-submenu">
                <Link to="/cuisines" className="mobile-sublink" onClick={closeMenu}>{t('nav.seeAll')}</Link>
                <Link to="/cuisines?marque=atolye" className="mobile-sublink" onClick={closeMenu}>Atölye Mutfak</Link>
                <Link to="/cuisines?marque=soprano" className="mobile-sublink" onClick={closeMenu}>Soprano</Link>
              </div>
            )}
          </div>

          <div className="mobile-section">
            <button className="mobile-section-toggle" onClick={() => toggleSection('menuiserie')}>
              {t('nav.joinery')}
              <svg viewBox="0 0 10 6" width="8" height="5" className={mobileExpanded === 'menuiserie' ? 'rotated' : ''}>
                <path d="M0 0l5 6 5-6z" fill="currentColor"/>
              </svg>
            </button>
            {mobileExpanded === 'menuiserie' && (
              <div className="mobile-submenu">
                <Link to="/menuiserie" className="mobile-sublink" onClick={closeMenu}>{t('nav.seeAll')}</Link>
                <Link to="/menuiserie?cat=pvc" className="mobile-sublink" onClick={closeMenu}>{t('nav.pvcDoors')}</Link>
                <Link to="/menuiserie?cat=alu" className="mobile-sublink" onClick={closeMenu}>{t('nav.aluDoors')}</Link>
                <Link to="/menuiserie?cat=volets" className="mobile-sublink" onClick={closeMenu}>{t('nav.rollerShutters')}</Link>
                <Link to="/menuiserie?cat=guillotine" className="mobile-sublink" onClick={closeMenu}>{t('nav.guillotineSystems')}</Link>
                <Link to="/menuiserie?cat=portes-garage" className="mobile-sublink" onClick={closeMenu}>{t('nav.garageDoors')}</Link>
                <Link to="/menuiserie?cat=portes-entree" className="mobile-sublink" onClick={closeMenu}>{t('nav.entryDoors')}</Link>
                <Link to="/menuiserie?cat=moustiquaires" className="mobile-sublink" onClick={closeMenu}>{t('nav.mosquitoNets')}</Link>
                <Link to="/menuiserie?cat=solutions-verre" className="mobile-sublink" onClick={closeMenu}>{t('nav.glassSolutions')}</Link>
                <Link to="/portes-pivot" className="mobile-sublink" onClick={closeMenu}>{t('nav.pivotDoors')}</Link>
              </div>
            )}
          </div>

          <div className="mobile-section">
            <button className="mobile-section-toggle" onClick={() => toggleSection('exterieur')}>
              {t('nav.exterior')}
              <svg viewBox="0 0 10 6" width="8" height="5" className={mobileExpanded === 'exterieur' ? 'rotated' : ''}>
                <path d="M0 0l5 6 5-6z" fill="currentColor"/>
              </svg>
            </button>
            {mobileExpanded === 'exterieur' && (
              <div className="mobile-submenu">
                <Link to="/exterieur" className="mobile-sublink" onClick={closeMenu}>{t('nav.seeAll')}</Link>
                <Link to="/exterieur?cat=pergola" className="mobile-sublink" onClick={closeMenu}>{t('nav.pergolas')}</Link>
                <Link to="/exterieur?cat=protection" className="mobile-sublink" onClick={closeMenu}>{t('nav.sunProtection')}</Link>
              </div>
            )}
          </div>

          <Link to="/catalogues" className="mobile-link" onClick={closeMenu}>{t('nav.catalogues')}</Link>
          <Link to="/realisations" className="mobile-link" onClick={closeMenu}>{t('nav.realizations')}</Link>
          <Link to="/contact" className="mobile-link" onClick={closeMenu}>{t('nav.contact')}</Link>

          <div className="mobile-lang">
            <LangSwitcher />
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
