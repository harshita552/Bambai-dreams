import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLightbox } from '../context/LightboxContext';
import { toPlayerUrl } from '../data/videos';

export default function Lightbox() {
  const { isOpen, videos, idx, close, next, prev } = useLightbox();
  const video = videos[idx];

  return createPortal(
    <AnimatePresence>
      {isOpen && video && (
        /* Backdrop */
        <motion.div key="lb-backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(26,22,18,0.96)',
            backdropFilter: 'blur(14px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'clamp(12px,3vw,20px) clamp(12px,5vw,70px)',
            cursor: 'pointer',
          }}>

          {/* Click-catcher: covers the full backdrop so any click outside the card closes */}
          <div
            onClick={close}
            style={{
              position: 'fixed', inset: 0, zIndex: -1,
              cursor: 'pointer',
            }}
          />

          {/* Player card */}
          <motion.div key={`lb-${video.id}`}
            initial={{ scale: 0.82, opacity: 0, rotate: -1 }}
            animate={{ scale: 1,    opacity: 1, rotate: 0 }}
            exit={{ scale: 0.9,  opacity: 0, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 1100, position: 'relative', cursor: 'default' }}>

            {/* Close */}
            <motion.button whileHover={{ color: 'var(--gold)' }}
              onClick={close}
              style={{
                position: 'absolute', top: -42, right: 0,
                background: 'none', border: 'none',
                color: 'var(--cream)', cursor: 'pointer',
                fontFamily: '"DM Sans",sans-serif', fontSize: 13,
                letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 6,
              }}>
              ✕ <span style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 9 }}>Close</span>
            </motion.button>

            {/* 16:9 iframe */}
            <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
              <iframe
                src={toPlayerUrl(video.embed_url, 'autoplay=1&color=ffcb31&title=0&byline=0&portrait=0')}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Info bar */}
            <div style={{
              marginTop: 16, display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', gap: 12, flexWrap: 'wrap',
            }}>
              <div>
                <p style={{
                  fontFamily: '"Playfair Display",serif', fontStyle: 'italic',
                  fontSize: 18, color: 'var(--cream)',
                }}>{video.title}</p>
                {video.client && (
                  <p style={{
                    marginTop: 5, fontFamily: '"DM Sans",sans-serif', fontSize: 9,
                    letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)',
                  }}>{video.client}{video.celebrity ? ` · ${video.celebrity}` : ''}</p>
                )}
              </div>
              {videos.length > 1 && (
                <p style={{
                  fontFamily: '"DM Sans",sans-serif', fontSize: 9,
                  color: 'var(--ink-light)', letterSpacing: '0.12em',
                }}>{idx + 1} / {videos.length}</p>
              )}
            </div>

            {/* ← → navigation */}
            {videos.length > 1 && (<>
              <motion.button whileHover={{ x: -4 }} onClick={prev}
                style={arrowStyle('left')}>←</motion.button>
              <motion.button whileHover={{ x: 4 }} onClick={next}
                style={arrowStyle('right')}>→</motion.button>
            </>)}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

const arrowStyle = side => ({
  position: 'absolute',
  [side]: 'clamp(-48px, -5vw, -58px)',
  top: '50%', transform: 'translateY(-50%)',
  background: 'rgba(10,10,10,0.7)', cursor: 'pointer',
  border: '1px solid rgba(245,240,232,0.25)',
  color: 'var(--cream)', width: 'clamp(34px,5vw,44px)', height: 'clamp(34px,5vw,44px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 'clamp(14px,2vw,18px)', transition: 'border-color 0.2s',
  borderRadius: 2,
});
