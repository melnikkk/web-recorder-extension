import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/chrome-extension';
import App from './App';
import { GlobalStyle } from '../../ui/styles';
import { ErrorBoundary, initPopupErrorHandler } from './PopupErrorHandler';
import { AuthProvider } from '../../features/auth';

initPopupErrorHandler();

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// oxlint-disable-next-line no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl={window.location.pathname}
      signInForceRedirectUrl={window.location.pathname}
      signUpForceRedirectUrl={window.location.pathname}
    >
      <AuthProvider>
        <ErrorBoundary>
          <GlobalStyle />
          <App />
        </ErrorBoundary>
      </AuthProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
