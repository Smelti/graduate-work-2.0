import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router';
import './App.css';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <React.StrictMode>
      <AppRouter></AppRouter>
    </React.StrictMode>
  </AuthProvider>
);
