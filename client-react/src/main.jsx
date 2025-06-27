import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { setupDebugTools } from './utils/debugUtils';

if (import.meta.env.DEV) {
  setupDebugTools();
  console.log('Development mode active - debug tools enabled');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);