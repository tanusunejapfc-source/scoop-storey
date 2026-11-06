import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Prevent mobile browsers from restoring previous scroll offsets on initial open
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  const h = window.location.hash;
  if (h === '#scoop-machine' || h === '#menu' || h === '#charm-studio' || h === '#reels') {
    try {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch {}
  }
  window.scrollTo(0, 0);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

