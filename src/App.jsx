import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
