import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Transition « carrelage » : à chaque changement de page (et à la première visite de la session),
// un pavage de carreaux sombres à joints dorés couvre l'écran puis se retourne en diagonale
// pour révéler la nouvelle page. Désactivée si le visiteur réduit les animations.
const SESSION_KEY = 'dekor-intro-seen';

const gridFor = () => {
  const w = window.innerWidth;
  return w < 600 ? { cols: 4, rows: 7 } : w < 1100 ? { cols: 6, rows: 5 } : { cols: 8, rows: 5 };
};

const PageWipe = () => {
  const { pathname } = useLocation();
  const previous = useRef(null);
  const [run, setRun] = useState(0);
  const [grid, setGrid] = useState(gridFor);

  useEffect(() => {
    const first = previous.current === null;
    if (!first && previous.current === pathname) return;
    previous.current = pathname;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (first) {
      // Introduction : une seule fois par session
      let seen = false;
      try { seen = sessionStorage.getItem(SESSION_KEY) === '1'; sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* stockage indisponible */ }
      if (seen) return;
    }
    setGrid(gridFor());
    setRun(r => r + 1);
  }, [pathname]);

  // Retire le pavage une fois retourné
  useEffect(() => {
    if (!run) return undefined;
    const id = setTimeout(() => setRun(0), 1400);
    return () => clearTimeout(id);
  }, [run]);

  if (!run) return null;
  const cells = [];
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      // Diagonale depuis le coin supérieur gauche, avec un léger aléa naturel
      cells.push(<div key={`${r}-${c}`} className="wipe-cell" style={{ '--d': `${(r + c) * 45 + ((r * 7 + c * 3) % 5) * 8}ms` }} />);
    }
  }
  return (
    <div key={run} className="wipe" aria-hidden="true" style={{ '--wipe-cols': grid.cols, '--wipe-rows': grid.rows }}>
      {cells}
    </div>
  );
};

export default PageWipe;
