import { BackgroundMessage, OffscreenMessage } from '../types';

export const sendRuntimeMessage = async (
  message: OffscreenMessage | BackgroundMessage,
) => {
  await chrome.runtime.sendMessage(message);
};
