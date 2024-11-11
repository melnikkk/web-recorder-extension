import { BackgroundMessageType, OffscreenMessageType } from './constants';

export interface Message<T> {
  type: T;
  data?: unknown;
}

export type BackgroundMessage = Message<BackgroundMessageType>;

export type OffscreenMessage = Message<OffscreenMessageType>;
