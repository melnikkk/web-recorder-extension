import { v4 } from 'uuid';
import { sendRuntimeMessage } from '../utils';
import { BackgroundMessageType } from '../constants';
import { UserEvent } from '../types';
import ContextType = chrome.runtime.ContextType;

let port: chrome.runtime.Port;

const clickRegister = async (event: MouseEvent): Promise<void> => {
  const userEvent: UserEvent = {
    id: v4(),
    type: event.type,
    coordinates: [event.x, event.y],
    timestamp: Date.now(),
    view: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    },
  };

  if (!port) {
    console.error('Port not connected');
    return;
  }

  try {;
    await sendRuntimeMessage({
      type: BackgroundMessageType.USER_ACTION_HAPPENED,
      contextType: ContextType.BACKGROUND,
      data: { userEvent },
    });
  } catch (error) {
    console.error('Failed to register click event:', error);
  }
};

const initializeEventListeners = () => {
  console.log('Initializing event listeners...');
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
