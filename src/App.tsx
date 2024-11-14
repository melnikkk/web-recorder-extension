import { useCallback, useEffect, useState } from 'react';
import { getStateFromLocalStorage, sendRuntimeMessage } from './utils';
import { BackgroundMessageType } from './constants';
import { AppWrapper, RecordButton, RecorderContent, RecorderStatus } from './styled';

export default function App() {
  const [isRecordingInProgress, setIsRecordingInProgress] = useState(false);

  const onRecordButtonClick = useCallback(async () => {
    setIsRecordingInProgress(!isRecordingInProgress);

    await sendRuntimeMessage({
      type: BackgroundMessageType.INITIATE_RECORDING,
      contextType: chrome.runtime.ContextType.BACKGROUND,
    });
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
