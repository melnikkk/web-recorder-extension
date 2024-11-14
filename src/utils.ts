import { BackgroundMessage, LocalStorageState, OffscreenMessage } from './types';

export const sendRuntimeMessage = async (
  message: OffscreenMessage | BackgroundMessage,
) => {
  await chrome.runtime.sendMessage(message);
};

export const setStateToLocalStorage = async (items: Partial<LocalStorageState>) => {
  await chrome.storage.local.set<LocalStorageState>(items);
};

export const getStateFromLocalStorage = async (): Promise<LocalStorageState> => {
  return await chrome.storage.local.get<LocalStorageState>();
};
