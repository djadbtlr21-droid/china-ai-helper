import React from 'react';

const tabs = [
  { id: 'home',         icon: '📸', label: 'AI분석' },
  { id: 'encyclopedia', icon: '📚', label: '백과사전' },
  { id: 'chat',         icon: '💬', label: '채팅' },
  { id: 'history',      icon: '📋', label: '기록' },
  { id: 'favorites',    icon: '⭐', label: '즐겨찾기' },
  { id: 'settings',     icon: '⚙️', label: '설정' },
];

export default function BottomNav({ current, onChange }) {
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <div key={t.id}
          className={`nav-item ${current === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}>
          <span className="nav-icon">{t.icon}</span>
          <span className="nav-label">{t.label}</span>
        </div>
      ))}
    </nav>
  );
}
