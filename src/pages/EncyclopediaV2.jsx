import { useState, useRef } from 'react';
import { categories, chinaItems } from '../data/chinaItems';
import ItemDetailModalV2 from '../components/ItemDetailModalV2';
import { saveItemImage, getUserItems, saveUserItem, deleteUserItem } from '../utils/userItems';
import { compressToThumbnail } from '../utils/imageUtils';

function AddItemModalV2({ onClose, onSave }) {
  const [form, setForm] = useState({
    nameKo: '', nameZh: '', category: 'food',
    subcategory: '', description: '',
    howToUse: '', warning: '', tags: '',
    emoji: '📝', image: null
  });
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  async function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressToThumbnail(file, 200);
    setPreview(compressed);
    setForm(prev => ({ ...prev, image: compressed }));
  }

  function handleSubmit() {
    if (!form.nameKo.trim() || !form.description.trim()) return;
    const newItem = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    if (form.image) saveItemImage('user_' + Date.now(), form.image);
    onSave(newItem);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(26,16,8,0.88)',
      backdropFilter: 'blur(12px)',
    }} onClick={onClose}>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 6,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(212,175,55,0.1)',
        borderBottom: 'none',
        borderRadius: '28px 28px 0 0',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          background: 'var(--cream)',
          borderRadius: '24px 24px 0 0',
          padding: '20px 20px 48px',
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3)',
        }}>
          <div style={{ width: 40, height: 4, borderRadius: 2,
            background: 'rgba(26,16,8,0.12)', margin: '0 auto 16px' }} />

          <h2 style={{ fontFamily: 'Noto Serif KR', color: 'var(--crimson)',
            margin: '0 0 16px', fontSize: '1.1rem', textAlign: 'center', fontWeight: 700 }}>
            ➕ 새 항목 추가
          </h2>

          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div onClick={() => fileRef.current?.click()}
              style={{
                width: 80, height: 80, borderRadius: 20, margin: '0 auto 8px',
                background: 'rgba(196,30,58,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden',
                border: '2px dashed rgba(196,30,58,0.2)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
              {preview ? (
                <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2rem' }}>{form.emoji || '📷'}</span>
              )}
            </div>
            <p style={{ fontSize: '0.72rem', color: '#8B7355', margin: 0 }}>
              탭하여 이미지 추가 (선택사항)
            </p>
            <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={handleImage} />
          </div>

          {[
            { type: 'select', key: 'category', options: [
              { v: 'medicine', l: '💊 의약품' }, { v: 'food', l: '🍜 음식' },
              { v: 'mart', l: '🛒 마트식품' }, { v: 'drink', l: '🧋 음료' },
              { v: 'snack', l: '🍪 과자/간식' }, { v: 'condiment', l: '🧂 조미료' },
              { v: 'daily', l: '🧴 생활용품' },
            ]},
            { key: 'emoji', placeholder: '이모지 (예: 🍜)' },
            { key: 'nameKo', placeholder: '* 이름 (한국어) — 필수', required: true },
            { key: 'nameZh', placeholder: '이름 (중국어)' },
            { key: 'description', placeholder: '* 설명 — 필수', multiline: true, required: true },
            { key: 'howToUse', placeholder: '사용법 / 먹는 방법 (선택사항)', multiline: true },
            { key: 'warning', placeholder: '주의사항 (선택사항)' },
            { key: 'tags', placeholder: '태그 (쉼표로 구분: 매운맛, 이우, 추천)' },
          ].map(field => {
            const baseStyle = {
              width: '100%', padding: '11px 14px',
              background: 'rgba(26,16,8,0.03)', border: '1px solid rgba(26,16,8,0.1)',
              borderRadius: 12, fontFamily: 'Noto Sans KR', fontSize: '0.85rem',
              color: '#1A1008', outline: 'none', boxSizing: 'border-box', marginBottom: 10,
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            };
            if (field.required && !form[field.key]) baseStyle.borderColor = 'rgba(196,30,58,0.3)';

            if (field.type === 'select') {
              return (
                <select key={field.key} value={form[field.key]}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  style={baseStyle}>
                  {field.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              );
            }
            if (field.multiline) {
              return (
                <textarea key={field.key} value={form[field.key]}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder} rows={field.key === 'description' ? 3 : 2}
                  style={{ ...baseStyle, resize: 'none' }} />
              );
            }
            return (
              <input key={field.key} value={form[field.key]}
                onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder} style={baseStyle} />
            );
          })}

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '13px', borderRadius: 100, border: 'none',
              background: 'rgba(26,16,8,0.06)', color: '#5C3D2E',
              fontFamily: 'Noto Sans KR', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>취소</button>
            <button onClick={handleSubmit}
              disabled={!form.nameKo.trim() || !form.description.trim()}
              className="v2-btn-primary"
              style={{ flex: 2, padding: '13px', opacity: (!form.nameKo.trim() || !form.description.trim()) ? 0.4 : 1 }}>
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EncyclopediaV2({ onAskAI }) {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [userItems, setUserItems] = useState(getUserItems);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingImageId, setEditingImageId] = useState(null);
  const [itemImages, setItemImages] = useState(
    () => JSON.parse(localStorage.getItem('itemImages') || '{}')
  );
  const imageInputRef = useRef(null);

  const allItems = [...chinaItems, ...userItems];
  const filtered = allItems.filter(item => {
    const matchCat = selectedCat === 'all' || item.category === selectedCat;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      item.nameKo?.toLowerCase().includes(q) ||
      item.nameZh?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.tags?.some(t => t.includes(q));
    return matchCat && matchSearch;
  });

  async function handleItemImageUpload(e, itemId) {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressToThumbnail(file, 200);
    saveItemImage(itemId, compressed);
    setItemImages(prev => ({ ...prev, [itemId]: compressed }));
  }

  return (
    <div className="v2-page">
      <ItemDetailModalV2 item={selectedItem} onClose={() => setSelectedItem(null)} />

      <input type="file" accept="image/*" ref={imageInputRef} style={{ display: 'none' }}
        onChange={e => { if (editingImageId) handleItemImageUpload(e, editingImageId); }} />

      {/* Header */}
      <div className="v2-animate" style={{ padding: '24px 20px 12px' }}>
        <div className="v2-eyebrow">오프라인 이용 가능</div>
        <h1 className="v2-heading" style={{ fontSize: '1.5rem', margin: '4px 0 0' }}>
          📚 중국생활 백과사전
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            ✍️ 전문가 검수 데이터 &nbsp;·&nbsp;
            🤖 AI 질문은 <strong className="v2-gradient-text">Gemini AI</strong> 제공
          </span>
        </div>
      </div>

      {/* Sticky search */}
      <div className="v2-animate v2-animate-delay-1" style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(26,16,8,0.92)',
        backdropFilter: 'blur(20px)',
        padding: '12px 10px',
        borderBottom: '1px solid rgba(212,175,55,0.08)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: 100, padding: '10px 16px',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <span style={{ color: 'var(--gold)', fontSize: '1rem' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="약 이름, 음식, 제품명으로 검색..."
            style={{
              flex: 1, background: 'transparent', border: 'none',
              color: 'var(--cream)', fontFamily: 'Noto Sans KR',
              fontSize: '0.9rem', outline: 'none',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              background: 'none', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem',
            }}>✕</button>
          )}
        </div>
      </div>

      {/* Category pills */}
      <div className="v2-scroll-hide v2-animate v2-animate-delay-2" style={{
        display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 10px 10px',
      }}>
        {[{ id: 'all', label: '전체', emoji: '🔎' }, ...categories].map(cat => (
          <button key={cat.id}
            className={`v2-pill ${selectedCat === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCat(cat.id)}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Count + add button */}
      <div className="v2-animate v2-animate-delay-3" style={{
        padding: '4px 10px 10px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          총 {filtered.length}개 항목
        </span>
        <button className="v2-btn-gold" onClick={() => setShowAddModal(true)}
          style={{ padding: '7px 16px', fontSize: '0.78rem' }}>
          ➕ 항목 추가
        </button>
      </div>

      {/* Items list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(196,30,58,0.05))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem',
          }}>🔍</div>
          <p style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>
            검색 결과가 없습니다
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 20 }}>
            AI 탭에서 사진으로 직접 물어보세요
          </p>
          <button className="v2-btn-primary" onClick={onAskAI}>📸 AI로 물어보기</button>
        </div>
      ) : (
        <div className="v2-stagger" style={{ padding: '0 10px' }}>
          {filtered.map(item => (
            <div key={item.id}
              className="v2-card"
              style={{ marginBottom: 10, cursor: 'pointer', position: 'relative' }}
              onClick={() => setSelectedItem({ ...item, userImage: itemImages[item.id] })}>
              <div className="v2-card-inner" style={{ padding: '14px 10px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  {/* Image or emoji */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'linear-gradient(135deg, rgba(196,30,58,0.1), rgba(212,175,55,0.06))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', flexShrink: 0, overflow: 'hidden', position: 'relative',
                  }}>
                    {itemImages[item.id] ? (
                      <img src={itemImages[item.id]} alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>{item.emoji}</span>
                    )}
                    <button onClick={e => {
                      e.stopPropagation();
                      setEditingImageId(item.id);
                      imageInputRef.current?.click();
                    }} style={{
                      position: 'absolute', bottom: 0, right: 0,
                      width: 18, height: 18, background: 'rgba(196,30,58,0.85)',
                      border: 'none', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', fontSize: '0.55rem', color: 'white',
                    }}>📷</button>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.92rem', color: 'var(--cream)' }}>
                        {item.nameKo}
                        {item.isUserItem && (
                          <span style={{
                            marginLeft: 6, fontSize: '0.6rem',
                            background: 'rgba(196,30,58,0.12)', color: 'var(--crimson)',
                            padding: '2px 7px', borderRadius: 100, fontWeight: 600,
                          }}>내 항목</span>
                        )}
                      </p>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                        {item.nameZh}
                      </span>
                    </div>
                    <p style={{
                      margin: '5px 0 8px', fontSize: '0.8rem',
                      color: 'var(--text-secondary)', lineHeight: 1.55,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      wordBreak: 'keep-all',
                    }}>{item.description}</p>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {item.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="v2-tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {item.warning && (
                  <div className="v2-warning">⚠️ {item.warning}</div>
                )}

                {item.isUserItem && (
                  <button onClick={e => {
                    e.stopPropagation();
                    deleteUserItem(item.id);
                    setUserItems(getUserItems());
                  }} style={{
                    position: 'absolute', top: 14, right: 14,
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem',
                  }}>🗑</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddItemModalV2
          onClose={() => setShowAddModal(false)}
          onSave={newItem => {
            saveUserItem(newItem);
            setUserItems(getUserItems());
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
