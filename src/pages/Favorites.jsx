import { useState } from 'react';
import { placeCategories, places, filterPlaces } from '../data/places';
import { openAmapSearch, openAmapNavi } from '../services/amap';

const subCategories = {
  '식당': ['전체', '한식', '중식'],
  '운동': ['전체', '당구', '골프'],
  '쇼핑': ['전체', '쇼핑몰', '마트'],
};

export default function Favorites() {
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

  function handleNav(place) {
    if (place.coordinates) {
      openAmapNavi(
        place.nameZh || place.nameKo,
        `${place.coordinates.lng},${place.coordinates.lat}`
      );
    } else {
      openAmapSearch(place.nameZh || place.nameKo);
    }
  }

  const catEmoji = placeCategories.find(c => c.id === selectedCat)?.emoji || '📍';

  return (
    <div style={{ paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ padding: '16px 20px 12px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0 0 4px' }}>
          이우 생활권
        </p>
        <h1 style={{
          fontFamily: 'Noto Serif KR',
          color: 'var(--cream)',
          fontSize: '1.5rem',
          margin: '0 0 4px'
        }}>
          ⭐ 즐겨찾기
        </h1>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
          탭하면 고덕지도로 바로 길찾기
        </p>
      </div>

      {/* Category Pills */}
      <div style={{
        display: 'flex', gap: 8, padding: '0 10px 8px',
        overflowX: 'auto', scrollbarWidth: 'none'
      }}>
        {placeCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCatChange(cat.id)}
            style={{
              flexShrink: 0,
              padding: '8px 16px',
              borderRadius: 100,
              border: 'none',
              background: selectedCat === cat.id
                ? 'var(--crimson)'
                : 'rgba(255,255,255,0.06)',
              color: selectedCat === cat.id ? 'white' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: selectedCat === cat.id ? 700 : 400,
              cursor: 'pointer',
              fontFamily: 'Noto Sans KR',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Subcategory Pills */}
      {subCategories[selectedCat] && (
        <div style={{
          display: 'flex', gap: 6, padding: '0 10px 12px',
          overflowX: 'auto', scrollbarWidth: 'none'
        }}>
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
                  : '1px solid rgba(212,175,55,0.2)',
                background: selectedSub === sub
                  ? 'rgba(212,175,55,0.15)'
                  : 'transparent',
                color: selectedSub === sub ? 'var(--gold)' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: selectedSub === sub ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'Noto Sans KR',
                whiteSpace: 'nowrap'
              }}>
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Result count */}
      <div style={{ padding: '0 10px 8px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          총 {filtered.length}개 장소
        </span>
      </div>

      {/* Place Cards */}
      <div style={{ padding: '0 10px' }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            color: 'var(--text-muted)'
          }}>
            <p style={{ fontSize: '2rem', margin: '0 0 12px' }}>📍</p>
            <p>장소를 추가해주세요</p>
            <p style={{ fontSize:'0.78rem' }}>생활반경 데이터를 곧 업데이트할 예정입니다</p>
          </div>
        ) : (
          filtered.map(place => (
            <div key={place.id} className="card fade"
              style={{ marginBottom: 10, padding: 0, overflow: 'hidden' }}>

              {/* Image area */}
              {place.images?.[0] ? (
                <img src={place.images[0]} alt={place.nameKo}
                  style={{ width: '100%', height: 140, objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '100%', height: 80,
                  background: 'linear-gradient(135deg, rgba(196,30,58,0.15), rgba(212,175,55,0.1))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem'
                }}>
                  {catEmoji}
                </div>
              )}

              {/* Info */}
              <div style={{ padding: '12px 14px' }}>
                <p style={{
                  margin: '0 0 2px', fontWeight: 700,
                  fontSize: '0.95rem', color: 'var(--text-primary)'
                }}>
                  {place.nameKo}
                </p>
                <p style={{
                  margin: '0 0 6px', fontSize: '0.72rem',
                  color: 'var(--text-muted)'
                }}>
                  {place.nameZh}
                </p>
                <p style={{
                  margin: '0 0 4px', fontSize: '0.78rem',
                  color: 'var(--text-secondary)'
                }}>
                  📍 {place.addressKo}
                </p>
                {place.hours && (
                  <p style={{
                    margin: '0 0 4px', fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                  }}>
                    🕐 {place.hours}
                  </p>
                )}
                {place.priceRange && (
                  <p style={{
                    margin: '0 0 4px', fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                  }}>
                    💰 {place.priceRange}
                  </p>
                )}
                {place.rating > 0 && (
                  <p style={{
                    margin: '0 0 4px', fontSize: '0.75rem',
                    color: 'var(--gold)'
                  }}>
                    ⭐ {place.rating} ({place.reviews}명 평가)
                  </p>
                )}

                {/* Distance + Drive time badges */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  {place.distance && (
                    <span style={{
                      fontSize: '0.68rem', padding: '2px 8px',
                      background: 'rgba(212,175,55,0.1)',
                      borderRadius: 100, color: 'var(--text-muted)'
                    }}>
                      📏 {place.distance}
                    </span>
                  )}
                  {place.driveTime && (
                    <span style={{
                      fontSize: '0.68rem', padding: '2px 8px',
                      background: 'rgba(196,30,58,0.08)',
                      borderRadius: 100, color: 'var(--text-muted)'
                    }}>
                      🚗 {place.driveTime}
                    </span>
                  )}
                </div>

                {place.description && (
                  <p style={{
                    margin: '0 0 8px', fontSize: '0.78rem',
                    color: 'var(--text-secondary)', lineHeight: 1.5
                  }}>
                    {place.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {place.tags?.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>

                {/* Navigation button */}
                <button
                  onClick={() => handleNav(place)}
                  style={{
                    width: '100%', marginTop: 12, padding: '11px',
                    background: 'linear-gradient(135deg, #C41E3A, #8B0000)',
                    color: 'white', border: 'none', borderRadius: 12,
                    fontSize: '0.85rem', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'Noto Sans KR',
                    boxShadow: '0 3px 0 rgba(139,0,0,0.35)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 6
                  }}>
                  🗺️ 고덕지도로 길찾기
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
