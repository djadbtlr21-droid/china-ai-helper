import { useState, useRef, useEffect } from 'react';
import { callAI, saveHistory } from '../services/ai';
import { isLocationQuery, searchAmapPlaces, formatAmapForPrompt, openAmapNavi } from '../services/amap';

export default function Chat() {
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
      if (places.length > 0) {
        amapContext = formatAmapForPrompt(places);
      }
    }

    try {
      const reply = await callAI(msg, null, amapContext);
      const msgId = Date.now();
      const aiMsg = { role: 'ai', content: reply, id: msgId };
      setMessages(prev => [...prev, aiMsg]);
      if (places.length > 0) {
        setChatAmapResults(prev => ({ ...prev, [msgId]: places }));
      }
      // Auto save to history
      saveHistory({ type: 'chat', question: msg, answer: reply });
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: '⚠️ ' + err.message, id: Date.now() }]);
    }
    setLoading(false);
  }

  const quickQuestions = [
    '근처 한국 식당 찾아줘',
    '이우에 병원 어디있어?',
    '단시로에 카페 알려줘',
    '마라탕 어디가 맛있어?',
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'var(--ink)',
      paddingBottom: '60px'
    }}>

      {/* Header - fixed */}
      <div style={{
        padding: '16px 20px 8px',
        background: 'var(--ink)',
        flexShrink: 0
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0 0 4px' }}>
          텍스트로 질문하기
        </p>
        <h1 style={{
          fontFamily: 'Noto Serif KR',
          color: 'var(--cream)',
          fontSize: '1.5rem',
          margin: '0 0 4px'
        }}>
          💬 AI 채팅
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: '0.68rem', color: 'rgba(212,175,55,0.5)' }}>
            🤖 Powered by <strong style={{ color: 'var(--gold)' }}>Gemini AI</strong>
            &nbsp;·&nbsp;Google AI Studio
          </span>
        </div>
      </div>

      {/* Messages - scrollable */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>

        {/* Quick questions */}
        {messages.length === 0 && (
          <div style={{ padding: '8px 0 12px' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
              자주 묻는 질문
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {quickQuestions.map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    borderRadius: 100, padding: '8px 14px',
                    fontSize: '0.78rem', color: 'var(--gold)',
                    cursor: 'pointer', fontFamily: 'Noto Sans KR'
                  }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((m) => (
          <div key={m.id}>
            {/* User bubble */}
            {m.role === 'user' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                <div style={{
                  maxWidth: '78%',
                  background: 'var(--crimson)',
                  color: 'white',
                  borderRadius: '18px 18px 4px 18px',
                  padding: '10px 14px',
                  fontSize: '0.88rem',
                  lineHeight: 1.5
                }}>
                  {m.content}
                </div>
              </div>
            )}

            {/* AI bubble */}
            {m.role === 'ai' && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 4, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>🏮</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    background: 'var(--cream)',
                    borderRadius: '4px 18px 18px 18px',
                    padding: '12px 14px',
                    fontSize: '0.88rem',
                    color: 'var(--ink)',
                    lineHeight: 1.7
                  }}>
                    {m.content}
                  </div>

                  {/* Amap results */}
                  {chatAmapResults[m.id]?.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {/* 바로 길찾기 버튼 */}
                      <button
                        onClick={() => openAmapNavi(
                          chatAmapResults[m.id][0].name,
                          chatAmapResults[m.id][0].location
                        )}
                        style={{
                          width: '100%', padding: '12px',
                          background: 'linear-gradient(135deg, #C41E3A, #8B0000)',
                          color: 'white', border: 'none', borderRadius: 14,
                          fontSize: '0.88rem', fontWeight: 700,
                          cursor: 'pointer', marginBottom: 8,
                          boxShadow: '0 4px 0 rgba(139,0,0,0.4)',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', gap: 8,
                          fontFamily: 'Noto Sans KR'
                        }}>
                        🗺️ 고덕지도로 바로 길찾기 → {chatAmapResults[m.id][0].name}
                      </button>

                      {/* 장소 카드 */}
                      {chatAmapResults[m.id].map((place, i) => (
                        <div key={i} style={{
                          background: 'var(--cream)',
                          borderRadius: 12, padding: '10px 14px',
                          marginBottom: 6
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)' }}>
                                {i === 0 ? '🥇 ' : `${i + 1}. `}{place.name}
                              </p>
                              <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>
                                📍 {place.address}
                              </p>
                              {place.tel && (
                                <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#888' }}>
                                  📞 {place.tel}
                                </p>
                              )}
                              {place.rating && (
                                <span style={{ fontSize: '0.7rem', color: '#D4AF37' }}>⭐ {place.rating}</span>
                              )}
                            </div>
                            {place.location && (
                              <button onClick={() => openAmapNavi(place.name, place.location)}
                                style={{
                                  background: '#C41E3A', color: 'white', border: 'none',
                                  borderRadius: 100, padding: '6px 12px',
                                  fontSize: '0.72rem', fontWeight: 700,
                                  cursor: 'pointer', flexShrink: 0, marginLeft: 8,
                                  fontFamily: 'Noto Sans KR'
                                }}>
                                🗺️ 길찾기
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.3rem' }}>🏮</span>
            <div style={{
              background: 'var(--cream)', borderRadius: '4px 18px 18px 18px',
              padding: '12px 16px', display: 'flex', gap: 6, alignItems: 'center'
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%',
                background: 'var(--crimson)', animation: 'pulse 1s infinite' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%',
                background: 'var(--crimson)', animation: 'pulse 1s infinite 0.2s' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%',
                background: 'var(--crimson)', animation: 'pulse 1s infinite 0.4s' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input - fixed at bottom */}
      <div style={{
        padding: '10px 16px',
        background: 'rgba(26,16,8,0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--card-border)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="중국 생활에 대해 무엇이든..."
            rows={1}
            style={{
              flex: 1, padding: '12px 16px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--card-border)',
              borderRadius: 24, color: 'var(--cream)',
              fontFamily: 'Noto Sans KR', fontSize: '0.9rem',
              outline: 'none', resize: 'none',
              maxHeight: 100, overflowY: 'auto'
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 46, height: 46, borderRadius: '50%',
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, var(--crimson), var(--crimson-dark))'
                : 'rgba(255,255,255,0.1)',
              border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
              fontSize: '1.2rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.2s'
            }}>
            {loading ? '⏳' : '🚀'}
          </button>
        </div>
      </div>
    </div>
  );
}
