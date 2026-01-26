import React, { useState, useEffect } from 'react';
import { carouselData } from '../../../data/content';
import './Carousel.css';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  return (
    <section className="carousel">
      {carouselData.map((slide, index) => (
        <div
          key={index}
          className="carousel-slide"
          style={{
            opacity: currentSlide === index ? 1 : 0,
            visibility: currentSlide === index ? 'visible' : 'hidden'
          }}
        >
          <img src={slide.url} alt={slide.title} className="carousel-image" />
          <div className="carousel-overlay">
            <div className="carousel-content">
              <div className="carousel-line"></div>
              <h2 className="carousel-title">{slide.title}</h2>
              <p className="carousel-subtitle">{slide.subtitle}</p>
              <button className="hero-button">DÉCOUVRIR NOS CRÉATIONS</button>
            </div>
          </div>
        </div>
      ))}
      
      <div className="carousel-nav">
        <button onClick={goToPrevious} className="nav-arrow">←</button>
        <div className="carousel-indicators">
          {carouselData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`indicator ${currentSlide === index ? 'indicator-active' : 'indicator-inactive'}`}
            />
          ))}
        </div>
        <button onClick={goToNext} className="nav-arrow">→</button>
      </div>
    </section>
  );
};

export default Carousel;