import type { UserEvent, Recording } from '../../storage';
import { setStateToLocalStorage } from '../../storage';

export class EventStorageService {
  private static instance: EventStorageService;

  public static getInstance(): EventStorageService {
    if (!EventStorageService.instance) {
      EventStorageService.instance = new EventStorageService();
    }
    return EventStorageService.instance;
  }

  public async storeEvent(userEvent: UserEvent): Promise<void> {
    try {
      const state = await chrome.storage.local.get([
        'recording',
        'isRecordingInProgress',
      ]);

      if (state.recording && state.isRecordingInProgress) {
        const recording = state.recording as Recording;

        if (!recording.events) {
          recording.events = {};
        }

        recording.events[userEvent.id] = userEvent;

        await setStateToLocalStorage({ recording });
      }
    } catch (error) {
      console.error('Failed to store event:', error);
    }
  }
}
