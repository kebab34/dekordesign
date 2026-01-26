import React from 'react';
import Header from './components/Header/Header';
import Carousel from './components/HomePage/Carousel/Carousel';
import RoomCategories from './components/HomePage/RoomCategories/RoomCategories';
import ProductCategories from './components/HomePage/ProductCategories/ProductCategories';
import FeaturedProducts from './components/HomePage/FeaturedProducts/FeaturedProducts';
import CTASection from './components/HomePage/CTASection/CTASection';
import Footer from './components/Footer/Footer';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <Carousel />
      <RoomCategories />
      <ProductCategories />
      <FeaturedProducts />
      <CTASection />
      <Footer />
    </div>
  );
};

export default App;