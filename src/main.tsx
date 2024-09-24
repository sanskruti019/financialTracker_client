import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY : string = "pk_test_YWJsZS10dW5hLTU3LmNsZXJrLmFjY291bnRzLmRldiQ";
if(!PUBLISHABLE_KEY){
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);
