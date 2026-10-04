import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logoBDWhite from '../assets/BD-logo-white.png';
import logoBDDark from '../assets/BD-logo-dark-nav.png';

// Routes whose page is light from the very top, so the centre mark starts on its
// dark cut. /work is not one of them any more - it opens on the dark Featured
// Work section and marks the point where it turns light with data-nav-light.
const LIGHT_BG_ROUTES = ['/about', '/services', '/contact'];

// Routes where the bar is painted solid white rather than left transparent.
const WHITE_BAR_ROUTES = ['/contact'];

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
];

const SOCIAL = [
  { label: 'IG', href: 'https://instagram.com/bambaidreams' },
  { label: 'YT', href: 'https://youtube.com/BambaiDreams' },
  { label: 'VM', href: 'https://vimeo.com/bambaidreams' },
  { label: 'Email', href: 'mailto:satvant@bambaidreams.com' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onYellow, setOnYellow] = useState(false);
  const [hideLogo, setHideLogo] = useState(false);
  const [burgerHovered, setBurgerHovered] = useState(false);
  const [pastTop, setPastTop] = useState(false);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 1023px)').matches);
  const { pathname } = useLocation();
  const lightPage = LIGHT_BG_ROUTES.some(r => pathname.startsWith(r));
  // The bar has no background of its own anywhere on the site - it is transparent
  // from the first frame to the last, on every route - and the links and burger
  // stay brand yellow throughout, dark section or light. The one exception is a
  // section that is itself brand yellow, where yellow on yellow disappears:
  // those mark themselves data-nav-invert and the lettering goes white.
  const whiteBar = WHITE_BAR_ROUTES.some(r => pathname.startsWith(r));
  const ink = onYellow ? '#fff' : 'var(--yellow)';
  // The logo is the one mark that still swaps, because its wordmark is knocked
  // out in white on one cut and set in black on the other, and white on a white
  // section would vanish outright. Home marks the point where its background
  // turns light with data-nav-light; the inner routes are light top to bottom.
  const darkInk = lightPage || scrolled;
  // The white cut still ships on its original 3000x2985 canvas with ~7%
  // transparent padding, so it needs scaling up and nudging to crop to the mark.
  // The dark cut is a nav-sized re-export already trimmed to the artwork.
  const logo = darkInk
    ? { src: logoBDDark, height: '100%', shift: 'none' }
    : { src: logoBDWhite, height: '112%', shift: 'translate(-7.5%, -7%)' };

  useEffect(() => {
    const handle = () => {
      const marker = document.querySelector('[data-nav-light]');
      // switch as the light section's top meets the bar rather than at a fixed
      // offset, so it lands with the section no matter how tall the films above
      // are. A page with no marker never flips on its own.
      setScrolled(marker ? marker.getBoundingClientRect().top <= 72 : false);

      // is a brand-yellow section currently sitting behind the bar?
      const yellow = document.querySelector('[data-nav-invert]');
      const r = yellow && yellow.getBoundingClientRect();
      setOnYellow(!!r && r.top <= 72 && r.bottom > 0);

      // sections that want the centre mark out of the way while they are on
      // screen mark themselves data-nav-nologo
      setPastTop(window.scrollY > 40);

      setHideLogo([...document.querySelectorAll('[data-nav-nologo]')].some((el) => {
        const b = el.getBoundingClientRect();
        return b.top <= 72 && b.bottom > 0;
      }));
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const on = () => setCompact(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // On phones and tablets the transparent bar ends up sitting on top of
  // headings once the page moves, so there it turns into a slim frosted strip
  // (light over light sections, dark over dark). Desktop and the top of every
  // page keep the transparent bar.
  const frosted = compact && pastTop && !whiteBar && !open;

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: frosted
          ? 'clamp(10px, 1.6vh, 16px) clamp(16px, 4vw, 32px)'
          : 'clamp(28px, 4.5vh, calc(48px * var(--k))) clamp(20px, 4vw, calc(40px * var(--k)))',

        background: whiteBar ? '#fff' : frosted ? (onYellow ? 'rgba(255,203,49,0.9)' : darkInk ? 'rgba(247,245,240,0.86)' : 'rgba(10,10,10,0.62)') : 'transparent',
        backdropFilter: frosted ? 'blur(14px) saturate(150%)' : 'none',
        WebkitBackdropFilter: frosted ? 'blur(14px) saturate(150%)' : 'none',
        border: 'none',
        boxShadow: frosted ? '0 1px 0 rgba(0,0,0,0.06)' : 'none',
        transition: 'padding 0.35s ease, background 0.35s ease',
      }}>
        {/* Social links — left */}
        <div style={{ display: 'flex', gap: 'calc(16px * var(--k))', flex: 1 }}>
          {SOCIAL.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: '"DM Sans",sans-serif', fontSize: 'max(clamp(calc(14px * var(--fm)), 1.15vw, calc(17px * var(--k))), var(--fs-min))', letterSpacing: '0.05em',
              color: ink, textTransform: 'uppercase', textDecoration: 'none',
              transition: 'color 0.3s ease',
            }}>{s.label}</a>
          ))}
        </div>

        {/* Logo — centre mark. Anchored to the true page centre rather than a
            flex column, so the widths of the social / hamburger columns can
            never shift it. Fades out over sections that ask for it. */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', justifyContent: 'center',
          opacity: hideLogo ? 0 : 1, pointerEvents: hideLogo ? 'none' : 'auto',
          transition: 'opacity 0.25s ease' }}>
          {/* The PNGs carry transparent padding on every side, so the link box
              crops to the artwork itself - otherwise the mark renders about half
              the size the box suggests. */}
          <NavLink to="/" aria-label="Bambai Dreams — home"
            style={{ display: 'block', height: 'clamp(38px, 7.2vh, calc(62px * var(--k)))', aspectRatio: '0.954',
              overflow: 'hidden', lineHeight: 0 }}>
            <img src={logo.src} alt="Bambai Dreams"
              style={{ height: logo.height, width: 'auto', display: 'block',
                transform: logo.shift }} />
          </NavLink>
        </div>

        {/* Hamburger — right */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <button aria-label="Menu" onClick={() => setOpen(true)}
          onMouseEnter={() => setBurgerHovered(true)}
          onMouseLeave={() => setBurgerHovered(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: `calc(${burgerHovered ? 16 : 8}px * var(--k))`, padding: 4, transition: 'gap 0.25s ease' }}>
          {[0, 1].map(i => (
            <span key={i} style={{ display: 'block', width: 'calc(48px * var(--k))', height: 'calc(2px * var(--k))', background: ink, transition: 'background 0.3s ease' }} />
          ))}
        </button>
        </div>
      </div>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div key="menu"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1500,
              background: 'rgba(8,8,8,0.82)',
              backdropFilter: 'blur(10px) saturate(160%)',
              WebkitBackdropFilter: 'blur(10px) saturate(160%)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 'clamp(4px, 1.2vh, 14px)',
            }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'var(--yellow)' }} />
            <button onClick={e => { e.stopPropagation(); setOpen(false); }}
              style={{ position: 'absolute', top: 24, right: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 'max(calc(22px * var(--k)), var(--fs-min))' }}>✕</button>

            {LINKS.map((l, i) => (
              // each link rises out of its own mask on a soft spring, one after another
              <div key={l.to} style={{ overflow: 'hidden', lineHeight: 1 }} onClick={e => e.stopPropagation()}>
                <motion.div
                  initial={{ y: '110%' }} animate={{ y: '0%' }} exit={{ y: '-110%' }}
                  transition={{ type: 'spring', damping: 27, stiffness: 121, mass: 0.3, delay: 0.08 + i * 0.06 }}>
                  <NavLink to={l.to} end={l.end} onClick={() => setOpen(false)}
                    style={({ isActive }) => ({
                      display: 'block', padding: '0.06em 0',
                      fontFamily: '"General Sans",sans-serif', fontWeight: 600,
                      fontSize: 'clamp(44px, 9vw, calc(72px * var(--k)))', color: isActive ? 'var(--yellow)' : '#fff',
                      textDecoration: 'none', textTransform: 'uppercase',
                    })}>{l.label}</NavLink>
                </motion.div>
              </div>
            ))}

            {/* socials along the foot of the menu */}
            <motion.div onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              style={{ position: 'absolute', bottom: 'clamp(24px, 5vh, 56px)', display: 'flex', gap: 24 }}>
              {SOCIAL.map(sl => (
                <a key={sl.label} href={sl.href} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 'max(calc(14px * var(--k)), var(--fs-min))', letterSpacing: '0.08em', color: 'var(--yellow)', textDecoration: 'none', textTransform: 'uppercase' }}>{sl.label}</a>
              ))}
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
