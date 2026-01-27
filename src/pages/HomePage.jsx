import React from 'react';
import Carousel from '../components/HomePage/Carousel/Carousel';
import RoomCategories from '../components/HomePage/RoomCategories/RoomCategories';
import ProductCategories from '../components/HomePage/ProductCategories/ProductCategories';
import FeaturedProducts from '../components/HomePage/FeaturedProducts/FeaturedProducts';
import CTASection from '../components/HomePage/CTASection/CTASection';

const HomePage = () => {
  return (
    <>
      <Carousel />
      <RoomCategories />
      <ProductCategories />
      <FeaturedProducts />
      <CTASection />
    </>
  );
};

export default HomePage;
