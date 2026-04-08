import React, { useState, useEffect, useRef } from 'react';
import SEO from '../SEO/SEO';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  productsData,
  roomCategoriesData,
  collectionNames,
  sizeOptions,
  materialOptions
} from '../../data/content';
import './CollectionsPage.css';

const CollectionsPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const [filters, setFilters] = useState({
    category: categoryFromUrl || '',
    collection: '',
    size: '',
    material: ''
  });

  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // États pour les dropdowns
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchTerms, setSearchTerms] = useState({
    category: '',
    collection: '',
    size: '',
    material: ''
  });

  const dropdownRefs = {
    category: useRef(null),
    collection: useRef(null),
    size: useRef(null),
    material: useRef(null)
  };

  // Ferme le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutside = Object.values(dropdownRefs).every(
        ref => ref.current && !ref.current.contains(event.target)
      );
      if (clickedOutside) {
        setOpenDropdown(null);
        setSearchTerms({ category: '', collection: '', size: '', material: '' });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Données des filtres
  const categoryOptions = roomCategoriesData.map(cat => cat.name);

  // Met à jour le filtre catégorie si l'URL change
  useEffect(() => {
    if (categoryFromUrl) {
      setFilters(prev => ({ ...prev, category: categoryFromUrl }));
    }
  }, [categoryFromUrl]);

  // Filtrage des produits
  const filteredProducts = productsData.filter(product => {
    if (filters.category && !product.categories.includes(filters.category)) return false;
    if (filters.collection && product.collection !== filters.collection) return false;
    if (filters.size && !product.sizes.includes(filters.size)) return false;
    if (filters.material && product.material !== filters.material) return false;
    return true;
  });

  const clearFilters = () => {
    setFilters({
      category: '',
      collection: '',
      size: '',
      material: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  // Fonction pour toggle un dropdown
  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Fonction pour sélectionner une option
  const selectOption = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setOpenDropdown(null);
    setSearchTerms(prev => ({ ...prev, [filterName]: '' }));
  };

  // Composant Dropdown réutilisable
  const renderDropdown = (name, title, options, placeholder) => {
    const isOpen = openDropdown === name;
    const searchTerm = searchTerms[name];
    const filteredOptions = options.filter(opt =>
      opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="filter-group">
        <h4 className="filter-group-title">{title}</h4>
        <div className="custom-dropdown" ref={dropdownRefs[name]}>
          <button
            className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
            onClick={() => toggleDropdown(name)}
          >
            <span>{filters[name] || placeholder}</span>
            <svg className="dropdown-arrow" viewBox="0 0 12 12">
              <path d="M6 8L1 3h10z" />
            </svg>
          </button>
          {isOpen && (
            <div className="dropdown-content">
              <input
                type="text"
                className="dropdown-search"
                placeholder={t('collections.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerms(prev => ({ ...prev, [name]: e.target.value }))}
                autoFocus
              />
              <div className="dropdown-list">
                <div
                  className={`dropdown-item ${filters[name] === '' ? 'active' : ''}`}
                  onClick={() => selectOption(name, '')}
                >
                  {placeholder}
                </div>
                {filteredOptions.map((opt, index) => (
                  <div
                    key={index}
                    className={`dropdown-item ${filters[name] === opt ? 'active' : ''}`}
                    onClick={() => selectOption(name, opt)}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="collections-page">
      <SEO
        title={t('collections.title')}
        description="Explorez nos 244 collections de carrelages pour salle de bain, cuisine et intérieur. Marbre, grès cérame, bois, pierre naturelle. Livraison Alger et toute l'Algérie."
        canonical="/collections"
      />
      <div className="collections-header">
        <div className="gold-line"></div>
        <h2 className="collections-title">
          {filters.category ? t(`roomCategories.${filters.category}`, filters.category).toUpperCase() : t('collections.ourCollections', 'NOS COLLECTIONS')}
        </h2>
        <p className="collections-subtitle">
          {t('collections.productsFound', { count: filteredProducts.length })}
        </p>
      </div>

      <div className="collections-content">
        {/* Sidebar Filtres desktop */}
        <aside className={`filters-sidebar ${isFilterOpen ? 'open' : ''}`}>
          <div className="filters-header">
            <h3 className="filters-title">{t('collections.filters', 'Filtres')}</h3>
            {activeFiltersCount > 0 && (
              <button className="clear-filters" onClick={clearFilters}>
                {t('collections.clear', 'Effacer')} ({activeFiltersCount})
              </button>
            )}
          </div>

          {renderDropdown('category', t('collections.category'), categoryOptions, t('collections.allCategories'))}
          {renderDropdown('collection', t('collections.collection'), collectionNames, t('collections.allCollections'))}
          {renderDropdown('size', t('collections.size'), sizeOptions, t('collections.allSizes'))}
          {renderDropdown('material', t('collections.material'), materialOptions, t('collections.allMaterials'))}

          {/* Bouton fermer (mobile) */}
          <button className="filters-close-btn" onClick={() => setIsFilterOpen(false)}>
            {t('collections.close', 'Fermer')}
          </button>
        </aside>

        {/* Overlay mobile */}
        {isFilterOpen && (
          <div className="filters-overlay" onClick={() => setIsFilterOpen(false)} />
        )}

        {/* Bouton flottant mobile */}
        <button className="filters-fab" onClick={() => setIsFilterOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="10" y2="18"/>
          </svg>
          {t('collections.filters', 'Filtres')}
          {activeFiltersCount > 0 && <span className="filters-fab-badge">{activeFiltersCount}</span>}
        </button>

        {/* Grille produits */}
        <div className="collections-main">
          {filteredProducts.length > 0 ? (
            <div className="collections-grid">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/collection/${encodeURIComponent(product.name)}`}
                  className="collection-card"
                >
                  <div className="collection-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="collection-image"
                      loading="lazy"
                    />
                    <div className="col-name-overlay">
                      <h3 className="collection-name-mob">{product.name}</h3>
                    </div>
                  </div>
                  <div className="collection-info">
                    <h3 className="collection-name">{product.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>{t('collections.noResults', 'Aucun produit ne correspond à vos critères.')}</p>
              <button className="clear-filters-btn" onClick={clearFilters}>
                {t('collections.clearFilters', 'Effacer les filtres')}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CollectionsPage;
