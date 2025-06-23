import { v4 } from 'uuid';
import { OffscreenMessageType } from '../../../core/constants';
import { sendRuntimeMessage } from '../../../core/messaging';
import { getActiveTabDimensions } from '../../../core/utils/chrome.utils';
import type { Recording } from '../../storage';
import { getStateFromLocalStorage, setStateToLocalStorage } from '../../storage';
import type { RecorderOptions } from '../types';

export class RecorderService {
  private static instance: RecorderService;
  private isRecording = false;

  private constructor() {}

  public static getInstance(): RecorderService {
    if (!RecorderService.instance) {
      RecorderService.instance = new RecorderService();
    }

    return RecorderService.instance;
  }

  async startRecording(options?: RecorderOptions): Promise<void> {
    if (this.isRecording) {
      return;
    }

    this.isRecording = true;

    const tabDimensions = await getActiveTabDimensions();

    const offscreenDocumentUrl = chrome.runtime.getURL('src/offscreen.html');

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

    const recording: Recording = {
      id: v4(),
      startTime: Date.now(),
      stopTime: null,
      events: {},
      viewData: {
        width: tabDimensions.width,
        height: tabDimensions.height,
      },
    };

    await setStateToLocalStorage({
      isRecordingInProgress: true,
      recording,
    });

    await sendRuntimeMessage({
      type: OffscreenMessageType.START_RECORDING,
      contextType: chrome.runtime.ContextType.OFFSCREEN_DOCUMENT,
      data: options,
    });
  }

  async stopRecording(): Promise<void> {
    if (!this.isRecording) {
      const state = await getStateFromLocalStorage();

      if (!state.isRecordingInProgress && !state.recording) {
        return;
      }
    }

    this.isRecording = false;

    const state = await getStateFromLocalStorage();
    const currentRecording = state.recording;

    if (currentRecording) {
      currentRecording.stopTime = Date.now();

      await setStateToLocalStorage({
        isRecordingInProgress: false,
        recording: currentRecording,
      });

      const existingContexts = await chrome.runtime.getContexts({
        contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
      });

      if (existingContexts.length > 0) {
        await sendRuntimeMessage({
          type: OffscreenMessageType.STOP_RECORDING,
          contextType: chrome.runtime.ContextType.OFFSCREEN_DOCUMENT,
        });
      }
    }
  }
}
