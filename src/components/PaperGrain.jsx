import paperTexture from '../assets/textured-paper.jpg';

export default function PaperGrain() {
  return (
    <>
      {/* ── Real paper texture ──────────────────────────────────
           mix-blend-mode: multiply means:
             light/cream sections → aged paper look ✓
             dark ink sections    → barely visible  ✓
           No component changes needed — one global overlay does it all. */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0,
          backgroundImage: `url(${paperTexture})`,
          backgroundSize: '520px 520px',
          backgroundRepeat: 'repeat',
          opacity: 0.32,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />

      {/* ── SVG fractal noise — adds micro grain on top ─────── */}
      <svg className="grain-overlay" xmlns="http://www.w3.org/2000/svg"
        width="100%" height="100%" aria-hidden="true">
        <filter id="g">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#g)"/>
      </svg>
    </>
  );
}
