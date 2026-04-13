import { useState, useRef, useEffect } from 'react';
import { callAI, saveHistory } from '../services/ai';
import { isLocationQuery, searchAmapPlaces, formatAmapForPrompt, openAmapSearch } from '../services/amap';

export default function ChatV2() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatAmapResults, setChatAmapResults] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text) {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: msg, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    let amapContext = '';
    let places = [];
    if (isLocationQuery(msg)) {
      places = await searchAmapPlaces(msg);
      if (places.length > 0) amapContext = formatAmapForPrompt(places);
    }

    try {
      const reply = await callAI(msg, null, amapContext);
      const msgId = Date.now();
      const aiMsg = { role: 'ai', content: reply, id: msgId };
      setMessages(prev => [...prev, aiMsg]);
      if (places.length > 0) setChatAmapResults(prev => ({ ...prev, [msgId]: places }));
      saveHistory({ type: 'chat', question: msg, answer: reply });
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: '⚠️ ' + err.message, id: Date.now() }]);
    }
    setLoading(false);
  }

  const quickQuestions = [
    '근처 한국 식당 찾아줘',
    '이우에 위치한 대형병원을 찾아줘',
    '요즘 뜨는 이우 소재 카페 알려줘',
    '마라탕 어디가 맛있어?',
    '푸텐 시장 어떻게 가?',
    '쇼핑하기 좋은 대형마트 있어?',
    '한국 식품을 파는 곳 알려줘',
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100dvh', background: 'var(--ink)',
      paddingBottom: '72px',
    }}>
      {/* Header */}
      <div className="v2-animate" style={{
        padding: '20px 20px 12px',
        flexShrink: 0,
      }}>
        <div className="v2-eyebrow">텍스트로 질문하기</div>
        <h1 className="v2-heading" style={{ fontSize: '1.5rem', margin: '4px 0 0' }}>
          💬 AI 채팅
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            🤖 Powered by <strong className="v2-gradient-text">Gemini AI</strong>
            &nbsp;·&nbsp;Google AI Studio
          </span>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '8px 10px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* Quick questions */}
        {messages.length === 0 && (
          <div className="v2-animate" style={{ padding: '12px 0 16px' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 10 }}>
              자주 묻는 질문
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {quickQuestions.map(q => (
                <button key={q}
                  className="v2-btn-ghost"
                  onClick={() => sendMessage(q)}
                  style={{ padding: '8px 14px', fontSize: '0.78rem' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map(m => (
          <div key={m.id}>
            {m.role === 'user' && (
              <div style={{
                display: 'flex', justifyContent: 'flex-end', marginBottom: 4,
                animation: 'v2-fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
              }}>
                <div style={{
                  maxWidth: '78%',
                  background: 'linear-gradient(135deg, var(--crimson), var(--crimson-dark))',
                  color: 'white',
                  borderRadius: '20px 20px 4px 20px',
                  padding: '12px 16px',
                  fontSize: '0.88rem', lineHeight: 1.6,
                  boxShadow: '0 4px 16px rgba(196,30,58,0.2)',
                  wordBreak: 'keep-all',
                }}>
                  {m.content}
                </div>
              </div>
            )}

            {m.role === 'ai' && (
              <div style={{
                display: 'flex', gap: 10, marginBottom: 4, alignItems: 'flex-start',
                animation: 'v2-fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(196,30,58,0.15), rgba(212,175,55,0.1))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem',
                }}>🏮</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Double-bezel message */}
                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(212,175,55,0.08)',
                    borderRadius: '4px 20px 20px 20px',
                    padding: 4,
                  }}>
                    <div style={{
                      background: 'rgba(245,240,232,0.95)',
                      borderRadius: '2px 18px 18px 18px',
                      padding: '14px 16px',
                      fontSize: '0.88rem', color: '#1A1008',
                      lineHeight: 1.75, wordBreak: 'keep-all',
                      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3)',
                    }}>
                      {m.content}
                    </div>
                  </div>

                  {/* Amap suggestion card */}
                  {chatAmapResults[m.id]?.length > 0 && (
                    <div style={{
                      background: 'rgba(212,175,55,0.08)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      borderRadius: 14,
                      padding: '10px 14px',
                      marginTop: 10,
                    }}>
                      <p style={{
                        margin: '0 0 8px',
                        fontSize: '0.82rem',
                        color: 'var(--gold)',
                        fontWeight: 600
                      }}>
                        🗺️ 고덕지도에서 위치를 확인해보시겠어요?
                      </p>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {chatAmapResults[m.id]?.slice(0, 3).map((place, i) => (
                          <button
                            key={i}
                            onClick={() => openAmapSearch(place.name)}
                            style={{
                              background: 'linear-gradient(135deg, #C41E3A, #8B0000)',
                              color: 'white',
                              border: 'none',
                              borderRadius: 100,
                              padding: '6px 14px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontFamily: 'Noto Sans KR'
                            }}>
                            📍 {place.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div style={{
            display: 'flex', gap: 10, alignItems: 'flex-start',
            animation: 'v2-fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(196,30,58,0.15), rgba(212,175,55,0.1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem',
            }}>🏮</div>
            <div style={{
              background: 'rgba(245,240,232,0.95)',
              borderRadius: '4px 20px 20px 20px',
              padding: '14px 18px', display: 'flex', gap: 8, alignItems: 'center',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)',
            }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--crimson)',
                  animation: `v2-pulse-dot 1.2s cubic-bezier(0.16, 1, 0.3, 1) infinite ${i * 0.15}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar — glass */}
      <div style={{
        padding: '10px 10px 14px',
        background: 'rgba(26,16,8,0.88)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(212,175,55,0.08)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
            }}
            placeholder="중국 생활에 대해 무엇이든..."
            rows={1}
            style={{
              flex: 1, padding: '12px 18px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(212,175,55,0.12)',
              borderRadius: 24, color: 'var(--cream)',
              fontFamily: 'Noto Sans KR', fontSize: '0.9rem',
              outline: 'none', resize: 'none',
              maxHeight: 100, overflowY: 'auto',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'rgba(212,175,55,0.35)';
              e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.06)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(212,175,55,0.12)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              borderRadius: 24,
              padding: '10px 18px',
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, var(--crimson), var(--crimson-dark))'
                : 'rgba(255,255,255,0.06)',
              border: input.trim() && !loading
                ? 'none'
                : '1px solid rgba(255,255,255,0.06)',
              cursor: input.trim() && !loading ? 'pointer' : 'default',
              fontSize: '0.85rem', fontWeight: 700,
              fontFamily: 'Noto Sans KR',
              color: 'white',
              display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: input.trim() && !loading ? '0 4px 16px rgba(196,30,58,0.25)' : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? '⏳' : '보내기'}
          </button>
        </div>
      </div>
    </div>
  );
}
