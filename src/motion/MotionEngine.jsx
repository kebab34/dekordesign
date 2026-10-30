import { useEffect } from 'react';

// Langage de mouvement appliqué automatiquement à tout le site, inspiré du carrelage :
//  - apparitions au défilement : cartes en cascade, titres balayés de bas en haut (comme un joint qu'on tire),
//    images dévoilées depuis leur centre (comme un carreau posé), filets dorés tracés
//  - cartes produit inclinées en 3D sous le curseur, avec un reflet qui suit la souris (carreau poli)
//  - parallaxe sur les grandes images, boutons d'action aimantés
// Les éléments sont repérés dès qu'ils apparaissent dans le DOM (changement de page, filtre…).
// « Réduire les animations » (html.motion-reduce) : fondus seuls, ni 3D, ni parallaxe, ni aimant.
// Le DOM géré par React n'est jamais restructuré : seuls des attributs data-* et des styles sont posés.
// Aucun transform n'est appliqué à un élément qui contient des panneaux position: fixed (zoom, filtres).

// Cartes et blocs qui montent en fondu
const REVEAL = [
  '.bc-card', '.cdp-card', '.kobos-card', '.sop-card', '.cui-card', '.men-card', '.ext-card',
  '.ade-card', '.ase-card', '.srch-card', '.real-card', '.collection-card', '.catalogue-card',
  '.tamamlayici-card', '.room-card', '.product-card',
  '[class*="-header"] > p', '.section-subtitle', '.footer-column',
  '.legal-section', '.cdp-info-block', '.info-item', '.contact-form-container',
  '.bcd-info', '.kd-info', '.spd-info', '.cdet-info', '.mdet-info', '.edet-info',
  '.real-photo', '.srch-group-title', '.cta-section > *',
].join(',');

// Titres : balayage de bas en haut
const TITLES = [
  '[class*="-header"] > h1', '[class*="-header"] > h2', '.section-title',
  '.bcd-name', '.kd-name', '.spd-name', '.cdet-name', '.mdet-name', '.edet-name', '.adkd-name', '.real-detail-title',
].join(',');

// Grands visuels des fiches dévoilés depuis le centre (les cartes ont leur propre dévoilement)
const UNCOVER = '.bcd-image-wrap, .kd-main-img-wrap, .spd-main-img-wrap, .cdet-image-wrap, .mdet-img-wrapper, .edet-img-wrapper';

// Filets dorés qui se tracent
const LINES = '[class*="gold-line"], .cdp-gold-bar, .room-line';

// Cartes inclinées en 3D au survol
const TILT = '.bc-card, .cdp-card, .kobos-card, .sop-card, .cui-card, .ade-card, .srch-card, .real-card, .collection-card, .catalogue-card, .tamamlayici-card, .men-card, .ext-card, .featured-card, .product-card';

// Grandes images en parallaxe (l'image glisse dans son cadre)
const PARALLAX = '.cdp-hero-img, .room-image, .ase-img, .adkd-hero-img, .real-photo--main img, .product-card img';

// Boutons d'action aimantés
const MAGNETIC = '.pose-cta, .view-all-btn, .real-btn, .cdp-quote-btn, .submit-btn, .bcd-contact-btn, .kd-btn-gold, .spd-btn-gold, .adkd-btn-gold, .mdet-cta, .edet-cta, .cdet-contact-btn, .nf-home, .srch-contact, .luxury-cta, .catalogue-download-btn';

// Parties qui ont leur propre animation
const EXCLUDE = '.luxury-carousel, .pose';

const MAX_STAGGER = 10;
const TILT_DEG = 7;
const MAGNET = 0.28;

const MotionEngine = () => {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    const root = document.documentElement;
    const syncReduce = () => root.classList.toggle('motion-reduce', reduce.matches);
    syncReduce();
    root.classList.add('motion-ready');
    const rich = () => !reduce.matches;

    // ── Apparitions ──────────────────────────────────────────────────────────
    const io = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).map(e => e.target);
      visible.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      visible.forEach((el, i) => {
        el.style.setProperty('--reveal-i', Math.min(i, MAX_STAGGER));
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    // ── Parallaxe ────────────────────────────────────────────────────────────
    const parallaxEls = new Set();
    let ticking = false;
    const updateParallax = () => {
      ticking = false;
      if (!rich()) return;
      const vh = window.innerHeight;
      parallaxEls.forEach(el => {
        if (!el.isConnected) { parallaxEls.delete(el); return; }
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const p = ((r.top + r.height / 2) - vh / 2) / vh; // -1 … 1 autour du centre de l'écran
        el.style.translate = `0 ${(p * -36).toFixed(1)}px`;
      });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(updateParallax); } };

    const tag = scope => {
      const pick = (sel, attr, observe = true) => {
        const found = scope.matches?.(sel) ? [scope] : [];
        scope.querySelectorAll?.(sel).forEach(el => found.push(el));
        return found.filter(el => {
          if (el.hasAttribute(attr) || el.closest(EXCLUDE)) return false;
          el.setAttribute(attr, '');
          if (observe) io.observe(el);
          return true;
        });
      };
      pick(REVEAL, 'data-reveal');
      pick(TITLES, 'data-reveal-title');
      pick(UNCOVER, 'data-reveal-uncover');
      pick(LINES, 'data-reveal-line');
      pick(TILT, 'data-tilt', false);
      pick(MAGNETIC, 'data-magnetic', false);
      pick(PARALLAX, 'data-parallax', false).forEach(el => parallaxEls.add(el));
    };

    tag(document.body);
    const mo = new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && tag(n)));
      onScroll();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    // ── Inclinaison 3D + reflet, boutons aimantés (délégation d'événements) ──
    let tilted = null;
    let magnet = null;
    const resetTilt = () => {
      if (!tilted) return;
      tilted.classList.remove('is-tilting');
      tilted = null;
    };
    const resetMagnet = () => {
      if (!magnet) return;
      magnet.style.translate = '';
      magnet = null;
    };
    const onPointerMove = e => {
      if (!rich() || !finePointer.matches || e.pointerType === 'touch') return;
      const card = e.target.closest?.('[data-tilt]');
      if (card !== tilted) resetTilt();
      if (card) {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const dist = Math.hypot(px, py);
        const len = dist || 1;
        // Rotation autour de l'axe perpendiculaire au déplacement : la carte « penche » vers le curseur
        card.style.setProperty('--tilt', `${(-py / len).toFixed(3)}, ${(px / len).toFixed(3)}, 0, ${(Math.min(dist, 0.7) * 2 * TILT_DEG).toFixed(2)}deg`);
        card.style.setProperty('--lx', `${((px + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--ly', `${((py + 0.5) * 100).toFixed(1)}%`);
        card.classList.add('is-tilting');
        tilted = card;
      }
      const btn = e.target.closest?.('[data-magnetic]');
      if (btn !== magnet) resetMagnet();
      if (btn) {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * MAGNET;
        const dy = (e.clientY - (r.top + r.height / 2)) * MAGNET;
        btn.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
        magnet = btn;
      }
    };
    const onLeaveWindow = () => { resetTilt(); resetMagnet(); };
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onLeaveWindow);

    const onReduceChange = () => {
      syncReduce();
      if (reduce.matches) { onLeaveWindow(); parallaxEls.forEach(el => { el.style.translate = ''; }); }
    };
    reduce.addEventListener?.('change', onReduceChange);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onLeaveWindow);
      reduce.removeEventListener?.('change', onReduceChange);
      root.classList.remove('motion-ready', 'motion-reduce');
    };
  }, []);

  return null;
};

export default MotionEngine;
