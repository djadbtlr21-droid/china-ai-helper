import React from 'react';

export default function ItemDetailModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(26,16,8,0.85)',
      backdropFilter: 'blur(8px)'
    }} onClick={onClose}>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--cream)',
        borderRadius: '24px 24px 0 0',
        padding: '20px 20px 48px',
        maxHeight: '88vh', overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>

        {/* Handle */}
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: 'var(--card-border)', margin: '0 auto 16px'
        }} />

        {/* Emoji or user image */}
        {item.userImage ? (
          <img src={item.userImage} alt=""
            style={{
              width: 100, height: 100, borderRadius: 16,
              objectFit: 'cover', margin: '0 auto 8px', display: 'block'
            }} />
        ) : (
          <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: 8 }}>
            {item.emoji}
          </div>
        )}

        {/* Name */}
        <h2 style={{
          textAlign: 'center', fontFamily: 'Noto Serif KR',
          color: 'var(--text-primary)', margin: '0 0 4px', fontSize: '1.25rem'
        }}>{item.nameKo}</h2>
        <p style={{
          textAlign: 'center', color: 'var(--text-muted)',
          margin: '0 0 16px', fontSize: '0.85rem'
        }}>{item.nameZh}</p>

        <div className="gold-divider" />

        {/* Description */}
        <h3 style={{ color: 'var(--crimson)', fontSize: '0.82rem', fontWeight: 700, margin: '0 0 8px' }}>
          📋 설명
        </h3>
        <p style={{ color: 'var(--text-primary)', lineHeight: 1.75, fontSize: '0.9rem', margin: '0 0 16px' }}>
          {item.description}
        </p>

        {/* How to use */}
        {item.howToUse && (
          <>
            <h3 style={{ color: 'var(--crimson)', fontSize: '0.82rem', fontWeight: 700, margin: '0 0 8px' }}>
              💡 사용법 / 먹는 방법
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.88rem', margin: '0 0 16px' }}>
              {item.howToUse}
            </p>
          </>
        )}

        {/* Warning */}
        {item.warning && (
          <div className="warning-box" style={{ marginBottom: 16 }}>
            ⚠️ {item.warning}
          </div>
        )}

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {item.tags?.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
