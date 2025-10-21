// Phase 6: Wrap with PayPal Provider
import { createRoot } from 'react-dom/client'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import App from './App.tsx'
import './index.css'
import './styles/wellness-animations.css'
import { PAYPAL_OPTIONS } from './config/paypal';

createRoot(document.getElementById("root")!).render(
  <PayPalScriptProvider options={PAYPAL_OPTIONS}>
    <App />
  </PayPalScriptProvider>
);
