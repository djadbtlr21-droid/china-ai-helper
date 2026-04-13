import { useState, useEffect } from 'react';
import { getHistory, deleteHistory } from '../services/ai';

export default function HistoryV2() {
  const [history, setHistory] = useState([]);

  useEffect(() => { setHistory(getHistory()); }, []);

  function handleDelete(id) {
    deleteHistory(id);
    setHistory(getHistory());
  }

  function handleClearAll() {
    if (confirm('모든 기록을 삭제할까요?')) {
      localStorage.removeItem('aiHistory');
      setHistory([]);
    }
  }

  if (history.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '80dvh', gap: 12,
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(196,30,58,0.05))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem',
          animation: 'v2-float 4s ease-in-out infinite',
        }}>📋</div>
        <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1rem', margin: 0,
          fontFamily: 'Noto Serif KR', letterSpacing: '-0.01em' }}>
          저장된 기록이 없습니다
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
          AI 분석/채팅 결과가 자동으로 저장됩니다
        </p>
      </div>
    );
  }

  return (
    <div className="v2-page">
      {/* Header */}
      <div className="v2-animate" style={{ padding: '24px 20px 14px' }}>
        <h1 className="v2-heading" style={{ fontSize: '1.5rem', margin: '0 0 8px' }}>
          📋 AI 기록
        </h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            총 {history.length}개 기록
          </span>
          <button onClick={handleClearAll}
            className="v2-btn-ghost"
            style={{ padding: '5px 14px', fontSize: '0.72rem', color: 'var(--crimson)',
              borderColor: 'rgba(196,30,58,0.2)' }}>
            전체 삭제
          </button>
        </div>
      </div>

      {/* History list */}
      <div className="v2-stagger" style={{ padding: '0 10px' }}>
        {history.map(item => (
          <div key={item.id} className="v2-card" style={{ marginBottom: 12 }}>
            <div className="v2-card-inner" style={{ padding: 16 }}>
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'linear-gradient(135deg, rgba(196,30,58,0.12), rgba(212,175,55,0.08))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem',
                  }}>
                    {item.type === 'chat' ? '💬' : '🤖'}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {new Date(item.date).toLocaleDateString('ko-KR', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                <button onClick={() => handleDelete(item.id)} style={{
                  background: 'none', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>🗑</button>
              </div>

              {/* Thumbnail */}
              {item.thumbnail && (
                <div style={{
                  borderRadius: 12, overflow: 'hidden', marginBottom: 12,
                  border: '1px solid rgba(212,175,55,0.06)',
                }}>
                  <img src={item.thumbnail} alt=""
                    style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }}
                    loading="lazy" />
                </div>
              )}

              {/* Question */}
              {item.question && (
                <p style={{
                  margin: '0 0 6px', fontSize: '0.82rem',
                  color: 'var(--gold)', fontWeight: 600,
                }}>
                  Q. {item.question}
                </p>
              )}

              {/* Answer preview */}
              <p style={{
                margin: 0, fontSize: '0.82rem',
                color: 'var(--text-secondary)', lineHeight: 1.65,
                display: '-webkit-box', WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                wordBreak: 'keep-all',
              }}>
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
