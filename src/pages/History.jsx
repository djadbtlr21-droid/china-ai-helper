import { useState, useEffect } from 'react';
import { getHistory, deleteHistory } from '../services/ai';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

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
        height: '80vh', gap: 12
      }}>
        <span style={{ fontSize: '3rem' }}>📋</span>
        <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1rem', margin: 0 }}>
          저장된 기록이 없습니다
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
          AI 분석/채팅 결과가 자동으로 저장됩니다
        </p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px' }}>
        <h1 style={{
          fontFamily: 'Noto Serif KR', color: 'var(--cream)',
          fontSize: '1.5rem', margin: '0 0 4px'
        }}>
          📋 AI 기록
        </h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            총 {history.length}개 기록
          </span>
          <button onClick={handleClearAll}
            style={{
              background: 'none', border: '1px solid rgba(196,30,58,0.3)',
              borderRadius: 100, padding: '4px 12px',
              fontSize: '0.72rem', color: 'var(--crimson)',
              cursor: 'pointer', fontFamily: 'Noto Sans KR'
            }}>
            전체 삭제
          </button>
        </div>
      </div>

      {/* History list */}
      <div style={{ padding: '0 16px' }}>
        {history.map((item) => (
          <div key={item.id} className="card fade"
            style={{ marginBottom: 12, padding: 16 }}>

            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1rem' }}>
                  {item.type === 'chat' ? '💬' : '🤖'}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {new Date(item.date).toLocaleDateString('ko-KR', {
                    month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              <button onClick={() => handleDelete(item.id)}
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem'
                }}>
                🗑
              </button>
            </div>

            {/* Thumbnail */}
            {item.thumbnail && (
              <img src={item.thumbnail} alt=""
                style={{ width: '100%', height: 120, objectFit: 'cover',
                  borderRadius: 10, marginBottom: 10 }} />
            )}

            {/* Question */}
            {item.question && (
              <p style={{
                margin: '0 0 6px', fontSize: '0.82rem',
                color: 'var(--gold)', fontWeight: 600
              }}>
                Q. {item.question}
              </p>
            )}

            {/* Answer preview */}
            <p style={{
              margin: 0, fontSize: '0.82rem',
              color: 'var(--text-secondary)', lineHeight: 1.6,
              display: '-webkit-box', WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical', overflow: 'hidden'
            }}>
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
