import { v4 } from 'uuid';
import { BackgroundMessageType, UserEventType } from '../../../core/constants';
import { MessagingError } from '../../../core/error-handling';
import { sendRuntimeMessage } from '../../../core/messaging';
import { EventTracker } from '../types';
import { UserEvent } from '../../storage/types';

export class ClickTracker implements EventTracker {
  type = UserEventType.CLICK;

  initialize() {
    document.addEventListener('click', this.handleClick);
  }

  destroy() {
    document.removeEventListener('click', this.handleClick);
  }

  private handleClick = async (event: MouseEvent): Promise<void> => {
    const userEvent: UserEvent = {
      id: v4(),
      type: UserEventType.CLICK,
      data: {
        coordinates: {
          x: event.clientX,
          y: event.clientY,
        },
      },
      timestamp: Date.now(),
      index: 0,
    };

    try {
      await sendRuntimeMessage({
        type: BackgroundMessageType.USER_ACTION_HAPPENED,
        contextType: chrome.runtime.ContextType.BACKGROUND,
        data: { userEvent },
      });
    } catch (error) {
      const messageError = new MessagingError(
        'Failed to send user event',
        BackgroundMessageType.USER_ACTION_HAPPENED,
        error instanceof Error ? error : new Error(String(error)),
      );

      throw messageError;
    }
  };
}
