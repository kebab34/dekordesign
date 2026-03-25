import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import CollectionsPage from './components/CollectionsPage/CollectionsPage';
import CataloguePage from './components/CataloguePage/CataloguePage';
import ContactPage from './components/ContactPage/ContactPage';
import CollectionDetailPage from './components/CollectionDetailPage/CollectionDetailPage';
import ProductDetailPage from './components/ProductDetailPage/ProductDetailPage';
import SanitairePage from './components/SanitairePage/SanitairePage';
import SanitaireDetailPage from './components/SanitaireDetailPage/SanitaireDetailPage';
import TamamlayiciPage from './components/TamamlayiciPage/TamamlayiciPage';
import TamamlayiciDetailPage from './components/TamamlayiciDetailPage/TamamlayiciDetailPage';
import ArmaturlerPage from './components/ArmaturlerPage/ArmaturlerPage';
import ArmaturlerDetailPage from './components/ArmaturlerDetailPage/ArmaturlerDetailPage';
import DusPage from './components/DusPage/DusPage';
import DusDetailPage from './components/DusDetailPage/DusDetailPage';
import AksesuarPage from './components/AksesuarPage/AksesuarPage';
import AksesuarDetailPage from './components/AksesuarDetailPage/AksesuarDetailPage';
import CuisinePage from './components/CuisinePage/CuisinePage';
import CuisineDetailPage from './components/CuisineDetailPage/CuisineDetailPage';
import KobosPage from './components/KobosPage/KobosPage';
import KobosDetailPage from './components/KobosDetailPage/KobosDetailPage';
import SopranoPage from './components/SopranoPage/SopranoPage';
import SopranoDetailPage from './components/SopranoDetailPage/SopranoDetailPage';
import MenuiseriePage from './components/MenuiseriePage/MenuiseriePage';
import MenuiserieDetailPage from './components/MenuiserieDetailPage/MenuiserieDetailPage';
import ExterieurPage from './components/ExterieurPage/ExterieurPage';
import ExterieurDetailPage from './components/ExterieurDetailPage/ExterieurDetailPage';
import AderkaSeriesPage from './components/AderkaSeriesPage/AderkaSeriesPage';
import AderkaPage from './components/AderkaPage/AderkaPage';
import AderkaDetailPage from './components/AderkaDetailPage/AderkaDetailPage';
import './App.css';

const ScrollToTop = () => {
  const location = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (navType !== 'POP') window.scrollTo(0, 0);
  }, [location, navType]);
  return null;
};

const App = () => {
  return (
    <HelmetProvider>
    <Router>
      <div className="app-container">
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/catalogues" element={<CataloguePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/collection/:collectionName" element={<CollectionDetailPage />} />
          <Route path="/product/:productName" element={<ProductDetailPage />} />
          <Route path="/sanitaire" element={<SanitairePage />} />
          <Route path="/sanitaire/:productId" element={<SanitaireDetailPage />} />
          <Route path="/accessoires" element={<TamamlayiciPage />} />
          <Route path="/accessoires/:productId" element={<TamamlayiciDetailPage />} />
          <Route path="/armaturler" element={<ArmaturlerPage />} />
          <Route path="/armaturler/:productId" element={<ArmaturlerDetailPage />} />
          <Route path="/douche" element={<DusPage />} />
          <Route path="/douche/:productId" element={<DusDetailPage />} />
          <Route path="/bain-accessoires" element={<AksesuarPage />} />
          <Route path="/bain-accessoires/:productId" element={<AksesuarDetailPage />} />
          <Route path="/cuisines" element={<CuisinePage />} />
          <Route path="/cuisines/:productId" element={<CuisineDetailPage />} />
          <Route path="/meubles" element={<KobosPage />} />
          <Route path="/meubles/:slug" element={<KobosDetailPage />} />
          <Route path="/cuisines-soprano" element={<SopranoPage />} />
          <Route path="/cuisines-soprano/:slug" element={<SopranoDetailPage />} />
          <Route path="/menuiserie" element={<MenuiseriePage />} />
          <Route path="/menuiserie/:productId" element={<MenuiserieDetailPage />} />
          <Route path="/exterieur" element={<ExterieurPage />} />
          <Route path="/exterieur/:productId" element={<ExterieurDetailPage />} />
          <Route path="/portes-pivot" element={<AderkaSeriesPage />} />
          <Route path="/portes-pivot/:series" element={<AderkaPage />} />
          <Route path="/portes-pivot/:series/:slug" element={<AderkaDetailPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
    </HelmetProvider>
  );
};

export default App;
