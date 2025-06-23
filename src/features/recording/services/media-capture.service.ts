import { BackgroundMessageType } from '../../../core/constants';
import { MediaCaptureError } from '../../../core/error-handling';
import { sendRuntimeMessage } from '../../../core/messaging';

export class MediaCaptureService {
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;

  async startCapture(
    options: MediaStreamConstraints = {
      video: {
        width: { ideal: 1920, max: 1920 },
        height: { ideal: 1080, max: 1080 },
        displaySurface: 'window',
      },
      audio: false,
    },
  ) {
    try {
      this.mediaStream = await navigator.mediaDevices.getDisplayMedia(options);

      this.mediaStream.getTracks().forEach((track) => {
        track.addEventListener('ended', () => {
          console.log('Track ended - user stopped sharing');
          this.stopCapture();
        });
      });

      this.mediaRecorder = new MediaRecorder(this.mediaStream);

      this.mediaRecorder.ondataavailable = this.onRecorderDataAvailable;
      this.mediaRecorder.onstop = this.onRecorderStop;

      this.mediaRecorder.start();
    } catch (error) {
      const mediaCaptureError = new MediaCaptureError(
        'Failed to start media capture',
        error instanceof Error ? error : new Error(String(error))
      );
      
      throw mediaCaptureError;
    }
  }

  stopCapture() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  private onRecorderDataAvailable = async (event: BlobEvent) => {
    const blob = new Blob([event.data], { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const arrayBuffer = await blob.arrayBuffer();

    const uint8Array = new Uint8Array(arrayBuffer);

    await sendRuntimeMessage({
      type: BackgroundMessageType.CAPTURE_IS_READY,
      contextType: chrome.runtime.ContextType.BACKGROUND,
      data: {
        url,
        uint8Array: Array.from(uint8Array),
        type: blob.type,
      },
    });
  };

  private onRecorderStop = async () => {
    await sendRuntimeMessage({
      type: BackgroundMessageType.STOP_RECORDING,
      contextType: chrome.runtime.ContextType.BACKGROUND,
      data: {
        stopTime: Date.now(),
      },
    });

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        console.log(`MediaCaptureService: Stopping track: ${track.kind}`);
        track.stop();
      });

      this.mediaStream = null;
    }

    this.mediaRecorder = null;
  };
}
