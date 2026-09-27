import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CONFETTI_COLORS = ['var(--gold)','var(--cream)','var(--rust)','var(--gold-light)','#ede6d6'];

function Burst({ active, onDone }) {
  const pieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 340,
    y: -(Math.random() * 220 + 80),
    r: (Math.random() - 0.5) * 400,
    w: 8 + Math.random() * 8,
    h: 12 + Math.random() * 10,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));

  return (
    <AnimatePresence>
      {active && pieces.map(p => (
        <motion.div key={p.id}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, rotate: p.r, opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          onAnimationComplete={p.id === 0 ? onDone : undefined}
          style={{
            position: 'absolute', bottom: 12, left: '50%',
            width: p.w, height: p.h,
            background: p.color, borderRadius: 2,
            pointerEvents: 'none', zIndex: 10,
          }}/>
      ))}
    </AnimatePresence>
  );
}

const fieldBase = {
  width: '100%', background: 'transparent',
  border: 'none', borderBottom: '1px solid var(--ink-light)',
  padding: '12px 0', fontFamily: '"DM Sans",sans-serif',
  fontSize: 14, color: 'var(--ink)', marginBottom: 28, display: 'block',
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', company: '', type: '', message: '' });
  const [sent, setSent] = useState(false);
  const [burst, setBurst] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setBurst(true);
    setTimeout(() => { setSent(true); setBurst(false); }, 1000);
  };

  return (
    <motion.main
      initial={{ opacity: 0, x: -30, rotate: -0.8 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      exit={{ opacity: 0, x: 40, rotate: 1.5 }}
      transition={{ duration: 0.38 }}
      // no top padding: the two panels run to the top of the page, straight up
      // under the navbar, instead of leaving a cream strip across the width
      style={{ minHeight: '100vh', background: 'var(--cream)' }}>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))',
        minHeight: '100vh',
      }}>
        {/* LEFT — contact info */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            background: 'var(--ink)',
            padding: 'calc(var(--nav-h) + clamp(16px,3vh,40px)) clamp(32px,5vw,72px) clamp(60px,8vw,100px)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            borderRight: '3px double rgba(245,240,232,0.18)',
          }}>
          <p className="kicker" style={{ marginBottom: 20 }}>✦ Let's Talk</p>
          <h1 style={{
            fontFamily: '"Playfair Display",serif', fontWeight: 900,
            fontSize: 'clamp(36px,6.5vw,72px)', color: 'var(--cream)',
            lineHeight: 1.04, marginBottom: 52,
          }}>
            Let's Create<br/><em style={{ color: 'var(--gold-light)' }}>Together.</em>
          </h1>

          <div style={{ borderTop: '1px solid rgba(245,240,232,0.14)', paddingTop: 40 }}>
            <p style={{
              fontFamily: '"Playfair Display",serif', fontWeight: 700,
              fontSize: 20, color: 'var(--cream)', marginBottom: 6,
            }}>Satvant Singh</p>
            <p style={{
              fontFamily: '"IM Fell English",serif', fontStyle: 'italic',
              fontSize: 14, color: 'var(--ink-light)', marginBottom: 22,
            }}>Founder & Creative Director</p>
            {['+91 9795 000 555', '+91 9820 538 238'].map(n => (
              <p key={n} style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 14, color: 'var(--gold)', marginBottom: 9 }}>{n}</p>
            ))}
            <a href="mailto:satvant@bambaidreams.com"
              style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 14, color: 'var(--gold)', textDecoration: 'none', borderBottom: '1px solid var(--gold)' }}>
              satvant@bambaidreams.com
            </a>
          </div>

          <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-light)', marginTop: 52 }}>
            Mumbai, India
          </p>
        </motion.div>

        {/* RIGHT — form */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          style={{
            background: 'var(--paper)',
            padding: 'calc(var(--nav-h) + clamp(16px,3vh,40px)) clamp(32px,5vw,72px) clamp(60px,8vw,100px)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>

          {sent ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: '"Playfair Display",serif', fontWeight: 900, fontSize: 40, color: 'var(--ink)', marginBottom: 16 }}>
                Thank you. ✦
              </p>
              <p style={{ fontFamily: '"IM Fell English",serif', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-mid)' }}>
                We will be in touch soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontFamily: '"Playfair Display",serif', fontWeight: 700, fontSize: 24, color: 'var(--ink)', marginBottom: 40 }}>
                Start a Project
              </p>

              {[
                { key: 'name',    label: 'Name',    ph: 'Your name',       type: 'text', req: true },
                { key: 'company', label: 'Company', ph: 'Brand or agency', type: 'text', req: false },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-light)' }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type} required={f.req} placeholder={f.ph}
                    value={form[f.key]}
                    onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))}
                    style={fieldBase}/>
                </div>
              ))}

              <label style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-light)' }}>
                Project Type
              </label>
              <select value={form.type} onChange={e => setForm(x => ({ ...x, type: e.target.value }))}
                style={{ ...fieldBase, appearance: 'none', cursor: 'pointer' }}>
                <option value="">Select a service</option>
                {['Commercial Film','Music Video','Photography','Talent Management','Documentary'].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>

              <label style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-light)' }}>
                Message
              </label>
              <textarea required rows={4} placeholder="Tell us about your project"
                value={form.message}
                onChange={e => setForm(x => ({ ...x, message: e.target.value }))}
                style={{ ...fieldBase, resize: 'none' }}/>

              <div style={{ position: 'relative' }}>
                <Burst active={burst} onDone={() => {}}/>
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{
                    width: '100%', background: 'var(--ink)', color: 'var(--cream)',
                    border: 'none', padding: '17px 0',
                    fontFamily: '"Playfair Display",serif', fontStyle: 'italic',
                    fontSize: 20, cursor: 'pointer', letterSpacing: '0.02em',
                  }}>Send →</motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </motion.main>
  );
}
