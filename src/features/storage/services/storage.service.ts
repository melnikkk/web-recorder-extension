import { LocalStorageState } from '../types';

export const setStateToLocalStorage = async (items: Partial<LocalStorageState>) => {
  await chrome.storage.local.set<LocalStorageState>(items);
};

export const getStateFromLocalStorage = async (): Promise<LocalStorageState> => {
  return await chrome.storage.local.get<LocalStorageState>();
};
