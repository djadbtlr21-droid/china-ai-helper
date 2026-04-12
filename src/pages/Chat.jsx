import React, { useState, useRef, useEffect } from 'react';
import { callQwen } from '../services/qwen';

const STARTERS = [
  '이우에서 병원 가려면 어떻게 해?',
  '중국에서 택시 부르는 방법 알려줘',
  '위챗페이 사용 방법이 뭐야?',
  '중국 편의점에서 추천 음식은?',
  '이우 시장 가는 방법 알려줘',
  '약국에서 어떻게 말해야 해?',
  '중국 마트에서 한국 음식 비슷한 거 찾으려면?',
  '비자 연장은 어디서 해?',
];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text) {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const reply = await callQwen(msg);
      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: '⚠️ ' + err.message }]);
    }
    setLoading(false);
  }

  return (
    <div className="page" style={{ background: 'transparent', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 12px', flexShrink: 0 }}>
        <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700,
          color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          텍스트로 질문하기
        </p>
        <h1 style={{ margin: '3px 0 0', fontSize: '1.4rem', fontWeight: 700,
          fontFamily: 'Noto Serif KR', color: 'var(--cream)' }}>
          💬 AI 채팅
        </h1>
      </div>

      {/* Messages or starters */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {messages.length === 0 ? (
          <div>
            <p style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: 12, fontSize: '0.9rem' }}>
              자주 묻는 질문
            </p>
            {STARTERS.map(q => (
              <button key={q} onClick={() => sendMessage(q)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: 'rgba(212,175,55,0.07)',
                  border: '1px solid rgba(212,175,55,0.18)',
                  borderRadius: 12, padding: '12px 16px',
                  marginBottom: 8, cursor: 'pointer',
                  color: 'var(--cream)', fontSize: '0.86rem',
                  fontFamily: 'Noto Sans KR', lineHeight: 1.5
                }}>
                💬 {q}
              </button>
            ))}
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 12
              }}>
                {m.role === 'ai' && (
                  <span style={{ fontSize: '1.3rem', marginRight: 8, alignSelf: 'flex-end' }}>🏮</span>
                )}
                <div style={{
                  maxWidth: '80%', padding: '12px 16px', borderRadius: 16,
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, var(--crimson), var(--crimson-dark))'
                    : 'var(--card-bg)',
                  color: m.role === 'user' ? 'white' : 'var(--text-primary)',
                  fontSize: '0.88rem', lineHeight: 1.7,
                  boxShadow: 'var(--card-shadow)',
                  border: m.role === 'ai' ? '1px solid var(--card-border)' : 'none',
                  whiteSpace: 'pre-wrap',
                  borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                  borderBottomLeftRadius: m.role === 'ai' ? 4 : 16,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: '1.3rem' }}>🏮</span>
                <div style={{
                  padding: '12px 16px', borderRadius: 16, background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)', fontSize: '0.88rem',
                  color: 'var(--text-muted)'
                }}>
                  분석 중...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input bar */}
      <div style={{
        position: 'fixed', bottom: 64, left: 0, right: 0,
        padding: '10px 16px',
        background: 'rgba(26,16,8,0.96)',
        borderTop: '1px solid rgba(212,175,55,0.12)',
        display: 'flex', gap: 10, alignItems: 'flex-end'
      }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
          placeholder="중국 생활에 대해 무엇이든..."
          rows={1}
          style={{
            flex: 1, background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: 12, padding: '10px 14px',
            color: 'var(--cream)', fontFamily: 'Noto Sans KR',
            fontSize: '0.9rem', resize: 'none', outline: 'none',
            maxHeight: 100
          }}
        />
        <button className="btn-primary"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{ padding: '12px 18px', flexShrink: 0 }}>
          전송
        </button>
      </div>
    </div>
  );
}
