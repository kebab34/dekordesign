import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import './App.css';

const CollectionsPage        = lazy(() => import('./components/CollectionsPage/CollectionsPage'));
const CataloguePage          = lazy(() => import('./components/CataloguePage/CataloguePage'));
const ContactPage            = lazy(() => import('./components/ContactPage/ContactPage'));
const CollectionDetailPage   = lazy(() => import('./components/CollectionDetailPage/CollectionDetailPage'));
const ProductDetailPage      = lazy(() => import('./components/ProductDetailPage/ProductDetailPage'));
const SanitairePage          = lazy(() => import('./components/SanitairePage/SanitairePage'));
const SanitaireDetailPage    = lazy(() => import('./components/SanitaireDetailPage/SanitaireDetailPage'));
const TamamlayiciPage        = lazy(() => import('./components/TamamlayiciPage/TamamlayiciPage'));
const TamamlayiciDetailPage  = lazy(() => import('./components/TamamlayiciDetailPage/TamamlayiciDetailPage'));
const ArmaturlerPage         = lazy(() => import('./components/ArmaturlerPage/ArmaturlerPage'));
const ArmaturlerDetailPage   = lazy(() => import('./components/ArmaturlerDetailPage/ArmaturlerDetailPage'));
const DusPage                = lazy(() => import('./components/DusPage/DusPage'));
const DusDetailPage          = lazy(() => import('./components/DusDetailPage/DusDetailPage'));
const AksesuarPage           = lazy(() => import('./components/AksesuarPage/AksesuarPage'));
const AksesuarDetailPage     = lazy(() => import('./components/AksesuarDetailPage/AksesuarDetailPage'));
const CuisinePage            = lazy(() => import('./components/CuisinePage/CuisinePage'));
const CuisineDetailPage      = lazy(() => import('./components/CuisineDetailPage/CuisineDetailPage'));
const KobosPage              = lazy(() => import('./components/KobosPage/KobosPage'));
const KobosDetailPage        = lazy(() => import('./components/KobosDetailPage/KobosDetailPage'));
const SopranoPage            = lazy(() => import('./components/SopranoPage/SopranoPage'));
const SopranoDetailPage      = lazy(() => import('./components/SopranoDetailPage/SopranoDetailPage'));
const MenuiseriePage         = lazy(() => import('./components/MenuiseriePage/MenuiseriePage'));
const MenuiserieDetailPage   = lazy(() => import('./components/MenuiserieDetailPage/MenuiserieDetailPage'));
const ExterieurPage          = lazy(() => import('./components/ExterieurPage/ExterieurPage'));
const ExterieurDetailPage    = lazy(() => import('./components/ExterieurDetailPage/ExterieurDetailPage'));
const AderkaSeriesPage       = lazy(() => import('./components/AderkaSeriesPage/AderkaSeriesPage'));
const AderkaPage             = lazy(() => import('./components/AderkaPage/AderkaPage'));
const AderkaDetailPage       = lazy(() => import('./components/AderkaDetailPage/AderkaDetailPage'));

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
        <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
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
        </Suspense>
        <Footer />
      </div>
    </Router>
    </HelmetProvider>
  );
};

export default App;
