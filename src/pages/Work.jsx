import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WORK_VIDEOS } from '../data/workVideos';
import VideoCard from '../components/VideoCard';
import { useIsMobile } from '../hooks/useIsMobile';
import { WorkShowcase } from './Home';

const MR = '"Manrope",sans-serif';
const GS = '"General Sans",sans-serif';

const FILTERS = [
  { key: 'all',         label: 'All' },
  { key: 'commercial',  label: 'Commercials' },
  { key: 'music',       label: 'Music Videos' },
  { key: 'photography', label: 'Photography' },
  { key: 'documentary', label: 'Documentaries' },
];


export default function Work() {
  const [active, setActive] = useState('all');
  const isMobile = useIsMobile();

  const pool = WORK_VIDEOS;
  const matched = active === 'all' ? pool : pool.filter(v => v.category === active);

  // Placeholder until the real films land: a category with nothing of its own
  // (photography and documentaries today) borrows from the rest of the reel
  // rather than showing an empty grid. Offset by the filter's position so the
  // empty categories don't show the identical six.
  const usePlaceholder = matched.length === 0 && pool.length > 0;
  const start = usePlaceholder
    ? (FILTERS.findIndex(f => f.key === active) * 6) % pool.length
    : 0;
  const list = usePlaceholder ? [...pool, ...pool].slice(start, start + 6) : matched;

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.38 }}
      style={{
        // no top padding: the Featured Work section runs to the top of the page
        // the way it does on home, under the transparent navbar
        background: '#f7f5f0',
        minHeight: '100vh',
      }}>

      {/* Featured Work — the same section the home page runs, imported rather
          than copied so the two can never drift apart */}
      <WorkShowcase />

      {/* All work — filter + video grid. This is where the page turns light
          again, so the navbar's centre mark swaps back to its dark cut. */}
      <div data-nav-light>

        {/* Filter bar */}
        <div style={{ padding: 'clamp(32px, 4vw, calc(48px * var(--k))) clamp(24px, 4vw, calc(56px * var(--k))) clamp(20px, 2.5vw, calc(28px * var(--k)))' }}>
          {/* The selected filter is a solid brand-yellow chip, the same square
              lockup as the deck's VIEW EVERYTHING / EXPLORE CAMPAIGN buttons.
              One shared layoutId means the chip slides across to whichever
              filter you pick rather than blinking out and back in. */}
          <div style={{ display: 'flex', gap: 'clamp(4px, 0.8vw, calc(12px * var(--k)))', flexWrap: 'wrap' }}>
            {FILTERS.map(f => {
              const on = active === f.key;
              return (
                <motion.button key={f.key}
                  onClick={() => setActive(f.key)}
                  style={{
                    position: 'relative', background: 'none', border: 'none',
                    padding: 'clamp(6px, 0.8vw, calc(10px * var(--k))) clamp(12px, 1.4vw, calc(20px * var(--k)))',
                    fontFamily: MR, fontWeight: 800, fontSize: 'max(clamp(calc(12px * var(--fm)), 1.5vw, calc(16px * var(--k))), var(--fs-min))',
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                    color: on ? 'var(--ink)' : '#1a1209',
                    cursor: 'pointer', lineHeight: 1,
                    transition: 'color 0.22s',
                  }}
                  whileHover={on ? undefined : { color: '#888' }}>
                  {on && (
                    <motion.span layoutId="work-filter-chip" aria-hidden
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      style={{
                        position: 'absolute', inset: 0, zIndex: 0,
                        background: 'var(--yellow)',
                        boxShadow: '0 6px 18px rgba(255,203,49,0.35)',
                      }} />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>{f.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Video grid */}
        <div style={{ padding: 'clamp(28px, 4vw, calc(44px * var(--k))) clamp(20px, 4vw, calc(56px * var(--k))) clamp(60px, 8vw, calc(96px * var(--k)))' }}>
          <motion.div layout style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: 16,
          }}>
            <AnimatePresence mode="popLayout">
              {list.map((v, i) => (
                <motion.div key={v.id} layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ delay: Math.min(i, 9) * 0.04, duration: 0.3 }}>
                  {/* 14px to match the Featured Work tiles above */}
                  <VideoCard video={v} allVideos={list}
                    aspectRatio='56.25%' style={{ borderRadius: 14 }}/>
                </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

          {list.length === 0 && (
            <p style={{ fontFamily: GS, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(26,18,9,0.3)', textAlign: 'center', padding: '64px 0', fontSize: 'max(calc(14px * var(--k) * var(--fm)), var(--fs-min))', letterSpacing: '0.1em' }}>
              No work in this category yet.
            </p>
          )}
        </div>
      </div>
    </motion.main>
  );
}
