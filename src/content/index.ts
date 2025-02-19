import { v4 } from 'uuid';
import { sendRuntimeMessage } from '../utils';
import { BackgroundMessageType } from '../constants';
import { UserEvent } from '../types';
import ContextType = chrome.runtime.ContextType;

export const clickRegister = async (event: MouseEvent): Promise<void> => {
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

  await sendRuntimeMessage({
    type: BackgroundMessageType.USER_ACTION_HAPPENED,
    contextType: ContextType.BACKGROUND,
    data: {
      userEvent,
    },
  });
};

document.body.addEventListener('click', clickRegister);
