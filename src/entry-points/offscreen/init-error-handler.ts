import { ErrorHandlerService } from '../../core/error-handling';

export const initOffscreenErrorHandler = () => {
  ErrorHandlerService.getInstance().registerGlobalErrorHandler();
};
