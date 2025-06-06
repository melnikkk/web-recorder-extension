import { BackgroundMessageType, OffscreenMessageType } from '../constants';
import { OffscreenMessage } from '../types';
import { sendRuntimeMessage } from '../utils';
import ContextType = chrome.runtime.ContextType;

let mediaStream: MediaStream;

const onRecorderDataAvailable = async (event: BlobEvent) => {
  const blob = new Blob([event.data], { type: 'video/webm' });
  const url = URL.createObjectURL(blob);

  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  await sendRuntimeMessage({
    type: BackgroundMessageType.CAPTURE_IS_READY,
    contextType: ContextType.BACKGROUND,
    data: {
      url,
      uint8Array: Array.from(uint8Array),
      type: blob.type,
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
      video: { width: { ideal: 1920, max: 1920 }, height: { ideal: 1080, max: 1080 }, displaySurface: 'window' },
      audio: false,
    });

    const recorder = new MediaRecorder(mediaStream);
    
    recorder.ondataavailable = onRecorderDataAvailable;
    recorder.onstop = onRecorderStop;

    recorder.start();

    await sendRuntimeMessage({
      type: BackgroundMessageType.RECORDING_IN_PROGRESS,
      contextType: ContextType.BACKGROUND
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
