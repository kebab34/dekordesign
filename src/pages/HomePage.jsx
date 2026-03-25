import React from 'react';
import SEO from '../components/SEO/SEO';
import Carousel from '../components/HomePage/Carousel/Carousel';
import RoomCategories from '../components/HomePage/RoomCategories/RoomCategories';
import ProductCategories from '../components/HomePage/ProductCategories/ProductCategories';
import FeaturedProducts from '../components/HomePage/FeaturedProducts/FeaturedProducts';
import CTASection from '../components/HomePage/CTASection/CTASection';

const HomePage = () => {
  return (
    <>
      <SEO
        title="Carrelage & Aménagement Intérieur — Showroom Alger"
        description="DekorDesign, votre showroom à Alger : carrelages, sanitaires, meubles de salle de bain, cuisines sur mesure, robinetterie, pergolas et menuiserie. 244 collections disponibles."
        canonical="/"
      />
      <Carousel />
      <RoomCategories />
      <ProductCategories />
      <FeaturedProducts />
      <CTASection />
    </>
  );
};

export default HomePage;
