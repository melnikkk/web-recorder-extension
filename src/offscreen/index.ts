import { BackgroundMessageType, OffscreenMessageType } from '../constants';
import { OffscreenMessage } from '../types';
import { sendRuntimeMessage } from '../utils';
import ContextType = chrome.runtime.ContextType;

let mediaStream: MediaStream;

const onRecorderDataAvailable = async (event: BlobEvent) => {
  const videoChunks = event.data;
  const blob = new Blob([videoChunks], { type: 'video/webm;codecs=vp9' });
  const url = URL.createObjectURL(blob);

  await sendRuntimeMessage({
    type: BackgroundMessageType.CAPTURE_IS_READY,
    contextType: ContextType.BACKGROUND,
    data: {
      url,
    },
  });
};

const onRecorderStop = async () => {
  await sendRuntimeMessage({
    type: BackgroundMessageType.STOP_RECORDING,
    contextType: ContextType.BACKGROUND,
  });

  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
  }
};

const onStartRecordingEventHandler = async () => {
  try {
    mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 60 },
      audio: false,
      // @ts-expect-error: not typed
      selfBrowserSurface: 'include',
    });

    const recorder = new MediaRecorder(mediaStream);
    recorder.ondataavailable = onRecorderDataAvailable;
    recorder.onstop = onRecorderStop;

    recorder.start();

    await sendRuntimeMessage({
      type: BackgroundMessageType.RECORDING_IN_PROGRESS,
      contextType: ContextType.BACKGROUND,
    });
  } catch (error) {
    console.error(error);

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
