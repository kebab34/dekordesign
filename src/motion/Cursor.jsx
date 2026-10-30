import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Curseur sur mesure (ordinateur uniquement) : un point doré et un anneau qui le suit avec inertie.
// L'anneau s'ouvre sur les liens et boutons, devient un disque doré « Voir » sur les images cliquables,
// et s'efface dans les champs de saisie (curseur texte natif conservé).
// Absent sur écran tactile et si le visiteur réduit les animations.
const VIEW = 'a :is(img), [data-tilt], .cdp-hero, .real-photo, .bcd-image-wrap, .kd-main-img-wrap, .spd-main-img-wrap, .cdet-image-wrap, .mdet-img-wrapper, .edet-img-wrapper';
const LINK = 'a, button, [role="button"], label, select, .lang-btn';
const TEXT = 'input, textarea, [contenteditable]';

const Cursor = () => {
  const { t } = useTranslation();
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine) and (hover: hover)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setEnabled(fine.matches && !reduce.matches);
    sync();
    fine.addEventListener?.('change', sync);
    reduce.addEventListener?.('change', sync);
    return () => { fine.removeEventListener?.('change', sync); reduce.removeEventListener?.('change', sync); };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.documentElement;
    const ring = ringRef.current, dot = dotRef.current;
    let x = -100, y = -100, rx = -100, ry = -100, frame, visible = false;

    const loop = () => {
      // L'anneau rattrape le point avec inertie
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      ring.style.setProperty('--cx', `${rx.toFixed(1)}px`);
      ring.style.setProperty('--cy', `${ry.toFixed(1)}px`);
      frame = requestAnimationFrame(loop);
    };
    const onMove = e => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      dot.style.setProperty('--cx', `${x}px`);
      dot.style.setProperty('--cy', `${y}px`);
      if (!visible) { visible = true; rx = x; ry = y; ring.classList.remove('is-off'); root.classList.add('has-cursor'); }
      const el = e.target;
      const text = el.closest?.(TEXT);
      const view = !text && el.closest?.(VIEW);
      const link = !text && !view && el.closest?.(LINK);
      ring.classList.toggle('is-text', !!text);
      ring.classList.toggle('is-view', !!view);
      ring.classList.toggle('is-link', !!link);
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');
    const onLeave = () => { visible = false; ring.classList.add('is-off'); root.classList.remove('has-cursor'); };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('pointerleave', onLeave);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      root.classList.remove('has-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ringRef} className="cursor-ring is-off" aria-hidden="true"><span>{t('motion.view')}</span></div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
};

export default Cursor;
