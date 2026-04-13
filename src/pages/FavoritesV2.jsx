import { useState } from 'react';
import { placeCategories, places } from '../data/places';
import { openAmapSearch, openAmapNavi } from '../services/amap';

export default function FavoritesV2() {
  const [selectedCat, setSelectedCat] = useState('restaurant');
  const filtered = places.filter(p => p.category === selectedCat);

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
        style={{ display: 'flex', gap: 8, padding: '0 10px 14px', overflowX: 'auto' }}>
        {placeCategories.map(cat => (
          <button key={cat.id}
            className={`v2-pill ${selectedCat === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCat(cat.id)}>
            {cat.emoji} {cat.label}
          </button>
        ))}
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
                {/* Inner bezel with no padding — image takes full width */}
                <div style={{
                  background: 'var(--bezel-inner-bg)',
                  borderRadius: 'var(--bezel-radius-inner)',
                  boxShadow: 'var(--bezel-inner-highlight)',
                  overflow: 'hidden',
                  backdropFilter: 'blur(16px)',
                }}>
                  {/* Image area */}
                  {place.image ? (
                    <img src={place.image} alt={place.nameKo}
                      style={{ width: '100%', height: 140, objectFit: 'cover' }}
                      loading="lazy" />
                  ) : (
                    <div style={{
                      width: '100%', height: 80,
                      background: 'linear-gradient(135deg, rgba(196,30,58,0.12), rgba(212,175,55,0.06))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '2.5rem',
                    }}>
                      {place.emoji}
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
                      margin: '0 0 6px', fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                    }}>
                      📍 {place.addressKo}
                    </p>
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
                      onClick={() => place.location
                        ? openAmapNavi(place.nameZh || place.nameKo, place.location)
                        : openAmapSearch(place.nameZh || place.nameKo)
                      }
                      className="v2-btn-primary"
                      style={{
                        width: '100%', padding: '12px',
                        fontSize: '0.85rem',
                      }}
                    >
                      🗺️ 고덕지도로 길찾기
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
