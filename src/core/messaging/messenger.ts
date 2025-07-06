import { MessagingError } from '../error-handling';
import type { BackgroundMessage, OffscreenMessage } from '../types';

export const sendRuntimeMessage = async (
  message: OffscreenMessage | BackgroundMessage,
) => {
  try {
    await chrome.runtime.sendMessage(message);
  } catch (error) {
    throw new MessagingError(
      'Failed to send runtime message',
      message.type,
      error instanceof Error ? error : new Error(String(error)),
    );
  }
};
