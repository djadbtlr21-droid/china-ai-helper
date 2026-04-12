import React, { useState } from 'react';
import { categories, chinaItems } from '../data/chinaItems';
import ItemDetailModal from '../components/ItemDetailModal';

export default function Encyclopedia({ onAskAI }) {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const filtered = chinaItems.filter(item => {
    const matchCat = selectedCat === 'all' || item.category === selectedCat;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      item.nameKo.toLowerCase().includes(q) ||
      item.nameZh.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some(t => t.includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="page" style={{ background: 'transparent' }}>
      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* Header */}
      <div style={{ padding: '20px 20px 12px' }}>
        <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700,
          color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          오프라인 이용 가능
        </p>
        <h1 style={{ margin: '3px 0 0', fontSize: '1.4rem', fontWeight: 700,
          fontFamily: 'Noto Serif KR', color: 'var(--cream)' }}>
          📚 중국생활 백과사전
        </h1>
      </div>

      <div style={{ padding: '0 20px 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: '0.65rem', color: 'rgba(212,175,55,0.4)' }}>
          ✍️ 전문가 검수 데이터 &nbsp;·&nbsp;
          🤖 AI 질문은 <strong style={{ color: 'var(--gold)' }}>Gemini AI</strong> 제공
        </span>
      </div>

      {/* Sticky search */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(26,16,8,0.96)',
        backdropFilter: 'blur(16px)',
        padding: '10px 16px',
        borderBottom: '1px solid rgba(212,175,55,0.12)'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(253,246,227,0.08)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: 100, padding: '10px 16px'
        }}>
          <span style={{ color: 'var(--gold)', fontSize: '1rem' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="약 이름, 음식, 제품명으로 검색..."
            style={{
              flex: 1, background: 'transparent', border: 'none',
              color: 'var(--cream)', fontFamily: 'Noto Sans KR',
              fontSize: '0.9rem', outline: 'none'
            }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category pills */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto',
        padding: '12px 16px 8px', scrollbarWidth: 'none'
      }}>
        {[{ id: 'all', label: '전체', emoji: '🔎' }, ...categories].map(cat => (
          <button key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            style={{
              whiteSpace: 'nowrap', padding: '8px 16px',
              borderRadius: 100, border: 'none', cursor: 'pointer',
              fontFamily: 'Noto Sans KR', fontWeight: 700, fontSize: '0.82rem',
              background: selectedCat === cat.id
                ? 'linear-gradient(135deg, var(--crimson), var(--crimson-dark))'
                : 'rgba(212,175,55,0.1)',
              color: selectedCat === cat.id ? 'white' : 'var(--gold)',
              boxShadow: selectedCat === cat.id ? '0 3px 0 rgba(139,0,0,0.3)' : 'none',
              transition: 'all 0.2s'
            }}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Result count */}
      <div style={{ padding: '4px 20px 8px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          총 {filtered.length}개 항목
        </span>
      </div>

      {/* Items list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
          <p style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: 8 }}>
            검색 결과가 없습니다
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 20 }}>
            AI 탭에서 사진으로 직접 물어보세요
          </p>
          <button className="btn-primary" onClick={onAskAI}>
            📸 AI로 물어보기
          </button>
        </div>
      ) : (
        <div style={{ padding: '0 16px' }}>
          {filtered.map((item, i) => (
            <div key={item.id}
              className={`card fade fade-${Math.min(i + 1, 6)}`}
              onClick={() => setSelectedItem(item)}
              style={{ marginBottom: 10, padding: '14px 16px', cursor: 'pointer',
                position: 'relative' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--crimson-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0
                }}>{item.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', gap: 8 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.92rem',
                      color: 'var(--text-primary)' }}>
                      {item.nameKo}
                    </p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)',
                      flexShrink: 0 }}>{item.nameZh}</span>
                  </div>
                  <p style={{
                    margin: '4px 0 8px', fontSize: '0.8rem',
                    color: 'var(--text-secondary)', lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>{item.description}</p>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {item.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              {item.warning && (
                <div className="warning-box">⚠️ {item.warning}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
