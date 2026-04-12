import React, { useState, useRef } from 'react';
import { categories, chinaItems } from '../data/chinaItems';
import ItemDetailModal from '../components/ItemDetailModal';
import {
  saveItemImage, getUserItems, saveUserItem, deleteUserItem
} from '../utils/userItems';
import { compressToThumbnail } from '../utils/imageUtils';

function AddItemModal({ onClose, onSave }) {
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
    const newItem = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    if (form.image) {
      const tempId = 'user_' + Date.now();
      saveItemImage(tempId, form.image);
    }
    onSave(newItem);
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--cream-dark)',
    border: '1px solid var(--card-border)',
    borderRadius: 10, fontFamily: 'Noto Sans KR',
    fontSize: '0.85rem', color: 'var(--ink)',
    outline: 'none', boxSizing: 'border-box',
    marginBottom: 10
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(26,16,8,0.88)',
      backdropFilter: 'blur(8px)'
    }} onClick={onClose}>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--cream)',
        borderRadius: '24px 24px 0 0',
        padding: '20px 20px 48px',
        maxHeight: '90vh', overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>

        <div style={{ width: 40, height: 4, borderRadius: 2,
          background: 'var(--card-border)', margin: '0 auto 16px' }} />

        <h2 style={{ fontFamily: 'Noto Serif KR', color: 'var(--crimson)',
          margin: '0 0 16px', fontSize: '1.1rem', textAlign: 'center' }}>
          ➕ 새 항목 추가
        </h2>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: 80, height: 80, borderRadius: 16, margin: '0 auto 8px',
              background: 'var(--crimson-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', overflow: 'hidden',
              border: '2px dashed rgba(196,30,58,0.3)'
            }}>
            {preview ? (
              <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '2rem' }}>{form.emoji || '📷'}</span>
            )}
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
            탭하여 이미지 추가 (선택사항)
          </p>
          <input type="file" accept="image/*" ref={fileRef}
            style={{ display: 'none' }} onChange={handleImage} />
        </div>

        <select value={form.category}
          onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
          style={{ ...inputStyle }}>
          <option value="medicine">💊 의약품</option>
          <option value="food">🍜 음식</option>
          <option value="mart">🛒 마트식품</option>
          <option value="drink">🧋 음료</option>
          <option value="snack">🍪 과자/간식</option>
          <option value="condiment">🧂 조미료</option>
          <option value="daily">🧴 생활용품</option>
        </select>

        <input value={form.emoji}
          onChange={e => setForm(prev => ({ ...prev, emoji: e.target.value }))}
          placeholder="이모지 (예: 🍜)"
          style={{ ...inputStyle }} />

        <input value={form.nameKo}
          onChange={e => setForm(prev => ({ ...prev, nameKo: e.target.value }))}
          placeholder="* 이름 (한국어) — 필수"
          style={{ ...inputStyle,
            border: !form.nameKo ? '1px solid var(--crimson)' : '1px solid var(--card-border)' }} />

        <input value={form.nameZh}
          onChange={e => setForm(prev => ({ ...prev, nameZh: e.target.value }))}
          placeholder="이름 (중국어)"
          style={{ ...inputStyle }} />

        <textarea value={form.description}
          onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
          placeholder="* 설명 — 필수"
          rows={3}
          style={{ ...inputStyle, resize: 'none',
            border: !form.description ? '1px solid var(--crimson)' : '1px solid var(--card-border)' }} />

        <textarea value={form.howToUse}
          onChange={e => setForm(prev => ({ ...prev, howToUse: e.target.value }))}
          placeholder="사용법 / 먹는 방법 (선택사항)"
          rows={2}
          style={{ ...inputStyle, resize: 'none' }} />

        <input value={form.warning}
          onChange={e => setForm(prev => ({ ...prev, warning: e.target.value }))}
          placeholder="주의사항 (선택사항)"
          style={{ ...inputStyle }} />

        <input value={form.tags}
          onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="태그 (쉼표로 구분: 매운맛, 이우, 추천)"
          style={{ ...inputStyle }} />

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button onClick={onClose}
            style={{
              flex: 1, padding: '13px', borderRadius: 100, border: 'none',
              background: 'rgba(212,175,55,0.1)', color: 'var(--text-secondary)',
              fontFamily: 'Noto Sans KR', fontWeight: 600, cursor: 'pointer'
            }}>
            취소
          </button>
          <button onClick={handleSubmit}
            disabled={!form.nameKo.trim() || !form.description.trim()}
            className="btn-primary"
            style={{ flex: 2, padding: '13px',
              opacity: (!form.nameKo.trim() || !form.description.trim()) ? 0.5 : 1 }}>
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Encyclopedia({ onAskAI }) {
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
    <div className="page" style={{ background: 'transparent' }}>
      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* Hidden image input */}
      <input
        type="file" accept="image/*" ref={imageInputRef}
        style={{ display: 'none' }}
        onChange={e => {
          if (editingImageId) handleItemImageUpload(e, editingImageId);
        }}
      />

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

      {/* Result count + add button */}
      <div style={{ padding: '4px 16px 8px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          총 {filtered.length}개 항목
        </span>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-gold"
          style={{ padding: '7px 16px', fontSize: '0.8rem' }}>
          ➕ 항목 추가
        </button>
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
              style={{ marginBottom: 10, padding: '14px 16px',
                cursor: 'pointer', position: 'relative' }}
              onClick={() => setSelectedItem({ ...item, userImage: itemImages[item.id] })}>

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                {/* Image or emoji */}
                <div style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: 'var(--crimson-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0, overflow: 'hidden', position: 'relative'
                }}>
                  {itemImages[item.id] ? (
                    <img src={itemImages[item.id]} alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>{item.emoji}</span>
                  )}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setEditingImageId(item.id);
                      imageInputRef.current?.click();
                    }}
                    style={{
                      position: 'absolute', bottom: 0, right: 0,
                      width: 18, height: 18,
                      background: 'rgba(196,30,58,0.85)',
                      border: 'none', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', fontSize: '0.6rem', color: 'white'
                    }}>
                    📷
                  </button>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', gap: 8 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.92rem',
                      color: 'var(--text-primary)' }}>
                      {item.nameKo}
                      {item.isUserItem && (
                        <span style={{
                          marginLeft: 6, fontSize: '0.62rem',
                          background: 'var(--crimson-light)',
                          color: 'var(--crimson)', padding: '1px 6px',
                          borderRadius: 100, fontWeight: 600
                        }}>내 항목</span>
                      )}
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
                    {item.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {item.warning && (
                <div className="warning-box">⚠️ {item.warning}</div>
              )}

              {item.isUserItem && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    deleteUserItem(item.id);
                    setUserItems(getUserItems());
                  }}
                  style={{
                    position: 'absolute', top: 10, right: 10,
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem'
                  }}>🗑</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add item modal */}
      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onSave={(newItem) => {
            saveUserItem(newItem);
            setUserItems(getUserItems());
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
