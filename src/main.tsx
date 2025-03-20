import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import client from '@/apollo/client';
import { initializeWepin } from '@/lib/wepin';
import { ApolloProvider } from '@apollo/client';
import App from './app';

initializeWepin();

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
);
