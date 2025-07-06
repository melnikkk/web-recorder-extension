import type { UserEventType } from '../../../core';

export interface TargetElement {
  elementType: string;
  elementId?: string;
  elementName?: string;
  elementClass?: string;
  textContent?: string;
  placeholder?: string;
  ariaLabel?: string;
}

export interface ParentElement {
  tagName: string;
  id?: string;
  className?: string;
}

export type ParentElements = Array<ParentElement>;

export interface PageContext {
  url?: string;
  title?: string;
  parentElements?: ParentElements;
}

export interface UserInteraction {
  inputValue?: string;
  selectedOptions?: Array<string>;
  isChecked?: boolean;
}

export interface UserClickEventData {
  coordinates: {
    x: number;
    y: number;
  };
  targetElement?: TargetElement;
  pageContext?: PageContext;
  userInteraction?: UserInteraction;
  additionalContext?: Record<string, unknown>;
}

export interface UserTabChangeEventData {
  newUrl: string;
}

export type UserEventData = UserClickEventData | UserTabChangeEventData;

export interface UserEvent {
  id: string;
  type: UserEventType;
  data: UserEventData;
  timestamp: number;
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
