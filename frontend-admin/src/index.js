import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Default CRA style
import './styles.css'; // Our custom admin style
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);