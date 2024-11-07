import { Message } from './types';

export const getCurrentTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

  return tab;
};

export const sendContentMessage = async (
  message: Message,
  tab: chrome.tabs.Tab,
  // TODO: provide typings
): Promise<unknown | undefined> => {
  if (tab.id) {
    return await chrome.tabs.sendMessage(tab.id, message);
  }

  return;
};
