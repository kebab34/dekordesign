import { useEffect, useRef, useState } from 'react';

// Passe à true (une seule fois) quand l'élément entre dans l'écran.
// Sans IntersectionObserver : true immédiatement.
const useInView = (options = { threshold: 0.25 }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.disconnect(); }
    }, options);
    io.observe(el);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, inView];
};

export default useInView;
