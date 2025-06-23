import { BackgroundMessageType } from '../../core/constants';
import { ENV } from '../../core/config';
import { ErrorHandlerService, NetworkError } from '../../core/error-handling';
import { BackgroundMessage } from '../../core/types';
import { RecorderService } from '../../features/recording';
import { setStateToLocalStorage, Recording } from '../../features/storage';
import { initBackgroundErrorHandler } from './background-error-handler';

initBackgroundErrorHandler();

const recorderService = RecorderService.getInstance();

chrome.runtime.onMessage.addListener(async (message: BackgroundMessage) => {
  if (message.contextType === chrome.runtime.ContextType.BACKGROUND) {
    switch (message.type) {
      case BackgroundMessageType.INITIATE_RECORDING: {
        await recorderService.startRecording();

        break;
      }
      case BackgroundMessageType.STOP_RECORDING: {
        await recorderService.stopRecording();

        const state = await chrome.storage.local.get();

        if (state.recording) {
          const recording = state.recording as Recording;

          if (recording.stopTime === null) {
            const stopTime = message.data?.stopTime ? message.data.stopTime : Date.now();

            recording.stopTime = stopTime;

            await setStateToLocalStorage({ recording });
          }
        }
        break;
      }
      case BackgroundMessageType.CAPTURE_IS_READY: {
        if (message.data && 'url' in message.data) {
          const { url, uint8Array, type } = message.data;

          chrome.offscreen.closeDocument();

          const state = await chrome.storage.local.get();

          if (state.recording) {
            const recording = state.recording as Recording;

            recording.url = url;

            if (recording.stopTime === null) {
              recording.stopTime = Date.now();
            }

            await setStateToLocalStorage({ recording });

            if (uint8Array && type) {
              const restoredUint8Array = new Uint8Array(uint8Array);
              const blob = new Blob([restoredUint8Array], { type });

              const body = new FormData();
              const recordingId = recording.id;

              const data = JSON.stringify({
                startTime: recording.startTime,
                stopTime: recording.stopTime,
                viewData: recording.viewData,
              });

              body.append('file', blob, recordingId);
              body.append('id', recordingId);
              body.append('data', data);

              try {
                const apiBaseUrl = ENV.BE_URL;
                
                await fetch(`${apiBaseUrl}/recordings`, {
                  method: 'POST',
                  body,
                });

                await fetch(`${apiBaseUrl}/recordings/${recordingId}/events`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ events: recording.events }),
                });
              } catch (error) {
                const networkError = new NetworkError(
                  'Error uploading recording to server',
                  error instanceof Error ? error : new Error(String(error)),
                  `${ENV.BE_URL}/recordings`
                );

                ErrorHandlerService.getInstance().handleError(networkError, 'background');

                throw networkError;
              }
            }
          }
        }
        break;
      }
      case BackgroundMessageType.USER_ACTION_HAPPENED: {
        if (message.data && 'userEvent' in message.data) {
          const state = await chrome.storage.local.get();

          if (state.recording && state.isRecordingInProgress) {
            const recording = state.recording as Recording;
            const userEvent = message.data.userEvent;

            if (!recording.events) {
              recording.events = {};
            }

            recording.events[userEvent.id] = userEvent;

            await setStateToLocalStorage({ recording });
          } else {
            console.warn(
              'Recording state not ready for event tracking:',
              state.isRecordingInProgress
                ? 'Recording in progress but no recording object'
                : 'Not recording',
            );
          }
        }

        break;
      }
    }
  }
});
