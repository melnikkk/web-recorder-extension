import { getAuthToken } from './utils';

export const withAuthVerification =
  <T extends { type: string; authToken?: string | null }>(
    handler: (
      message: T,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: unknown) => void,
    ) => void | boolean,
  ) =>
  async (
    message: T,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void,
  ) => {
    const skipAuth = ['AUTH_REQUEST', 'LOGIN_REQUEST'].includes(message?.type);

    if (!skipAuth) {
      const token = message.authToken || (await getAuthToken());

      if (!token) {
        sendResponse({ error: 'Authentication required' });

        return true;
      }
    }

    return handler(message, sender, sendResponse);
  };
