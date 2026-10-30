import { useEffect } from 'react';

// Animations d'apparition au défilement, appliquées automatiquement à tout le site :
// les éléments listés ci-dessous sont repérés dès qu'ils apparaissent dans le DOM (changement de page,
// filtre…), puis révélés à l'entrée dans l'écran, en cascade quand plusieurs arrivent ensemble.
// Si le visiteur a demandé « réduire les animations » (html.motion-reduce), les apparitions se font
// en fondu seul, sans déplacement. Rien n'est masqué si le JavaScript échoue : l'état caché n'existe
// que sous html.motion-ready.

// Cartes et blocs qui montent en fondu
const REVEAL = [
  '.bc-card', '.cdp-card', '.kobos-card', '.sop-card', '.cui-card', '.men-card', '.ext-card',
  '.ade-card', '.ase-card', '.srch-card', '.real-card', '.collection-card', '.catalogue-card',
  '.tamamlayici-card', '.room-card', '.product-card',
  '.section-title', '.section-subtitle',
  '[class*="-header"] > h1', '[class*="-header"] > h2', '[class*="-header"] > p',
  '.legal-section', '.cdp-info-block', '.info-item', '.contact-form-container',
  '.bcd-info', '.bcd-image-wrap', '.kd-info', '.spd-info', '.cdet-info', '.mdet-info', '.edet-info',
].join(',');

// Filets dorés qui se tracent
const LINES = '[class*="gold-line"], .cdp-gold-bar';

// Parties qui ont leur propre animation (carrousel d'accueil, section « L'art de la pose »)
const EXCLUDE = '.luxury-carousel, .pose';

const MAX_STAGGER = 10;

const MotionEngine = () => {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;
    const syncReduce = () => root.classList.toggle('motion-reduce', reduce.matches);
    syncReduce();
    root.classList.add('motion-ready');

    const io = new IntersectionObserver(entries => {
      // Éléments entrés ensemble : cascade dans l'ordre du document
      const visible = entries.filter(e => e.isIntersecting).map(e => e.target);
      visible.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      visible.forEach((el, i) => {
        el.style.setProperty('--reveal-i', Math.min(i, MAX_STAGGER));
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    const tag = scope => {
      const pick = (sel, attr) => {
        const found = scope.matches?.(sel) ? [scope] : [];
        scope.querySelectorAll?.(sel).forEach(el => found.push(el));
        found.forEach(el => {
          if (el.hasAttribute(attr) || el.closest(EXCLUDE)) return;
          el.setAttribute(attr, '');
          io.observe(el);
        });
      };
      pick(REVEAL, 'data-reveal');
      pick(LINES, 'data-reveal-line');
    };

    tag(document.body);
    const mo = new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && tag(n))));
    mo.observe(document.body, { childList: true, subtree: true });

    // Préférence modifiée en cours de visite : on bascule entre animations complètes et fondus seuls
    reduce.addEventListener?.('change', syncReduce);

    return () => {
      io.disconnect();
      mo.disconnect();
      reduce.removeEventListener?.('change', syncReduce);
      root.classList.remove('motion-ready', 'motion-reduce');
    };
  }, []);

  return null;
};

export default MotionEngine;
