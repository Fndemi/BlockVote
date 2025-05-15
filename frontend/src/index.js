import React from 'react';
import ReactDOM from 'react-dom/client';  // ✅ this is for React 18+
import './index.css';  // Ensure you import index.css here

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
