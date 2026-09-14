import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/wellness-animations.css'
import { reloadOnceForChunkError } from './lib/lazyWithRetry'

// Vite preloads a page's CSS and shared chunks before importing it. After a
// deploy those preloads can 404 for a tab opened before the deploy. Vite
// reports that here; one reload fetches the new filenames. See
// src/lib/lazyWithRetry.ts for the same guard on the page chunks themselves.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadOnceForChunkError(event.payload ?? new Error('Failed to fetch dynamically imported module'))) {
    event.preventDefault();
  }
});

// NOTE: the PayPal SDK is deliberately NOT loaded here. It used to wrap the
// whole app in a <PayPalScriptProvider>, which pulled ~200-350KB of SDK from
// paypal.com on every single page — homepage, event page, everything — for a
// script only the checkout components ever use. Each of those (PayPalCheckout,
// RoamBuddyCheckoutModal) already wraps itself in its own PayPalScriptProvider,
// so the SDK now loads only when a checkout actually mounts. If you add a new
// PayPal surface, wrap it locally the same way rather than restoring a global
// provider here.
createRoot(document.getElementById("root")!).render(<App />);
