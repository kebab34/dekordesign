import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigationType, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import './App.css';

const CollectionsPage        = lazy(() => import('./components/CollectionsPage/CollectionsPage'));
const CataloguePage          = lazy(() => import('./components/CataloguePage/CataloguePage'));
const ContactPage            = lazy(() => import('./components/ContactPage/ContactPage'));
const CollectionDetailPage   = lazy(() => import('./components/CollectionDetailPage/CollectionDetailPage'));
const TamamlayiciPage        = lazy(() => import('./components/TamamlayiciPage/TamamlayiciPage'));
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
const MentionsLegales        = lazy(() => import('./components/LegalPage/MentionsLegales'));
const Confidentialite        = lazy(() => import('./components/LegalPage/Confidentialite'));
const NotFoundPage           = lazy(() => import('./components/NotFoundPage/NotFoundPage'));
const SearchPage             = lazy(() => import('./components/SearchPage/SearchPage'));
const RealisationsPage       = lazy(() => import('./components/RealisationsPage/RealisationsPage'));
const RealisationDetailPage  = lazy(() => import('./components/RealisationsPage/RealisationDetailPage'));

// Catalogues Bien Seramik : une page liste + une page détail génériques, configurées par univers.
// Chaque config est chargée à la demande pour ne pas embarquer toutes les données dans le même chunk.
const loadList   = () => import('./components/BienCatalog/BienListPage');
const loadDetail = () => import('./components/BienCatalog/BienDetailPage');
const catalogPage = (loadPage, loadCatalog) => lazy(async () => {
  const [{ default: Page }, { default: catalog }] = await Promise.all([loadPage(), loadCatalog()]);
  return { default: () => <Page catalog={catalog} /> };
});

const loadSanitaire   = () => import('./components/BienCatalog/catalogs/sanitaire');
const loadDus         = () => import('./components/BienCatalog/catalogs/dus');
const loadArmaturler  = () => import('./components/BienCatalog/catalogs/armaturler');
const loadAksesuar    = () => import('./components/BienCatalog/catalogs/aksesuar');
const loadTamamlayici = () => import('./components/BienCatalog/catalogs/tamamlayici');

const SanitairePage         = catalogPage(loadList,   loadSanitaire);
const SanitaireDetailPage   = catalogPage(loadDetail, loadSanitaire);
const DusPage               = catalogPage(loadList,   loadDus);
const DusDetailPage         = catalogPage(loadDetail, loadDus);
const ArmaturlerPage        = catalogPage(loadList,   loadArmaturler);
const ArmaturlerDetailPage  = catalogPage(loadDetail, loadArmaturler);
const AksesuarPage          = catalogPage(loadList,   loadAksesuar);
const AksesuarDetailPage    = catalogPage(loadDetail, loadAksesuar);
const TamamlayiciDetailPage = catalogPage(loadDetail, loadTamamlayici);

// Ancienne URL /product/:name (page supprimée, plus aucun lien interne) → fiche collection
const ProductRedirect = () => {
  const { productName } = useParams();
  return <Navigate to={`/collection/${encodeURIComponent(productName)}`} replace />;
};

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
          <Route path="/product/:productName" element={<ProductRedirect />} />
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
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/recherche" element={<SearchPage />} />
          <Route path="/realisations" element={<RealisationsPage />} />
          <Route path="/realisations/:slug" element={<RealisationDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
        <Footer />
        {/* Mesure d'audience anonyme sans cookie (à activer dans Vercel > Analytics) */}
        <Analytics />
      </div>
    </Router>
    </HelmetProvider>
  );
};

export default App;
