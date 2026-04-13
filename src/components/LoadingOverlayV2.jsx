import { useEffect, useRef } from 'react';

export default function LoadingOverlayV2({ visible }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!overlayRef.current) return;
    if (visible) {
      overlayRef.current.style.display = 'flex';
      requestAnimationFrame(() => {
        overlayRef.current.style.opacity = '1';
      });
    } else {
      overlayRef.current.style.opacity = '0';
      const t = setTimeout(() => {
        if (overlayRef.current) overlayRef.current.style.display = 'none';
      }, 400);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(26,16,8,0.92)',
        backdropFilter: 'blur(12px)',
        display: 'none', opacity: 0,
        flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        width: 200, height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,30,58,0.2), transparent 70%)',
        animation: 'v2-glow-pulse 2s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Lantern */}
      <div style={{
        fontSize: '3.5rem',
        animation: 'v2-swing 2s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        display: 'inline-block',
        filter: 'drop-shadow(0 0 24px rgba(196,30,58,0.6))',
        position: 'relative', zIndex: 1,
      }}>
        🏮
      </div>

      {/* Text */}
      <p style={{
        color: 'var(--gold)',
        fontWeight: 700,
        marginTop: 20,
        fontSize: '1rem',
        fontFamily: 'Noto Serif KR, serif',
        letterSpacing: '-0.01em',
        position: 'relative', zIndex: 1,
      }}>
        AI가 분석 중입니다
      </p>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16, position: 'relative', zIndex: 1 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--gold)',
            animation: `v2-pulse-dot 1.2s cubic-bezier(0.16, 1, 0.3, 1) infinite ${i * 0.15}s`,
          }} />
        ))}
      </div>

      <p style={{
        color: 'var(--text-muted)',
        fontSize: '0.72rem',
        marginTop: 20,
        position: 'relative', zIndex: 1,
      }}>
        Powered by Gemini AI · Google
      </p>
    </div>
  );
}
