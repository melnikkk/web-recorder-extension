import { StorageError } from '../../../core/error-handling';
import type { LocalStorageState } from '../types';

export const setStateToLocalStorage = async (items: Partial<LocalStorageState>) => {
  try {
    await chrome.storage.local.set<LocalStorageState>(items);
  } catch (error) {
    const storageError = new StorageError(
      'Failed to set state to local storage',
      error instanceof Error ? error : new Error(String(error)),
    );

    throw storageError;
  }
};

export const getStateFromLocalStorage = async (): Promise<LocalStorageState> => {
  try {
    return await chrome.storage.local.get<LocalStorageState>();
  } catch (error) {
    const storageError = new StorageError(
      'Failed to get state from local storage',
      error instanceof Error ? error : new Error(String(error)),
    );

    throw storageError;
  }
};
