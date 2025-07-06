import type { BackgroundMessage } from '../../core';
import {
  ErrorHandlerService,
  NetworkError,
  BackgroundMessageType,
  ConfigService,
} from '../../core';
import { RecorderService } from '../../features/recording';
import type { Recording } from '../../features/storage';
import { setStateToLocalStorage } from '../../features/storage';
import { initBackgroundErrorHandler } from './background-error-handler';
import { trackerRegistry, TabChangeTracker } from '../../features/events-tracking';

initBackgroundErrorHandler();

const tabChangeTracker = new TabChangeTracker();

trackerRegistry.register(tabChangeTracker);

trackerRegistry.initialize();

self.addEventListener('unload', () => {
  trackerRegistry.destroy();
});

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
            recording.stopTime = message.data?.stopTime
              ? message.data.stopTime
              : Date.now();

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

              const configService = await ConfigService.getInstance();
              const apiBaseUrl = configService.backendUrl;

              try {
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
                  `${configService.backendUrl}/recordings`,
                );

                ErrorHandlerService.getInstance().handleError(networkError, 'background');

                throw networkError;
              }
            }
          }
        }
        break;
      }
    }
  }
});
