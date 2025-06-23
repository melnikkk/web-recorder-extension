import { OffscreenMessageType } from '../../core/constants';
import { MediaCaptureService } from '../../features/recording';
import { initOffscreenErrorHandler } from './offscreen-error-handler';

initOffscreenErrorHandler();

const mediaCaptureService = new MediaCaptureService();

chrome.runtime.onMessage.addListener((message) => {
  if (message.contextType === chrome.runtime.ContextType.OFFSCREEN_DOCUMENT) {
    if (message.type === OffscreenMessageType.START_RECORDING) {
      const options = message.data ?? undefined;

      mediaCaptureService.startCapture(options);
    } else if (message.type === OffscreenMessageType.STOP_RECORDING) {
      mediaCaptureService.stopCapture();
    }
  }
});
