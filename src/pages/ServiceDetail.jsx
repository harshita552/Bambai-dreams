import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useVimeoFeed } from '../hooks/useVimeoFeed';
import VideoCard from '../components/VideoCard';
import { SERVICES } from '../data/videos';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { videos } = useVimeoFeed();
  const service = SERVICES.find(s => s.slug === slug);

  if (!service) return (
    <div style={{ paddingTop: 120, textAlign: 'center' }}>
      <p style={{ fontFamily: '"Playfair Display",serif', fontSize: 24, color: 'var(--ink)', marginBottom: 20 }}>
        Service not found.
      </p>
      <Link to="/services" style={{ color: 'var(--gold)', fontFamily: '"DM Sans",sans-serif', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        ← All Services
      </Link>
    </div>
  );

  const related = videos.filter(v => service.categories.includes(v.category));

  return (
    <motion.main
      initial={{ opacity: 0, x: -30, rotate: -0.8 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      exit={{ opacity: 0, x: 40, rotate: 1.5 }}
      transition={{ duration: 0.38 }}
      style={{ paddingTop: 64 }}>

      {/* Cinematic header */}
      <section style={{
        minHeight: '72vh', background: 'var(--ink)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,64px) clamp(48px,6vw,72px)',
        borderBottom: '3px double rgba(245,240,232,0.2)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Giant number bg */}
        <span aria-hidden style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          fontFamily: '"Playfair Display",serif', fontWeight: 900,
          fontSize: 'clamp(100px,28vw,260px)', color: 'var(--cream)',
          opacity: 0.04, userSelect: 'none', whiteSpace: 'nowrap',
        }}>{service.number}</span>

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="kicker" style={{ marginBottom: 18 }}>
          ✦ {service.number} / 05
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{
            fontFamily: '"Playfair Display",serif', fontWeight: 900,
            fontSize: 'clamp(44px,10vw,120px)', color: 'var(--cream)',
            lineHeight: 0.95, marginBottom: 22,
          }}>{service.name}</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{
            fontFamily: '"IM Fell English",serif', fontStyle: 'italic',
            fontSize: 20, color: 'var(--ink-light)', maxWidth: 480, marginBottom: 40,
          }}>{service.tagline}</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Link to="/services"
            style={{
              fontFamily: '"DM Sans",sans-serif', fontSize: 10,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--gold)', textDecoration: 'none',
            }}>← All Services</Link>
        </motion.div>
      </section>

      {/* Video grid */}
      <section style={{ padding: 'clamp(48px,6vw,80px) clamp(20px,4vw,48px)', background: 'var(--cream)' }}>
        {related.length === 0 ? (
          <p style={{
            fontFamily: '"IM Fell English",serif', fontStyle: 'italic',
            color: 'var(--ink-light)', fontSize: 18, textAlign: 'center', padding: '60px 0',
          }}>More work in this category coming soon.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 3 }}>
            {related.map((v, i) => (
              <motion.div key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}>
                <VideoCard video={v} allVideos={related} aspectRatio="60%"/>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </motion.main>
  );
}
