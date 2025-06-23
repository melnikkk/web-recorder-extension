export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class NetworkError extends ApplicationError {
  originalError?: Error;
  endpoint?: string;

  constructor(message: string, originalError?: Error, endpoint?: string) {
    super(message);

    this.originalError = originalError;
    this.endpoint = endpoint;
  }
}

export class ChromeAPIError extends ApplicationError {
  apiName: string;
  originalError?: Error;

  constructor(message: string, apiName: string, originalError?: Error) {
    super(message);

    this.apiName = apiName;
    this.originalError = originalError;
  }
}

export class RecordingError extends ApplicationError {
  originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message);

    this.originalError = originalError;
  }
}

export class MediaCaptureError extends RecordingError {
  constructor(message: string, originalError?: Error) {
    super(message);

    this.originalError = originalError;
  }
}

export class StorageError extends ApplicationError {
  originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message);

    this.originalError = originalError;
  }
}

export class MessagingError extends ApplicationError {
  messageType: string;
  originalError?: Error;

  constructor(message: string, messageType: string, originalError?: Error) {
    super(message);

    this.messageType = messageType;
    this.originalError = originalError;
  }
}
