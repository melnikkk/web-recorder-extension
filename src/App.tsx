import { useCallback, useEffect, useState } from 'react';
import { getStateFromLocalStorage, sendRuntimeMessage } from './utils';
import { BackgroundMessageType } from './constants';
import { AppWrapper, RecordButton, RecorderContent, RecorderStatus } from './styled';

export default function App() {
  const [isRecordingInProgress, setIsRecordingInProgress] = useState(false);

  const startRecording = useCallback(async () => {
    setIsRecordingInProgress(true);

    await sendRuntimeMessage({
      type: BackgroundMessageType.INITIATE_RECORDING,
      contextType: chrome.runtime.ContextType.BACKGROUND,
    });
  }, []);

  const stopRecording = useCallback(async () => {
    setIsRecordingInProgress(false);

    await sendRuntimeMessage({
      type: BackgroundMessageType.STOP_RECORDING,
      contextType: chrome.runtime.ContextType.BACKGROUND,
    });
  }, []);

  const onRecordButtonClick = useCallback(async () => {
    if (isRecordingInProgress) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecordingInProgress]);

  const initiateExtension = useCallback(async () => {
    const savedState = await getStateFromLocalStorage();

    if (savedState?.isRecordingInProgress) {
      setIsRecordingInProgress(savedState.isRecordingInProgress);
    }
  }, []);

  useEffect(() => {
    initiateExtension();
  }, []);

  return (
    <AppWrapper>
      <RecorderContent>
        <RecordButton
          isRecordingInProgress={isRecordingInProgress}
          onClick={onRecordButtonClick}
        />
        <RecorderStatus>
          {isRecordingInProgress ? 'Recording' : 'Start Recording'}
        </RecorderStatus>
      </RecorderContent>
    </AppWrapper>
  );
}
