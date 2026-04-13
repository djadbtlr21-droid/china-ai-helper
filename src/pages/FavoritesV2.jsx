import { useState } from 'react';
import { placeCategories, places, filterPlaces } from '../data/places';
import { openAmapSearch } from '../services/amap';

const subCategories = {
  '식당': ['전체', '한식', '중식'],
  '운동': ['전체', '당구', '골프'],
  '쇼핑': ['전체', '쇼핑몰', '마트'],
};

export default function FavoritesV2() {
  const [selectedCat, setSelectedCat] = useState('식당');
  const [selectedSub, setSelectedSub] = useState('전체');

  const filtered = filterPlaces({
    category: selectedCat,
    subcategory: selectedSub,
  });

  function handleCatChange(catId) {
    setSelectedCat(catId);
    setSelectedSub('전체');
  }

  const catEmoji = placeCategories.find(c => c.id === selectedCat)?.emoji || '📍';

  return (
    <div className="v2-page">
      {/* Header */}
      <div className="v2-animate" style={{ padding: '24px 20px 14px' }}>
        <div className="v2-eyebrow">이우 생활권</div>
        <h1 className="v2-heading" style={{ fontSize: '1.5rem', margin: '4px 0 4px' }}>
          ⭐ 즐겨찾기
        </h1>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
          탭하면 고덕지도로 바로 길찾기
        </p>
      </div>

      {/* Category Pills */}
      <div className="v2-scroll-hide v2-animate v2-animate-delay-1"
        style={{ display: 'flex', gap: 8, padding: '0 10px 8px', overflowX: 'auto' }}>
        {placeCategories.map(cat => (
          <button key={cat.id}
            className={`v2-pill ${selectedCat === cat.id ? 'active' : ''}`}
            onClick={() => handleCatChange(cat.id)}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Subcategory Pills */}
      {subCategories[selectedCat] && (
        <div className="v2-scroll-hide v2-animate v2-animate-delay-2"
          style={{ display: 'flex', gap: 6, padding: '0 10px 12px', overflowX: 'auto' }}>
          {subCategories[selectedCat].map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSub(sub)}
              style={{
                flexShrink: 0,
                padding: '5px 14px',
                borderRadius: 100,
                border: selectedSub === sub
                  ? '1px solid var(--gold)'
                  : '1px solid rgba(212,175,55,0.15)',
                background: selectedSub === sub
                  ? 'rgba(212,175,55,0.12)'
                  : 'transparent',
                color: selectedSub === sub ? 'var(--gold)' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: selectedSub === sub ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'Noto Sans KR',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Result count */}
      <div className="v2-animate v2-animate-delay-3" style={{ padding: '0 10px 8px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          총 {filtered.length}개 장소
        </span>
      </div>

      {/* Place Cards */}
      <div style={{ padding: '0 10px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(196,30,58,0.05))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem',
              animation: 'v2-float 4s ease-in-out infinite',
            }}>📍</div>
            <p>장소를 추가해주세요</p>
            <p style={{ fontSize:'0.78rem' }}>생활반경 데이터를 곧 업데이트할 예정입니다</p>
          </div>
        ) : (
          <div className="v2-stagger">
            {filtered.map(place => (
              <div key={place.id} className="v2-card" style={{ marginBottom: 12 }}>
                <div style={{
                  background: 'var(--bezel-inner-bg)',
                  borderRadius: 'var(--bezel-radius-inner)',
                  boxShadow: 'var(--bezel-inner-highlight)',
                  overflow: 'hidden',
                  backdropFilter: 'blur(16px)',
                }}>
                  {/* Image area */}
                  {place.images?.[0] ? (
                    <img src={place.images[0]} alt={place.nameKo}
                      style={{ width: '100%', height: 140, objectFit: 'cover' }}
                      loading="lazy" />
                  ) : (
                    <div style={{
                      width: '100%', height: 80,
                      background: 'linear-gradient(135deg, rgba(196,30,58,0.12), rgba(212,175,55,0.06))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '2.5rem',
                    }}>
                      {catEmoji}
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ padding: '14px 16px' }}>
                    <p style={{
                      margin: '0 0 2px', fontWeight: 700,
                      fontSize: '0.95rem', color: 'var(--cream)',
                    }}>
                      {place.nameKo}
                    </p>
                    <p style={{
                      margin: '0 0 6px', fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                    }}>
                      {place.nameZh}
                    </p>
                    <p style={{
                      margin: '0 0 4px', fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                    }}>
                      📍 {place.addressKo}
                    </p>
                    {place.hours && (
                      <p style={{
                        margin: '0 0 4px', fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                      }}>
                        🕐 {place.hours}
                      </p>
                    )}
                    {place.priceRange && (
                      <p style={{
                        margin: '0 0 4px', fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                      }}>
                        💰 {place.priceRange}
                      </p>
                    )}
                    {place.rating > 0 && (
                      <p style={{
                        margin: '0 0 4px', fontSize: '0.75rem',
                        color: 'var(--gold)',
                      }}>
                        ⭐ {place.rating} ({place.reviews}명 평가)
                      </p>
                    )}

                    {/* Distance + Drive time badges */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                      {place.distance && (
                        <span className="v2-tag">
                          📏 {place.distance}
                        </span>
                      )}
                      {place.driveTime && (
                        <span className="v2-tag" style={{
                          background: 'rgba(196,30,58,0.08)',
                        }}>
                          🚗 {place.driveTime}
                        </span>
                      )}
                    </div>

                    {place.description && (
                      <p style={{
                        margin: '0 0 10px', fontSize: '0.78rem',
                        color: 'var(--text-secondary)', lineHeight: 1.55,
                        wordBreak: 'keep-all',
                      }}>
                        {place.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                      {place.tags?.map(tag => (
                        <span key={tag} className="v2-tag">#{tag}</span>
                      ))}
                    </div>

                    {/* Navigation button */}
                    <button
                      onClick={() => openAmapSearch(place.nameZh || place.nameKo)}
                      className="v2-btn-primary"
                      style={{
                        width: '100%', padding: '12px',
                        fontSize: '0.85rem',
                      }}
                    >
                      🗺️ 고덕지도에서 검색
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
