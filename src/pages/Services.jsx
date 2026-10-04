import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useVimeoFeed } from '../hooks/useVimeoFeed';
import VideoCard from '../components/VideoCard';
import { SERVICES } from '../data/videos';

const PHOTOGRAPHY_STILLS = [
  "/images/AnushkaImg/jpg/GIVA ANUSHKA_7642.jpg",
  "/images/underarmour/1.1.1_1.1.1.jpg",
  "/images/oppo/2.png",
  "/images/giva/1.42.1_1.42.1.jpg",
];

function ServiceBlock({ service, videos, i }) {
  const [hov, setHov] = useState(false);
  const matched = videos.filter(v => service.categories.includes(v.category));
  // Placeholder until the real films land: a category with nothing of its own
  // (documentaries today) borrows from the rest of the reel rather than
  // rendering an empty panel. Offset per service so they don't all show the same.
  const pool = videos.filter(v => v.category !== 'showreel');
  const related = matched.length
    ? matched.slice(0, 3)
    : pool.length
      ? [...pool, ...pool].slice((i * 3) % pool.length, (i * 3) % pool.length + 3)
      : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ delay: i * 0.06, duration: 0.6 }}
      style={{ borderBottom: '3px double var(--ink)', paddingBottom: 64, marginBottom: 64 }}>

      {/* Card header */}
      <Link to={`/services/${service.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
        <motion.div
          onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
          style={{
            position: 'relative', background: 'var(--paper)',
            border: '1px solid var(--ink)', padding: 'clamp(36px, 5vw, calc(60px * var(--k)))',
            overflow: 'hidden', cursor: 'pointer',
          }}>
          {/* Number watermark */}
          <span aria-hidden style={{
            position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
            fontFamily: '"Playfair Display",serif', fontWeight: 900,
            fontSize: 'max(clamp(80px, 14vw, calc(140px * var(--k))), var(--fs-min))', color: 'var(--cream-dark)',
            lineHeight: 1, userSelect: 'none', zIndex: 0,
          }}>{service.number}</span>

          {/* Tear reveal */}
          <motion.div aria-hidden
            initial={{ clipPath: 'polygon(0% 100%,100% 100%,100% 100%,0% 100%)' }}
            animate={hov ? { clipPath: 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)' }
                         : { clipPath: 'polygon(0% 100%,100% 100%,100% 100%,0% 100%)' }}
            transition={{ duration: 0.4 }}
            style={{ position: 'absolute', inset: 0, background: 'var(--ink)', zIndex: 1 }}>
            <div style={{ padding: 'clamp(36px, 5vw, calc(60px * var(--k)))', height: '100%', display: 'flex', alignItems: 'center' }}>
              <p style={{ fontFamily: '"Playfair Display",serif', fontWeight: 900, fontSize: 'max(clamp(28px, 5vw, calc(52px * var(--k))), var(--fs-min))', color: 'var(--cream)' }}>
                {service.name}
              </p>
            </div>
          </motion.div>

          <div style={{ position: 'relative', zIndex: 0 }}>
            <p className="kicker" style={{ marginBottom: 14 }}>{service.number} / 05</p>
            <h2 style={{
              fontFamily: '"Playfair Display",serif', fontWeight: 900,
              fontSize: 'max(clamp(28px, 4.5vw, calc(52px * var(--k))), var(--fs-min))', color: 'var(--ink)', marginBottom: 12,
            }}>{service.name}</h2>
            <p style={{
              fontFamily: '"IM Fell English",serif', fontStyle: 'italic',
              fontSize: 'max(calc(16px * var(--k) * var(--fm)), var(--fs-min))', color: 'var(--ink-mid)', marginBottom: 22,
            }}>{service.tagline}</p>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 'max(calc(11px * var(--k) * var(--fm)), var(--fs-min))', color: 'var(--gold)', letterSpacing: '0.1em' }}>
              Explore Full Category →
            </span>
          </div>
        </motion.div>
      </Link>

      {/* Photography stills grid */}
      {service.slug === 'photography' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {PHOTOGRAPHY_STILLS.map((src, idx) => (
            <div key={idx} style={{ overflow: 'hidden', aspectRatio: '3/4' }}>
              <img
                src={src} alt={`Photography still ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
          ))}
        </div>
      )}

      {/* Related strip */}
      {service.slug !== 'photography' && related.length > 0 && (
        <div className="no-scroll"
          style={{ display: 'flex', gap: 3, overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
          {related.map(v => (
            <div key={v.id} style={{ flex: '0 0 calc(33.33% - 2px)', minWidth: 200, scrollSnapAlign: 'start' }}>
              <VideoCard video={v} allVideos={related} aspectRatio="62%"/>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function Services() {
  const { videos } = useVimeoFeed();

  return (
    <motion.main
      initial={{ opacity: 0, x: -30, rotate: -0.8 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      exit={{ opacity: 0, x: 40, rotate: 1.5 }}
      transition={{ duration: 0.38 }}
      style={{ paddingTop: 64 }}>

      <div style={{
        padding: 'clamp(56px, 8vw, calc(88px * var(--k))) clamp(24px, 4vw, calc(48px * var(--k))) clamp(36px, 4vw, calc(48px * var(--k)))',
        background: 'var(--cream)', borderBottom: '3px double var(--ink)',
      }}>
        <p className="kicker" style={{ marginBottom: 12 }}>✦ What We Create</p>
        <h1 style={{
          fontFamily: '"Playfair Display",serif', fontWeight: 900,
          fontSize: 'max(clamp(36px, 7vw, calc(80px * var(--k))), var(--fs-min))', color: 'var(--ink)',
        }}>Our Services</h1>
      </div>

      <div style={{ padding: 'clamp(48px, 6vw, calc(80px * var(--k))) clamp(24px, 4vw, calc(48px * var(--k)))', background: 'var(--cream)' }}>
        {SERVICES.map((s, i) => (
          <ServiceBlock key={s.slug} service={s} videos={videos} i={i}/>
        ))}
      </div>
    </motion.main>
  );
}
