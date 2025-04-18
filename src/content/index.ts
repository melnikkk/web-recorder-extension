import { v4 } from 'uuid';
import { sendRuntimeMessage } from '../utils';
import { BackgroundMessageType, UserEventType } from '../constants';
import { UserEvent } from '../types';
import ContextType = chrome.runtime.ContextType;

let port: chrome.runtime.Port;

const clickRegister = async (event: MouseEvent): Promise<void> => {
  const userEvent: UserEvent = {
    id: v4(),
    // TODO: support other event types and data
    type: UserEventType.CLICK,
    data: {
      coordinates: {
        x: event.x,
        y: event.y,
      },
      view: {
        innerWidth: window.outerWidth,
        innerHeight: window.outerHeight,
      },
    },
    timestamp: Date.now(),
  };

  if (!port) {
    console.error('Port not connected');
    return;
  }

  try {
    await sendRuntimeMessage({
      type: BackgroundMessageType.USER_ACTION_HAPPENED,
      contextType: ContextType.BACKGROUND,
      data: { userEvent },
    });
  } catch (error) {
    console.error('Failed to register an event:', error);
  }
};

const initializeEventListeners = () => {
  if (document.body) {
    document.body.addEventListener('click', clickRegister);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.addEventListener('click', clickRegister);
    });
  }
};

port = chrome.runtime.connect();

port.onDisconnect.addListener(() => {
  document.removeEventListener('click', clickRegister, true);

  port = chrome.runtime.connect();
});

initializeEventListeners();
