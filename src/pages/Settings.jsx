import React, { useState } from 'react';

export default function Settings() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('qwenApiKey') || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  function saveKey() {
    localStorage.setItem('qwenApiKey', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const isValid = apiKey.startsWith('sk-') && apiKey.length > 20;

  return (
    <div className="page" style={{ background: 'transparent' }}>
      <div style={{ padding: '20px 20px 12px' }}>
        <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700,
          color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          앱 설정
        </p>
        <h1 style={{ margin: '3px 0 0', fontSize: '1.4rem', fontWeight: 700,
          fontFamily: 'Noto Serif KR', color: 'var(--cream)' }}>
          ⚙️ 설정
        </h1>
      </div>

      {/* API Key */}
      <div className="card fade fade-1" style={{ margin: '0 16px 14px', padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: '1.5rem' }}>🔑</span>
          <div>
            <p style={{ fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Qwen API 키
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Alibaba Cloud DashScope (싱가포르 리전)
            </p>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <input type={showKey ? 'text' : 'password'}
            value={apiKey} onChange={e => setApiKey(e.target.value)}
            placeholder="sk-xxxxxxxxxxxxxxxx"
            style={{
              width: '100%', padding: '12px 44px 12px 14px',
              background: 'var(--cream-dark)',
              border: `1px solid ${isValid ? 'rgba(46,139,87,0.5)' : 'var(--card-border)'}`,
              borderRadius: 12, fontFamily: 'monospace',
              fontSize: '0.85rem', color: 'var(--ink)', outline: 'none',
              boxSizing: 'border-box'
            }} />
          <button onClick={() => setShowKey(!showKey)} style={{
            position: 'absolute', right: 12, top: '50%',
            transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem'
          }}>{showKey ? '🙈' : '👁'}</button>
        </div>

        {apiKey && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isValid ? '#34C759' : '#FF3B30'
            }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isValid ? '유효한 키 형식입니다' : 'sk- 로 시작해야 합니다'}
            </span>
          </div>
        )}

        <button className="btn-primary" style={{ width: '100%', marginTop: 14 }}
          onClick={saveKey}>
          {saved ? '✓ 저장됨' : '저장하기'}
        </button>
      </div>

      {/* Amap info card */}
      <div className="card fade fade-2" style={{ margin: '0 16px 14px', padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: '1.5rem' }}>🗺️</span>
          <div>
            <p style={{ fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              고덕지도 (Amap) API
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              장소 검색 · 길찾기 연동
            </p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34C759' }} />
            <span style={{ fontSize: '0.75rem', color: '#34C759', fontWeight: 700 }}>연동됨</span>
          </div>
        </div>
        <div className="gold-divider" />
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
          위치 관련 질문 시 자동으로 실시간 장소 데이터를 검색합니다.<br/>
          예: "근처 한국 식당 알려줘", "이우에 병원 어디 있어?"
        </p>
      </div>

      {/* Guide */}
      <div className="card fade fade-3" style={{ margin: '0 16px 14px', padding: 18 }}>
        <p style={{ fontWeight: 700, color: 'var(--gold)', margin: '0 0 12px', fontSize: '0.9rem' }}>
          🔗 API 키 무료 발급 방법
        </p>
        <div className="gold-divider" />
        {[
          '1. international.alibabacloud.com 접속',
          '2. 회원가입 (이메일 인증)',
          '3. 상단 메뉴 → 제품 → Model Studio',
          '4. API Keys 메뉴 → Create API Key',
          '5. 싱가포르 리전 선택 (중국 본토 차단 없음)',
          '6. 생성된 키를 위 입력창에 붙여넣기',
        ].map(step => (
          <p key={step} style={{
            margin: '0 0 8px', fontSize: '0.83rem',
            color: 'var(--text-secondary)', lineHeight: 1.6
          }}>{step}</p>
        ))}
      </div>

      {/* App info */}
      <div className="card fade fade-4" style={{ margin: '0 16px', padding: 18, textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏮</div>
        <p style={{ color: 'var(--gold)', fontWeight: 700, margin: '0 0 4px', fontSize: '1rem' }}>
          중국생활 AI 도우미
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>
          Powered by Qwen-VL · 이우 한인을 위해 만들어졌습니다
        </p>
        <div className="gold-divider" />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', margin: 0 }}>
          백과사전은 AI 없이 오프라인으로 이용 가능합니다
        </p>
      </div>
    </div>
  );
}
