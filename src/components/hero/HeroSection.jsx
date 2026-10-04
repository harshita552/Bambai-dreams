import { useRef, useState, useEffect } from 'react';
import BackgroundLayer from './BackgroundLayer';
import FeaturedCard from './FeaturedCard';
import FloatingCard from './FloatingCard';
import Headline from './Headline';
import { useMouseParallax } from './useMouseParallax';
import { useScrollEffects } from './useScrollEffects';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const CARD_CONFIG = [
  {
    key: 'top-left',
    style: { top: '10%', left: '6%', width: 'clamp(150px, 16vw, calc(220px * var(--k)))', height: 'clamp(190px, 20vw, calc(280px * var(--k)))' },
    depth: 40,
    entryFrom: { x: -120, y: -80 },
    floatDuration: 7,
    floatDelay: 0,
    label: 'Brand Film',
    palette: ['#ffd166', '#ff7a45'],
    minBreakpoint: 'md',
  },
  {
    key: 'bottom-left',
    style: { bottom: '12%', left: '10%', width: 'clamp(130px, 14vw, calc(190px * var(--k)))', height: 'clamp(170px, 18vw, calc(240px * var(--k)))' },
    depth: 60,
    entryFrom: { x: -100, y: 100 },
    floatDuration: 8.5,
    floatDelay: 0.4,
    label: 'Music Video',
    palette: ['#3ec9c9', '#136b6b'],
    minBreakpoint: 'md',
  },
  {
    key: 'top-right',
    style: { top: '12%', right: '7%', width: 'clamp(140px, 15vw, calc(200px * var(--k)))', height: 'clamp(180px, 19vw, calc(260px * var(--k)))' },
    depth: 50,
    entryFrom: { x: 120, y: -100 },
    floatDuration: 7.5,
    floatDelay: 0.2,
    label: 'Campaign',
    palette: ['#ff6f59', '#b23a3a'],
    minBreakpoint: 'md',
  },
  {
    key: 'bottom-right',
    style: { bottom: '9%', right: '9%', width: 'clamp(120px, 13vw, calc(180px * var(--k)))', height: 'clamp(160px, 17vw, calc(230px * var(--k)))' },
    depth: 70,
    entryFrom: { x: 100, y: 90 },
    floatDuration: 9,
    floatDelay: 0.6,
    label: 'Photography',
    palette: ['#7fd9d4', '#1f7a73'],
    minBreakpoint: 'md',
  },
  {
    key: 'far-top',
    style: { top: '4%', left: '40%', width: 120, height: 150 },
    depth: 80,
    entryFrom: { x: 0, y: -140 },
    floatDuration: 10,
    floatDelay: 0.8,
    label: 'Reel',
    palette: ['#ffe27a', '#f2a900'],
    minBreakpoint: 'lg',
  },
];

const BREAKPOINTS = { md: 768, lg: 1024 };

function useViewportWidth() {
  const [width, setWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280));
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return width;
}

export default function HeroSection() {
  const containerRef = useRef(null);
  const collageRef = useRef(null);
  const headlineRef = useRef(null);
  const blurRef = useRef(null);
  const cardRefs = useRef([]);

  const reduceMotion = usePrefersReducedMotion();
  const { x: mouseX, y: mouseY } = useMouseParallax(containerRef, reduceMotion);

  useScrollEffects({ containerRef, collageRef, headlineRef, blurRef, cardRefs, disabled: reduceMotion });

  return (
    <section ref={containerRef} style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', background: '#000' }}>
      <BackgroundLayer blurRef={blurRef} />

      <div ref={collageRef} style={{ position: 'relative', height: '100%', width: '100%', willChange: 'transform' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <FeaturedCard mouseX={mouseX} mouseY={mouseY} depth={10} />
        </div>

        {CARD_CONFIG.map((cfg, i) => (
          <ResponsiveCardSlot
            key={cfg.key}
            cfg={cfg}
            i={i}
            cardRefs={cardRefs}
            mouseX={mouseX}
            mouseY={mouseY}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>

      <Headline headlineRef={headlineRef} />
    </section>
  );
}

function ResponsiveCardSlot({ cfg, i, cardRefs, mouseX, mouseY, reduceMotion }) {
  const viewportWidth = useViewportWidth();
  const minWidth = BREAKPOINTS[cfg.minBreakpoint] || 0;
  const visible = viewportWidth >= minWidth;

  if (!visible) return null;

  return (
    <div
      ref={(el) => (cardRefs.current[i] = el)}
      style={{ position: 'absolute', zIndex: 10, willChange: 'transform', ...cfg.style }}
    >
      <FloatingCard
        label={cfg.label}
        palette={cfg.palette}
        mouseX={mouseX}
        mouseY={mouseY}
        depth={cfg.depth}
        floatDuration={cfg.floatDuration}
        floatDelay={cfg.floatDelay}
        entryFrom={cfg.entryFrom}
        entryDelay={0.15 + i * 0.08}
        reduceMotion={reduceMotion}
      />
    </div>
  );
}
