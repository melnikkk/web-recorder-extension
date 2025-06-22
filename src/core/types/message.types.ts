import { BackgroundMessageType, OffscreenMessageType } from '../constants';
import { UserEvent } from '../../features/storage/types';

export interface Message<T, D = unknown> {
  type: T;
  data?: D;
  contextType: chrome.runtime.ContextType;
}

export interface CaptureReadyData {
  url: string;
  uint8Array: number[];
  type: string;
}

export interface UserActionData {
  userEvent: UserEvent;
}

export interface StopRecordingData {
  stopTime: number;
}

export type BackgroundMessage =
  | Message<BackgroundMessageType.INITIATE_RECORDING>
  | Message<BackgroundMessageType.STOP_RECORDING, StopRecordingData>
  | Message<BackgroundMessageType.CAPTURE_IS_READY, CaptureReadyData>
  | Message<BackgroundMessageType.USER_ACTION_HAPPENED, UserActionData>
  | Message<BackgroundMessageType.RECORDING_IN_PROGRESS>;

export type OffscreenMessage = Message<OffscreenMessageType, unknown>;
