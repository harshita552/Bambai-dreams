export default function BackgroundLayer({ blurRef }) {
  return (
    <div
      ref={blurRef}
      aria-hidden
      style={{
        position: 'absolute', inset: 0,
        background: '#000',
        willChange: 'filter',
      }}
    />
  );
}
