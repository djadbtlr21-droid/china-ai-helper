import { useState } from 'react';
import { placeCategories, places } from '../data/places';
import { openAmapSearch, openAmapNavi } from '../services/amap';

export default function Favorites() {
  const [selectedCat, setSelectedCat] = useState('restaurant');

  const filtered = places.filter(p => p.category === selectedCat);

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
        display: 'flex', gap: 8, padding: '0 10px 12px',
        overflowX: 'auto', scrollbarWidth: 'none'
      }}>
        {placeCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
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
              {place.image ? (
                <img src={place.image} alt={place.nameKo}
                  style={{ width: '100%', height: 140, objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '100%', height: 80,
                  background: 'linear-gradient(135deg, rgba(196,30,58,0.15), rgba(212,175,55,0.1))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem'
                }}>
                  {place.emoji}
                </div>
              )}

              {/* Info */}
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: '0 0 2px', fontWeight: 700,
                      fontSize: '0.95rem', color: 'var(--text-primary)'
                    }}>
                      {place.nameKo}
                    </p>
                    <p style={{
                      margin: '0 0 4px', fontSize: '0.72rem',
                      color: 'var(--text-muted)'
                    }}>
                      {place.nameZh}
                    </p>
                    <p style={{
                      margin: '0 0 6px', fontSize: '0.78rem',
                      color: 'var(--text-secondary)'
                    }}>
                      📍 {place.addressKo}
                    </p>
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
                  </div>
                </div>

                {/* Navigation button */}
                <button
                  onClick={() => place.location
                    ? openAmapNavi(place.nameZh || place.nameKo, place.location)
                    : openAmapSearch(place.nameZh || place.nameKo)
                  }
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
