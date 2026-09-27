import { motion } from 'framer-motion';

export default function Headline({ headlineRef }) {
  return (
    <div
      ref={headlineRef}
      style={{
        position: 'absolute', inset: 0, zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', padding: '0 24px',
        willChange: 'transform',
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          textAlign: 'center', color: '#fff', fontWeight: 800,
          fontSize: 'clamp(4rem, 10vw, 10rem)',
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
          fontFamily: '"General Sans",sans-serif',
          margin: 0,
        }}
      >
        Design that<br />
        captivates today<br />
        &amp; inspires<br />
        tomorrow.
      </motion.h1>
    </div>
  );
}
