import { BackgroundMessageType, OffscreenMessageType } from '../constants';
import { OffscreenMessage } from '../types';
import { sendRuntimeMessage } from '../utils.ts';

const onStartRecordingEventHandler = async () => {
  try {
    await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 60 },
      audio: false,
      // @ts-expect-error: not typed
      selfBrowserSurface: 'include',
    });
  } catch (error) {
    console.error('Display media: permission denied.');

    await sendRuntimeMessage({
      type: BackgroundMessageType.STOP_RECORDING,
      contextType: chrome.runtime.ContextType.BACKGROUND,
    });
  }
};

const eventListener = async (message: OffscreenMessage) => {
  if (message.contextType === chrome.runtime.ContextType.OFFSCREEN_DOCUMENT) {
    switch (message.type) {
      case OffscreenMessageType.START_RECORDING:
        await onStartRecordingEventHandler();

        break;
      default:
        throw new Error(`Offscreen: unrecognized message type ${message.type}.`);
    }
  }
};

chrome.runtime.onMessage.addListener(eventListener);
