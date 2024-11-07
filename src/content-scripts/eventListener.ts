import { MessageType } from '../constants';
import { Message } from '../types';
import { onSayHiEvent } from './eventHandlers';

export const eventListener = () => {
  chrome.runtime.onMessage.addListener((message: Message) => {
    switch (message.type) {
      case MessageType.SAY_HI: {
        onSayHiEvent();

        return true;
      }
      default: {
        return false;
      }
    }
  });
};
