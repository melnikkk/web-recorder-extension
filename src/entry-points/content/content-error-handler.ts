import { ErrorHandlerService } from '../../core';

export const initContentErrorHandler = () => {
  ErrorHandlerService.getInstance().registerGlobalErrorHandler();
};
