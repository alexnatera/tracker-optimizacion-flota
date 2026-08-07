import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { App } from './App';
import './index.css';

// Service Worker PWA registration for offline readiness
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('[OPTRACKER PWA] Nueva versión disponible.');
  },
  onOfflineReady() {
    console.log('[OPTRACKER PWA] Aplicación lista para trabajar offline.');
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
