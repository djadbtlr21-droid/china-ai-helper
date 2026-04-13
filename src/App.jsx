import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Encyclopedia from './pages/Encyclopedia';
import Chat from './pages/Chat';
import History from './pages/History';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';

export default function App() {
  const [page, setPage] = useState('home');

  const pages = {
    home: <Home />,
    encyclopedia: <Encyclopedia onAskAI={() => setPage('home')} />,
    chat: <Chat />,
    history: <History />,
    favorites: <Favorites />,
    settings: <Settings />,
  };

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh', position: 'relative' }}>
      {pages[page]}
      <BottomNav current={page} onChange={setPage} />
    </div>
  );
}
