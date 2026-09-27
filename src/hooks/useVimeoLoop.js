import { useEffect } from 'react';

/**
 * Drives a Vimeo background iframe as a short looping preview — the film's own
 * opening seconds standing in for a GIF, with no extra asset to ship and no
 * transcode. Seeks back to the start every `clipMs`.
 *
 * Pass `full` to let it run on instead (used on hover, where the whole film
 * should play rather than the teaser).
 */
export function useVimeoLoop(iframeRef, { ready, full = false, clipMs = 3000 }) {
  useEffect(() => {
    if (!ready) return;
    const win = iframeRef.current && iframeRef.current.contentWindow;
    if (!win) return;
    const send = (m) => win.postMessage(JSON.stringify(m), '*');

    send({ method: 'setCurrentTime', value: 0 });
    send({ method: 'play' });
    if (full) return;

    const t = setInterval(() => send({ method: 'setCurrentTime', value: 0 }), clipMs);
    return () => clearInterval(t);
  }, [iframeRef, ready, full, clipMs]);
}
