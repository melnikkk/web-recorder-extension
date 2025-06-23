import { ChromeAPIError, ErrorHandlerService } from '../error-handling';
import { safeExecuteChromeAPI } from './chrome-api.utils';

export const getActiveTab = async () => {
  const tabs = await safeExecuteChromeAPI(
    'chrome.tabs.query',
    async () => await chrome.tabs.query({ active: true, currentWindow: true }),
  );

  if (tabs.length === 0) {
    throw new ChromeAPIError('No active tab found', 'chrome.tabs.query');
  }

  return tabs[0];
};

export const getActiveTabDimensions = async (): Promise<{
  width: number;
  height: number;
}> => {
  const defaultDimensions = { width: 1920, height: 1080 };

  try {
    const activeTab = await getActiveTab();

    if (!activeTab.id) {
      return defaultDimensions;
    }

    const result = await safeExecuteChromeAPI(
      'chrome.scripting.executeScript',
      async () => {
        if (!activeTab.id) {
          return undefined;
        }

        const [result] = await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: () => ({ width: window.innerWidth, height: window.innerHeight }),
        });

        return result;
      },
      undefined,
    );

    if (result?.result) {
      return result.result;
    }

    return defaultDimensions;
  } catch (error) {
    ErrorHandlerService.getInstance().handleError(
      error instanceof Error ? error : new Error(String(error)),
      'getActiveTabDimensions',
    );

    return defaultDimensions;
  }
};
