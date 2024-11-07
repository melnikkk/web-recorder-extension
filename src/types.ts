import { MessageType } from './constants';

export interface Message {
  type: MessageType;
  data?: unknown;
}
