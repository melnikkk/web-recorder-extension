import type { UserEventType } from '../../../core/constants';

export interface UserClickEventData {
  coordinates: {
    x: number;
    y: number;
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

export interface Recording {
  id: string;
  url?: string;
  startTime: number;
  stopTime: number | null;
  events: UserEventsRecord;
  viewData: {
    width: number;
    height: number;
  };
}

export interface LocalStorageState {
  isRecordingInProgress: boolean;
  recording?: Recording | null;
}
