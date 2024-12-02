import { BackgroundMessageType, OffscreenMessageType } from './constants';

export interface Message<T> {
  type: T;
  data?: unknown;
  contextType: chrome.runtime.ContextType;
}

export type BackgroundMessage = Message<BackgroundMessageType>;

export type OffscreenMessage = Message<OffscreenMessageType>;

export interface Recording {
  id: string;
  url?: string;
  data: {
    startTime?: number;
    stopTime?: number;
  };
}

export interface LocalStorageState {
  isRecordingInProgress: boolean;
  recording?: Recording | null;
}
