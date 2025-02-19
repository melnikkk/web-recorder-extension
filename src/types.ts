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
  recording?: Recording | null;
}

export interface Recording {
  id: string;
  url?: string;
  startTime?: number;
  stopTime?: number;
  events: UserEvents;
}

export interface UserEvent {
  id: string;
  type: string;
  coordinates: [number, number];
  timestamp: number;
  view: {
    innerWidth: number;
    innerHeight: number;
  }
}

export type UserEvents = Array<UserEvent>;
