import { useCallback, useState } from 'react';
import { getCurrentTab, sendContentMessage } from './utils';
import { MessageType } from './constants';
import { AppWrapper, RecordButton, RecorderContent, RecorderStatus } from './styled';

function App() {
  const [isRecordingInProgress, setIsRecordingInProgress] = useState(false);

  const onRecordButtonClick = useCallback(async () => {
    setIsRecordingInProgress(!isRecordingInProgress);

    const currentTab = await getCurrentTab();

    await sendContentMessage({ type: MessageType.SAY_HI }, currentTab);
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
