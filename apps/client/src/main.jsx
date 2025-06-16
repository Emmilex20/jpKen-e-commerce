// C:\Users\user\Desktop\e-commerce-project\apps\client\src\main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CartProvider } from './context/CartContext.jsx'; 
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; 
import store from './store.js'; 

import 'bootstrap/dist/css/bootstrap.min.css';

// Import PayPalScriptProvider
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

// Define initial options for the PayPal script
// The clientId will be loaded dynamically in OrderPage, but we need currency here.
const initialPayPalOptions = {
  clientId: "sb", // Use "sb" for sandbox or an empty string initially
  currency: "USD", // Set your currency here (e.g., "USD", "GBP", "EUR")
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      {/* Wrap with PayPalScriptProvider */}
      <PayPalScriptProvider options={initialPayPalOptions}>
        <BrowserRouter>
          <Provider store={store}>
            <CartProvider>
              <App />
            </CartProvider>
          </Provider>
        </BrowserRouter>
      </PayPalScriptProvider>
    </HelmetProvider>
  </React.StrictMode>,
);