import React from 'react';

export default function LoadingOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(26,16,8,0.92)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        fontSize: '3rem',
        animation: 'swing 0.9s ease-in-out infinite',
        display: 'inline-block'
      }}>🏮</div>
      <p style={{ color: 'var(--gold)', fontWeight: 700, marginTop: 16, fontSize: '1rem' }}>
        AI가 분석 중입니다...
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 4 }}>
        잠시만 기다려주세요
      </p>
    </div>
  );
}
