import { useEffect, useRef } from 'react';

export default function ItemDetailModalV2({ item, onClose }) {
  const backdropRef = useRef(null);
  const sheetRef = useRef(null);

  useEffect(() => {
    if (!item) return;
    // Animate in
    if (backdropRef.current) {
      backdropRef.current.style.opacity = '0';
      requestAnimationFrame(() => {
        backdropRef.current.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        backdropRef.current.style.opacity = '1';
      });
    }
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(100%)';
      requestAnimationFrame(() => {
        sheetRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        sheetRef.current.style.transform = 'translateY(0)';
      });
    }
  }, [item]);

  if (!item) return null;

  return (
    <div
      ref={backdropRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(26,16,8,0.85)',
        backdropFilter: 'blur(12px)',
      }}
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          borderRadius: '28px 28px 0 0',
          padding: 6,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(212,175,55,0.1)',
          borderBottom: 'none',
          maxHeight: '88vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Inner bezel */}
        <div style={{
          background: 'var(--cream)',
          borderRadius: '24px 24px 0 0',
          padding: '20px 20px 48px',
          maxHeight: 'calc(88vh - 12px)',
          overflowY: 'auto',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3)',
        }}>
          {/* Handle */}
          <div style={{
            width: 40, height: 4, borderRadius: 2,
            background: 'rgba(26,16,8,0.15)',
            margin: '0 auto 20px',
          }} />

          {/* Emoji or user image */}
          {item.userImage ? (
            <img src={item.userImage} alt=""
              style={{
                width: 100, height: 100, borderRadius: 20,
                objectFit: 'cover', margin: '0 auto 12px', display: 'block',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }} />
          ) : (
            <div style={{
              width: 80, height: 80, borderRadius: 20, margin: '0 auto 12px',
              background: 'linear-gradient(135deg, rgba(196,30,58,0.1), rgba(212,175,55,0.08))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem',
            }}>
              {item.emoji}
            </div>
          )}

          {/* Name */}
          <h2 style={{
            textAlign: 'center', fontFamily: 'Noto Serif KR',
            color: '#1A1008', margin: '0 0 4px', fontSize: '1.25rem',
            fontWeight: 700, letterSpacing: '-0.01em',
          }}>{item.nameKo}</h2>
          <p style={{
            textAlign: 'center', color: '#8B7355',
            margin: '0 0 20px', fontSize: '0.85rem',
          }}>{item.nameZh}</p>

          <div className="v2-divider" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,30,58,0.15), transparent)' }} />

          {/* Description */}
          <h3 style={{ color: 'var(--crimson)', fontSize: '0.82rem', fontWeight: 700, margin: '0 0 8px' }}>
            📋 설명
          </h3>
          <p style={{ color: '#1A1008', lineHeight: 1.8, fontSize: '0.9rem', margin: '0 0 16px', wordBreak: 'keep-all' }}>
            {item.description}
          </p>

          {/* How to use */}
          {item.howToUse && (
            <>
              <h3 style={{ color: 'var(--crimson)', fontSize: '0.82rem', fontWeight: 700, margin: '0 0 8px' }}>
                💡 사용법 / 먹는 방법
              </h3>
              <p style={{ color: '#5C3D2E', lineHeight: 1.8, fontSize: '0.88rem', margin: '0 0 16px', wordBreak: 'keep-all' }}>
                {item.howToUse}
              </p>
            </>
          )}

          {/* Warning */}
          {item.warning && (
            <div style={{
              padding: '12px 16px', background: 'rgba(196,30,58,0.06)',
              borderRadius: 12, borderLeft: '3px solid var(--crimson)',
              fontSize: '0.8rem', color: 'var(--crimson)', marginBottom: 16,
            }}>
              ⚠️ {item.warning}
            </div>
          )}

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
            {item.tags?.map(tag => (
              <span key={tag} style={{
                display: 'inline-block', fontSize: '0.68rem',
                padding: '3px 10px', background: 'rgba(212,175,55,0.1)',
                borderRadius: 100, color: '#5C3D2E', fontWeight: 500,
              }}>#{tag}</span>
            ))}
          </div>

          <button
            className="v2-btn-primary"
            style={{ width: '100%' }}
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
