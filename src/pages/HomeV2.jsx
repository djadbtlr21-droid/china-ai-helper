import { useState, useRef, useEffect } from 'react';
import Lantern from '../components/Lantern';
import LoadingOverlayV2 from '../components/LoadingOverlayV2';
import Toast from '../components/Toast';
import { callAI, compressImage, compressThumbnail, saveHistory } from '../services/ai';
import { isLocationQuery, searchAmapPlaces, formatAmapForPrompt, openAmapNavi } from '../services/amap';

const quickQuestions = [
  { emoji: '🍜', text: '이게 무슨 음식?' },
  { emoji: '💊', text: '이 약 어떻게 먹어?' },
  { emoji: '🏪', text: '무슨 뜻이야?' },
  { emoji: '🛒', text: '이 제품 어디서 사?' },
  { emoji: '🌶', text: '얼마나 매워?' },
  { emoji: '📦', text: '유통기한 확인해줘' },
  { emoji: '🧾', text: '영수증 해석해줘' },
  { emoji: '🏥', text: '이 약 부작용은?' },
  { emoji: '🍱', text: '칼로리 알려줘' },
  { emoji: '💰', text: '가격이 적당해?' },
];

export default function HomeV2() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState('error');
  const [amapPlaces, setAmapPlaces] = useState([]);
  const fileInputRef = useRef(null);

  async function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
    const b64 = await compressImage(file);
    const thumb = await compressThumbnail(file);
    setBase64Image(b64);
    setThumbnailImage(thumb);
  }

  async function handleAnalyze() {
    if (!selectedImage && !question.trim()) return;
    setLoading(true);
    setAnswer('');
    setAmapPlaces([]);
    try {
      let amapContext = '';
      let places = [];
      if (question && isLocationQuery(question)) {
        places = await searchAmapPlaces(question);
        if (places.length > 0) {
          amapContext = formatAmapForPrompt(places);
          setAmapPlaces(places);
        }
      }
      const result = await callAI(question || null, base64Image, amapContext);
      setAnswer(result);
      saveHistory({
        type: 'analyze',
        question: question || '사진 분석',
        answer: result,
        thumbnail: thumbnailImage || null
      });
    } catch (err) {
      setToast(err.message);
      setToastType('error');
    }
    setLoading(false);
  }

  function handleSave() {
    if (!answer) return;
    saveHistory({ image: thumbnailImage, question: question || '사진 분석', answer });
    setToast('기록에 저장됐습니다 ✓');
    setToastType('success');
  }

  function handleClear() {
    setSelectedImage(null);
    setBase64Image(null);
    setThumbnailImage(null);
    setQuestion('');
    setAnswer('');
    setAmapPlaces([]);
  }

  return (
    <div className="v2-page">
      <LoadingOverlayV2 visible={loading} />
      {toast && (
        <div className={`v2-toast v2-toast-${toastType}`} onClick={() => setToast('')}>
          {toast}
        </div>
      )}

      {/* Header */}
      <header style={{ padding: '24px 20px 12px' }}>
        <div className="v2-eyebrow v2-animate">이우 한인을 위한</div>
        <h1 className="v2-heading v2-animate v2-animate-delay-1" style={{ fontSize: '1.6rem', margin: '4px 0 0' }}>
          🏮 중국생활 AI 도우미
        </h1>
      </header>

      {/* Lantern hero */}
      <div className="v2-animate v2-animate-delay-2" style={{ textAlign: 'center', padding: '16px 0 12px' }}>
        <div style={{ animation: 'v2-float 4s ease-in-out infinite' }}>
          <Lantern size={90} />
        </div>
        <p style={{ color: 'var(--gold-muted)', fontSize: '0.8rem', marginTop: 12, fontWeight: 500 }}>
          사진으로 무엇이든 물어보세요
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 6, margin: '6px 0 0'
        }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            🤖 Powered by <strong className="v2-gradient-text">Gemini AI</strong>
            &nbsp;·&nbsp;Google AI Studio
          </span>
        </div>
      </div>

      {/* Upload zone — Double Bezel */}
      <div className="v2-card v2-animate v2-animate-delay-3" style={{ margin: '0 10px 14px' }}>
        <div className="v2-card-inner">
          <input type="file" accept="image/*" capture="environment"
            style={{ display: 'none' }} ref={fileInputRef}
            onChange={handleImageSelect} />

          {!selectedImage ? (
            <div onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed rgba(212,175,55,0.25)',
                borderRadius: 14, padding: '32px 20px', textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(212,175,55,0.03)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
              <div style={{
                width: 64, height: 64, borderRadius: 20, margin: '0 auto 12px',
                background: 'linear-gradient(135deg, rgba(196,30,58,0.12), rgba(212,175,55,0.08))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem',
              }}>📸</div>
              <p style={{ fontWeight: 700, color: 'var(--cream)', margin: '0 0 4px', fontSize: '0.95rem' }}>
                사진을 찍거나 업로드하세요
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                음식 · 약품 · 간판 · 영수증 · 제품
              </p>
            </div>
          ) : (
            <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden' }}>
              <img src={selectedImage} alt="선택된 이미지" style={{
                width: '100%', borderRadius: 14,
                maxHeight: 260, objectFit: 'cover', display: 'block'
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(26,16,8,0.4), transparent 40%)',
                borderRadius: 14,
              }} />
              <button onClick={handleClear} style={{
                position: 'absolute', top: 10, right: 10,
                background: 'rgba(0,0,0,0.55)', color: 'white',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%', width: 34, height: 34, cursor: 'pointer',
                fontSize: '0.85rem', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>✕</button>
            </div>
          )}
        </div>
      </div>

      {/* Quick question carousel */}
      <div className="v2-animate v2-animate-delay-4" style={{
        overflow: 'hidden',
        padding: '0 10px 6px',
        WebkitMaskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)',
        maskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)',
      }}>
        <div style={{
          display: 'flex', gap: 8, whiteSpace: 'nowrap',
          animation: 'scrollLeft 20s linear infinite',
          width: 'max-content',
        }}>
          {[...quickQuestions, ...quickQuestions].map((q, i) => (
            <button key={i} onClick={() => setQuestion(q.text)}
              style={{
                background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
                color: 'var(--crimson)', border: 'none', borderRadius: 100,
                padding: '8px 16px', fontSize: '0.82rem', whiteSpace: 'nowrap',
                flexShrink: 0, cursor: 'pointer', fontFamily: 'Noto Sans KR',
                fontWeight: 700,
              }}>
              {q.emoji} {q.text}
            </button>
          ))}
        </div>
      </div>

      {/* Text input — Double Bezel */}
      <div className="v2-card v2-animate v2-animate-delay-5" style={{ margin: '10px 10px' }}>
        <div className="v2-card-inner" style={{ padding: '12px 16px' }}>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="추가로 궁금한 점을 입력하세요 (선택사항)"
            className="v2-input"
            style={{
              border: 'none', background: 'transparent',
              resize: 'none', minHeight: 52, lineHeight: 1.6,
              padding: 0,
            }}
          />
        </div>
      </div>

      {/* Analyze button */}
      <div className="v2-animate v2-animate-delay-6" style={{ padding: '0 10px 14px' }}>
        <button
          className="v2-btn-primary"
          onClick={handleAnalyze}
          disabled={loading || (!selectedImage && !question.trim())}
          style={{ width: '100%', fontSize: '1rem', padding: '16px' }}
        >
          🏮 AI에게 물어보기
        </button>
      </div>

      {/* Result — Double Bezel */}
      {answer && (
        <div className="v2-card v2-animate" style={{ margin: '0 10px 16px' }}>
          <div className="v2-card-inner" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(196,30,58,0.15), rgba(212,175,55,0.1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
              }}>🤖</div>
              <span style={{ fontWeight: 700, color: 'var(--crimson)', fontSize: '0.88rem' }}>
                AI 분석 결과
              </span>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                Gemini · Google AI
              </span>
            </div>
            <div className="v2-divider" />
            <p style={{
              color: 'var(--cream)', lineHeight: 1.85,
              fontSize: '0.9rem', whiteSpace: 'pre-wrap', margin: 0,
              wordBreak: 'keep-all',
            }}>{answer}</p>
            <div className="v2-divider" />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="v2-btn-gold" style={{ flex: 1, padding: '12px' }}
                onClick={handleSave}>
                💾 저장하기
              </button>
              <button className="v2-btn-ghost" style={{ flex: 1, padding: '12px' }}
                onClick={handleClear}>
                🔄 새 질문
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Amap place results */}
      {amapPlaces.length > 0 && (
        <div className="v2-card v2-animate" style={{ margin: '0 10px 16px' }}>
          <div className="v2-card-inner" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(196,30,58,0.15), rgba(212,175,55,0.1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
              }}>📍</div>
              <span style={{ fontWeight: 700, color: 'var(--crimson)', fontSize: '0.88rem' }}>
                고덕지도 검색 결과
              </span>
              <span className="v2-eyebrow" style={{ marginLeft: 'auto', marginBottom: 0, padding: '2px 8px', fontSize: '0.62rem' }}>
                실시간
              </span>
            </div>
            <div className="v2-divider" />

            {/* Top result nav button */}
            <button
              onClick={() => openAmapNavi(amapPlaces[0].name, amapPlaces[0].location)}
              className="v2-btn-primary"
              style={{ width: '100%', marginBottom: 14, fontSize: '0.88rem', padding: '13px' }}
            >
              🗺️ 고덕지도로 바로 길찾기 → {amapPlaces[0].name}
            </button>

            <div className="v2-stagger">
              {amapPlaces.map((place, i) => (
                <div key={i} style={{
                  padding: '12px 0',
                  borderBottom: i < amapPlaces.length - 1 ? '1px solid rgba(212,175,55,0.08)' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--cream)' }}>
                        {i === 0 ? '🥇 ' : `${i+1}. `}{place.name}
                      </p>
                      <p style={{ margin: '0 0 3px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        📍 {place.address || '주소 없음'}
                      </p>
                      {place.tel && (
                        <p style={{ margin: '0 0 3px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          📞 {place.tel}
                        </p>
                      )}
                      {place.rating && (
                        <span className="v2-tag" style={{ marginTop: 4, display: 'inline-block' }}>
                          ⭐ {place.rating}
                        </span>
                      )}
                    </div>
                    {place.location && (
                      <button
                        onClick={() => openAmapNavi(place.name, place.location)}
                        className="v2-btn-primary"
                        style={{
                          padding: '8px 14px', fontSize: '0.72rem',
                          flexShrink: 0, marginLeft: 8,
                          boxShadow: '0 3px 0 rgba(139,0,0,0.3)',
                        }}
                      >
                        🗺️ 길찾기
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
