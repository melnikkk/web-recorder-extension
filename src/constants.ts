export enum BackgroundMessageType {
  INITIATE_RECORDING = 'initiate_recording',
  STOP_RECORDING = 'stop_recording',
  CAPTURE_IS_READY = 'capture_is_ready',
  RECORDING_IN_PROGRESS = 'recording_in_progress',
  USER_ACTION_HAPPENED = 'user_action_happened',
}

export enum OffscreenMessageType {
  START_RECORDING = 'start_recording',
}

export enum UserEventType {
  CLICK = 'click',
}
