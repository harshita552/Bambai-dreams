import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import imgVisualStorytelling from '../assets/Visual_Storytelling.png';
import imgTalentRep from '../assets/Talent_Representation.png';
import imgCreativeDev from '../assets/Creative_Development.png';
import logoRealme from '../assets/realme-logo.png';
import logoZoho from '../assets/Zoho-logo.png';
import zohoMark from '../assets/zoho-logo.svg';
import logoGiva from '../assets/giva-logo.png';
import givaWordmark from '../assets/giva-wordmark.png';
import logoOppo from '../assets/Oppo-logo.png';
import logoNoise from '../assets/noise-logo.png';
import logoTcl from '../assets/tcl-logo.png';
import logoGomechanic from '../assets/gomechanic-logo.png';
import logoPowerlook from '../assets/powerlook-logo.png';
import logoColoros from '../assets/coloros-logo.png';
import logoUnderarmour from '../assets/underarmour-log.png';
import logoPizzahut from '../assets/pizzahut-logo.png';
import logoCavins from '../assets/cavins-logo.png';
import logoShapoorji from '../assets/shapooriji-logo.png';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useMotionTemplate, useAnimationFrame } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';
import { useSectionSnap } from '../hooks/useSectionSnap';
import { useVimeoLoop } from '../hooks/useVimeoLoop';
import { useLightbox } from '../context/LightboxContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BB = '"Bebas Neue",sans-serif';
const MR = '"Manrope",sans-serif';
const GS = '"General Sans",sans-serif';
// Warm amber -> yellow gradient used on the hero tagline (and the CTA), as in the mock.
const HERO_GOLD = 'linear-gradient(90deg, #FFDE59 0%, #FF914D 100%)';
// Cream -> pink wash across the campaign script word.
const HERO_SCRIPT = 'linear-gradient(90deg, #FFF7AD 0%, #FFA9F9 100%)';

const EASE = [0.22, 1, 0.36, 1];
const DURATION = 0.8;

// Hero load-in colour grade: warm red-gold, then back to neutral.
// Same filter functions in the same order so the two states interpolate.
const HERO_GRADE = 'sepia(0.85) saturate(2.6) hue-rotate(-22deg) contrast(1.06) brightness(0.96)';
const HERO_NEUTRAL = 'sepia(0) saturate(1) hue-rotate(0deg) contrast(1) brightness(1)';

// Hero header layout - mirrors the Canva mock: the wordmark is stacked on two
// lines and flush left, with the tagline + CTA sitting directly beneath it.
// Every piece derives its position from these constants so they can't drift.
// Every full-screen film — the hero included — hands over the same way, so
// these three numbers are shared rather than duplicated per section:
//   1. the copy starts climbing immediately and covers COPY_EXIT_TRAVEL
//      screens over COPY_EXIT_BEAT of scroll, leaving through the top;
//   2. the film holds still for FILM_HOLD_BEAT — by then the copy has visibly
//      lifted — and then travels its own screen, following the text up;
//   3. because the copy is still climbing while the film moves, it stays ahead
//      the whole way and clears the screen first.
const COPY_EXIT_BEAT = 0.6;      // screens of scroll over which the copy exits
const COPY_EXIT_TRAVEL = 0.95;   // screens the copy covers — enough to clear the top
const FILM_HOLD_BEAT = 0.18;     // screens the film holds before it starts moving

const HERO_LEFT_CSS = 'clamp(22px,5vw,96px)';     // left gutter (CSS)
const HERO_STACK_TOP = 0.324;                      // top of "BAMBAI" as a fraction of the viewport
const HERO_LINE = 0.78;                       // wordmark line-height (em) - tight, as in the mock
const HERO_TAGLINE_GAP = 27;                           // px between wordmark bottom and tagline

// Tracks whether an element is near/in the viewport — used to lazy-mount video
// iframes and pause off-screen players so the whole page isn't running 10+ videos.
function useNearViewport(ref, rootMargin = '250px') {
  const [inView, setInView] = useState(false);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); setEntered(true); return; }
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting);
      if (e.isIntersecting) setEntered(true);
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return { inView, entered };
}

const PALETTES = {
  hero: ['#2a2a2a', '#0a0a0a'],
  work1: ['#ffd166', '#ff7a45'],
  work2: ['#3ec9c9', '#136b6b'],
  work3: ['#ff6f59', '#b23a3a'],
  work4: ['#8b5cf6', '#4c1d95'],
  studio: ['#d8d2c4', '#a89f8c'],
};

/* ── placeholder / image helpers ─────────────────────────────────── */
function PlaceholderBlock({ palette = PALETTES.work1, label, height = '100%' }) {
  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden', background: `linear-gradient(155deg, ${palette[0]} 0%, ${palette[1]} 100%)` }}>
      {label && (
        <span style={{ position: 'absolute', bottom: 10, left: 12, fontFamily: '"DM Sans",sans-serif', fontSize: 7, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', background: 'rgba(10,10,10,0.45)', padding: '4px 8px' }}>{label}</span>
      )}
    </div>
  );
}

function ShowcaseImage({ src, palette = PALETTES.work1, label, height = '100%', style, imgPos = 'center center' }) {
  const [errored, setErrored] = useState(false);
  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden', background: `linear-gradient(155deg, ${palette[0]} 0%, ${palette[1]} 100%)`, ...style }}>
      {!errored && (
        <img src={src} alt={label || ''} onError={() => setErrored(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: imgPos }} />
      )}
      {label && (
        <span style={{ position: 'absolute', bottom: 10, left: 12, fontFamily: '"DM Sans",sans-serif', fontSize: 7, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', background: 'rgba(10,10,10,0.45)', padding: '4px 8px', zIndex: 1 }}>{label}</span>
      )}
    </div>
  );
}

function Kicker({ children, light }) {
  return (
    <span style={{ fontFamily: MR, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: light ? 'rgba(255,255,255,0.5)' : 'var(--yellow)', fontWeight: 700 }}>
      {children}
    </span>
  );
}

function RevealWords({ text, style }) {
  const words = text.split(' ');
  return (
    <span style={{ display: 'inline' }}>
      {words.map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.28em' }}>
          <motion.span
            initial={{ y: '110%' }} animate={{ y: '0%' }}
            transition={{ delay: 0.15 + i * 0.05, duration: DURATION, ease: EASE }}
            style={{ display: 'inline-block', ...style }}>{w}</motion.span>
        </span>
      ))}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   STACK PANEL — sticky card-stack mechanism
   Each panel is position:sticky, top:0, height:100vh.
   As the NEXT panel scrolls up to cover it, this one scales/blurs/
   gains border-radius — like a card being placed on a stack.
══════════════════════════════════════════════════════════════════ */
function StackPanel({ selfRef, nextRef, zIndex, background = '#fff', noShrink = false, height = '100vh', navInvert = false, navHideLogo = false, children }) {
  const progress = useMotionValue(0);

  useEffect(() => {
    if (noShrink) return;
    const handle = () => {
      const el = nextRef.current; if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, (vh - rect.top) / vh));
      progress.set(p);
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle);
    return () => { window.removeEventListener('scroll', handle); window.removeEventListener('resize', handle); };
  }, [nextRef, progress, noShrink]);

  return (
    <div ref={selfRef} data-snap
      {...(navInvert ? { 'data-nav-invert': '' } : null)}
      {...(navHideLogo ? { 'data-nav-nologo': '' } : null)}
      style={{ position: 'sticky', top: 0, height, zIndex, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: '100%', overflow: 'hidden', background, position: 'relative' }}>
        {typeof children === 'function' ? children(progress) : children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   1 — HERO
══════════════════════════════════════════════════════════════════ */
function Hero({ onViewWork, progress }) {
  const fallback = useMotionValue(0);
  const raw = progress || fallback;
  const isMobile = useIsMobile();

  // The hero copy leaves the same way the film panels hand off: it physically
  // climbs out through the top rather than dissolving. On top of the hero's own
  // 1:1 travel it lifts a further 0.22 of a viewport — the identical 1.22x lead
  // the featured stage uses — so the wordmark and the GIVA lockup clear the
  // screen just before the footage does, and the next film's copy is already
  // rising from below to take their place. No fade: it exits by moving.
  // The copy goes first: it covers its whole exit inside COPY_EXIT_BEAT, while
  // the film is still holding, so the text has visibly left through the top
  // before the footage starts to move. Driven by the raw scroll value — a
  // spring damps its way to the target and read as the text crawling up and
  // never quite clearing.
  const taglineY = useTransform(raw, (v) => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const beat = Math.min(1, Math.max(0, v / COPY_EXIT_BEAT));
    return -beat * vh * COPY_EXIT_TRAVEL;
  });
  const taglineOpacity = 1;

  const crosses = [
    { top: '18%', left: '3%' }, { top: '18%', left: '38%' },
    { top: '18%', right: '3%' }, { bottom: '28%', left: '3%' },
    { bottom: '28%', right: '3%' }, { bottom: '28%', left: '38%' },
  ];

  return (
    <div style={{ position: 'relative', height: '100%', background: '#0a0a0a' }}>

      {/* ── CARD — full width initially, gains side margins as hero slides up ── */}
      <motion.div style={{
        position: 'absolute', top: 0, bottom: 0,
        left: 0, right: 0,
        overflow: 'hidden', zIndex: 2,
      }}>
        {/* Warm red-gold film grade applied to the FOOTAGE itself (a CSS filter
            on the video element), so no overlay can ever touch the copy.
            Holds for ~1.4s on load, then grades back to neutral. */}
        <motion.video autoPlay muted loop playsInline
          initial={{ filter: HERO_GRADE }}
          animate={{ filter: [HERO_GRADE, HERO_GRADE, HERO_NEUTRAL] }}
          transition={{ duration: 3.4, times: [0, 0.42, 1], ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
          <source src="/videos/hero.mov" type="video/mp4" />
        </motion.video>

        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 30%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 100%)' }} />

        {crosses.map((pos, i) => (
          <span key={i} aria-hidden style={{ position: 'absolute', fontSize: 13, color: 'rgba(255,255,255,0.25)', zIndex: 2, ...pos }}>+</span>
        ))}

        {/* Featured-campaign lockup — right side. Every number here is lifted
            straight out of the client's deck (slide 1, Group 8), which places the
            group at 1013,272 on a 1440x810 canvas: GIVA is artwork in the deck,
            not type, so it ships as the same PNG. Offsets are vw so the lockup
            scales as one piece. Fades out on scroll with the rest of the hero. */}
        {!isMobile && (
          <motion.div style={{ position: 'absolute', left: '70.35vw', top: '33.58%', zIndex: 4, opacity: taglineOpacity, y: taglineY }}>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: DURATION, ease: EASE }}
              style={{ position: 'relative' }}>
              {/* Freeform 9 in the deck — 242x161 at the group origin. */}
              <img src={givaWordmark} alt="GIVA"
                style={{ display: 'block', width: '16.806vw', height: 'auto' }} />
              {/* TextBox 10 — Bebas Neue 32px, tracking -0.57px, #FCFEFF. */}
              <div className="giva-tag" style={{ position: 'absolute', left: '4.583vw', top: '8.194vw', fontFamily: BB, fontWeight: 400, fontSize: '2.222vw', lineHeight: 0.8, color: '#FCFEFF', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                What the heart
              </div>
              {/* TextBox 11 — Brittany, gradient #FFF7AD to #FFA9F9. The padding
                  keeps the swashes inside the background-clip paint box. */}
              <div className="giva-script" style={{ position: 'absolute', left: '10.42vw', top: '7.91vw', fontSize: 'clamp(34px,5.21vw,86px)', lineHeight: 1, padding: '0.36em 0.50em 0.60em 0.14em', margin: '-0.36em 0 0 -0.14em', whiteSpace: 'nowrap', backgroundImage: HERO_SCRIPT, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>
                wants
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Wordmark + tagline + CTA — one block, flush left, fades out on scroll */}
        {!isMobile && (
          <motion.div style={{ position: 'absolute', top: `${HERO_STACK_TOP * 100}vh`, left: HERO_LEFT_CSS, zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', opacity: taglineOpacity, y: taglineY }}>
            <motion.h1
              className="bd-type"
              initial="hidden" animate="show"
              variants={{ hidden: {}, show: { transition: { delayChildren: 0.35, staggerChildren: 0.085 } } }}
              style={{
                margin: 0, padding: 0,
                fontFamily: BB, fontWeight: 900, textTransform: 'uppercase',
                fontSize: 'clamp(46px,7.2vw,120px)', lineHeight: HERO_LINE,
                whiteSpace: 'nowrap', textAlign: 'left',
                // Warm-white gradient so the wordmark sits in the same light as
                // the footage behind it.
                backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #fdf7ee 55%, #f0e2cc 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent', color: 'transparent',
              }}>
              {/* One span per character so each letter lands whole, like typing. */}
              {['BAMBAI', 'DREAMS'].map((wordText) => (
                <span key={wordText} style={{ display: 'block' }}>
                  {wordText.split('').map((ch, i) => (
                    <motion.span key={i}
                      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.01 } } }}
                      style={{ whiteSpace: 'pre' }}>{ch}</motion.span>
                  ))}
                </span>
              ))}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: DURATION, ease: EASE }}
              style={{ fontFamily: BB, fontWeight: 400, fontSize: 'clamp(18px,2.8vw,44px)', lineHeight: 1.02, letterSpacing: '0.01em', textTransform: 'uppercase', margin: `${HERO_TAGLINE_GAP}px 0 0`, backgroundImage: HERO_GOLD, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>
              WE MAKE FILMS
              <br />PEOPLE FEEL.
            </motion.p>
            <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: DURATION, ease: EASE }}
              onClick={onViewWork}
              whileHover={{ backgroundColor: '#0a0a0a', color: '#ffcb31', y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="cta-hero"
              style={{
                marginTop: 38, alignSelf: 'flex-start', fontFamily: MR, fontWeight: 700, fontSize: 11,
                textIndent: '0.22em', textTransform: 'uppercase',
                color: '#0a0a0a', background: 'var(--yellow)', border: 'none',
                padding: '11px 24px', cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
              }}>
              View Work
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Brand name is now rendered as FloatingBrandName (position:fixed) in Home,
          so it can escape this stacking context and animate above the nav */}

      {/* Mobile */}
      {isMobile && (
        <div style={{ position: 'absolute', top: `${HERO_STACK_TOP * 100}vh`, left: 0, right: 0, zIndex: 4, textAlign: 'left', padding: `0 ${HERO_LEFT_CSS}` }}>
          <div style={{ overflow: 'hidden' }}>
            <motion.h1 initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ delay: 0.15, duration: DURATION, ease: EASE }}
              style={{ margin: '0 0 16px', fontFamily: BB, fontWeight: 900, textTransform: 'uppercase', fontSize: 'clamp(48px,14vw,80px)', color: '#fff', lineHeight: HERO_LINE, letterSpacing: '0.005em' }}>
              BAMBAI<br />DREAMS
            </motion.h1>
          </div>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: DURATION, ease: EASE }}
            style={{ fontFamily: BB, fontWeight: 400, fontSize: 'clamp(16px,5.4vw,24px)', lineHeight: 1.02, textTransform: 'uppercase', letterSpacing: '0.01em', marginBottom: 22, backgroundImage: HERO_GOLD, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>
            Mumbai's Premier Film<br />Production House
          </motion.p>
          <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: DURATION, ease: EASE }}
            onClick={onViewWork}
            style={{ fontFamily: MR, fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0a0a0a', background: 'var(--yellow)', border: 'none', padding: '13px 28px', cursor: 'pointer' }}>
            View Work →
          </motion.button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HERO WRAPPER — 200vh scroll space so hero card shrinks before
   FeaturedShowcase appears below it.
   Progress MotionValue is created by the parent (Home) and passed
   in so FloatingBrandName can share the same value.
══════════════════════════════════════════════════════════════════ */
/* Staircase page-load reveal: the hero is hidden behind equal vertical strips
   that retract upward in a left→right cascade (stepped clip reveal, GSAP).
   Runs once on load, then the masks unmount and the hero behaves normally. */
function StaircaseReveal() {
  const [done, setDone] = useState(false);
  const wrapRef = useRef(null);
  const N = 14;

  useEffect(() => {
    if (!wrapRef.current) return;
    const strips = Array.from(wrapRef.current.children);
    const tween = gsap.to(strips, {
      scaleY: 0, transformOrigin: 'top', duration: 1.4, ease: 'power4.out',
      stagger: 0.09, delay: 0.35,
      onComplete: () => setDone(true),
    });
    return () => tween.kill();
  }, []);

  if (done) return null;
  return (
    <div ref={wrapRef} aria-hidden
      style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', pointerEvents: 'none' }}>
      {Array.from({ length: N }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: '100%', background: '#0a0a0a', willChange: 'transform', marginRight: -1 }} />
      ))}
    </div>
  );
}

function HeroWrapper({ children, progress }) {
  const isMobile = useIsMobile();
  // The film holds for FILM_HOLD_BEAT, then travels exactly one
  // viewport over one viewport of scroll so its bottom edge stays flush with
  // the section below. Raw scroll value, never a spring — a spring lags the
  // wheel and would show a seam at the join.
  const heroY = useTransform(progress, (v) => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    return -Math.min(1, Math.max(0, v - FILM_HOLD_BEAT)) * vh;
  });

  useEffect(() => {
    const handle = () => {
      const vh = window.innerHeight;
      progress.set(Math.max(0, Math.min(1 + FILM_HOLD_BEAT, window.scrollY / vh)));
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, [progress]);

  return (
    <>
      {/* Hero behind section 2 (zIndex 1), slides up as you scroll */}
      <motion.div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '100vh',
        zIndex: 1, background: '#0a0a0a', overflow: 'hidden',
        y: heroY,
      }}>
        {children(progress)}
        <StaircaseReveal />
      </motion.div>
      {/* Spacer covers both beats: the copy's, then the film's own screen. */}
      <div data-snap style={{ height: `${(1 + FILM_HOLD_BEAT) * 100}vh` }} aria-hidden />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   2 — FEATURED PROJECT SHOWCASE
   Single featured campaign: main film in center, campaign stills
   fan in from bottom and float around it as you scroll.
   Heading grows continuously. GSAP ScrollTrigger, 400vh pinned.
══════════════════════════════════════════════════════════════════ */
// Cards enter in pairs from bottom-center and travel diagonally outward+up to the top
// corners (L → up-left, R → up-right). Three pairs, staged on scroll (Arpeggio style). No fade.
const FEATURED_STILLS = [
  { palette: PALETTES.work1, label: 'Realme', src: '/images/Featured-Campaign/Picture6.png', pair: 0, side: 'L' },
  { palette: PALETTES.work2, label: 'GIVA', src: '/images/Featured-Campaign/Anushka.png', pair: 0, side: 'R' },
  { palette: PALETTES.work3, label: 'OPPO Find X7 Ultra', src: '/images/Featured-Campaign/Comercials.png', pair: 1, side: 'L' },
  { palette: PALETTES.hero, label: 'OPPO Find X7 Ultra', src: '/images/Featured-Campaign/Picture10.png', pair: 1, side: 'R' },
  { palette: PALETTES.work4, label: 'Under Armour × Neeraj', src: '/images/Featured-Campaign/Neeraj.png', pair: 2, side: 'L', imgPos: 'center top' },
  { palette: PALETTES.studio, label: 'OPPO Find X7 Ultra', src: '/images/Featured-Campaign/Picture11.png', pair: 2, side: 'R' },
];

// [start, end] scroll fraction for each pair's diagonal sweep — overlap so the next
// pair emerges from center-bottom as the previous rises (no empty gap between pairs).
// All pairs finish by ~0.58; 0.58→1.0 is a long HOLD during which the next section covers.
const PAIR_TIMING = [[0, 0.35], [0.14, 0.48], [0.28, 0.58]];

function FeaturedShowcase({ outerRef }) {
  const pinRef = useRef(null);
  const videoRef = useRef(null);
  const videoFrameRef = useRef(null);
  const headingScaleRef = useRef(null);
  const wrapperRefs = useRef([]);
  const isMobile = useIsMobile();
  const featVid = useNearViewport(videoFrameRef);
  const featInViewRef = useRef(featVid.inView);
  featInViewRef.current = featVid.inView;

  // Robustly start the featured film: wait for the Vimeo player's `ready` event
  // (a bare postMessage before that is ignored — which is why it needed a refresh),
  // plus a few fallback nudges. Play when on screen, pause when scrolled away.
  useEffect(() => {
    const iframe = videoFrameRef.current;
    if (!iframe) return;
    const sync = () => {
      const win = iframe.contentWindow;
      if (win) win.postMessage(JSON.stringify({ method: featInViewRef.current ? 'play' : 'pause' }), '*');
    };
    const onMsg = (e) => {
      if (typeof e.origin === 'string' && e.origin.indexOf('vimeo') === -1) return;
      let d; try { d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch { return; }
      if (d && d.event === 'ready') sync();
    };
    window.addEventListener('message', onMsg);
    const nudges = [600, 1500, 3000].map((ms) => setTimeout(sync, ms));
    return () => { window.removeEventListener('message', onMsg); nudges.forEach(clearTimeout); };
  }, []);

  useEffect(() => {
    const win = videoFrameRef.current && videoFrameRef.current.contentWindow;
    if (win) win.postMessage(JSON.stringify({ method: featVid.inView ? 'play' : 'pause' }), '*');
  }, [featVid.inView]);

  useEffect(() => {
    if (!outerRef.current || isMobile) return;   // desktop-only scroll choreography
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: '+=220%',
          scrub: 0.6,
          pin: pinRef.current,
          pinSpacing: true,
        },
      });

      const mob = window.innerWidth < 768;
      if (videoRef.current) {
        // Video starts top-aligned (peeks from below the hero). As the section pins
        // (hero already scrolled up), slide it down and pin it to true vertical-center
        // (y = half viewport, yPercent = -50% of its own height) as the stills fan in.
        // Flex wrapper centers horizontally; GSAP only zooms + slides to vertical center.
        gsap.set(videoRef.current, { scale: 1.0, y: 0, yPercent: 0 });
        tl.to(videoRef.current, { scale: mob ? 0.82 : 0.72, ease: 'none', duration: 1 }, 0);
        tl.to(videoRef.current, { y: () => window.innerHeight / 2, yPercent: -50, ease: 'none', duration: 0.5 }, 0);
      }
      if (headingScaleRef.current) {
        gsap.set(headingScaleRef.current, { scale: mob ? 0.78 : 0.72 });
        tl.to(headingScaleRef.current, { scale: 1.0, ease: 'none', duration: 1 }, 0);
      }

      // Each pair enters from bottom-center and travels diagonally to the top corners.
      const vh = window.innerHeight, vw = window.innerWidth;
      wrapperRefs.current.forEach((el, i) => {
        if (!el) return;
        const s = FEATURED_STILLS[i];
        const cardH = el.offsetHeight || vh * 0.6;
        const dir = s.side === 'L' ? -1 : 1;
        // Diagonal: right card starts LOWER so the rising pair reads as a diagonal,
        // then BOTH cards travel fully off the top (nothing stops mid-screen).
        const yLane = s.side === 'L' ? 0 : vh * 0.42;
        const startX = dir * vw * 0.18;          // emerge already leaning to their own side
        const endX = dir * vw * 0.37;          // sit at the sides but stay fully visible
        const startY = vh * 1.05 + yLane;        // below the viewport (R lower → diagonal)
        const endY = -cardH * 1.1;             // all pairs clear the top
        const [t0, t1] = PAIR_TIMING[s.pair];
        gsap.set(el, { xPercent: -50, x: startX, y: startY });
        tl.fromTo(el, { x: startX, y: startY }, { x: endX, y: endY, ease: 'none', duration: t1 - t0 }, t0);
      });

      ScrollTrigger.refresh();
    });
    return () => ctx.revert();
  }, [outerRef, isMobile]);

  // ── Mobile: simple stacked section (no pin, no fanning stills) ──
  if (isMobile) {
    return (
      <section ref={outerRef} style={{ position: 'relative', zIndex: 2, background: '#0a0a0a', padding: '48px 20px 56px' }}>
        <Kicker light>Featured Campaign</Kicker>
        <div style={{ marginTop: 16, width: '100%', aspectRatio: '16/9', borderRadius: 6, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
          <iframe
            title="Bambai Dreams — Main Film"
            src="https://player.vimeo.com/video/1045916243?h=0f88637370&autoplay=1&muted=1&loop=1&background=1"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="autoplay; fullscreen; picture-in-picture"
          />
        </div>
        <h2 style={{ margin: '30px 0 0', fontFamily: BB, fontWeight: 900, fontSize: 'clamp(30px,8.5vw,46px)', color: '#fff', lineHeight: 1.02, textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
          Craft · Precision · Purpose
        </h2>
      </section>
    );
  }

  return (
    <section ref={outerRef} style={{ position: 'relative', zIndex: 2, height: '320vh' }}>
      <div ref={pinRef} style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>

        {/* Video: flex-wrapper centers it horizontally; GSAP handles zoom + vertical slide on inner box */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
          <div ref={videoRef} style={{ position: 'relative', width: 'clamp(260px,64vw,880px)', aspectRatio: '16/9', willChange: 'transform', borderRadius: 8, overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,0,0,0.55)' }}>
            <iframe ref={videoFrameRef}
              title="Bambai Dreams — Main Film"
              src="https://player.vimeo.com/video/1045916243?h=0f88637370&autoplay=1&muted=1&loop=1&background=1"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
            {/* bottom gradient so the caption stays legible without covering the subject */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 42%)', pointerEvents: 'none' }} />
            {/* caption — small, single line, low on the video (off the subject's face) */}
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 'clamp(14px,3.2%,28px)', textAlign: 'center', padding: '0 16px', pointerEvents: 'none' }}>
              <h2 style={{ margin: 0, fontFamily: BB, fontWeight: 900, fontSize: 'clamp(12px,1.5vw,22px)', color: '#fff', lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '0.03em', textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}>
                Craft&nbsp;·&nbsp;Precision&nbsp;·&nbsp;Purpose
              </h2>
            </div>
          </div>
        </div>

        {/* Campaign stills — pairs sweep diagonally bottom-center → top corners (hidden on mobile) */}
        {FEATURED_STILLS.map((img, i) => (
          <div key={i} ref={el => (wrapperRefs.current[i] = el)}
            style={{
              position: 'absolute', top: 0, left: '50%',
              width: 'clamp(190px,20vw,320px)', height: 'clamp(300px,31vw,500px)', padding: '7px 0',
              zIndex: 6, willChange: 'transform', display: 'var(--stills-display, block)'
            }}
            className="featured-still">
            <ShowcaseImage src={img.src} palette={img.palette} height="100%" label={img.label} imgPos={img.imgPos} />
          </div>
        ))}

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   2 — FEATURED WORK
   Full-screen featured films, one after another in normal flow — each
   scrolls past on its own rather than stacking over the one before it.
   The campaign copy rises in from below as its film arrives, then rides
   up and out with it. Videos are local mp4s in /public/videos/section-2.
══════════════════════════════════════════════════════════════════ */
const FEATURED_WORKS = [
  {
    src: '/videos/section-2/ARMOUR.mp4', title: 'Gold. Grit. Glory.', sub: 'Athlete Campaign', client: 'Under Armour',
    overlay: {
      kind: 'campaign', logo: logoUnderarmour, logoWhite: true,
      line1: 'Gold. Grit. Glory.', line2: 'Athlete Campaign 2023',
    },
  },
  {
    src: '/videos/section-2/Zoho.mp4', title: 'Built For More', sub: 'Product Film', client: 'Zoho',
    // Overlay rebuilt in HTML (matching the client's Canva reference) so the
    // lockup stays crisp and never gets cropped with the footage.
    overlay: { logo: zohoMark, line1: 'ZOHO', line2: 'RUN YOUR', accent: 'BUSINESS' },
  },
];

// Reveal in the style of the reference site: the copy sits a little low and
// transparent, and the first time its film scrolls into view it rises into
// place and fades up. It plays once on entry and then stays — the position is
// not tied to scroll, so it never drifts back out or re-runs on the way past.
const REVEAL_RISE = 110;   // px the copy travels on the way in
const REVEAL_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const REVEAL_MS = 900;
// The overlay — campaign lockup on the left, credit on the right — climbs out
// together while the film below it holds, then follows.

function FeaturedWorkPanel({ work }) {
  const ref = useRef(null);
  const vidRef = useRef(null);
  const { entered, inView } = useNearViewport(ref, '400px');
  // Initialised from capability rather than set inside the effect, which would
  // trigger a cascading render.
  const [revealed, setRevealed] = useState(() => typeof IntersectionObserver === 'undefined');

  // Plays every time the film comes back into view, not just the first time —
  // scroll away and back and the copy slides in again, no reload needed.
  //
  // The two thresholds are deliberately different: it takes half the film on
  // screen to arm the slide, but the copy only resets once the film is nearly
  // gone. Without that gap a single threshold would flip on and off around the
  // boundary and the text would flicker as you hovered there.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => {
      const seen = e.intersectionRatio;
      setRevealed((prev) => (prev ? seen > 0.15 : seen >= 0.5));
    }, { threshold: [0, 0.15, 0.3, 0.5, 0.7, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reveal = {
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'translateY(0)' : `translateY(${REVEAL_RISE}px)`,
    transition: `opacity ${REVEAL_MS}ms ${REVEAL_EASE}, transform ${REVEAL_MS}ms ${REVEAL_EASE}`,
  };

  // The entrance replays on each approach, and the exit is scroll-linked: as soon as
  // the film begins to leave, the copy accelerates upward so it is gone before
  // the footage is. The two live on separate elements — the inner one owns the
  // reveal's transition, the outer one this transform — because a transition on
  // a scroll-driven transform would smear it a frame behind the wheel.
  const exitRef = useRef(null);
  useEffect(() => {
    const panel = ref.current;
    if (!panel) return;
    const section = panel.closest('[data-film-section]');
    if (!section) return;
    const paint = () => {
      const el = exitRef.current;
      if (!el) return;
      const vh = window.innerHeight || 1;
      const rect = section.getBoundingClientRect();
      // Measured over the copy's own beat rather than over the pin: the film is
      // released partway through, and the copy has to keep climbing past that
      // point to stay ahead of it.
      const beat = Math.min(1, Math.max(0, -rect.top / (COPY_EXIT_BEAT * vh)));
      el.style.transform = `translate3d(0, ${-beat * vh * COPY_EXIT_TRAVEL}px, 0)`;
    };
    paint();
    window.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
    return () => {
      window.removeEventListener('scroll', paint);
      window.removeEventListener('resize', paint);
    };
  }, []);

  // Lazy-play: only the on-screen film runs; others pause to keep it smooth.
  useEffect(() => {
    const v = vidRef.current;
    if (!v || !entered) return;
    if (inView) { const p = v.play(); if (p && p.catch) p.catch(() => { }); }
    else v.pause();
  }, [inView, entered]);
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0a0a0a' }}>
      {entered && (
        // Full-bleed. On viewports wider than 16:9 the crop is vertical, so bias
        // it downward (object-position 72%) to keep the bottom credits row in
        // frame — that trims from the top, where there's no baked-in copy.
        <video ref={vidRef} src={work.src} muted loop playsInline autoPlay preload="auto"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 72%'
          }} />
      )}

      {work.overlay && (
        <div ref={exitRef} style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          padding: 'clamp(22px,3.4vw,54px)', willChange: 'transform'
        }}>

          {work.overlay.kind === 'campaign' ? (
            /* Deck slide 3: logo, campaign line, film line, button — anchored
               on the same 1440x810 canvas the other panels use. */
            <div style={{ position: 'absolute', left: '5.63vw', top: '29.63%', width: '40vw', height: 0, willChange: 'transform' }}>
              <div style={{ position: 'relative', height: 0, ...reveal }}>
              <img src={work.overlay.logo} alt={work.client}
                style={{ position: 'absolute', left: 0, top: 0, height: '4.44vw', width: 'auto', display: 'block',
                  filter: work.overlay.logoWhite ? 'brightness(0) invert(1)' : 'none' }} />
              <div className="deck-type" style={{ position: 'absolute', left: 0, top: '6.46vw', fontFamily: BB, fontSize: '4.61vw', lineHeight: 1, color: '#CBFE20', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {work.overlay.line1}
              </div>
              <div className="deck-type" style={{ position: 'absolute', left: 0, top: '10.28vw', fontFamily: BB, fontSize: '3.16vw', lineHeight: 1, color: '#FFFFFF', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {work.overlay.line2}
              </div>
              <Link to="/work" style={{
                position: 'absolute', left: 0, top: '17.08vw',
                width: '10.14vw', height: '3.13vw', minWidth: 104, minHeight: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#CBFE20', textDecoration: 'none', pointerEvents: 'auto',
              }}>
                <span className="deck-type" style={{ fontFamily: BB, fontSize: '1.02vw', color: '#17191A', textTransform: 'uppercase', lineHeight: 1, whiteSpace: 'nowrap' }}>
                  Explore Campaign
                </span>
              </Link>
              </div>
            </div>
          ) : (
          <>
          {/* LEFT — the campaign lockup, laid out on the deck's slide-4 grid.
              That slide is a 1440x810 canvas and places the group at 81,201, so
              the block is anchored there and every offset inside it is vw —
              the lockup scales as one piece. */}
          <div style={{ position: 'absolute', left: '5.63vw', top: '24.81%', width: '30vw', height: 0, willChange: 'transform' }}>
            <div style={{ position: 'relative', height: 0, ...reveal }}>
            {/* Freeform 12 — 115x41 at the group origin. */}
            <img src={work.overlay.logo} alt={work.client}
              style={{ position: 'absolute', left: 0, top: 0, height: '2.85vw', width: 'auto', objectFit: 'contain', display: 'block' }} />

            {/* TextBox 11 — Bebas Neue Bold 121.6px, #FCFEFF. */}
            <div className="deck-type" style={{ position: 'absolute', left: 0, top: '5.76vw', fontFamily: BB, fontSize: '8.44vw', lineHeight: 1, color: '#FCFEFF', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {work.overlay.line1}
            </div>

            {/* TextBox 9 — Bebas Neue 65.9px, #FCFEFF. */}
            <div className="deck-type" style={{ position: 'absolute', left: 0, top: '13.75vw', fontFamily: BB, fontSize: '4.58vw', lineHeight: 1, color: '#FCFEFF', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {work.overlay.line2}
            </div>

            {/* TextBox 10 — rotated -90 in the deck, so it reads bottom-to-top. */}
            <div className="deck-type" style={{ position: 'absolute', left: '13.91vw', top: '7.55vw', fontFamily: BB, fontSize: '3.58vw', lineHeight: 1, color: '#FFD21F', textTransform: 'uppercase', writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap' }}>
              {work.overlay.accent}
            </div>

            {/* Group 3 — 146x45 button. The deck sets it in #CBFE20; the client
                asked for brand yellow on this panel. */}
            <Link to="/work" style={{
              position: 'absolute', left: 0, top: '21.25vw',
              width: '10.14vw', height: '3.13vw', minWidth: 104, minHeight: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--yellow)', textDecoration: 'none', pointerEvents: 'auto',
            }}>
              <span className="deck-type" style={{ fontFamily: BB, fontSize: '1.02vw', color: '#17191A', textTransform: 'uppercase', lineHeight: 1, whiteSpace: 'nowrap' }}>
                Explore Campaign
              </span>
            </Link>
            </div>
          </div>
          </>
          )}

        </div>
      )}
    </div>
  );
}

function FeaturedWorkStack({ outerRef }) {
  return (
    <section ref={outerRef} style={{ position: 'relative', zIndex: 2, background: '#0a0a0a' }}>
      {FEATURED_WORKS.map((w, i) => (
        // Taller than the screen: the extra height is the beat the film is held
        // for while its copy leaves. The sticky child is what stays put.
        <div key={i} data-film-section data-snap style={{ position: 'relative', height: `${(1 + FILM_HOLD_BEAT) * 100}vh`, background: '#0a0a0a' }}>
          <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#0a0a0a' }}>
            <FeaturedWorkPanel work={w} />
          </div>
        </div>
      ))}
    </section>
  );
}
/* ══════════════════════════════════════════════════════════════════
   3 — SELECTED WORK
   One campaign fills the screen — big block title, project insight
   copy, client / year / role meta. Scroll stacks the next campaign
   over the previous one using the same StackPanel mechanic.
══════════════════════════════════════════════════════════════════ */
const WORK_CAMPAIGNS = [
  {
    index: '01',
    title: 'KING VS.\nKING',
    client: 'Realme India',
    category: 'Commercial Film',
    year: '2024',
    role: 'Creative Direction · Production · Post',
    insight: 'From conceptual brilliance to seamless execution — the King vs. King campaign for Realme India starring Shah Rukh Khan in an iconic double role, showcasing the unparalleled camera and performance of the Realme 14 Pro Series.',
    palette: PALETTES.work1,
    src: '/images/realme/01.jpg',
    images: ['/images/SRK-images/Picture2.jpg', '/images/SRK-images/Picture3.jpg', '/images/SRK-images/Picture4.jpg'],
    mobileSrc: '/images/SRK-images/Picture1.png',
  },
  {
    index: '02',
    title: 'WHAT THE\nHEART WANTS',
    client: 'GIVA Jewellery',
    category: 'Brand Film',
    year: '2024',
    role: 'Creative Direction · Production',
    insight: 'Heartwarming stories crafted with Anushka Sharma for GIVA Jewellery — blending emotional storytelling with festive gifting moments and their lifetime replating service, strengthening GIVA\'s position as the brand "What the Heart Wants."',
    palette: PALETTES.work2,
    src: '/images/giva/1.2.1_1.2.1.jpg',
  },
  {
    index: '03',
    title: "CAVIN'S\nMILKSHAKE",
    client: "CavinKare",
    category: 'Commercials · Curated Showreel',
    year: '2023',
    role: 'End-to-End Production',
    insight: "A contemporary film for CavinKare's milkshake — centred around a mother and child, showcasing it as a tasty go-to made exclusively with milk. Produced in Tamil, Telugu, Hindi, and English.",
    palette: PALETTES.work3,
    src: "/images/Cavin's/Picture12.png",
    images: ["/images/Cavin's/Picture13.png", "/images/Cavin's/Picture14.png", "/images/Cavin's/Picture15.png"],
  },
  {
    index: '04',
    title: 'GOLD.\nGRIT.\nGLORY.',
    client: 'Under Armour India',
    category: 'Athlete Campaign',
    year: '2023',
    role: 'Creative Direction · Production',
    insight: 'A high-octane campaign built around Olympic gold medallist Neeraj Chopra — capturing the discipline, dedication and raw athletic power that defines the Under Armour spirit in India.',
    palette: PALETTES.work4,
    src: '/images/underarmour/1.1.1_1.1.1.jpg',
  },
  {
    index: '05',
    title: 'IMAGINE\nIF',
    client: 'OPPO India',
    category: 'Brand Film',
    year: '2023',
    role: 'Creative Direction · Production · Post',
    insight: 'Shot with SS Rajamouli — OPPO\'s Imagine IF Photography Awards campaign challenged the world\'s greatest creative minds to push the boundaries of imagination, with Bambai Dreams behind every frame.',
    palette: PALETTES.hero,
    src: '/images/SS-Rajamaouli/Picture5.jpg',
  },
];

function WorkCampaignPanel({ campaign }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const isMobile = useIsMobile();

  if (isMobile) {
    const mobileSrc = campaign.mobileSrc || campaign.src;
    return (
      <div ref={ref} style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0a0a0a', overflow: 'hidden' }}>
        {/* Top: text */}
        <div style={{ padding: '20px 20px 16px', flexShrink: 0 }}>
          <Kicker light>{campaign.category}</Kicker>
          <h3 style={{ fontFamily: BB, fontWeight: 700, fontSize: 'clamp(28px,8vw,44px)', color: '#fff', lineHeight: 0.92, margin: '8px 0 10px', textTransform: 'uppercase', whiteSpace: 'pre-line' }}>
            {campaign.title}
          </h3>
          <p style={{ fontFamily: MR, fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: '0 0 12px' }}>
            {campaign.insight}
          </p>
          <div style={{ display: 'flex', gap: 20, marginBottom: 14, flexWrap: 'wrap' }}>
            {[['Client', campaign.client], ['Year', campaign.year]].map(([k, v]) => (
              <div key={k}>
                <span style={{ fontFamily: MR, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 3 }}>{k}</span>
                <span style={{ fontFamily: MR, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{v}</span>
              </div>
            ))}
          </div>
          <Link to="/work" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: MR, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--yellow)', textDecoration: 'none' }}>
            VIEW PROJECT <span style={{ fontSize: 16, lineHeight: 1 }}>→</span>
          </Link>
        </div>
        {/* Bottom: image */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
          <ShowcaseImage src={mobileSrc} palette={campaign.palette} height="100%" />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 1.15fr', background: '#0a0a0a', overflow: 'hidden' }}>
      {/* Left: text */}
      <div style={{ padding: 'clamp(40px,6vh,80px) clamp(24px,4vw,52px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
        {/* Giant ghost index */}
        <span aria-hidden style={{ position: 'absolute', top: '4%', left: 'clamp(16px,3vw,40px)', fontFamily: '"General Sans",sans-serif', fontWeight: 900, fontSize: 'clamp(80px,16vw,220px)', color: 'rgba(255,255,255,0.06)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>{campaign.index}</span>

        <div style={{ position: 'relative', zIndex: 1, maxHeight: '72vh', overflow: 'hidden' }}>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
            <Kicker light>{campaign.category}</Kicker>
          </motion.div>

          <motion.h3 initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: DURATION, ease: EASE, delay: 0.08 }}
            style={{ fontFamily: BB, fontWeight: 700, fontSize: 'clamp(44px,7vw,96px)', color: '#fff', lineHeight: 0.92, margin: '12px 0 20px', textTransform: 'uppercase', whiteSpace: 'pre-line' }}>
            {campaign.title}
          </motion.h3>

          <motion.p initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: DURATION, ease: EASE, delay: 0.18 }}
            style={{ fontFamily: MR, fontWeight: 400, fontSize: 'clamp(13px,1.2vw,14px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, maxWidth: 380, margin: '0 0 28px' }}>
            {campaign.insight}
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: DURATION, delay: 0.28 }}
            style={{ display: 'flex', gap: 'clamp(16px,2.5vw,32px)', marginBottom: 36, flexWrap: 'wrap' }}>
            {[['Client', campaign.client], ['Year', campaign.year], ['Role', campaign.role]].map(([k, v]) => (
              <div key={k}>
                <span style={{ fontFamily: MR, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 4 }}>{k}</span>
                <span style={{ fontFamily: MR, fontSize: 'clamp(11px,1.2vw,13px)', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{v}</span>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -8 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: DURATION, delay: 0.35 }}>
            <Link to="/work" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: MR, fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--yellow)', textDecoration: 'none' }}>
              VIEW PROJECT <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Right: visual */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {campaign.images ? (
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gridTemplateColumns: '1fr 1fr', height: '100%', gap: 3 }}>
            <div style={{ gridRow: '1 / 3', position: 'relative', overflow: 'hidden' }}>
              <ShowcaseImage src={campaign.images[0]} palette={campaign.palette} height="100%" />
            </div>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <ShowcaseImage src={campaign.images[1]} palette={campaign.palette} height="100%" />
            </div>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <ShowcaseImage src={campaign.images[2]} palette={campaign.palette} height="100%" />
            </div>
          </div>
        ) : (
          <ShowcaseImage src={campaign.src} palette={campaign.palette} height="100%" label={campaign.category} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0) 40%)' }} />
      </div>
    </div>
  );
}

// Six featured reels — Vimeo (thumbnail poster + background-mode video on hover).
// Titles are the films' own, as they read on vimeo.com/bambaidreams.
const WORK_REELS = [
  { index: '01', title: 'realme 14 Series', sub: 'realme × Shah Rukh Khan', id: '1045916243', h: '0f88637370' },
  { index: '02', title: 'GIVA', sub: 'GIVA × Kriti Sanon', id: '1194918051', h: '76643967c4' },
  { index: '03', title: 'Zindagi Ke Real Heroes', sub: 'OPPO F29 Series 5G · The Durable Champion', id: '1068788543', h: '9a57c4fc4e' },
  { index: '04', title: 'Velocity Elite', sub: 'Under Armour × Vedarth Thapa', id: '1190896661', h: '260b0b94e6' },
  { index: '05', title: 'Velocity Elite', sub: 'Under Armour × Renee Noronha', id: '1183020138', h: '0cb42d51f0' },
  // zoom: this one is a ~2.2:1 film delivered letterboxed inside a 16:9 frame,
  // so it plays with black bands over roughly 9% of the height top and bottom.
  // 1.25 scales the picture past them and fills the tile like the rest.
  { index: '06', title: 'Imagine IF', sub: 'OPPO × SS Rajamouli · Photography Awards', id: '947795645', h: '85a5df077a', zoom: 1.25 },
];

// 16:9 — the ratio every one of these films is mastered at, so each fills its
// tile exactly: no letterbox bands, no crop, and all six identical. (The deck
// drew 407x265 tiles, but that is 1.54 against the films' 1.78 and the mismatch
// is what put black bands on some of them.)
const TILE_AR = 16 / 9;
const TILE_ZOOM = 1.04;      // shared overscan, so no tile shows a seam or a stray edge

// Grid tile: at rest it is just the film's thumbnail. The video mounts on the
// first hover, plays for as long as the pointer stays, and fades back to the
// thumbnail on the way out - so nothing streams until someone asks for it.
function WorkTile({ reel, active, onEnter, onLeave }) {
  const tileRef = useRef(null);
  const iframeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });   // the film's true pixel size
  const { inView, entered } = useNearViewport(tileRef);
  const lb = useLightbox();
  const aspect = dims.w && dims.h ? dims.w / dims.h : 16 / 9;

  useEffect(() => {
    const onMsg = (e) => {
      const win = iframeRef.current && iframeRef.current.contentWindow;
      if (!win || e.source !== win) return;                 // only our own player
      let d; try { d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch { return; }
      if (!d) return;
      if (d.event === 'ready') {
        win.postMessage(JSON.stringify({ method: 'getVideoWidth' }), '*');
        win.postMessage(JSON.stringify({ method: 'getVideoHeight' }), '*');
      }
      if (d.method === 'getVideoWidth') setDims((p) => ({ ...p, w: d.value }));
      if (d.method === 'getVideoHeight') setDims((p) => ({ ...p, h: d.value }));
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // A background embed never emits 'ready' - that event only goes to embeds that
  // opt into the JS API - so the handshake above can't start on its own. Ask for
  // the size once the frame loads and keep asking until the player answers.
  // Without the true frame size the tile assumes 16:9, and the player then
  // letterboxes anything wider inside it: that is where the black bands on some
  // tiles came from.
  useEffect(() => {
    if (!loaded || (dims.w && dims.h)) return;
    const ask = () => {
      const win = iframeRef.current && iframeRef.current.contentWindow;
      if (!win) return;
      win.postMessage(JSON.stringify({ method: 'getVideoWidth' }), '*');
      win.postMessage(JSON.stringify({ method: 'getVideoHeight' }), '*');
    };
    ask();
    let tries = 0;
    const t = setInterval(() => { if (++tries > 12) clearInterval(t); else ask(); }, 400);
    return () => clearInterval(t);
  }, [loaded, dims.w, dims.h]);

  // Cover the tile in plain percentages of the tile box rather than container
  // query units: cqw/cqh resolve to zero wherever the container's own size is
  // still being worked out, which left the frame short of the tile and read as a
  // letterbox band. Percentages against the tile resolve the same everywhere, so
  // all six films end up at identical rendered dimensions.
  const zoom = TILE_ZOOM * (reel.zoom || 1);
  const cover = aspect >= TILE_AR
    ? { width: `${(100 * zoom * aspect / TILE_AR).toFixed(2)}%`, height: `${(100 * zoom).toFixed(2)}%` }
    : { width: `${(100 * zoom).toFixed(2)}%`, height: `${(100 * zoom * TILE_AR / aspect).toFixed(2)}%` };

  // At rest the tile runs the film's first few seconds on a loop — a GIF in
  // everything but format. Hovering lets the same player run on into the film.
  useVimeoLoop(iframeRef, { ready: loaded && inView, full: active });

  // Scrolled away entirely: stop, so off-screen tiles aren't streaming.
  useEffect(() => {
    if (inView) return;
    const win = iframeRef.current && iframeRef.current.contentWindow;
    if (win) win.postMessage(JSON.stringify({ method: 'pause' }), '*');
  }, [inView]);

  const openPlayer = () => {
    const list = WORK_REELS.map((r) => ({
      id: r.id, title: r.title, client: r.sub,
      embed_url: `https://vimeo.com/${r.id}?h=${r.h}`,
    }));
    lb.open(list, Math.max(0, list.findIndex((v) => v.id === reel.id)));
  };

  return (
    <div ref={tileRef} onMouseLeave={onLeave} onClick={openPlayer}
      onMouseEnter={onEnter}
      style={{
        // height-driven: the row hands down a height, 16:9 gives the width
        height: '100%', aspectRatio: '16 / 9', minWidth: 0, flexShrink: 1,
        outline: active ? '1px solid rgba(255,255,255,0.9)' : '1px solid transparent',
        boxShadow: active ? '0 0 32px rgba(255,255,255,0.28)' : '0 0 0 rgba(255,255,255,0)',
        transition: 'box-shadow 0.35s ease, outline-color 0.35s ease',
        position: 'relative', overflow: 'hidden', borderRadius: 14, cursor: 'pointer', background: '#111',
        // the frame inside is transformed and oversized; isolating the tile keeps
        // it on the same compositing layer so the rounded corners actually clip it
        isolation: 'isolate',
      }}>
      {/* thumbnail — the tile's resting state, and what the video fades back to */}
      <img src={`https://vumbnail.com/${reel.id}.jpg`} alt={reel.title}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${(zoom * (active ? 1 : 1.04)).toFixed(3)})`,
          transition: 'transform 0.6s ease'
        }} />

      {/* video — mounts as the tile nears the viewport and becomes the tile's
          resting state: a looping 3s teaser that runs on into the film on hover.
          The thumbnail underneath covers the gap until it has buffered. */}
      {entered && (
        <iframe ref={iframeRef} title={reel.title} loading="lazy"
          onLoad={() => setLoaded(true)}
          src={`https://player.vimeo.com/video/${reel.id}?h=${reel.h}&background=1&autoplay=1&muted=1&loop=1`}
          style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: cover.width, height: cover.height,
            border: 'none', pointerEvents: 'none',
            opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease'
          }}
          allow="autoplay; fullscreen; picture-in-picture" />
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.15) 48%, transparent 74%)' }} />

      {/* name + one-liner — only visible on hover */}
      {active && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 'clamp(16px,1.8vw,28px)', zIndex: 2 }}>
          <h3 style={{
            margin: 0, fontFamily: BB, fontWeight: 700, textTransform: 'uppercase', color: '#fff',
            fontSize: 'clamp(20px,2vw,36px)', lineHeight: 0.98, letterSpacing: '-0.01em'
          }}>{reel.title}</h3>
          <p style={{ margin: '8px 0 0', fontFamily: MR, fontSize: 'clamp(12px,0.95vw,15px)', color: 'rgba(255,255,255,0.78)', letterSpacing: '0.02em' }}>{reel.sub}</p>
        </div>
      )}
    </div>
  );
}

function MobileWorkCard({ reel }) {
  return (
    <div style={{ position: 'relative', height: '48vh', overflow: 'hidden' }}>
      <img src={`https://vumbnail.com/${reel.id}.jpg`} alt={reel.title}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '20px' }}>
        <span style={{ fontFamily: MR, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.7)' }}>{reel.index}</span>
        <h3 style={{ margin: '6px 0 6px', fontFamily: BB, fontWeight: 700, textTransform: 'uppercase', color: '#fff', fontSize: 'clamp(22px,6.5vw,34px)', lineHeight: 0.98 }}>{reel.title}</h3>
        <p style={{ margin: 0, fontFamily: MR, fontSize: 12, color: 'rgba(255,255,255,0.72)' }}>{reel.sub}</p>
      </div>
    </div>
  );
}

// Exported so /work can show the identical section rather than a second copy
// that would drift out of step with this one.
export function WorkShowcase({ outerRef }) {
  const isMobile = useIsMobile();
  const [titleHover, setTitleHover] = useState(false);
  const [activeId, setActiveId] = useState(null);   // hovered reel — shared across all tiles

  return (
    // Desktop: exactly one screen, so both rows of tiles are on screen together.
    // The snap's next stop is the section after this one, so anything that does
    // not fit here can never be scrolled to.
    <section ref={outerRef} data-snap style={{
      position: 'relative', zIndex: 3, background: '#0a0a0a',
      ...(isMobile ? null : { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }),
    }}>
      {/* Section header */}
      {/* top pad clears the fixed navbar — it is transparent here, so without it
          the heading rides up underneath the social links and the centre mark */}
      <div style={{ flexShrink: 0, padding: 'calc(var(--nav-h) - clamp(8px,1.8vh,24px)) clamp(20px,4vw,56px) clamp(14px,2.2vh,24px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
          <div style={{ minWidth: 0 }}>
            {/* Deck slide 5: heading 87.1px, sub 25px on the gold gradient. */}
            <h2 onMouseEnter={() => setTitleHover(true)} onMouseLeave={() => setTitleHover(false)}
              style={{
                fontFamily: BB, fontWeight: 900, fontSize: 'clamp(28px,4.2vw,60px)', margin: '10px 0 0', lineHeight: 0.88, textTransform: 'uppercase', whiteSpace: isMobile ? 'normal' : 'nowrap', letterSpacing: '-0.02em', cursor: 'default',
                color: titleHover ? 'var(--yellow)' : '#fff',
                WebkitTextStroke: titleHover ? '1px var(--yellow)' : '1px #fff',
                transition: 'color 0.3s ease, -webkit-text-stroke-color 0.3s ease'
              }}>
              FEATURED WORK
            </h2>
            <p style={{
              margin: '8px 0 0', fontFamily: BB, fontSize: 'clamp(14px,1.74vw,25px)', lineHeight: 1.1,
              textTransform: 'uppercase', backgroundImage: HERO_GOLD,
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent', color: 'transparent',
            }}>
              Films that travelled further than the brief.
            </p>
          </div>
          {/* Group 11 in the deck — 125x39, #FED758 with #17191A copy. */}
          <Link to="/work" style={{
            flexShrink: 0, alignSelf: 'flex-end', marginBottom: 8,
            width: 'clamp(104px,8.68vw,125px)', height: 'clamp(32px,2.71vw,39px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#FED758', textDecoration: 'none',
          }}>
            <span style={{ fontFamily: BB, fontSize: 'clamp(11px,0.88vw,13px)', color: '#17191A', textTransform: 'uppercase', lineHeight: 1, whiteSpace: 'nowrap' }}>
              View Everything
            </span>
          </Link>
        </div>
      </div>

      {/* Two rows, each a 3-tile widen-on-hover accordion (mobile: stacked cards) */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {WORK_REELS.map((r) => <MobileWorkCard key={r.index} reel={r} />)}
        </div>
      ) : (
        // Two rows of three, sized by the HEIGHT left over rather than by width.
        // Each tile is height:100% of its row with a 16:9 ratio, so its width
        // follows — which means the tiles are always the largest that genuinely
        // fit, and the bottom row can never fall off the screen. Capping the
        // width instead (the previous approach) meant guessing a vh number that
        // had to hold at every aspect at once, and it could not.
        <div onMouseLeave={() => setActiveId(null)}
          style={{
            flex: '1 1 auto', minHeight: 0,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            rowGap: 'clamp(28px,7vh,90px)',
            padding: 'clamp(10px,1.6vh,24px) clamp(12px,1.5vw,28px) clamp(14px,2.2vh,32px)',
          }}>
          {[0, 1].map((row) => (
            <div key={row} style={{
              flex: '1 1 0', minHeight: 0,
              display: 'flex', justifyContent: 'center',
              gap: 'clamp(14px,1.9vw,30px)',
            }}>
              {WORK_REELS.slice(row * 3, row * 3 + 3).map((r) => (
                <WorkTile key={r.index} reel={r}
                  active={activeId === r.index}
                  onEnter={() => setActiveId(r.index)}
                  onLeave={() => setActiveId((cur) => (cur === r.index ? null : cur))} />
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   4 — BRANDS MARQUEE
   Infinite auto-scroll logo strip. Replace the placeholder SVGs with
   real client logos when assets are ready — same slot, same count.
══════════════════════════════════════════════════════════════════ */
const BRANDS = [
  { src: logoRealme, alt: 'Realme' },
  { src: logoGiva, alt: 'GIVA' },
  { src: logoOppo, alt: 'OPPO' },
  { src: logoNoise, alt: 'Noise' },
  { src: logoTcl, alt: 'TCL' },
  { src: logoGomechanic, alt: 'GoMechanic' },
  { src: logoPowerlook, alt: 'Powerlook' },
  { src: logoColoros, alt: 'ColorOS' },
  { src: logoUnderarmour, alt: 'Under Armour' },
  { src: logoPizzahut, alt: 'Pizza Hut' },
  { src: logoCavins, alt: 'Cavin\'s' },
  { src: logoShapoorji, alt: 'Shapoorji' },
];

/* OUR CLIENTS — exact Spector-style 3D rotator.
   Container: perspective 1700px, cursor grab. Ring: 0×0 preserve-3d pivot at centre.
   6 raw logo imgs at rotateY(i·60°) translateZ(393px). Auto-spins, drag-to-spin,
   arrow buttons step ±60°, motion blur proportional to spin velocity. */
const RING_BRANDS = [
  { src: logoRealme, alt: 'Realme' },
  { src: logoGiva, alt: 'GIVA' },
  { src: logoOppo, alt: 'OPPO' },
  { src: logoUnderarmour, alt: 'Under Armour' },
  { src: logoNoise, alt: 'Noise' },
  { src: logoTcl, alt: 'TCL' },
  { src: logoGomechanic, alt: 'GoMechanic' },
  { src: logoPowerlook, alt: 'Powerlook' },
  { src: logoColoros, alt: 'ColorOS' },
  { src: logoPizzahut, alt: 'Pizza Hut' },
  { src: logoCavins, alt: "Cavin's" },
  { src: logoShapoorji, alt: 'Shapoorji' },
];

// Client testimonials — Arpeggio-style cards in a continuous horizontal marquee.
const TESTIMONIALS = [
  { quote: 'Bambai Dreams turned our campaign into something truly cinematic. The craft and execution were flawless from start to finish.', name: 'Brand Team', role: 'Marketing Lead', company: 'Realme India' },
  { quote: 'A production-first team that genuinely understands storytelling. They brought our brand film to life exactly as we imagined.', name: 'Creative Team', role: 'Brand Manager', company: 'GIVA' },
  { quote: 'Fast, collaborative and endlessly creative. Every frame felt intentional — the result exceeded our expectations.', name: 'Campaign Team', role: 'Head of Content', company: 'Under Armour' },
  { quote: 'Their attention to detail and ability to translate our vision into film made all the difference to the campaign.', name: 'Marketing Team', role: 'Brand Lead', company: 'OPPO India' },
  { quote: 'Working with the team was a game-changer. They elevated our brand with visuals that felt premium and effortless.', name: 'Digital Team', role: 'Growth Manager', company: 'Noise' },
  { quote: 'Responsive, sharp and genuinely creative. The films were delivered on time and captured exactly what we envisioned.', name: 'Brand Team', role: 'Category Head', company: 'TCL' },
];

// One logo on the ring. Blur/opacity derive from its angle relative to the front:
// front-facing = sharp & black, receding = soft glassy blur (like the reference).
// Every logo gets the same slot, but each PNG carries its own padding and
// proportions, so they render at wildly different optical sizes. Measure the
// artwork's real ink box once it loads and normalise on area, so a wide wordmark
// and a compact symbol carry the same visual weight — and re-centre on the ink
// rather than on the file's canvas.
// Every logo is drawn to the same ink HEIGHT. Matching area instead — which is
// what this did before — leaves a wide wordmark short and a compact symbol tall,
// so the row never looks level.
const RING_INK_H = 26;             // shared ink height in px at desktop size
const RING_INK_MAX_W = 250;        // ...unless a very wide wordmark would run past this

function RingLogo({ brand, i, step, radius, rotation, isMobile }) {
  const boxW = isMobile ? 116 : 165;
  const boxH = isMobile ? 52 : 78;
  const [fit, setFit] = useState(null);

  const measure = (img) => {
    const W = img.naturalWidth, H = img.naturalHeight;
    if (!W || !H) return;
    const N = 96;
    const c = document.createElement('canvas');
    c.width = N; c.height = Math.max(1, Math.round((N * H) / W));
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, c.width, c.height);
    let d;
    try { d = ctx.getImageData(0, 0, c.width, c.height).data; } catch { return; }   // tainted canvas
    let minX = c.width, minY = c.height, maxX = -1, maxY = -1;
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        if (d[(y * c.width + x) * 4 + 3] > 24) {
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < 0) return;                                    // fully transparent
    const px = W / c.width, py = H / c.height;
    const inkW = (maxX - minX + 1) * px, inkH = (maxY - minY + 1) * py;
    const inkCx = ((minX + maxX + 1) / 2) * px, inkCy = ((minY + maxY + 1) / 2) * py;
    const k = Math.min(boxW / W, boxH / H);                  // object-fit: contain
    const renderedW = inkW * k, renderedH = inkH * k;
    const targetH = RING_INK_H * (isMobile ? 0.68 : 1);
    const scale = Math.min(
      targetH / renderedH,                                   // same ink height for all
      (RING_INK_MAX_W * (isMobile ? 0.68 : 1)) / renderedW,   // cap the widest wordmarks
    );
    setFit({
      s: +scale.toFixed(3),
      dx: +((inkCx - W / 2) * k).toFixed(1),
      dy: +((inkCy - H / 2) * k).toFixed(1),
    });
  };
  const depth = useTransform(rotation, (r) => {
    const a = (((r + i * step) % 360) + 360) % 360;
    return Math.min(a, 360 - a) / 180;         // 0 = front · 1 = back
  });
  // Stay perfectly sharp across the whole front window; only blur once clearly receding.
  const blurMV = useTransform(depth, [0, 0.16, 0.45, 1], [0, 0, 4, 7]);
  const opacity = useTransform(depth, [0, 0.16, 0.45, 1], [1, 1, 0.65, 0.4]);
  const filter = useMotionTemplate`grayscale(100%) contrast(1.15) blur(${blurMV}px)`;

  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, transformOrigin: '0 0',
      transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <motion.img src={brand.src} alt={brand.alt} draggable={false}
        onLoad={(e) => measure(e.currentTarget)}
        style={{
          height: boxH, width: boxW, objectFit: 'contain',
          // right-to-left: centre on the ink, scale to the shared optical size,
          // then sit the whole thing on the ring's pivot.
          transform: fit
            ? `translate(-50%, -50%) scale(${fit.s}) translate(${-fit.dx}px, ${-fit.dy}px)`
            : 'translate(-50%, -50%)',
          filter, opacity, willChange: 'filter'
        }} />
    </div>
  );
}

function ClientsCarousel() {
  const isMobile = useIsMobile();
  const N = RING_BRANDS.length;              // 12
  const step = 360 / N;                      // 30°
  // The ring's apparent width is about twice its radius, so 0.25vw of radius
  // makes it span ~50% of the screen. Clamped so it stays sane at the extremes.
  const [vw, setVw] = useState(() => (typeof window === 'undefined' ? 1440 : window.innerWidth));
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const radius = isMobile ? 240 : Math.round(Math.min(650, Math.max(260, vw * 0.25)));
  const rotation = useMotionValue(0);
  const drag = useRef({ on: false, lastX: 0, moved: false });
  const tweenRef = useRef(null);
  const hoverRef = useRef(false);

  // Slow, continuous auto-spin (pauses on hover / drag / tween)
  useAnimationFrame((_, delta) => {
    if (!drag.current.on && !tweenRef.current && !hoverRef.current) {
      rotation.set(rotation.get() - (delta / 1000) * 7); // ~7°/s
    }
  });

  const stopTween = () => { if (tweenRef.current) { tweenRef.current.stop(); tweenRef.current = null; } };

  const onDown = (e) => { stopTween(); drag.current = { on: true, lastX: e.clientX, moved: false }; e.currentTarget.setPointerCapture(e.pointerId); };
  const onMove = (e) => {
    if (!drag.current.on) return;
    const dx = e.clientX - drag.current.lastX;
    drag.current.lastX = e.clientX;
    if (dx !== 0) drag.current.moved = true;
    rotation.set(rotation.get() + dx * 0.35);
  };
  const onUp = () => { drag.current.on = false; };

  return (
    <div>
      {/* 3D stage */}
      <div
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        onMouseEnter={() => { hoverRef.current = true; }}
        onMouseLeave={() => { hoverRef.current = false; }}
        style={{
          perspective: 1600, width: '50vw', height: 'clamp(110px,16vh,170px)', margin: '0 auto',
          cursor: drag.current.on ? 'grabbing' : 'grab', touchAction: 'pan-y',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
        <motion.div style={{ position: 'relative', width: 0, height: 0, transformStyle: 'preserve-3d', rotateY: rotation }}>
          {RING_BRANDS.map((b, i) => (
            <RingLogo key={i} brand={b} i={i} step={step} radius={radius} rotation={rotation} isMobile={isMobile} />
          ))}
        </motion.div>
      </div>

    </div>
  );
}

// Card geometry mirrors the reference: 280×500, #f6f6f6, 24px padding, no radius.
function TestimonialCard({ t }) {
  const initials = t.company.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <li style={{
      listStyle: 'none', flex: '0 0 auto', width: 430, height: '100%',
      background: 'rgb(246,246,246)', padding: 'clamp(20px,2.6vh,32px)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div>
        {/* quote glyph — 24px block, like the reference */}
        <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="rgb(180,180,185)" style={{ display: 'block', marginBottom: 18 }}>
          <path d="M0 13.6C0 8.2 3.4 3.4 8.6 1l1.2 2.3C6.3 5 4.4 7.4 4.2 10.2c.3-.1.8-.2 1.3-.2 2.5 0 4.4 1.9 4.4 4.4S8 19 5.3 19C2.2 19 0 16.7 0 13.6zm13.9 0c0-5.4 3.4-10.2 8.6-12.6L23.7 3c-3.5 1.7-5.4 4.1-5.6 6.9.3-.1.8-.2 1.3-.2 2.5 0 4.4 1.9 4.4 4.4S21.9 19 19.2 19c-3.1 0-5.3-2.3-5.3-5.4z" />
        </svg>
        {/* holds 19px on a normal window and only gives ground on a short one,
            so the quote never outgrows a card that has to fit the fold */}
        <p style={{ margin: 0, fontFamily: MR, fontWeight: 500, fontSize: 'clamp(15px,2.2vh,19px)', lineHeight: 1.4, color: 'rgb(51,51,54)' }}>
          {t.quote}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          width: 32, height: 32, borderRadius: '50%', background: '#111', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: MR, fontWeight: 600, fontSize: 12, flexShrink: 0
        }}>{initials}</span>
        <div>
          <p style={{ margin: 0, fontFamily: MR, fontWeight: 500, fontSize: 21, lineHeight: 1.3, color: 'rgb(51,51,54)' }}>{t.name}</p>
          <p style={{ margin: 0, fontFamily: MR, fontWeight: 500, fontSize: 17, lineHeight: 1.2, color: 'rgb(51,51,54)' }}>{t.role}</p>
          <p style={{ margin: 0, fontFamily: MR, fontWeight: 400, fontSize: 15, lineHeight: 1.2, color: 'rgb(111,111,117)' }}>{t.company}</p>
        </div>
      </div>
    </li>
  );
}

function BrandsMarquee() {
  return (
    // everything above this is #0a0a0a and everything below stays light, so this
    // is where the always-transparent navbar has to switch its lettering to dark
    // Exactly one screen: the heading, the ring and the cards are all sized off
    // the viewport, and the card row takes whatever height is left over, so the
    // whole section lands inside the fold at any window size.
    <div data-nav-light data-snap style={{
      position: 'relative', zIndex: 3, background: '#fff', overflow: 'hidden',
      height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      // the top pad clears the fixed navbar, which is transparent here - without
      // it the centred heading rides up under the centre logo
      padding: 'calc(var(--nav-h) + clamp(8px,1.5vh,20px)) clamp(20px,4vw,72px) clamp(24px,4vh,56px)'
    }}>

      {/* Heading */}
      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <h2 style={{
          margin: 0, fontFamily: BB, fontWeight: 900, textTransform: 'uppercase', color: '#111',
          fontSize: 'clamp(26px,3.2vw,48px)', lineHeight: 0.9, letterSpacing: '-0.02em'
        }}>TRUSTED BY</h2>
      </div>

      {/* 3D logo rotator */}
      <div style={{ marginTop: 'clamp(10px,2.4vh,28px)', flexShrink: 0 }}>
        <ClientsCarousel />
      </div>

      {/* Testimonials — a fixed feature card on the left, then a continuous
          horizontal marquee of quote cards (Arpeggio pattern). The track holds
          two copies of the list so the loop is seamless. */}
      <div style={{
        marginTop: 'clamp(14px,3vh,40px)', display: 'flex', gap: 24, alignItems: 'stretch',
        flex: '1 1 auto', minHeight: 0,   // absorbs the leftover height
      }}>

        <div className="tm-viewport" style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
          <ul className="tm-track" style={{ display: 'flex', gap: 24, margin: 0, padding: 0, width: 'max-content', height: '100%' }}>
            {TESTIMONIALS.map((t, i) => <TestimonialCard key={`a${i}`} t={t} />)}
            {TESTIMONIALS.map((t, i) => <TestimonialCard key={`b${i}`} t={t} />)}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   5 — SERVICES
   Full agency + production house scope. Giant block uppercase
   wordmark with scroll-velocity motion blur. Four service pillars
   (Agency / Production / Post / Digital) fold onto each other.
══════════════════════════════════════════════════════════════════ */
const SERVICE_CATEGORIES = [
  {
    index: '01', label: 'Visual Storytelling', title: 'VISUAL\nSTORYTELLING',
    desc: 'We capture the essence of your brand\'s soul and share it with your audience — igniting their passion through cinematic craft and purposeful storytelling.',
    bullets: [
      'Commercial Films',
      'Music Videos',
      'Documentaries',
      'Lifestyle Photography',
      'Product Photography',
    ],
    image: imgVisualStorytelling,
    video: { id: '1190896661', h: '260b0b94e6' },
  },
  {
    index: '02', label: 'Video Production', title: 'VIDEO\nPRODUCTION',
    desc: 'We specialise in showcasing your brand or product as the hero of the film. From large-scale brand films to fast-moving digital content — produced with precision, passion, and purpose.',
    bullets: [
      'Brand & Commercial Films',
      'Large-Scale Production',
      'On-Location & Studio Shoots',
      'Top-Tier Directors & Battle-Tested Crew',
      'End-to-End Execution',
    ],
    image: 'https://images.pexels.com/photos/2510428/pexels-photo-2510428.jpeg?auto=compress&cs=tinysrgb&w=600',
    video: { id: '1011387371', h: '7f621ac62a' },
  },
  {
    index: '03', label: 'Talent Representation', title: 'TALENT\nREPRESENTATION',
    desc: 'We connect the right faces to the right brands — managing relationships, deals, and creative alignment so talent and campaign speak the same language.',
    bullets: [
      'Celebrity Management',
      'Influencer Management',
      'Brand–Talent Matchmaking',
      'Campaign Integration & Briefing',
      'Long-Term Partnership Strategy',
    ],
    image: imgTalentRep,
    video: { id: '589343405', h: 'd4b410ce86' },
  },
  {
    index: '04', label: 'Creative Development', title: 'CREATIVE\nDEVELOPMENT',
    desc: 'When brands and agencies need a partner at the concept stage, we step in — bringing ideas to life from first brief to final frame.',
    bullets: [
      'Concept & Script Development',
      'Art Direction & Visual Identity',
      'Campaign Strategy & Rollout',
      'Social-First Content Planning',
      'Multi-Platform Asset Delivery',
    ],
    image: imgCreativeDev,
    video: { id: '1003135669', h: 'f447dd5f96' },
  },
];

function ServiceCategoryRow({ cat }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const isMobile = useIsMobile();
  const [videoReady, setVideoReady] = useState(false);
  const mediaRef = useRef(null);
  const media = useNearViewport(mediaRef);
  const svcIframeRef = useRef(null);

  // Pause the service video when it scrolls off-screen; play when back in view.
  useEffect(() => {
    const win = svcIframeRef.current && svcIframeRef.current.contentWindow;
    if (!win) return;
    win.postMessage(JSON.stringify({ method: media.inView ? 'play' : 'pause' }), '*');
  }, [media.inView]);

  // Slide-up-from-bottom reveal, staggered top→down.
  const EASE_OUT = [0.16, 1, 0.3, 1];
  const rise = (i) => ({
    initial: { opacity: 0, y: 60 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.75, ease: EASE_OUT, delay: 0.06 * i },
  });

  // Prefer the video's own thumbnail as the poster; the category image is the fallback (no video).
  const posterSrc = cat.video ? `https://vumbnail.com/${cat.video.id}.jpg` : cat.image;
  const image = (
    <motion.div
      initial={{ opacity: 0, clipPath: 'inset(14% 0% 0% 0%)' }}
      animate={inView ? { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' } : {}}
      transition={{ duration: 0.95, ease: EASE_OUT, delay: 0.15 }}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', containerType: 'size', background: '#0a0a0a' }}>
      <div ref={mediaRef} style={{ position: 'absolute', inset: 0 }}>
        {/* Poster — shown instantly so there's never a blank/loading gap; video fades over it once ready */}
        {posterSrc && (
          <img src={posterSrc} alt={cat.title.replace('\n', ' ')}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
        {!posterSrc && <div style={{ position: 'absolute', inset: 0, background: 'rgba(17,17,17,0.04)' }} />}

        {cat.video && media.entered && (
          // Vimeo background video — mounts only near the viewport; covers via container units; fades in on load
          <iframe ref={svcIframeRef} title={cat.title.replace('\n', ' ')} loading="lazy"
            onLoad={() => setVideoReady(true)}
            src={`https://player.vimeo.com/video/${cat.video.id}?h=${cat.video.h}&background=1&autoplay=1&muted=1&loop=1${cat.video.start ? `#t=${cat.video.start}s` : ''}`}
            style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              width: 'max(100cqw, 177.78cqh)', height: 'max(56.25cqw, 100cqh)', border: 'none', pointerEvents: 'none',
              opacity: videoReady ? 1 : 0, transition: 'opacity 0.5s ease'
            }}
            allow="autoplay; fullscreen; picture-in-picture" />
        )}
      </div>
    </motion.div>
  );

  const text = (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(24px,3.5vw,52px)' }}>
      <motion.div {...rise(0)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: MR, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.45)', fontWeight: 600 }}>{cat.label}</span>
          <span style={{ width: 16, height: 2, background: 'var(--yellow)', display: 'inline-block' }} />
        </div>
        <span style={{ fontFamily: MR, fontSize: 11, color: 'rgba(17,17,17,0.25)' }}>/{cat.index}</span>
      </motion.div>

      <motion.h3 {...rise(1)}
        style={{ fontFamily: BB, fontWeight: 700, fontSize: 'clamp(26px,2vw,42px)', color: 'var(--ink)', margin: '0 0 14px', textTransform: 'uppercase', lineHeight: 0.92, whiteSpace: 'pre-line' }}>
        {cat.title}
      </motion.h3>
      <motion.p {...rise(2)}
        style={{ fontFamily: MR, fontWeight: 400, fontSize: 'clamp(12px,0.8vw,15px)', color: 'rgba(17,17,17,0.6)', lineHeight: 1.7, maxWidth: 340, marginBottom: 20 }}>{cat.desc}</motion.p>
      {cat.bullets.map((b, bi) => (
        <motion.div key={b} {...rise(3 + bi)}
          style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(17,17,17,0.07)' }}>
          <span style={{ color: 'var(--yellow)', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>+</span>
          <span style={{ fontFamily: MR, fontWeight: 500, fontSize: 'clamp(11px,0.72vw,14px)', color: 'rgba(17,17,17,0.75)' }}>{b}</span>
        </motion.div>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <div ref={ref} style={{ height: '100%', display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(17,17,17,0.12)' }}>
        {text}
        <div style={{ flex: 1, minHeight: '42vh' }}>{image}</div>
      </div>
    );
  }

  // Desktop: text left 60%, film fills the right 40% edge-to-edge, full row height.
  return (
    <div ref={ref} style={{ height: '100%', display: 'grid', gridTemplateColumns: '60fr 40fr', borderTop: '1px solid rgba(17,17,17,0.12)' }}>
      {text}
      {image}
    </div>
  );
}

/* RADIAL REVEAL (expanding circular clip-path mask).
   The white Services layer is revealed through a round dome that grows from the
   bottom edge. Plays on its own clock as the section arrives — deliberately not
   scrubbed against scroll, so there is never a frame where it sits at 0% and
   the screen is simply black. */
const REVEAL_SECONDS = 1;

function ServicesReveal() {
  const wrapRef = useRef(null);
  const maskRef = useRef(null);
  const isMobile = useIsMobile();

  // The reveal plays itself, once, as the section arrives — it is NOT tied to
  // scroll position. Scrubbing it against scroll is what put an empty black
  // screen on the page: at the top of the stage the circle sat at 0% and simply
  // stayed there until the reader moved, so stopping anywhere early meant
  // staring at nothing. Driven by time instead, the circle is always already
  // opening by the time the section is on screen; there is no frame to land on
  // where nothing is happening.
  useEffect(() => {
    if (isMobile) return;   // radial reveal is desktop-only
    const ctx = gsap.context(() => {
      gsap.fromTo(maskRef.current,
        { clipPath: 'circle(0% at 50% 100%)' },   // anchored at bottom-centre → dome rises from the bottom edge
        {
          clipPath: 'circle(115% at 50% 100%)',   // grows until the half-circle swallows the whole viewport
          duration: REVEAL_SECONDS,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: wrapRef.current,
            // fires while the section is still coming up, so the dome is
            // already growing by the time it fills the screen
            start: 'top 70%',
            once: true,
          },
        });
    });
    return () => ctx.revert();
  }, [isMobile]);


  // ── Mobile: plain white section, no dome / no dark stage ──
  if (isMobile) {
    return (
      <div style={{ background: '#fff', padding: '64px 20px 48px' }}>
        <h2 style={{ margin: 0, fontFamily: BB, fontWeight: 900, fontSize: 'clamp(52px,17vw,88px)', color: 'var(--ink)', lineHeight: 0.9, letterSpacing: '-0.03em' }}>
          what we do
        </h2>
        <p style={{ margin: '20px 0 0', fontFamily: MR, fontWeight: 700, fontSize: 'clamp(17px,4.6vw,24px)', color: 'rgb(111,111,117)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          Cinematic craft and end-to-end production, engineered to make every frame count.
        </p>
      </div>
    );
  }

  return (
    // Exactly one screen. The reveal runs on its own clock now, so there is no
    // need for a tall pinned stage to scrub it against — and no long dark run to
    // get stranded in.
    <div ref={wrapRef} style={{ position: 'relative', height: '100vh', background: '#0a0a0a' }}>
      <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        {/* dark base — visible until the circular mask expands over it */}
        <div style={{ position: 'absolute', inset: 0, background: '#0a0a0a' }} />
        {/* white layer revealed through the expanding circular clip-path */}
        <div ref={maskRef} style={{
          position: 'absolute', inset: 0, background: '#fff',
          clipPath: 'circle(0% at 50% 100%)', willChange: 'clip-path',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',
          padding: '0 clamp(12px,2vw,28px) clamp(20px,4vh,48px)',
        }}>
          <h2 style={{
            margin: 0, width: '100%', fontFamily: BB, fontWeight: 900,
            fontSize: 'clamp(48px,12.9vw,248px)', color: 'var(--ink)', lineHeight: 0.82,
            letterSpacing: '-0.045em', wordSpacing: '-0.12em', whiteSpace: 'nowrap', WebkitTextStroke: '2px var(--ink)',
          }}>
            what we do
          </h2>
          <p style={{
            margin: 'clamp(30px,5vh,60px) 0 0', fontFamily: MR, fontWeight: 700,
            fontSize: 'clamp(16px,3.09vw,60px)', color: 'rgb(111,111,117)', lineHeight: 1.1,
            letterSpacing: '-0.04em',
          }}>
            Cinematic craft and end-to-end production,<br />engineered to make every frame count.
          </p>
        </div>
      </div>
    </div>
  );
}

function ServicesSection({ outerRef }) {
  const cat0Ref = useRef(null);
  const cat1Ref = useRef(null);
  const cat2Ref = useRef(null);
  const cat3Ref = useRef(null);
  const catEndRef = useRef(null);
  const catRefs = [cat0Ref, cat1Ref, cat2Ref, cat3Ref];


  return (
    <section ref={outerRef} data-snap style={{ position: 'relative', zIndex: 4, background: '#fff' }}>
      {/* Circle-open intro with the giant SERVICES heading */}
      <ServicesReveal />

      <div style={{ padding: 'clamp(20px,3vh,36px) clamp(20px,4vw,56px) clamp(24px,4vh,40px)' }}>
        <p style={{ fontFamily: MR, fontWeight: 600, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.4)', margin: 0 }}>
          Agency · Production House · Post · Digital
        </p>
      </div>

      {SERVICE_CATEGORIES.map((cat, i) => (
        <StackPanel
          key={cat.index}
          selfRef={catRefs[i]}
          nextRef={i < SERVICE_CATEGORIES.length - 1 ? catRefs[i + 1] : catEndRef}
          zIndex={i + 1}
          background="#fff"
          noShrink={i === SERVICE_CATEGORIES.length - 1}
        >
          <ServiceCategoryRow cat={cat} />
        </StackPanel>
      ))}

      <div ref={catEndRef} aria-hidden style={{ height: 1 }} />
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   5 — ABOUT
══════════════════════════════════════════════════════════════════ */
function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const isMobile = useIsMobile();

  return (
    <div ref={ref} style={{ height: '100%', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: isMobile ? 20 : 'clamp(24px,4vw,56px)', padding: isMobile ? '28px 20px' : 'clamp(24px,3.5vw,52px)', alignItems: 'center' }}>
      <div>
        <Kicker>Who We Are</Kicker>
        <h2 style={{ fontFamily: BB, fontWeight: 700, fontSize: 'clamp(34px,5vw,64px)', color: 'var(--ink)', lineHeight: 0.9, margin: '10px 0 22px', textTransform: 'uppercase' }}>
          {inView && <RevealWords text="PRODUCTION" />}<br />
          {inView && <RevealWords text="FIRST." />}<br />
          {inView && <RevealWords text="STORY ALWAYS." />}
        </h2>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4, duration: DURATION, ease: EASE }}
          style={{ fontFamily: MR, fontWeight: 400, fontSize: 'clamp(14px,1.6vw,16px)', color: 'rgba(17,17,17,0.6)', lineHeight: 1.7, maxWidth: 460 }}>
          At Bambai Dreams, we're a production-first company built on the backbone of strong storytelling, cinematic craft, and seamless execution. From large-scale brand films to fast-moving digital content, we produce with precision, passion, and purpose.
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.55, duration: DURATION, ease: EASE }}
          style={{ fontFamily: MR, fontWeight: 400, fontSize: 'clamp(14px,1.6vw,16px)', color: 'rgba(17,17,17,0.45)', lineHeight: 1.7, maxWidth: 460, marginTop: 14 }}>
          Backed by top-tier talent, trusted directors, and a battle-tested crew — we deliver high-quality work that's both effective and emotionally engaging in today's fast-paced content landscape.
        </motion.p>
      </div>
      {!isMobile && (
        <motion.div style={{ height: 'clamp(220px,38vw,420px)' }} initial={{ opacity: 0, scale: 0.96 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: DURATION, ease: EASE }}>
          <PlaceholderBlock palette={PALETTES.studio} label="Placeholder Photo — Studio" height="100%" />
        </motion.div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   6 — CONTACT
══════════════════════════════════════════════════════════════════ */
function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref} style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 clamp(24px,6vw,80px)' }}>
      <Kicker>Let's Connect</Kicker>
      <h2 style={{ fontFamily: BB, fontWeight: 700, fontSize: 'clamp(30px,min(5.2vw,8.5vh),68px)', color: 'var(--ink)', lineHeight: 0.92, maxWidth: 860, margin: 'clamp(6px,1.2vh,14px) 0 0', textTransform: 'uppercase' }}>
        {inView && <RevealWords text="CREATE COMPELLING" />}<br />
        {inView && <RevealWords text="STORIES WITH US." />}
      </h2>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.45, duration: DURATION, ease: EASE }}
        style={{ fontFamily: MR, fontWeight: 400, fontSize: 'clamp(13px,1.5vw,16px)', color: 'rgba(17,17,17,0.55)', lineHeight: 1.6, maxWidth: 520, marginTop: 'clamp(8px,1.6vh,20px)' }}>
        We're driven by a profound desire to create compelling stories and collaborate with a diverse range of brands. We eagerly anticipate the opportunity to bring extraordinary stories to life together.
      </motion.p>
      {/* name / phones / email deliberately not repeated here — the footer
          directly below carries the same details */}
      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6, duration: DURATION, ease: EASE }}>
        <Link to="/contact" data-cursor="HELLO" className="btn-mr" style={{ marginTop: 'clamp(20px,4vh,44px)', fontFamily: MR, fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', background: 'var(--ink)', padding: '16px 36px', textDecoration: 'none', display: 'inline-block' }}>
          START A PROJECT
        </Link>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HOME — stacking-card scroll narrative
   Hero → FeaturedShowcase → WorkShowcase → Services → About → Contact
══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const isMobile = useIsMobile();
  useSectionSnap();   // one scroll glides to the next section
  const reelRef = useRef(null);
  const workRef = useRef(null);
  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const endRef = useRef(null);

  const scrollToWork = () => workRef.current?.scrollIntoView({ behavior: 'smooth' });

  const heroProgress = useMotionValue(0);

  return (
    <main style={{ position: 'relative', background: '#0a0a0a' }}>
      {/* 1 · Hero — 200vh wrapper, card shrinks as you scroll */}
      <HeroWrapper progress={heroProgress}>
        {(p) => <Hero onViewWork={scrollToWork} progress={p} />}
      </HeroWrapper>

      {/* 2 · Featured Work — 3 full-screen films that stack on scroll (Arpeggio-style) */}
      <FeaturedWorkStack outerRef={reelRef} />

      {/* 3 · Selected Work — plain section, internal campaign stack */}
      <WorkShowcase outerRef={workRef} />

      {/* 4 · Brands marquee — auto-scroll logo strip */}
      <BrandsMarquee />

      {/* 5 · Services — plain section, internal category stack */}
      <ServicesSection outerRef={servicesRef} />

      {/* 5 · About — mobile only */}
      {isMobile && (
        <div style={{ background: '#fff', zIndex: 5, position: 'relative' }}>
          <AboutSection />
        </div>
      )}

      {/* 6 · Contact — sticky, does not fold (last card) */}
      {/* short by exactly the footer's height, so the yellow panel and the
          footer below it land together inside one screen */}
      <StackPanel selfRef={contactRef} nextRef={endRef} zIndex={6} background="var(--yellow)" noShrink
        height="calc(100vh - var(--footer-h))" navInvert>
        <ContactSection />
      </StackPanel>

      <div ref={endRef} aria-hidden style={{ height: 1 }} />
    </main>
  );
}
