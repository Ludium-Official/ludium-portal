import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { initializeWepin } from '@/lib/wepin';
import Providers from '@/providers';
import App from './app';

initializeWepin();

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
