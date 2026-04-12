import React, { useState } from 'react';
import { getHistory, deleteHistory } from '../services/qwen';

export default function History() {
  const [history, setHistory] = useState(getHistory);
  const [selectedItem, setSelectedItem] = useState(null);

  function handleDelete(id) {
    deleteHistory(id);
    setHistory(getHistory());
    if (selectedItem?.id === id) setSelectedItem(null);
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }

  return (
    <div className="page" style={{ background: 'transparent' }}>
      <div style={{ padding: '20px 20px 12px' }}>
        <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700,
          color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          저장된 AI 분석
        </p>
        <h1 style={{ margin: '3px 0 0', fontSize: '1.4rem', fontWeight: 700,
          fontFamily: 'Noto Serif KR', color: 'var(--cream)' }}>
          📋 기록
        </h1>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
          <p style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: 6 }}>
            저장된 기록이 없습니다
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            AI 분석 결과를 저장하면 여기에 쌓입니다
          </p>
        </div>
      ) : (
        <div style={{ padding: '0 16px' }}>
          {history.map(h => (
            <div key={h.id} className="card fade"
              style={{ marginBottom: 10, padding: 16, cursor: 'pointer', position: 'relative' }}
              onClick={() => setSelectedItem(h)}>
              <div style={{ display: 'flex', gap: 12 }}>
                {h.image && (
                  <img src={h.image} alt="" style={{
                    width: 56, height: 56, borderRadius: 10,
                    objectFit: 'cover', flexShrink: 0
                  }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '0.88rem',
                    color: 'var(--crimson)', overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.question}
                  </p>
                  <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDate(h.date)}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)',
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                    {h.answer}
                  </p>
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); handleDelete(h.id); }}
                style={{
                  position: 'absolute', top: 10, right: 10,
                  background: 'none', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem'
                }}>🗑</button>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selectedItem && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(26,16,8,0.85)', backdropFilter: 'blur(8px)'
        }} onClick={() => setSelectedItem(null)}>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'var(--cream)', borderRadius: '24px 24px 0 0',
            padding: '20px 20px 48px', maxHeight: '88vh', overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, borderRadius: 2,
              background: 'var(--card-border)', margin: '0 auto 16px' }} />
            <h3 style={{ color: 'var(--crimson)', margin: '0 0 8px', fontSize: '1rem' }}>
              {selectedItem.question}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '0 0 12px' }}>
              {new Date(selectedItem.date).toLocaleString('ko-KR')}
            </p>
            <div className="gold-divider" />
            <p style={{ color: 'var(--text-primary)', lineHeight: 1.8,
              fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
              {selectedItem.answer}
            </p>
            <button className="btn-primary" style={{ width: '100%', marginTop: 16 }}
              onClick={() => setSelectedItem(null)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
