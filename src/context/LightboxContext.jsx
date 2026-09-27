import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const Ctx = createContext(null);

export function LightboxProvider({ children }) {
  const [state, setState] = useState({ isOpen: false, videos: [], idx: 0 });

  const open  = useCallback((vids, idx = 0) => setState({ isOpen: true, videos: vids, idx }), []);
  const close = useCallback(() => setState(s => ({ ...s, isOpen: false })), []);
  const next  = useCallback(() => setState(s => ({ ...s, idx: (s.idx + 1) % s.videos.length })), []);
  const prev  = useCallback(() => setState(s => ({ ...s, idx: (s.idx - 1 + s.videos.length) % s.videos.length })), []);

  useEffect(() => {
    const h = e => {
      if (!state.isOpen) return;
      if (e.key === 'Escape')      close();
      if (e.key === 'ArrowRight')  next();
      if (e.key === 'ArrowLeft')   prev();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [state.isOpen, close, next, prev]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = state.isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [state.isOpen]);

  return (
    <Ctx.Provider value={{ isOpen: state.isOpen, videos: state.videos, idx: state.idx, open, close, next, prev }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLightbox = () => useContext(Ctx);
