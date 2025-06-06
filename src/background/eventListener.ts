import { v4 } from 'uuid';
import { BackgroundMessage, UserEvent } from '../types';
import { BackgroundMessageType, OffscreenMessageType } from '../constants';
import {
  getActiveTab,
  getStateFromLocalStorage,
  sendRuntimeMessage,
  setStateToLocalStorage,
} from '../utils';

export const eventListener = async (message: BackgroundMessage) => {
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
        // @ts-expect-error: provide generic solution
        const { url, type, uint8Array } = message.data;

        if (url) {
          const state = await getStateFromLocalStorage();
          const currentRecording = state.recording;

          if (currentRecording) {
            currentRecording.url = url;

            await setStateToLocalStorage({ recording: currentRecording });

            if (uint8Array && type) {
              const restoredUint8Array = new Uint8Array(uint8Array);
              const blob = new Blob([restoredUint8Array], { type });

              const body = new FormData();
              const recordingId = state.recording?.id ?? 'recording.webm';
              const data = JSON.stringify({
                startTime: currentRecording.startTime,
                stopTime: currentRecording?.stopTime,
                viewData: currentRecording.viewData,
              });

              body.append('file', blob, recordingId);
              body.append('id', recordingId);
              body.append('data', data);

              await fetch('http://localhost:8080/recordings', {
                method: 'POST',
                body,
              });

              await fetch(`http://localhost:8080/recordings/${recordingId}/events`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ events: currentRecording.events }),
              });
            }
          }
        }

        break;
      }
      case BackgroundMessageType.RECORDING_IN_PROGRESS: {
        const activeTab = await getActiveTab();

        let viewData = { width: 1920, height: 1080 };
        
        if (activeTab.id) {
          try {
            const result = await chrome.scripting.executeScript({
              target: { tabId: activeTab.id },
              func: () => ({
                width: window.innerWidth,
                height: window.innerHeight
              })
            });
            
            if (result && result[0]?.result) {
              viewData = result[0].result;
            }
          } catch (error) {
            console.error('Failed to get view size data:', error);
          }
        }

        await setStateToLocalStorage({
          recording: {
            id: v4(),
            startTime: Date.now(),
            stopTime: null,
            events: {},
            viewData,
          },
        });

        break;
      }
      case BackgroundMessageType.USER_ACTION_HAPPENED: {
        const state = await getStateFromLocalStorage();
        const recording = state.recording;
        const isRecordingInProgress = state.isRecordingInProgress;

        if (recording && isRecordingInProgress) {
          const userEvent = (message?.data as { userEvent: UserEvent }).userEvent;

          userEvent.index = Object.keys(recording.events).length;
          recording.events[userEvent.id] = userEvent;

          await setStateToLocalStorage({ recording });
        }

        break;
      }
      default:
        throw new Error(`Background: unrecognized message type ${message.type}.`);
    }
  }
};
