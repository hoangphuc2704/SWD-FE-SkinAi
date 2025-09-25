import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App.jsx';
import '../src/assets/styles/_global.scss';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
