import { useEffect, useRef } from 'react';

const tabs = [
  { id: 'home',         icon: '📸', label: 'AI분석' },
  { id: 'chat',         icon: '💬', label: 'AI채팅' },
  { id: 'history',      icon: '📋', label: '기록' },
  { id: 'encyclopedia', icon: '📚', label: '백과사전' },
  { id: 'favorites',    icon: '⭐', label: '즐겨찾기' },
  { id: 'settings',     icon: '⚙️', label: '설정' },
];

export default function BottomNavV2({ current, onChange }) {
  const navRef = useRef(null);

  useEffect(() => {
    if (!navRef.current) return;
    navRef.current.style.opacity = '0';
    navRef.current.style.transform = 'translateX(-50%) translateY(20px)';
    requestAnimationFrame(() => {
      navRef.current.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      navRef.current.style.opacity = '1';
      navRef.current.style.transform = 'translateX(-50%) translateY(0)';
    });
  }, []);

  return (
    <nav ref={navRef} className="v2-bottom-nav">
      {tabs.map(t => (
        <div
          key={t.id}
          className={`v2-nav-item ${current === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <span className="v2-nav-icon">{t.icon}</span>
          <span className="v2-nav-label">{t.label}</span>
        </div>
      ))}
    </nav>
  );
}
