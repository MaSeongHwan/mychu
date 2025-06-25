import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { setupDebugTools } from './utils/debugUtils'

// 개발 환경에서 디버깅 도구 설정
if (import.meta.env.DEV) {
  setupDebugTools();
  console.log('Development mode active - debug tools enabled');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
