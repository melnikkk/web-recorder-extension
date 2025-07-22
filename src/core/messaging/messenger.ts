import { MessagingError } from '../error-handling';
import type { BackgroundMessage, OffscreenMessage } from '../types';
import { addAuthTokenToMessage } from '../../features/auth';

export const sendRuntimeMessage = async (
  message: OffscreenMessage | BackgroundMessage,
) => {
  try {
    const authenticatedMessage = await addAuthTokenToMessage(message);

    await chrome.runtime.sendMessage(authenticatedMessage);
  } catch (error) {
    throw new MessagingError(
      'Failed to send runtime message',
      message.type,
      error instanceof Error ? error : new Error(String(error)),
    );
  }
};
