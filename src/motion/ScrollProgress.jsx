import React, { useEffect, useRef } from 'react';

// Fil de joint doré en haut de l'écran : progression de lecture de la page
const ScrollProgress = () => {
  const ref = useRef(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current?.style.setProperty('--progress', max > 0 ? Math.min(window.scrollY / max, 1).toFixed(4) : 0);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // La hauteur change quand les images arrivent ou qu'on change de page
    const ro = new ResizeObserver(onScroll);
    ro.observe(document.body);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      ro.disconnect();
    };
  }, []);

  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
};

export default ScrollProgress;
