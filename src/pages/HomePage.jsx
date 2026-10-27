import React from 'react';
import SEO from '../components/SEO/SEO';
import Carousel from '../components/HomePage/Carousel/Carousel';
import RoomCategories from '../components/HomePage/RoomCategories/RoomCategories';
import ProductCategories from '../components/HomePage/ProductCategories/ProductCategories';
import FeaturedProducts from '../components/HomePage/FeaturedProducts/FeaturedProducts';
import CTASection from '../components/HomePage/CTASection/CTASection';
import { PAGE_SEO } from '../config/seoPages';

const HomePage = () => {
  return (
    <>
      <SEO {...PAGE_SEO['/']} canonical="/" />
      <Carousel />
      <RoomCategories />
      <ProductCategories />
      <FeaturedProducts />
      <CTASection />
    </>
  );
};

export default HomePage;
