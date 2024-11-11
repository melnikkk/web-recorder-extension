import { useCallback, useState } from 'react';
import { sendRuntimeMessage } from './utils';
import { BackgroundMessageType } from './constants';
import { AppWrapper, RecordButton, RecorderContent, RecorderStatus } from './styled';

function App() {
  const [isRecordingInProgress, setIsRecordingInProgress] = useState(false);

  const onRecordButtonClick = useCallback(async () => {
    setIsRecordingInProgress(!isRecordingInProgress);

    await sendRuntimeMessage({ type: BackgroundMessageType.INITIATE_RECORDING });
  }, [isRecordingInProgress]);

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

export default App;
