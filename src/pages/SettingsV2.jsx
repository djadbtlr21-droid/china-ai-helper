import { useState } from 'react';

export default function SettingsV2() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  function saveKey() {
    localStorage.setItem('geminiApiKey', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const isValid = apiKey.startsWith('AIza') && apiKey.length >= 39;

  return (
    <div className="v2-page">
      <div className="v2-animate" style={{ padding: '24px 20px 12px' }}>
        <div className="v2-eyebrow">앱 설정</div>
        <h1 className="v2-heading" style={{ fontSize: '1.5rem', margin: '4px 0 0' }}>
          ⚙️ 설정
        </h1>
      </div>

      {/* API Key — Double Bezel */}
      <div className="v2-card v2-animate v2-animate-delay-1" style={{ margin: '0 10px 14px' }}>
        <div className="v2-card-inner" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(196,30,58,0.08))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem',
            }}>🔑</div>
            <div>
              <p style={{ fontWeight: 700, margin: 0, color: 'var(--cream)', fontSize: '0.95rem' }}>
                Gemini API 키
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Google AI Studio (무료)
              </p>
            </div>
          </div>

          {/* Powered by badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 14px',
            background: 'rgba(212,175,55,0.05)',
            borderRadius: 14, marginBottom: 14,
            border: '1px solid rgba(212,175,55,0.1)',
          }}>
            <span style={{ fontSize: '1.1rem' }}>🤖</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700 }}>
                <span className="v2-gradient-text">Powered by Gemini AI</span>
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                Google AI Studio · 무료 제공
              </p>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIzaxxxxxxxxxxxxxxxx"
              style={{
                width: '100%', padding: '13px 44px 13px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${isValid ? 'rgba(52,199,89,0.4)' : 'rgba(212,175,55,0.15)'}`,
                borderRadius: 14, fontFamily: 'monospace',
                fontSize: '0.85rem', color: 'var(--cream)', outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
            <button onClick={() => setShowKey(!showKey)} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem',
            }}>{showKey ? '🙈' : '👁'}</button>
          </div>

          {apiKey && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: isValid ? '#34C759' : '#FF3B30',
                boxShadow: isValid ? '0 0 8px rgba(52,199,89,0.4)' : '0 0 8px rgba(255,59,48,0.4)',
              }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isValid ? '유효한 키 형식입니다' : 'AIza로 시작해야 합니다'}
              </span>
            </div>
          )}

          <button className="v2-btn-primary" style={{ width: '100%', marginTop: 16 }}
            onClick={saveKey}>
            {saved ? '✓ 저장됨' : '저장하기'}
          </button>
        </div>
      </div>

      {/* Amap info */}
      <div className="v2-card v2-animate v2-animate-delay-2" style={{ margin: '0 10px 14px' }}>
        <div className="v2-card-inner" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(196,30,58,0.1), rgba(212,175,55,0.08))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem',
            }}>🗺️</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, margin: 0, color: 'var(--cream)', fontSize: '0.95rem' }}>
                고덕지도 (Amap) API
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                장소 검색 · 길찾기 연동
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: '#34C759',
                boxShadow: '0 0 8px rgba(52,199,89,0.4)',
              }} />
              <span style={{ fontSize: '0.72rem', color: '#34C759', fontWeight: 700 }}>연동됨</span>
            </div>
          </div>
          <div className="v2-divider" />
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65, wordBreak: 'keep-all' }}>
            위치 관련 질문 시 자동으로 실시간 장소 데이터를 검색합니다.
            예: "근처 한국 식당 알려줘", "이우에 병원 어디 있어?"
          </p>
        </div>
      </div>

      {/* Guide */}
      <div className="v2-card v2-animate v2-animate-delay-3" style={{ margin: '0 10px 14px' }}>
        <div className="v2-card-inner" style={{ padding: 18 }}>
          <p style={{ fontWeight: 700, color: 'var(--gold)', margin: '0 0 14px', fontSize: '0.9rem' }}>
            🔗 API 키 무료 발급 방법
          </p>
          <div className="v2-divider" />
          {[
            '1. aistudio.google.com 접속',
            '2. 로그인 후 \'Get API key\' 클릭',
            '3. \'Create API key\' 선택',
            '4. 생성된 키 복사 (AIza로 시작)',
            '5. 위 입력창에 붙여넣기',
            '6. 무료로 사용 가능 (분당 15회 제한)',
          ].map(step => (
            <p key={step} style={{
              margin: '0 0 8px', fontSize: '0.83rem',
              color: 'var(--text-secondary)', lineHeight: 1.65,
            }}>{step}</p>
          ))}
        </div>
      </div>

      {/* App info */}
      <div className="v2-card v2-animate v2-animate-delay-4" style={{ margin: '0 10px 16px' }}>
        <div className="v2-card-inner" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, rgba(196,30,58,0.12), rgba(212,175,55,0.08))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem',
            animation: 'v2-float 5s ease-in-out infinite',
          }}>🏮</div>
          <p style={{ color: 'var(--gold)', fontWeight: 700, margin: '0 0 4px', fontSize: '1rem',
            fontFamily: 'Noto Serif KR' }}>
            중국생활 AI 도우미
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>
            Powered by Gemini AI · 이우 한인을 위해 만들어졌습니다
          </p>
          <div className="v2-divider" />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', margin: 0 }}>
            백과사전은 AI 없이 오프라인으로 이용 가능합니다
          </p>
        </div>
      </div>
    </div>
  );
}
