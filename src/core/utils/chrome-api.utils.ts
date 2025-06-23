import { ChromeAPIError } from '../error-handling';

export const safeExecuteChromeAPI = async <T>(
  apiName: string,
  apiCall: () => Promise<T>,
  defaultValue?: T,
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    const chromeAPIError = new ChromeAPIError(
      `Chrome API '${apiName}' failed`,
      apiName,
      error instanceof Error ? error : new Error(String(error)),
    );

    if (defaultValue !== undefined) {
      return defaultValue;
    }

    throw chromeAPIError;
  }
};
