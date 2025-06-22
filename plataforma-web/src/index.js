import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; //Tan solo por importarlo ya se aplica el estilo al index
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);