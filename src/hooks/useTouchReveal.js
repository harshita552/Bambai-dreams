import { useEffect } from 'react';

/**
 * Scroll reveals for phones and tablets, after the Arpeggio site's motion:
 * headings sharpen out of a blur as they rise, copy fades up, cards slide in
 * from alternating sides, and pictures settle from a slight zoom.
 *
 * Desktop keeps its own choreography (GSAP pins, framer-motion), so this only
 * runs below 1200px. It animates through the Web Animations API on the
 * individual `translate` / `scale` / `filter` properties, which compose with
 * whatever `transform` GSAP or framer-motion already put on an element
 * rather than fighting it, and it cancels each animation once it has played
 * so the element is left exactly as the page styled it.
 */

const QUERY = '(max-width: 1199px)';
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';   // close to the reference's soft spring

// Order matters: the first rule an element matches decides its motion.
const RULES = [
  {
    sel: 'li, article, [data-reveal-card]',
    frames: (i) => [
      { opacity: 0, translate: `${i % 2 ? 48 : -48}px 0` },
      { opacity: 1, translate: '0 0' },
    ],
    duration: 900,
  },
  {
    sel: 'h1, h2, h3',
    frames: [
      { opacity: 0, translate: '0 40px', filter: 'blur(8px)' },
      { opacity: 1, translate: '0 0', filter: 'blur(0px)' },
    ],
    duration: 1000,
  },
  {
    sel: 'img, video',
    frames: [{ scale: '1.18' }, { scale: '1' }],
    duration: 1400,
    when: (el) => el.parentElement && getComputedStyle(el.parentElement).overflow === 'hidden',
  },
  {
    sel: 'p, a.btn, button',
    frames: [
      { opacity: 0, translate: '0 24px' },
      { opacity: 1, translate: '0 0' },
    ],
    duration: 800,
  },
];

// Fixed chrome, the lightbox, and anything already animated as a group.
const SKIP = 'nav, [data-no-reveal], .tm-track, .lb-card, [aria-hidden="true"]';

export function useTouchReveal(routeKey) {
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches || reduced.matches) return;

    const pending = new Map();   // element -> paused Animation
    let batch = [];
    let raf = 0;

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        batch.push(e.target);
      }
      if (batch.length && !raf) {
        // elements that arrive together play as a short stagger, top to bottom
        raf = requestAnimationFrame(() => {
          batch.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
          batch.forEach((el, i) => {
            const anim = pending.get(el);
            if (!anim) return;
            anim.effect.updateTiming({ delay: Math.min(i, 6) * 70 });
            anim.play();
          });
          batch = [];
          raf = 0;
        });
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    const scan = () => {
      const root = document.querySelector('main') || document.body;
      let cardIndex = 0;
      for (const rule of RULES) {
        for (const el of root.querySelectorAll(rule.sel)) {
          if (el.hasAttribute('data-tr') || el.closest(SKIP)) continue;
          // one motion per subtree: nothing inside an element that has (or had) its own reveal
          if (el.parentElement && el.parentElement.closest('[data-tr]')) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 8 || r.height < 8) continue;
          // off to the side (carousels, tickers) it may never cross the viewport, so leave it be
          if (r.right <= 0 || r.left >= window.innerWidth) continue;
          if (rule.when && !rule.when(el)) continue;
          el.setAttribute('data-tr', '');
          const frames = typeof rule.frames === 'function' ? rule.frames(cardIndex++) : rule.frames;
          const anim = el.animate(frames, { duration: rule.duration, easing: EASE, fill: 'both' });
          anim.pause();
          anim.onfinish = () => { anim.cancel(); pending.delete(el); };
          pending.set(el, anim);
          io.observe(el);
        }
      }
    };

    // Pages mount their sections in stages (lazy media, route transitions), so
    // scan once after the route settles and again whenever the DOM grows.
    const t = setTimeout(scan, 450);
    let mo = 0;
    const observer = new MutationObserver(() => {
      clearTimeout(mo);
      mo = setTimeout(scan, 250);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(t);
      clearTimeout(mo);
      cancelAnimationFrame(raf);
      observer.disconnect();
      io.disconnect();
      pending.forEach((a) => a.cancel());
      pending.clear();
      document.querySelectorAll('[data-tr]').forEach((el) => el.removeAttribute('data-tr'));
    };
  }, [routeKey]);
}
