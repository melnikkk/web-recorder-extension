import { ErrorHandlerService } from '../../core/error-handling';

self.addEventListener('error', (event) => {
  const error = event instanceof ErrorEvent ? event.error : new Error(String(event));

  ErrorHandlerService.getInstance().handleError(error, 'background-global');
});

self.addEventListener('unhandledrejection', (event) => {
  const error =
    event.reason instanceof Error ? event.reason : new Error(String(event.reason));
  ErrorHandlerService.getInstance().handleError(error, 'background-unhandled-promise');
});

export const initBackgroundErrorHandler = () => {
  console.info('Background error handler initialized');
};
