import { StorageError } from '../../../core/error-handling';
import { LocalStorageState } from '../types';

/**
 * Set state in local storage
 * @param items The items to set in local storage
 * @throws {StorageError} If the storage operation fails
 */
export const setStateToLocalStorage = async (items: Partial<LocalStorageState>) => {
  try {
    await chrome.storage.local.set<LocalStorageState>(items);
  } catch (error) {
    const storageError = new StorageError(
      'Failed to set state to local storage',
      error instanceof Error ? error : new Error(String(error))
    );
    console.error(storageError);
    throw storageError;
  }
};

/**
 * Get state from local storage
 * @returns The current state from local storage
 * @throws {StorageError} If the storage operation fails
 */
export const getStateFromLocalStorage = async (): Promise<LocalStorageState> => {
  try {
    return await chrome.storage.local.get<LocalStorageState>();
  } catch (error) {
    const storageError = new StorageError(
      'Failed to get state from local storage',
      error instanceof Error ? error : new Error(String(error))
    );
    console.error(storageError);
    throw storageError;
  }
};
