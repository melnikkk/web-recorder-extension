import { BackgroundMessage } from '../types';
import { BackgroundMessageType, OffscreenMessageType } from '../constants';
import { sendRuntimeMessage } from '../utils';

export const eventListener = async (
  message: BackgroundMessage,
  _sender: chrome.runtime.MessageSender,
  _senderResponse: (response?: unknown) => void,
) => {
  if (message.contextType === chrome.runtime.ContextType.BACKGROUND) {
    switch (message.type) {
      case BackgroundMessageType.INITIATE_RECORDING: {
        // TODO: setup correct vite builder
        const offscreenDocumentUrl = '../src/offscreen.html';
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

        break;
      }
      default:
        throw new Error(`Background: unrecognized message type ${message.type}.`);
    }
  }
};
