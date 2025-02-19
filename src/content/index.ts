import { v4 } from 'uuid';
import { sendRuntimeMessage } from '../utils';
import { BackgroundMessageType } from '../constants';
import { UserEvent } from '../types';
import ContextType = chrome.runtime.ContextType;

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

  try {
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
  if (document.body) {
    document.body.addEventListener('click', clickRegister);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.addEventListener('click', clickRegister);
    });
  }
};

initializeEventListeners();
