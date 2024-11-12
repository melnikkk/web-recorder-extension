import { OffscreenMessageType } from '../constants';
import { OffscreenMessage } from '../types';

const onStartRecordingEventHandler = async () => {
  await navigator.mediaDevices.getDisplayMedia({
    video: { frameRate: 60 },
    audio: false,
    // @ts-expect-error: not typed
    selfBrowserSurface: 'include',
  });
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
