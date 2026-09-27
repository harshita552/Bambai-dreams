import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SERVICES } from '../data/videos';
import logo from '../assets/BD-logo-white.png';

const fadeUp = { hidden:{ opacity:0, y:22 }, visible:{ opacity:1, y:0 } };

export default function Footer() {
  return (
    // Fixed to --footer-h so it and the contact panel above it add up to exactly
    // one screen. The columns take what is left after the bottom bar.
    <footer style={{
      background:'var(--ink)', borderTop:'4px solid var(--yellow)',
      height:'var(--footer-h)', display:'flex', flexDirection:'column', overflow:'hidden',
    }}>
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.2 }}
        variants={{ visible:{ transition:{ staggerChildren:0.12 } } }}
        style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
          gap:'clamp(20px,3vw,48px)',
          padding:'clamp(18px,3vh,48px) clamp(20px,3vw,48px) clamp(12px,2vh,32px)',
          flex:'1 1 auto', minHeight:0,
        }}>

        {/* Col 1 */}
        <motion.div variants={fadeUp}>
          <img
            src={logo}
            alt="Bambai Dreams"
            style={{ height: 'clamp(56px,8vh,100px)', width: 'auto', objectFit: 'contain', marginBottom: 'clamp(8px,1.4vh,16px)' }}
          />
          <p style={{
            fontFamily:'"Manrope",sans-serif', fontStyle:'italic',
            fontSize:14, color:'var(--ink-light)', lineHeight:1.55,
          }}>where we turn your wildest<br/>media dreams into reality</p>
        </motion.div>

        {/* Col 2 */}
        <motion.div variants={fadeUp}>
          <p style={{
            fontFamily:'"DM Sans",sans-serif', fontSize:9,
            letterSpacing:'0.24em', textTransform:'uppercase',
            color:'var(--yellow)', marginBottom:'clamp(6px,1.4vh,18px)',
          }}>Services</p>
          {SERVICES.map(s => (
            <Link key={s.slug} to={`/services/${s.slug}`}
              style={{
                display:'block', fontFamily:'"DM Sans",sans-serif',
                fontSize:13, color:'var(--ink-light)', textDecoration:'none',
                marginBottom:'clamp(2px,0.6vh,10px)', transition:'color 0.2s, padding-left 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color='var(--yellow)'; e.currentTarget.style.paddingLeft='8px'; }}
              onMouseLeave={e => { e.currentTarget.style.color='var(--ink-light)'; e.currentTarget.style.paddingLeft='0'; }}>
              {s.name}
            </Link>
          ))}
        </motion.div>

        {/* Col 3 */}
        <motion.div variants={fadeUp}>
          <p style={{
            fontFamily:'"DM Sans",sans-serif', fontSize:9,
            letterSpacing:'0.24em', textTransform:'uppercase',
            color:'var(--yellow)', marginBottom:'clamp(6px,1.4vh,18px)',
          }}>Contact</p>
          <p style={{ fontFamily:'"Manrope",sans-serif', fontWeight:700, fontSize:17, color:'#f4f4f4', marginBottom:'clamp(3px,0.8vh,7px)' }}>
            Satvant Singh
          </p>
          <p style={{ fontFamily:'"Manrope",sans-serif', fontStyle:'italic', fontSize:13, color:'var(--ink-light)', marginBottom:'clamp(6px,1.4vh,18px)' }}>
            Founder & Creative Director
          </p>
          {['+91 9795 000 555','+91 9820 538 238'].map(n => (
            <p key={n} style={{ fontFamily:'"DM Sans",sans-serif', fontSize:13, color:'var(--yellow)', marginBottom:'clamp(3px,0.8vh,7px)' }}>{n}</p>
          ))}
          <a href="mailto:satvant@bambaidreams.com"
            style={{ fontFamily:'"DM Sans",sans-serif', fontSize:13, color:'var(--yellow)', textDecoration:'none', borderBottom:'1px solid rgba(255,203,49,0.4)' }}>
            satvant@bambaidreams.com
          </a>
        </motion.div>
      </motion.div>

      <div style={{
        borderTop:'1px solid rgba(255,203,49,0.12)',
        padding:'clamp(8px,1.4vh,18px) clamp(20px,3vw,48px)', flexShrink:0,
        display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8,
      }}>
        <p style={{ fontFamily:'"DM Sans",sans-serif', fontSize:11, color:'var(--ink-light)' }}>
          © 2026 Bambai Dreams. All rights reserved.
        </p>
        <p style={{ fontFamily:'"DM Sans",sans-serif', fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--ink-light)' }}>
          Mumbai, India
        </p>
      </div>
    </footer>
  );
}
