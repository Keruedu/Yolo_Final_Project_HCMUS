import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Make sure we're targeting the correct DOM element
const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);