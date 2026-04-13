import { useState, useRef, useEffect } from 'react';
import { callAI, saveHistory } from '../services/ai';
import { isLocationQuery, searchAmapPlaces, formatAmapForPrompt, openAmapSearch, getRelevantAreas } from '../services/amap';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatAmapResults, setChatAmapResults] = useState({});
  const [locationMessageIds, setLocationMessageIds] = useState(new Set());
  const [lastUserMessage, setLastUserMessage] = useState('');
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
    const isLocation = isLocationQuery(msg);
    if (isLocation) {
      setLastUserMessage(msg);
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
      if (isLocation) {
        setLocationMessageIds(prev => new Set([...prev, msgId]));
      }
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
    '이우에 위치한 대형병원을 찾아줘',
    '요즘 뜨는 이우 소재 카페 알려줘',
    '마라탕 어디가 맛있어?',
    '푸텐 시장 어떻게 가?',
    '쇼핑하기 좋은 대형마트 있어?',
    '한국 식품을 파는 곳 알려줘',
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
        padding: '8px 10px',
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

                  {/* Area suggestion card */}
                  {locationMessageIds.has(m.id) && (
                    <div style={{
                      background: 'rgba(212,175,55,0.08)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      borderRadius: 14,
                      padding: '12px 14px',
                      marginTop: 8,
                    }}>
                      <p style={{ margin:'0 0 10px', fontSize:'0.82rem', color:'var(--gold)', fontWeight:700 }}>
                        🗺️ 이우에서 이런 곳은 어떠세요?
                      </p>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                        {getRelevantAreas(lastUserMessage).map((area, i) => (
                          <button key={i} onClick={() => openAmapSearch(area.nameZh)}
                            style={{ background:'rgba(196,30,58,0.15)', border:'1px solid rgba(196,30,58,0.3)', borderRadius:100, padding:'7px 14px', fontSize:'0.78rem', fontWeight:600, color:'var(--cream)', cursor:'pointer', fontFamily:'Noto Sans KR' }}>
                            📍 {area.nameKo}
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
        padding: '10px 10px',
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
              borderRadius: 24,
              padding: '10px 18px',
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, var(--crimson), var(--crimson-dark))'
                : 'rgba(255,255,255,0.1)',
              border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
              fontSize: '0.85rem', fontWeight: 700,
              fontFamily: 'Noto Sans KR',
              color: 'white',
              display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}>
            {loading ? '⏳' : '보내기'}
          </button>
        </div>
      </div>
    </div>
  );
}
