import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './app';
import ApiProvider from './api/provider.tsx';
import { AuthProvider } from './hooks/auth.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApiProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApiProvider>
  </React.StrictMode>
);
