import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// StrictMode is ON on purpose: in development it runs effects twice on mount
// (setup → cleanup → setup) to expose missing cleanups. See example 26.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
