import { useEffect } from 'react';

/**
 * One wheel gesture = one section.
 *
 * Rather than jumping, this animates window.scrollY between stops, so every
 * scroll-linked animation on the page (the hero film's travel, the copy exits,
 * the sticky service panels) still plays out on the way - it just plays on a
 * timeline we drive instead of one the reader has to turn by hand.
 *
 * Stops come from elements marked data-snap. Where two stops sit more than a
 * screen and a bit apart - a tall grid, say - the gap is filled at one screen
 * per stop, so a single scroll always advances about one screenful.
 *
 * Mouse and trackpad only. Touch keeps native scrolling, and so does anyone who
 * has asked for reduced motion.
 */

const MIN_MS = 520;
const MAX_MS = 1250;
const MS_PER_SCREEN = 700;
const GESTURE_GAP = 90;    // wheel events closer than this are one flick, not two

// Layout offset from the top of the document. offsetTop is the element's laid
// out position, so this stays correct for the sticky panels, whose painted
// position (and so getBoundingClientRect) is shifted while they are stuck.
function docTop(el) {
  let y = 0;
  for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
  return y;
}

export function useSectionSnap() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || still.matches || window.innerWidth < 1024) return;

    let stops = [];
    let animating = false;
    let lastWheelAt = 0;
    let raf = 0;

    let lastH = -1;
    let lastVh = -1;

    const build = () => {
      const vh = window.innerHeight || 1;
      const docH = document.documentElement.scrollHeight;
      // Only remeasure when the page itself changed shape. The sticky panels
      // report a shifted offset while they are stuck, so a needless rebuild
      // mid-scroll would drift the stops; at rest, and on a real layout change,
      // the numbers are the laid out ones.
      if (docH === lastH && vh === lastVh) return;
      lastH = docH;
      lastVh = vh;
      const max = Math.max(0, docH - vh);
      const marked = [...document.querySelectorAll('[data-snap]')]
        .map(docTop)
        .filter((y) => Number.isFinite(y));

      const sorted = [...new Set([0, ...marked, max])]
        .map((y) => Math.round(Math.min(max, Math.max(0, y))))
        .sort((a, b) => a - b);

      // Stops are the sections themselves and nothing else. Filling the long
      // gaps with extra stops a screen apart is what made scrolling feel like it
      // halted at arbitrary points mid-section, so a tall section is simply
      // crossed in one move.
      stops = sorted;
    };

    const nextStop = (dir) => {
      const y = window.scrollY;
      const slack = 4;   // treat "within a few px" as already on the stop
      if (dir > 0) return stops.find((s) => s > y + slack) ?? null;
      for (let i = stops.length - 1; i >= 0; i--) if (stops[i] < y - slack) return stops[i];
      return null;
    };

    const animateTo = (to) => {
      const from = window.scrollY;
      const delta = to - from;
      if (!delta) return;
      const vh = window.innerHeight || 1;
      const ms = Math.min(MAX_MS, Math.max(MIN_MS, (Math.abs(delta) / vh) * MS_PER_SCREEN));
      const t0 = performance.now();
      animating = true;

      const step = (t) => {
        const p = Math.min(1, (t - t0) / ms);
        // easeInOutCubic — leaves and arrives calmly, covers ground in between
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        window.scrollTo(0, from + delta * e);
        if (p < 1) raf = requestAnimationFrame(step);
        else animating = false;
      };
      raf = requestAnimationFrame(step);
    };

    const onWheel = (e) => {
      if (e.ctrlKey) return;                      // pinch zoom, not a scroll
      const now = performance.now();
      // A trackpad flick fires wheel events continuously for up to a second.
      // Only a run that starts after a real pause counts as a new scroll, so one
      // flick moves one section however long its momentum keeps firing.
      const fresh = now - lastWheelAt > GESTURE_GAP;
      lastWheelAt = now;

      const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
      if (!dir) return;

      const to = nextStop(dir);
      if (to === null && !animating) return;      // nothing ahead — let it scroll
      e.preventDefault();
      if (animating || !fresh || to === null) return;
      animateTo(to);
    };

    // the page's own heights are in vh and its images settle late, so rebuild
    // whenever the document changes size rather than only on resize
    build();
    const ro = new ResizeObserver(build);
    ro.observe(document.body);
    window.addEventListener('resize', build);
    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', build);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);
}
