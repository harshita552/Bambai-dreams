import { useEffect } from 'react';

/**
 * Continuous eased scrolling — the page glides toward where the wheel has asked
 * it to go instead of jumping a notch at a time, and never stops at fixed
 * points along the way.
 *
 * Everything scroll-linked on the page keeps working: this moves the real
 * scroll position, so scroll events fire as normal throughout the glide.
 *
 * Mouse and trackpad only. Touch keeps native scrolling, and so does anyone who
 * has asked for reduced motion.
 */

const EASE = 0.12;        // fraction of the remaining distance covered per frame
const LINE_PX = 16;       // wheels that report lines rather than pixels

export function useSmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || still.matches) return;

    let target = window.scrollY;
    let current = target;
    let running = false;
    let raf = 0;

    const maxY = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const tick = () => {
      const left = target - current;
      if (Math.abs(left) < 0.5) {
        current = target;
        window.scrollTo(0, current);
        running = false;
        return;
      }
      current += left * EASE;
      window.scrollTo(0, current);
      raf = requestAnimationFrame(tick);
    };

    const onWheel = (e) => {
      if (e.ctrlKey) return;                       // pinch zoom, not a scroll
      // let anything with its own scrollbar (the work filter strip, a modal)
      // handle its own wheel
      if (e.target.closest && e.target.closest('[data-native-scroll]')) return;

      e.preventDefault();
      let d = e.deltaY;
      if (e.deltaMode === 1) d *= LINE_PX;
      else if (e.deltaMode === 2) d *= window.innerHeight;

      target = Math.min(maxY(), Math.max(0, target + d));
      if (!running) {
        running = true;
        current = window.scrollY;
        raf = requestAnimationFrame(tick);
      }
    };

    // Anything that moves the page itself — a keyboard scroll, an anchor jump,
    // the reveal gliding out of its dark stretch — resets where we are gliding
    // from, so the two never fight over the scroll position.
    const onScroll = () => {
      if (!running) {
        target = window.scrollY;
        current = target;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
}
