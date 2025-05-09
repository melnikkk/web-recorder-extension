import { v4 } from 'uuid';
import { BackgroundMessageType, UserEventType } from '../constants';
import { UserEvent } from '../types';
import ContextType = chrome.runtime.ContextType;

const sendMessage = async (message: any): Promise<void> => {
  if (!chrome.runtime) {
    console.error('Chrome runtime not available');

    return;
  }

  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(message, () => {
        const error = chrome.runtime.lastError;

        if (error) {
          console.debug('Message sent without response:', error.message);
        }

        resolve();
      });
    } catch (err) {
      console.error('Failed to send message:', err);

      resolve();
    }
  });
};

const handleClick = async (event: MouseEvent): Promise<void> => {
  const userEvent: UserEvent = {
    id: v4(),
    type: UserEventType.CLICK,
    data: {
      coordinates: {
        x: event.x,
        y: event.y,
      },
      view: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      },
    },
    timestamp: Date.now(),
    index: 0,
  };

  await sendMessage({
    type: BackgroundMessageType.USER_ACTION_HAPPENED,
    contextType: ContextType.BACKGROUND,
    data: { userEvent },
  });
};

const initializeEventListeners = (): void => {
  document.removeEventListener('click', handleClick);

  if (document.body) {
    document.body.addEventListener('click', handleClick);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.addEventListener('click', handleClick);
    });
  }
};

(function init() {
  initializeEventListeners();
})();
