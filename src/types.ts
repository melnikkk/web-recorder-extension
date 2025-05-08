import { BackgroundMessageType, OffscreenMessageType, UserEventType } from './constants';

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
  startTime: number;
  stopTime: number | null;
  events: UserEventsRecord;
}

export interface UserClickEventData {
  coordinates: {
    x: number;
    y: number;
  };
  view: {
    innerWidth: number;
    innerHeight: number;
  };
}

export type UserEventData = UserClickEventData;

export interface UserEvent {
  id: string;
  type: UserEventType;
  data: UserEventData;
  timestamp: number;
  index: number;
}

export type UserEventsRecord = Record<string, UserEvent>;
