import React, { useState, useRef } from 'react';
import Lantern from '../components/Lantern';
import LoadingOverlay from '../components/LoadingOverlay';
import Toast from '../components/Toast';
import { callAI, compressImage, compressThumbnail, saveHistory } from '../services/ai';
import { isLocationQuery, searchAmapPlaces, formatAmapForPrompt, openAmapSearch, getRelevantAreas } from '../services/amap';

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

export default function Home() {
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

      // If location query, search Amap first
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
    saveHistory({
      image: thumbnailImage,
      question: question || '사진 분석',
      answer
    });
    setToast('기록에 저장됐습니다 ✓');
    setToastType('success');
  }

  function handleClear() {
    setSelectedImage(null);
    setBase64Image(null);
    setThumbnailImage(null);
    setQuestion('');
    setAnswer('');
  }

  return (
    <div className="page" style={{ background: 'transparent' }}>
      <LoadingOverlay visible={loading} />
      <Toast message={toast} type={toastType} onClose={() => setToast('')} />

      {/* Header */}
      <header style={{ padding: '20px 20px 8px' }}>
        <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700,
          color: 'white', letterSpacing: '0.02em' }}>
          이우 거주 한인을 위한
        </p>
        <h1 style={{ margin: '3px 0 0', fontSize: '1.4rem', fontWeight: 700,
          fontFamily: 'Noto Serif KR', color: 'var(--cream)', letterSpacing: '-0.01em' }}>
          🏮 중국생활 AI 도우미
        </h1>
      </header>

      {/* Lantern hero */}
      <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
        <Lantern size={90} />
        <p style={{ color: 'rgba(212,175,55,0.6)', fontSize: '0.78rem', marginTop: 8 }}>
          사진으로 무엇이든 물어보세요
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 6, margin: '4px 0 8px'
        }}>
          <span style={{ fontSize: '0.68rem', color: 'rgba(212,175,55,0.6)' }}>🤖</span>
          <span style={{ fontSize: '0.68rem', color: 'rgba(212,175,55,0.6)', letterSpacing: '0.05em' }}>
            Powered by <strong style={{ color: 'var(--gold)' }}>Gemini AI</strong>
            &nbsp;·&nbsp;Google AI Studio
          </span>
        </div>
      </div>

      {/* Upload zone */}
      <div className="card fade fade-1" style={{ margin: '0 10px 12px', padding: 16 }}>
        <input type="file" accept="image/*" capture="environment"
          style={{ display: 'none' }} ref={fileInputRef}
          onChange={handleImageSelect} />

        {!selectedImage ? (
          <div onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed rgba(212,175,55,0.35)',
              borderRadius: 12, padding: '28px 20px', textAlign: 'center',
              cursor: 'pointer', background: 'rgba(212,175,55,0.04)',
              transition: 'border-color 0.2s, background 0.2s'
            }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📸</div>
            <p style={{ fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', fontSize: '0.95rem' }}>
              사진을 찍거나 업로드하세요
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              음식 · 약품 · 간판 · 영수증 · 제품
            </p>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <img src={selectedImage} alt="선택된 이미지" style={{
              width: '100%', borderRadius: 12,
              maxHeight: 260, objectFit: 'cover', display: 'block'
            }} />
            <button onClick={handleClear} style={{
              position: 'absolute', top: 8, right: 8,
              background: 'rgba(0,0,0,0.65)', color: 'white',
              border: 'none', borderRadius: '50%',
              width: 32, height: 32, cursor: 'pointer',
              fontSize: '0.85rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>✕</button>
          </div>
        )}
      </div>

      {/* Quick question carousel */}
      <div className="fade fade-2" style={{
        overflow: 'hidden',
        padding: '0 10px 4px',
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

      {/* Text input */}
      <div className="card fade fade-3" style={{ margin: '10px 10px', padding: '12px 16px' }}>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="추가로 궁금한 점을 입력하세요 (선택사항)"
          style={{
            width: '100%', border: 'none', background: 'transparent',
            resize: 'none', fontFamily: 'Noto Sans KR',
            fontSize: '0.9rem', color: 'var(--text-primary)',
            outline: 'none', minHeight: 52, lineHeight: 1.6
          }}
        />
      </div>

      {/* Analyze button */}
      <div style={{ padding: '0 10px 12px' }}>
        <button className="btn-primary fade fade-4"
          onClick={handleAnalyze}
          disabled={loading || (!selectedImage && !question.trim())}
          style={{ width: '100%', fontSize: '1rem', padding: '15px' }}>
          🏮 AI에게 물어보기
        </button>
      </div>

      {/* Result */}
      {answer && (
        <div className="card fade" style={{ margin: '0 10px 16px', padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: '1.2rem' }}>🤖</span>
            <span style={{ fontWeight: 700, color: 'var(--crimson)', fontSize: '0.88rem' }}>
              AI 분석 결과
            </span>
            <span style={{ fontSize: '0.65rem', color: 'rgba(212,175,55,0.5)', marginLeft: 'auto' }}>
              Gemini · Google AI
            </span>
          </div>
          <div className="gold-divider" />
          <p style={{
            color: 'var(--text-primary)', lineHeight: 1.8,
            fontSize: '0.9rem', whiteSpace: 'pre-wrap', margin: 0
          }}>{answer}</p>
          <div className="gold-divider" />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-gold" style={{ flex: 1, padding: '10px' }}
              onClick={handleSave}>
              💾 저장하기
            </button>
            <button onClick={handleClear} style={{
              flex: 1, padding: '10px',
              background: 'rgba(212,175,55,0.1)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: 100, cursor: 'pointer',
              color: 'var(--text-secondary)', fontFamily: 'Noto Sans KR',
              fontSize: '0.82rem', fontWeight: 600
            }}>
              🔄 새 질문
            </button>
          </div>
        </div>
      )}

      {/* Area suggestion card */}
      {answer && isLocationQuery(question) && (
        <div className="card fade" style={{ margin:'0 10px 14px', padding:14, background:'rgba(212,175,55,0.06)', border:'1px solid rgba(212,175,55,0.2)' }}>
          <p style={{ margin:'0 0 10px', fontSize:'0.85rem', color:'var(--gold)', fontWeight:700 }}>🗺️ 이우에서 이런 곳은 어떠세요?</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {getRelevantAreas(question).map((area, i) => (
              <button key={i} onClick={() => openAmapSearch(area.nameZh)}
                style={{ background:'rgba(196,30,58,0.15)', border:'1px solid rgba(196,30,58,0.3)', borderRadius:100, padding:'7px 14px', fontSize:'0.78rem', fontWeight:600, color:'var(--cream)', cursor:'pointer', fontFamily:'Noto Sans KR' }}>
                📍 {area.nameKo}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
