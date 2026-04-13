import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './index-v2.css'
import App from './App.jsx'
import AppV2 from './AppV2.jsx'

const USE_V2 = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {USE_V2 ? <AppV2 /> : <App />}
  </StrictMode>,
)
