import { useState, useEffect } from 'react';
import BottomNavV2 from './components/BottomNavV2';
import HomeV2 from './pages/HomeV2';
import EncyclopediaV2 from './pages/EncyclopediaV2';
import ChatV2 from './pages/ChatV2';
import HistoryV2 from './pages/HistoryV2';
import FavoritesV2 from './pages/FavoritesV2';
import SettingsV2 from './pages/SettingsV2';

export default function AppV2() {
  const [page, setPage] = useState('home');

  useEffect(() => {
    document.body.classList.add('v2');
    return () => document.body.classList.remove('v2');
  }, []);

  const pages = {
    home: <HomeV2 />,
    encyclopedia: <EncyclopediaV2 onAskAI={() => setPage('home')} />,
    chat: <ChatV2 />,
    history: <HistoryV2 />,
    favorites: <FavoritesV2 />,
    settings: <SettingsV2 />,
  };

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100dvh', position: 'relative' }}>
      {pages[page]}
      <BottomNavV2 current={page} onChange={setPage} />
    </div>
  );
}
