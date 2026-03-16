import React, { useState, useEffect, useRef } from 'react';
import { carouselData } from '../../../data/content';
import './Carousel.css';

const Carousel = () => {
  const [slides, setSlides] = useState({
    current: 0,
    previous: null
  });
  const currentRef = useRef(0);
  const transitionTimeoutRef = useRef(null);

  const transition = (nextIndex) => {
    const prevIndex = currentRef.current;

    if (nextIndex === prevIndex) return;

    currentRef.current = nextIndex;

    setSlides({
      current: nextIndex,
      previous: prevIndex
    });

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setSlides(s => ({ ...s, previous: null }));
    }, 1800);
  };

  const goToNext = () => {
    const next = (currentRef.current + 1) % carouselData.length;
    transition(next);
  };

  const goToPrevious = () => {
    const prev = (currentRef.current - 1 + carouselData.length) % carouselData.length;
    transition(prev);
  };

  useEffect(() => {
    const interval = setInterval(goToNext, 7000);

    return () => {
      clearInterval(interval);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getSlideClass = (index) => {
    if (index === slides.current) return 'luxury-slide active entering';
    if (index === slides.previous) return 'luxury-slide exiting';
    return 'luxury-slide';
  };

  return (
    <section className="luxury-carousel">
      {/* Particules dorées flottantes */}
      <div className="golden-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>

      {/* Vignette cinématique */}
      <div className="cinematic-vignette" />

      {/* Bordures dorées décoratives */}
      <div className="luxury-frame">
        <div className="frame-corner frame-top-left" />
        <div className="frame-corner frame-top-right" />
        <div className="frame-corner frame-bottom-left" />
        <div className="frame-corner frame-bottom-right" />
      </div>

      {/* Slides */}
      {carouselData.map((slide, index) => (
        <div
          key={index}
          className={getSlideClass(index)}
        >
          <div className="slide-image-wrapper">
            <img
              src={slide.url}
              alt={slide.title}
              className="slide-image"
            />
          </div>

          <div className="slide-overlay">
            <div className="content-wrapper">
              {/* Ligne décorative animée */}
              <div className="decorative-line">
                <span className="line-left" />
                <span className="line-diamond">◆</span>
                <span className="line-right" />
              </div>

              {/* Titre avec animation lettre par lettre */}
              <h2 className="slide-title">
                {slide.title.split('').map((char, i) => (
                  <span
                    key={i}
                    className="title-char"
                    style={{ animationDelay: `${0.8 + i * 0.03}s` }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </h2>

              {/* Sous-titre avec effet reveal */}
              <p className="slide-subtitle">
                <span className="subtitle-inner">{slide.subtitle}</span>
              </p>

              {/* Bouton luxueux */}
              <div className="cta-wrapper">
                <button className="luxury-cta">
                  <span className="cta-text">DÉCOUVRIR NOS CRÉATIONS</span>
                  <span className="cta-shine" />
                  <span className="cta-border" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation latérale élégante */}
      <div className="side-nav side-nav-left" onClick={goToPrevious}>
        <div className="nav-icon">
          <span className="nav-line nav-line-1" />
          <span className="nav-line nav-line-2" />
        </div>
      </div>
      <div className="side-nav side-nav-right" onClick={goToNext}>
        <div className="nav-icon">
          <span className="nav-line nav-line-1" />
          <span className="nav-line nav-line-2" />
        </div>
      </div>

      {/* Indicateurs de progression luxueux */}
      <div className="luxury-indicators">
        <div className="indicator-line">
          {carouselData.map((_, index) => (
            <button
              key={index}
              onClick={() => transition(index)}
              className={`luxury-indicator ${slides.current === index ? 'active' : ''}`}
            >
              <span className="indicator-number">0{index + 1}</span>
              <span className="indicator-progress" />
            </button>
          ))}
        </div>
        <div className="indicator-total">
          <span className="current">0{slides.current + 1}</span>
          <span className="separator">/</span>
          <span className="total">0{carouselData.length}</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="scroll-line" />
        <span className="scroll-text">SCROLL</span>
      </div>
    </section>
  );
};

export default Carousel;
