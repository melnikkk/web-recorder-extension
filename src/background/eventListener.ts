import { v4 } from 'uuid';
import { BackgroundMessage, UserEvent } from '../types';
import { BackgroundMessageType, OffscreenMessageType } from '../constants';
import {
  getStateFromLocalStorage,
  sendRuntimeMessage,
  setStateToLocalStorage,
} from '../utils';

export const eventListener = async (
  message: BackgroundMessage,
  _sender: chrome.runtime.MessageSender,
  _senderResponse: (response?: unknown) => void,
) => {
  if (message.contextType === chrome.runtime.ContextType.BACKGROUND) {
    switch (message.type) {
      case BackgroundMessageType.INITIATE_RECORDING: {
        // TODO: setup correct vite builder
        const offscreenDocumentUrl = 'src/offscreen.html';
        const existingContexts = await chrome.runtime.getContexts({
          contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
        });
        const isOffscreenContextExists = existingContexts.length > 0;

        if (!isOffscreenContextExists) {
          await chrome.offscreen.createDocument({
            url: offscreenDocumentUrl,
            reasons: [chrome.offscreen.Reason.USER_MEDIA],
            justification: 'Recording from chrome.tabCapture API',
          });
        }

        await sendRuntimeMessage({
          type: OffscreenMessageType.START_RECORDING,
          contextType: chrome.runtime.ContextType.OFFSCREEN_DOCUMENT,
        });

        await setStateToLocalStorage({ isRecordingInProgress: true });

        break;
      }
      case BackgroundMessageType.STOP_RECORDING: {
        const state = await getStateFromLocalStorage();
        const currentRecording = state.recording;
        const isRecordingInProgress = state.isRecordingInProgress;

        if (currentRecording && isRecordingInProgress) {
          currentRecording.stopTime = Date.now();

          await setStateToLocalStorage({
            isRecordingInProgress: false,
            recording: currentRecording,
          });
        }

        break;
      }
      case BackgroundMessageType.CAPTURE_IS_READY: {
        // TODO: provide generic solution
        // @ts-ignore
        const { url, type, uint8Array } = message.data;

        if (url) {
          const state = await getStateFromLocalStorage();
          const currentRecording = state.recording;

          if (currentRecording) {
            currentRecording.url = url;

            await setStateToLocalStorage({ recording: currentRecording });
          }

          if (uint8Array && type) {
            const restoredUint8Array = new Uint8Array(uint8Array);
            const blob = new Blob([restoredUint8Array], { type });

            const body = new FormData();
            const recordingId = state.recording?.id ?? 'recording.webm';

            body.append('file', blob, recordingId);
            body.append('id', recordingId);

            await fetch('http://localhost:8080/recordings', {
              method: 'POST',
              // @ts-ignore
              body,
            });
          }

          await chrome.downloads.download({ url, saveAs: true });
        }

        break;
      }
      case BackgroundMessageType.RECORDING_IN_PROGRESS: {
        await setStateToLocalStorage({
          recording: {
            id: v4(),
            startTime: Date.now(),
            events: [],
          },
        });

        break;
      }
      case BackgroundMessageType.USER_ACTION_HAPPENED: {
        const state = await getStateFromLocalStorage();
        const recording = state.recording;
        const isRecordingInProgress = state.isRecordingInProgress;

        if (recording && isRecordingInProgress) {
          recording?.events.push((message?.data as { userEvent: UserEvent }).userEvent);

          await setStateToLocalStorage({ recording });
        }

        break;
      }
      default:
        throw new Error(`Background: unrecognized message type ${message.type}.`);
    }
  }
};
