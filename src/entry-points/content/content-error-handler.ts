import { ErrorHandlerService } from '../../core/error-handling';

export const initContentErrorHandler = () => {
  ErrorHandlerService.getInstance().registerGlobalErrorHandler();
};
