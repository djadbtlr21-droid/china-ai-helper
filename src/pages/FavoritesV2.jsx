import { useState, useRef } from 'react';
import { placeCategories, places, filterPlaces } from '../data/places';
import { openAmapSearch } from '../services/amap';
import { getBusinessStatus } from '../utils/businessHours';

const subCategories = {
  '식당': ['전체', '한식', '중식'],
  '운동': ['전체', '당구', '골프'],
  '쇼핑': ['전체', '쇼핑몰', '마트'],
};

function AddPlaceModalV2({ onClose, onSave }) {
  const [form, setForm] = useState({
    category: '식당', nameKo: '', nameZh: '', tel: '',
    hours: '', priceRange: '', description: '', tags: '', image: null,
  });
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  async function handleImageFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 600;
        let w = img.width, h = img.height;
        if (w > size) { h = Math.round(h * size / w); w = size; }
        if (h > size) { w = Math.round(w * size / h); h = size; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        setPreview(compressed);
        setForm(prev => ({ ...prev, image: compressed }));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    if (!form.nameKo.trim()) return;
    onSave({
      id: 'custom_' + Date.now(),
      category: form.category,
      nameKo: form.nameKo,
      nameZh: form.nameZh,
      addressKo: '',
      tel: form.tel,
      hours: form.hours,
      priceRange: form.priceRange,
      description: form.description,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      images: form.image ? [form.image] : [],
      coordinates: null,
      isCustom: true,
    });
  }

  const inp = {
    width:'100%', padding:'11px 14px',
    background:'rgba(255,255,255,0.05)',
    border:'1px solid rgba(212,175,55,0.15)',
    borderRadius:12, fontFamily:'Noto Sans KR',
    fontSize:'0.85rem', color:'var(--cream)',
    outline:'none', boxSizing:'border-box', marginBottom:10,
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:400, background:'rgba(26,16,8,0.92)', backdropFilter:'blur(12px)', display:'flex', alignItems:'flex-end' }} onClick={onClose}>
      <div style={{ width:'100%', background:'var(--ink)', borderRadius:'24px 24px 0 0', padding:'20px 20px 48px', maxHeight:'90vh', overflowY:'auto', border:'1px solid rgba(212,175,55,0.1)', borderBottom:'none' }} onClick={e => e.stopPropagation()}>
        <div style={{ width:40, height:4, borderRadius:2, background:'rgba(212,175,55,0.2)', margin:'0 auto 16px' }} />
        <h2 style={{ fontFamily:'Noto Serif KR', color:'var(--gold)', margin:'0 0 16px', fontSize:'1.1rem', textAlign:'center', fontWeight:700 }}>새 장소 추가</h2>

        <div style={{ marginBottom:16 }}>
          <div style={{ width:'100%', height:140, borderRadius:14, background: preview ? 'transparent' : 'rgba(255,255,255,0.03)', border:'2px dashed rgba(212,175,55,0.2)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:8 }}>
            {preview
              ? <img src={preview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <div style={{ textAlign:'center', color:'var(--text-muted)' }}><div style={{ fontSize:'2rem' }}>🖼️</div><div style={{ fontSize:'0.75rem', marginTop:4 }}>이미지를 추가하세요</div></div>
            }
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => cameraRef.current?.click()} className="v2-btn-ghost" style={{ flex:1, padding:'9px', fontSize:'0.8rem' }}>📷 카메라</button>
            <button onClick={() => fileRef.current?.click()} className="v2-btn-ghost" style={{ flex:1, padding:'9px', fontSize:'0.8rem' }}>🖼️ 사진첩</button>
          </div>
          <input type="file" accept="image/*" capture="environment" ref={cameraRef} style={{ display:'none' }} onChange={e => handleImageFile(e.target.files[0])} />
          <input type="file" accept="image/*" ref={fileRef} style={{ display:'none' }} onChange={e => handleImageFile(e.target.files[0])} />
        </div>

        <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ ...inp, appearance:'none' }}>
          <option value="식당">🍽️ 식당</option>
          <option value="운동">💪 운동</option>
          <option value="마사지">💆 마사지</option>
          <option value="쇼핑">🛍️ 쇼핑</option>
          <option value="집/회사">🏠 집/회사</option>
          <option value="내 장소">⭐ 내 장소</option>
        </select>
        <input value={form.nameKo} onChange={e => setForm(p => ({ ...p, nameKo: e.target.value }))} placeholder="* 업체명 (한국어) — 필수" style={{ ...inp, border: !form.nameKo ? '1px solid rgba(196,30,58,0.3)' : '1px solid rgba(212,175,55,0.15)' }} />
        <input value={form.nameZh} onChange={e => setForm(p => ({ ...p, nameZh: e.target.value }))} placeholder="업체명 (중국어) — 고덕지도 검색에 사용" style={inp} />
        <input value={form.tel} onChange={e => setForm(p => ({ ...p, tel: e.target.value }))} placeholder="전화번호 (예: +86-xxx-xxxx-xxxx)" style={inp} type="tel" />
        <input value={form.hours} onChange={e => setForm(p => ({ ...p, hours: e.target.value }))} placeholder="영업시간 (예: 11:00~22:00)" style={inp} />
        <input value={form.priceRange} onChange={e => setForm(p => ({ ...p, priceRange: e.target.value }))} placeholder="가격대 (예: ¥50/인)" style={inp} />
        <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="간단한 설명" rows={2} style={{ ...inp, resize:'none' }} />
        <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="태그 (쉼표로 구분: 한식, 강남4구, 추천)" style={inp} />

        <div style={{ display:'flex', gap:10, marginTop:8 }}>
          <button onClick={onClose} className="v2-btn-ghost" style={{ flex:1, padding:'13px' }}>취소</button>
          <button onClick={handleSubmit} disabled={!form.nameKo.trim()} className="v2-btn-primary" style={{ flex:2, padding:'13px', opacity: form.nameKo.trim() ? 1 : 0.4 }}>저장</button>
        </div>
      </div>
    </div>
  );
}

export default function FavoritesV2() {
  const [selectedCat, setSelectedCat] = useState('식당');
  const [selectedSub, setSelectedSub] = useState('전체');
  const [showAddModal, setShowAddModal] = useState(false);
  const [customPlaces, setCustomPlaces] = useState(() => {
    try { return JSON.parse(localStorage.getItem('customFavoritePlaces') || '[]'); }
    catch { return []; }
  });

  const allPlaces = [...places, ...customPlaces];
  const filtered = allPlaces.filter(p => {
    if (p.category !== selectedCat) return false;
    if (selectedSub && selectedSub !== '전체' && p.subCategory !== selectedSub) return false;
    return true;
  });

  function handleCatChange(catId) {
    setSelectedCat(catId);
    setSelectedSub('전체');
  }

  function handleSavePlace(newPlace) {
    const updated = [newPlace, ...customPlaces];
    setCustomPlaces(updated);
    localStorage.setItem('customFavoritePlaces', JSON.stringify(updated));
    setShowAddModal(false);
  }

  function handleDeleteCustomPlace(id) {
    const updated = customPlaces.filter(p => p.id !== id);
    setCustomPlaces(updated);
    localStorage.setItem('customFavoritePlaces', JSON.stringify(updated));
  }

  return (
    <div className="v2-page">
      {/* Header */}
      <div className="v2-animate" style={{ padding: '24px 20px 14px' }}>
        <div className="v2-eyebrow">이우 생활권</div>
        <h1 className="v2-heading" style={{ fontSize: '1.5rem', margin: '4px 0 4px' }}>⭐ 즐겨찾기</h1>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>탭하면 고덕지도로 바로 검색</p>
      </div>

      {/* Category Grid */}
      <div className="v2-animate v2-animate-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: '0 16px 12px' }}>
        {placeCategories.map(cat => (
          <button key={cat.id} onClick={() => handleCatChange(cat.id)}
            style={{ padding: '10px 8px', borderRadius: 12, border: selectedCat === cat.id ? 'none' : '1px solid rgba(212,175,55,0.08)', background: selectedCat === cat.id ? 'linear-gradient(135deg, var(--crimson), var(--crimson-dark))' : 'rgba(255,255,255,0.04)', color: selectedCat === cat.id ? 'white' : 'var(--text-muted)', fontSize: '0.82rem', fontWeight: selectedCat === cat.id ? 700 : 400, cursor: 'pointer', fontFamily: 'Noto Sans KR', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, boxShadow: selectedCat === cat.id ? '0 3px 0 rgba(139,0,0,0.35)' : 'none' }}>
            <span style={{ fontSize: '1.2rem' }}>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Subcategory Pills */}
      {subCategories[selectedCat] && (
        <div className="v2-scroll-hide v2-animate v2-animate-delay-2" style={{ display: 'flex', gap: 6, padding: '0 16px 12px', overflowX: 'auto' }}>
          {subCategories[selectedCat].map(sub => (
            <button key={sub} onClick={() => setSelectedSub(sub)}
              style={{ flexShrink: 0, padding: '5px 14px', borderRadius: 100, border: selectedSub === sub ? '1px solid var(--gold)' : '1px solid rgba(212,175,55,0.15)', background: selectedSub === sub ? 'rgba(212,175,55,0.12)' : 'transparent', color: selectedSub === sub ? 'var(--gold)' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: selectedSub === sub ? 700 : 400, cursor: 'pointer', fontFamily: 'Noto Sans KR', whiteSpace: 'nowrap', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Result count + Add button */}
      <div className="v2-animate v2-animate-delay-3" style={{ padding:'0 16px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>총 {filtered.length}개 장소</span>
        <button onClick={() => setShowAddModal(true)} className="v2-btn-primary" style={{ padding:'8px 18px', fontSize:'0.82rem' }}>
          + 장소 추가
        </button>
      </div>

      {/* Place Cards */}
      <div style={{ padding: '0 10px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, margin: '0 auto 16px', background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(196,30,58,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', animation: 'v2-float 4s ease-in-out infinite' }}>📍</div>
            <p>장소를 추가해주세요</p>
            <p style={{ fontSize:'0.78rem' }}>생활반경 데이터를 곧 업데이트할 예정입니다</p>
          </div>
        ) : (
          <div className="v2-stagger">
            {filtered.map(place => {
              const status = getBusinessStatus(place.hours);
              return (
                <div key={place.id} className="v2-card" style={{ marginBottom: 12, position: 'relative' }}>
                  {place.isCustom && (
                    <button onClick={() => handleDeleteCustomPlace(place.id)}
                      style={{ position:'absolute', top:12, right:12, background:'rgba(196,30,58,0.8)', border:'none', borderRadius:'50%', width:28, height:28, color:'white', cursor:'pointer', fontSize:'0.8rem', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1 }}>
                      🗑
                    </button>
                  )}
                  <div style={{ background: 'var(--bezel-inner-bg)', borderRadius: 'var(--bezel-radius-inner)', boxShadow: 'var(--bezel-inner-highlight)', overflow: 'hidden', backdropFilter: 'blur(16px)' }}>
                    {/* Image area */}
                    <div style={{ width: '100%', height: 160, background: place.images?.[0] ? 'transparent' : 'linear-gradient(135deg, rgba(196,30,58,0.12), rgba(212,175,55,0.08))', overflow: 'hidden', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                      {place.images?.[0] ? (
                        <img src={place.images[0]} alt={place.nameKo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy"
                          onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'linear-gradient(135deg, rgba(196,30,58,0.12), rgba(212,175,55,0.08))'; }} />
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.4 }}>
                          <span style={{ fontSize: '2.5rem' }}>
                            {place.category === '식당' ? '🍽️' : place.category === '운동' ? '💪' : place.category === '마사지' ? '💆' : place.category === '쇼핑' ? '🛍️' : place.category === '집/회사' ? '🏠' : '📍'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'Noto Sans KR' }}>이미지 준비 중</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:2 }}>
                        <p style={{ margin:0, fontWeight:700, fontSize:'0.95rem', color:'var(--cream)', flex:1 }}>{place.nameKo}</p>
                        <div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:100, background:status.bg, border:`1px solid ${status.color}33`, flexShrink:0 }}>
                          <div style={{ width:6, height:6, borderRadius:'50%', background:status.color, boxShadow: status.status === 'open' ? `0 0 6px ${status.color}` : 'none' }} />
                          <span style={{ fontSize:'0.68rem', fontWeight:700, color:status.color, fontFamily:'Noto Sans KR' }}>{status.label}</span>
                        </div>
                      </div>
                      <p style={{ margin: '0 0 6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{place.nameZh}</p>
                      {place.addressKo && <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>📍 {place.addressKo}</p>}
                      {place.hours && <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>🕐 {place.hours}</p>}
                      {place.priceRange && <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>💰 {place.priceRange}</p>}
                      {place.rating > 0 && <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--gold)' }}>⭐ {place.rating} ({place.reviews}명 평가)</p>}

                      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                        {place.distance && <span className="v2-tag">📏 {place.distance}</span>}
                        {place.driveTime && <span className="v2-tag" style={{ background: 'rgba(196,30,58,0.08)' }}>🚗 {place.driveTime}</span>}
                      </div>

                      {place.description && <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.55, wordBreak: 'keep-all' }}>{place.description}</p>}
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                        {place.tags?.map(tag => (<span key={tag} className="v2-tag">#{tag}</span>))}
                      </div>

                      <button onClick={() => openAmapSearch(place.nameZh || place.nameKo)} className="v2-btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.85rem' }}>
                        🗺️ 고덕지도에서 검색
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && <AddPlaceModalV2 onClose={() => setShowAddModal(false)} onSave={handleSavePlace} />}
    </div>
  );
}
