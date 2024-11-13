import { BackgroundMessageType, OffscreenMessageType } from './constants';

export interface Message<T> {
  type: T;
  data?: unknown;
  contextType: chrome.runtime.ContextType;
}

export type BackgroundMessage = Message<BackgroundMessageType>;

export type OffscreenMessage = Message<OffscreenMessageType>;

export interface LocalStorageState {
  isRecordingInProgress: boolean;
}
