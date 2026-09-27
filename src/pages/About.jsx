import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import logoDark from '../assets/BD-Logo.png';

// Card slides in from the left, then its contents stagger in behind it.
const CARD_IN = {
  hidden: { opacity: 0, x: -110 },
  show: {
    opacity: 1, x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], when: 'beforeChildren', delayChildren: 0.3, staggerChildren: 0.14 },
  },
};
const CARD_ITEM = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

// Copy taken verbatim from the client deck ("Who We are?" slide).
const WHO_WE_ARE = [
  'At Bambai Dreams, we’re a production-first company built on the backbone of strong storytelling, cinematic craft, and seamless execution. From large-scale brand films to fast-moving digital content, we produce with precision, passion, and purpose.',
  'While production is our core, we also partner with brands and agencies on creative development when needed — bringing concepts to life from idea to screen. Backed by top-tier talent, trusted directors, and a battle-tested crew, we pride ourselves on delivering high-quality work that’s both effective and emotionally engaging in today’s fast-paced content landscape.',
];

const BB = '"Bebas Neue",sans-serif';
const MR = '"Manrope",sans-serif';
const GS = '"General Sans",sans-serif';
const DM = '"DM Sans",sans-serif';

const STATS = [
  { num: '50+', label: 'Campaigns Delivered' },
  { num: '20+', label: 'Bollywood Collaborations' },
  { num: '12+', label: 'Global Brands' },
  { num: '7+',  label: 'Years of Excellence' },
];

const PILLARS = [
  {
    title: 'WHO WE ARE',
    body: 'Bambai Dreams is a Mumbai-based creative film production studio specialising in high-impact commercial films, music videos, and lifestyle content. We are a full-service creative partner — from concept to final cut.',
  },
  {
    title: 'WHAT WE DO',
    body: 'We work with India\'s biggest brands and talent — Realme, OPPO, GIVA, Under Armour, Shah Rukh Khan, Anushka Sharma, Neeraj Chopra — to craft campaigns that are bold, beautiful, and built to perform.',
  },
  {
    title: 'HOW WE THINK',
    body: 'Every brief is an opportunity to do something remarkable. We bring together world-class directors, cinematographers, and creative teams to deliver work that sets benchmarks — not just meets them.',
  },
];

const SKILLS = [
  'Commercial Film Production',
  'Music Video Production',
  'Celebrity & Influencer Campaigns',
  'Creative Direction & Script Development',
  'Lifestyle & Editorial Photography',
  'Product Photography',
  'Post-Production & Colour Grade',
  'Talent Representation & Management',
];

function PillarCard({ p, i, pillarsInView }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.1, duration: 0.6 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        padding: 'clamp(32px,4vw,52px)',
        background: '#f7f5f0',
        borderTop: '3px solid var(--yellow)',
        overflow: 'hidden',
        cursor: 'default',
      }}>

      {/* Curtain */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: hov ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'absolute', inset: 0,
          background: '#0a0a0a',
          transformOrigin: 'top',
          zIndex: 0,
        }}/>

      <p style={{ position: 'relative', zIndex: 1, fontFamily: BB, fontWeight: 700, fontSize: 'clamp(24px,3vw,36px)', color: hov ? '#fff' : '#1a1209', textTransform: 'uppercase', marginBottom: 20, transition: 'color 0.2s ease 0.15s' }}>
        {p.title}
      </p>
      <p style={{ position: 'relative', zIndex: 1, fontFamily: MR, fontWeight: 400, fontSize: 'clamp(14px,1.4vw,16px)', color: hov ? 'rgba(255,255,255,0.65)' : 'rgba(26,18,9,0.6)', lineHeight: 1.7, transition: 'color 0.2s ease 0.15s' }}>
        {p.body}
      </p>
    </motion.div>
  );
}

function StatBox({ num, label, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
      style={{ padding: 'clamp(24px,3vw,40px)', borderLeft: '3px solid var(--yellow)' }}>
      <p style={{ fontFamily: BB, fontWeight: 700, fontSize: 'clamp(44px,7.5vw,80px)', color: '#1a1209', lineHeight: 1, margin: 0 }}>
        {num}
      </p>
      <p style={{ fontFamily: MR, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,18,9,0.45)', marginTop: 8 }}>
        {label}
      </p>
    </motion.div>
  );
}

export default function About() {
  const heroRef    = useRef(null);
  const pillarsRef = useRef(null);
  const statsRef   = useRef(null);

  const pillarsInView = useInView(pillarsRef, { once: true, amount: 0.1 });
  const statsInView   = useInView(statsRef,   { once: true, amount: 0.1 });

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.38 }}
      style={{ paddingTop: 64, background: '#f7f5f0' }}>

      {/* ── Hero statement ────────────────────────────────────────── */}
      <section ref={heroRef} style={{
        minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 'clamp(80px,10vw,130px) clamp(24px,5vw,80px) clamp(60px,8vw,96px)',
        background: '#f7f5f0', borderBottom: '1px solid rgba(0,0,0,0.1)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* grid lines */}
        {[0,1,2,3].map(i => (
          <div key={i} aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: `${25 * i}%`, height: 1, background: 'rgba(0,0,0,0.04)', pointerEvents: 'none' }} />
        ))}

        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}
          style={{
            fontFamily: BB, fontWeight: 700, textTransform: 'uppercase',
            fontSize: 'clamp(44px,9.5vw,128px)', color: '#1a1209',
            lineHeight: 0.88, margin: '0 0 28px', position: 'relative', zIndex: 1,
          }}>
          WHERE WE TURN<br />
          YOUR WILDEST<br />
          MEDIA DREAMS<br />
          <span style={{ color: 'var(--yellow)' }}>INTO REALITY.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ fontFamily: MR, fontWeight: 500, fontSize: 'clamp(14px,1.6vw,18px)', color: 'rgba(26,18,9,0.55)', textTransform: 'uppercase', letterSpacing: '0.04em', maxWidth: 480, position: 'relative', zIndex: 1 }}>
          A full-service creative production house. Bold ideas, flawless execution, unforgettable frames.
        </motion.p>
      </section>

      {/* ── Who We Are — dark break, full deck copy ───────────────── */}
      <section style={{ background: '#0a0a0a', padding: 'clamp(64px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }}>
          <div>
            <p style={{ fontFamily: DM, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--yellow)', margin: '0 0 22px' }}>
              ✦ WHO WE ARE
            </p>
            <h2 style={{ fontFamily: BB, fontWeight: 700, fontSize: 'clamp(40px,6vw,86px)', color: '#fff',
              textTransform: 'uppercase', lineHeight: 0.9, margin: 0 }}>
              PRODUCTION<br />FIRST.<br />
              <span style={{ color: 'var(--yellow)' }}>STORY ALWAYS.</span>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px,2.2vw,26px)', paddingTop: 'clamp(0px,2vw,38px)' }}>
            {WHO_WE_ARE.map((para, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }} transition={{ delay: i * 0.12, duration: 0.6 }}
                style={{ margin: 0, fontFamily: MR, fontWeight: 400, fontSize: 'clamp(14px,1.35vw,17px)',
                  lineHeight: 1.75, color: i === 0 ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.55)' }}>
                {para}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who / What / How ──────────────────────────────────────── */}
      <section ref={pillarsRef} style={{
        background: '#eeece7', padding: 'clamp(60px,8vw,96px) clamp(24px,5vw,80px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: 'clamp(2px,0.3vw,4px)' }}>
          {PILLARS.map((p, i) => (
            <PillarCard key={p.title} p={p} i={i} pillarsInView={pillarsInView} />
          ))}
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section ref={statsRef} style={{
        background: '#f7f5f0', padding: 'clamp(60px,8vw,96px) clamp(24px,5vw,80px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={statsInView ? { opacity: 1, y: 0 } : {}}
          style={{ fontFamily: DM, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--yellow)', marginBottom: 40 }}>
          ✦ BY THE NUMBERS
        </motion.p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 2 }}>
          {STATS.map((s, i) => <StatBox key={s.label} {...s} delay={i * 0.1} />)}
        </div>
      </section>

      {/* ── Skills ───────────────────────────────────────────────── */}
      <section style={{ background: '#eeece7', padding: 'clamp(60px,8vw,96px) clamp(24px,5vw,80px)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <p style={{ fontFamily: DM, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--yellow)', marginBottom: 40 }}>
          ✦ OUR SKILLS
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 2 }}>
          {SKILLS.map((skill, i) => (
            <motion.div key={skill}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.05 }}
              style={{ padding: 'clamp(18px,2vw,26px) clamp(20px,2.5vw,32px)', background: '#f7f5f0', borderLeft: '2px solid rgba(184,134,11,0.3)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ color: 'var(--yellow)', fontSize: 18, lineHeight: 1 }}>✦</span>
              <span style={{ fontFamily: MR, fontWeight: 700, fontSize: 'clamp(13px,1.3vw,15px)', color: '#1a1209', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{skill}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Founder — minimal visiting card ──────────────────────── */}
      <section style={{ background: '#eeece7', padding: 'clamp(64px,9vw,120px) clamp(24px,5vw,80px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Header — eyebrow row · rule · subheading */}
        <div style={{ width: '100%', maxWidth: 1180, margin: '0 0 clamp(56px,9vh,110px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 'clamp(14px,2vh,24px)' }}>
            <span aria-hidden style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--yellow)', flexShrink: 0 }} />
            <span style={{ fontFamily: BB, fontWeight: 500, fontSize: 'clamp(26px,3vw,38px)', lineHeight: 1.15, color: 'rgba(26,18,9,0.5)' }}>
              Founder
            </span>
            <span aria-hidden style={{ width: 1, alignSelf: 'stretch', background: 'rgba(26,18,9,0.22)' }} />
            <span style={{ fontFamily: MR, fontWeight: 400, fontSize: 'clamp(13px,1.3vw,17px)', lineHeight: 1.4, color: 'rgba(26,18,9,0.7)' }}>
              leadership
            </span>
          </div>

          <div aria-hidden style={{ height: 1, background: 'rgba(26,18,9,0.14)', width: '100%' }} />

          <p style={{ margin: 'clamp(16px,2.4vh,28px) 0 0', fontFamily: MR, fontWeight: 500,
            fontSize: 'clamp(13px,1.4vw,19px)', lineHeight: 1.3, color: 'rgba(26,18,9,0.5)',
            whiteSpace: 'nowrap' }}>
            Leading Bambai Dreams from idea to screen.
          </p>
        </div>

        <motion.div
          variants={CARD_IN} initial="hidden" whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ y: -8, boxShadow: '0 46px 90px rgba(0,0,0,0.20)' }}
          style={{
            width: '100%', maxWidth: 660, aspectRatio: '1.75 / 1',
            background: '#ffffff', color: '#111',
            padding: 'clamp(22px,3.2vw,40px)',
            display: 'flex', alignItems: 'center', gap: 'clamp(20px,3vw,40px)',
            boxShadow: '0 30px 70px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
            borderRadius: 12,
            position: 'relative', overflow: 'hidden',
          }}>
          {/* slim brand accent down the left edge */}
          <div aria-hidden style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 5, background: 'var(--yellow)' }} />

          {/* left — logo + wordmark */}
          <motion.div variants={CARD_ITEM} style={{ flex: '0 0 42%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
            borderRight: '1px solid rgba(0,0,0,0.09)', paddingRight: 'clamp(16px,2.4vw,32px)', alignSelf: 'stretch' }}>
            <img src={logoDark} alt="Bambai Dreams" style={{ width: '100%', maxWidth: 240, height: 'auto', objectFit: 'contain' }} />
          </motion.div>

          {/* right — identity + contact, filling the full card height */}
          <motion.div style={{ flex: 1, minWidth: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', paddingTop: 'clamp(4px,0.8vw,10px)', paddingBottom: 'clamp(4px,0.8vw,10px)' }}>
            <motion.div variants={CARD_ITEM}>
              <p style={{ margin: 0, fontFamily: BB, fontWeight: 700, fontSize: 'clamp(22px,3.1vw,38px)',
                lineHeight: 1.05, textTransform: 'uppercase', color: '#111' }}>Satvant Singh</p>
              <p style={{ margin: '5px 0 0', fontFamily: MR, fontWeight: 500, fontSize: 'clamp(9px,0.92vw,11px)',
                letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.45)' }}>
                Founder &amp; Creative Director
              </p>
              <div aria-hidden style={{ height: 2, width: 44, background: 'var(--yellow)', marginTop: 'clamp(10px,1.4vw,16px)' }} />
            </motion.div>

            <motion.div variants={CARD_ITEM} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px,0.9vw,10px)' }}>
              {[
                { href: 'tel:+919795000555',  label: '+91 9795 000 555', icon: 'phone' },
                { href: 'tel:+919820538238',  label: '+91 9820 538 238', icon: 'phone' },
                { href: 'mailto:satvant@bambaidreams.com', label: 'satvant@bambaidreams.com', icon: 'mail' },
              ].map((c, i) => (
                <a key={i} href={c.href} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--yellow)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      {c.icon === 'phone'
                        ? <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                        : <><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path d="m22 6-10 7L2 6" /></>}
                    </svg>
                  </span>
                  <span style={{ fontFamily: MR, fontWeight: 400, fontSize: 'clamp(10px,1vw,13px)',
                    color: 'rgba(17,17,17,0.68)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.label}
                  </span>
                </a>
              ))}
            </motion.div>

            {/* footer — website + base, anchors the bottom of the card */}
            <motion.div variants={CARD_ITEM} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              borderTop: '1px solid rgba(0,0,0,0.09)', paddingTop: 'clamp(8px,1.2vw,14px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px,1vw,12px)' }}>
                <span style={{ fontFamily: MR, fontWeight: 500, fontSize: 'clamp(9px,0.9vw,12px)',
                  letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.5)', whiteSpace: 'nowrap' }}>
                  Find us on&nbsp;:
                </span>

                {/* Instagram — official gradient */}
                <a href="https://instagram.com/bambaidreams" target="_blank" rel="noopener noreferrer"
                   aria-label="Instagram" style={{ display: 'flex', lineHeight: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                    <defs>
                      <linearGradient id="bdIg" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFDC80" /><stop offset="25%" stopColor="#F77737" />
                        <stop offset="50%" stopColor="#DC2743" /><stop offset="75%" stopColor="#CC2366" />
                        <stop offset="100%" stopColor="#833AB4" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#bdIg)" d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.67-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.41a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
                  </svg>
                </a>

                {/* YouTube — brand red */}
                <a href="https://youtube.com/BambaiDreams" target="_blank" rel="noopener noreferrer"
                   aria-label="YouTube" style={{ display: 'flex', lineHeight: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                    <path fill="#FF0000" d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81z" />
                    <path fill="#fff" d="M9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
                  </svg>
                </a>

                {/* Vimeo — brand blue */}
                <a href="https://vimeo.com/bambaidreams" target="_blank" rel="noopener noreferrer"
                   aria-label="Vimeo" style={{ display: 'flex', lineHeight: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                    <path fill="#1AB7EA" d="M23.98 6.42c-.11 2.34-1.74 5.54-4.9 9.61-3.26 4.25-6.02 6.37-8.29 6.37-1.4 0-2.58-1.3-3.55-3.88L5.32 11.4c-.72-2.58-1.49-3.88-2.31-3.88-.18 0-.81.38-1.88 1.13L0 7.15a291 291 0 0 0 3.5-3.13c1.58-1.36 2.77-2.03 3.56-2.11 1.87-.18 3.02 1.1 3.45 3.84.46 2.95.79 4.79.97 5.51.54 2.45 1.13 3.67 1.78 3.67.5 0 1.25-.8 2.26-2.39 1-1.59 1.54-2.8 1.61-3.63.14-1.37-.4-2.06-1.61-2.06-.58 0-1.17.12-1.78.39 1.19-3.87 3.43-5.76 6.76-5.64 2.47.06 3.63 1.67 3.49 4.8z" />
                  </svg>
                </a>
              </div>
              <span style={{ fontFamily: MR, fontWeight: 400, fontSize: 'clamp(9px,0.9vw,12px)',
                letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.42)' }}>
                Mumbai, India
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

    </motion.main>
  );
}
