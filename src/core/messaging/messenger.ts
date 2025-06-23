import { MessagingError } from '../error-handling';
import { BackgroundMessage, OffscreenMessage } from '../types';

export const sendRuntimeMessage = async (
  message: OffscreenMessage | BackgroundMessage,
) => {
  try {
    await chrome.runtime.sendMessage(message);
  } catch (error) {
    const messagingError = new MessagingError(
      'Failed to send runtime message',
      message.type,
      error instanceof Error ? error : new Error(String(error)),
    );

    throw messagingError;
  }
};
