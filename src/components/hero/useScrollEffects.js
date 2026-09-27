import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Pins the hero for one viewport's worth of scroll and scrubs:
 *  - the collage scaling down (1 -> 0.85)
 *  - each floating card spreading outward at its own speed
 *  - the background gaining blur
 *  - the headline drifting upward slower than scroll
 */
export function useScrollEffects({ containerRef, collageRef, headlineRef, blurRef, cardRefs, disabled = false }) {
  useEffect(() => {
    if (disabled || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=90%',
          scrub: true,
          pin: true,
          pinSpacing: true,
        },
      });

      if (collageRef.current) {
        tl.to(collageRef.current, { scale: 0.85, ease: 'none' }, 0);
      }
      if (headlineRef.current) {
        // Moves up, but slower than the scroll itself (parallax feel)
        tl.to(headlineRef.current, { y: -90, ease: 'none' }, 0);
      }
      if (blurRef.current) {
        tl.to(blurRef.current, { filter: 'blur(10px)', ease: 'none' }, 0);
      }

      (cardRefs.current || []).forEach((el, i) => {
        if (!el) return;
        const angle = (i / Math.max(1, cardRefs.current.length)) * Math.PI * 2;
        const distance = 60 + i * 18;
        tl.to(
          el,
          {
            x: `+=${Math.cos(angle) * distance}`,
            y: `+=${Math.sin(angle) * distance}`,
            ease: 'none',
          },
          0
        );
      });
    });

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [containerRef, collageRef, headlineRef, blurRef, cardRefs, disabled]);
}
