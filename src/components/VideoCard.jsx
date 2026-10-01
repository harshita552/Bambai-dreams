import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLightbox } from '../context/LightboxContext';
import { useVimeoLoop } from '../hooks/useVimeoLoop';
import { toPlayerUrl } from '../data/videos';
import { coverFor } from '../data/workVideos';

function GradientThumb({ video }) {
  const [g1, g2] = video.grad || ['#2a1a0e', '#1a1612'];
  return (
    <div style={{
      width:'100%', height:'100%', position:'absolute', inset:0,
      background:`linear-gradient(145deg, ${g1} 0%, ${g2} 100%)`,
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', gap:10,
    }}>
      <p style={{
        fontFamily:'"Playfair Display",serif', fontStyle:'italic',
        color:'#f4f4f4', opacity:0.5, fontSize:11,
        textAlign:'center', padding:'0 18px', lineHeight:1.4, maxWidth:200,
      }}>{video.title}</p>
    </div>
  );
}

export default function VideoCard({
  video, allVideos, aspectRatio = '56.25%',
  style, className = '', compact = false,
}) {
  const [hovered,  setHovered]  = useState(false);
  const [inView,   setInView]   = useState(false);
  const [imgError, setImgError] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const ref = useRef(null);
  const [coverReady, setCoverReady] = useState(false);
  const previewRef = useRef(null);
  const lb  = useLightbox();

  useVimeoLoop(previewRef, { ready: inView && previewReady, full: hovered });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold:0.05, rootMargin:'300px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleClick = () => {
    const list = allVideos || [video];
    const i = list.findIndex(v => v.id === video.id);
    lb.open(list, i >= 0 ? i : 0);
  };

  // Cards from older lists carry no cover of their own; look it up by film.
  const art = video.cover ? video : coverFor(video.embed_url);

  const derivedThumb = (() => {
    if (art.poster) return art.poster;
    if (video.thumbnail_url) return video.thumbnail_url;
    const m = (video.embed_url || '').match(/vimeo\.com\/video\/(\d+)/);
    return m ? `https://vumbnail.com/${m[1]}.jpg` : '';
  })();
  const hasThumbnail = derivedThumb && !imgError;

  return (
    <motion.article
      ref={ref} className={className}
      data-cursor="PLAY"
      style={{
        position:'relative', overflow:'hidden',
        border:'1px solid var(--cream-dark)',
        cursor:'none', background:'var(--ink)',
        display:'flex', flexDirection:'column', ...style,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleClick}
      whileHover={{ y:-5, boxShadow:'0 14px 44px rgba(26,22,18,0.30), 0 0 0 2px var(--yellow)' }}
      transition={{ duration:0.22, ease:'easeOut' }}>

      {/* Yellow top accent on hover */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          height:3, background:'var(--yellow)',
          transformOrigin:'left', flexShrink:0,
        }}/>

      {/* Thumbnail area */}
      <div style={{ position:'relative', paddingTop:aspectRatio, flexShrink:0 }}>
        <GradientThumb video={video}/>

        {/* Thumbnail — always visible, video overlays on top */}
        {hasThumbnail && (
          <img
            src={derivedThumb} alt={video.title} loading="lazy"
            onError={() => setImgError(true)}
            style={{
              position:'absolute', inset:0, width:'100%', height:'100%',
              objectFit:'cover', zIndex:1,
            }}/>
        )}

        {/* The card's resting state: the film's first few seconds on a loop, a
            GIF in everything but format. On hover the same player runs on. */}
        {/* A GIF cut from the film's prime scene. The poster above holds the
            frame until it has loaded, and the live Vimeo preview is skipped. */}
        {art.cover ? (inView && (
          <img
            src={art.cover} alt="" aria-hidden decoding="async"
            onLoad={() => setCoverReady(true)}
            style={{
              position:'absolute', inset:0, width:'100%', height:'100%',
              objectFit:'cover', zIndex:2, pointerEvents:'none',
              opacity: coverReady ? 1 : 0, transition:'opacity 0.4s',
            }}/>
        )) : inView && (
          <motion.iframe
            ref={previewRef}
            key={`prev-${video.id}`}
            onLoad={() => setPreviewReady(true)}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.4 }}
            src={toPlayerUrl(video.embed_url, 'background=1&autoplay=1&muted=1&loop=1')}
            style={{
              position:'absolute', inset:0, width:'100%', height:'100%',
              border:'none', zIndex:2, pointerEvents:'none',
            }}
            allow="autoplay"/>
        )}

        {/* Hover info overlay — no play button */}
        {!compact && (
          <motion.div aria-hidden
            initial={{ opacity:0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration:0.25 }}
            style={{
              position:'absolute', inset:0, zIndex:3,
              background:'linear-gradient(to top, rgba(26,22,18,0.82) 0%, rgba(26,22,18,0.0) 55%)',
              display:'flex', flexDirection:'column',
              justifyContent:'flex-end', padding:'16px 14px',
              pointerEvents:'none',
            }}>
            <div>
              {video.client && (
                <span className="yellow-pill" style={{ marginBottom:7, display:'inline-block' }}>
                  {video.client}
                </span>
              )}
              <p style={{
                fontFamily:'"Playfair Display",serif', fontStyle:'italic',
                fontSize:14, color:'#f4f4f4', lineHeight:1.35,
              }}>{video.title}</p>
              {video.celebrity && (
                <p style={{
                  fontFamily:'"DM Sans",sans-serif', fontSize:9,
                  color:'rgba(244,244,244,0.5)', marginTop:4, letterSpacing:'0.1em',
                }}>{video.celebrity}</p>
              )}
            </div>
          </motion.div>
        )}
      </div>

    </motion.article>
  );
}
