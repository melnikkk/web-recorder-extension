import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalStyle } from '../../ui/styles';
import { ErrorBoundary, initPopupErrorHandler } from './popup-error-handler';

initPopupErrorHandler();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GlobalStyle />
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
