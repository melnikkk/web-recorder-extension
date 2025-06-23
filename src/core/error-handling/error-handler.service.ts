import {
  ChromeAPIError,
  MediaCaptureError,
  MessagingError,
  NetworkError,
  RecordingError,
  StorageError,
} from './errors';

export class ErrorHandlerService {
  private static instance: ErrorHandlerService;

  private constructor() {}

  public static getInstance(): ErrorHandlerService {
    if (!ErrorHandlerService.instance) {
      ErrorHandlerService.instance = new ErrorHandlerService();
    }

    return ErrorHandlerService.instance;
  }

  public handleError(error: Error, context?: string): void {
    this.logError(error, context);

    switch (true) {
      case error instanceof NetworkError:
        this.handleNetworkError(error as NetworkError);

        break;
      case error instanceof ChromeAPIError:
        this.handleChromeAPIError(error as ChromeAPIError);

        break;
      case error instanceof RecordingError:
        this.handleRecordingError(error as RecordingError);

        break;
      case error instanceof MediaCaptureError:
        this.handleMediaCaptureError(error as MediaCaptureError);

        break;
      case error instanceof StorageError:
        this.handleStorageError(error as StorageError);

        break;
      case error instanceof MessagingError:
        this.handleMessagingError(error as MessagingError);

        break;
      default:
        console.error('Unhandled error:', error);
    }
  }

  private logError(error: Error, context?: string): void {
    if (context) {
      console.error(`[${context}] Error:`, error);
    } else {
      console.error('Error:', error);
    }
  }

  private handleNetworkError(error: NetworkError): void {
    console.error(
      `Network error at ${error.endpoint || 'unknown endpoint'}:`,
      error.message,
    );
  }

  private handleChromeAPIError(error: ChromeAPIError): void {
    console.error(`Chrome API error (${error.apiName}):`, error.message);
  }

  private handleRecordingError(error: RecordingError): void {
    console.error('Recording error:', error.message);
  }

  private handleMediaCaptureError(error: MediaCaptureError): void {
    console.error('Media capture error:', error.message);
  }

  private handleStorageError(error: StorageError): void {
    console.error('Storage error:', error.message);
  }

  private handleMessagingError(error: MessagingError): void {
    console.error(`Messaging error (${error.messageType}):`, error.message);
  }

  public registerGlobalErrorHandler(): void {
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'global');

      event.preventDefault();
    });

    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason instanceof Error) {
        this.handleError(event.reason, 'unhandled-promise');
      } else {
        this.handleError(new Error(String(event.reason)), 'unhandled-promise');
      }

      event.preventDefault();
    });
  }
}
