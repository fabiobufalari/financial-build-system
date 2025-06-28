import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 Starting React application...');

const rootElement = document.getElementById('root');
console.log('📍 Root element:', rootElement);

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  console.log('✅ React root created');
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('🎯 App rendered');
} else {
  console.error('❌ Root element not found!');
}

