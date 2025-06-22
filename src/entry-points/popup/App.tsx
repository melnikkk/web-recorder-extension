import { useCallback } from 'react';
import { AppWrapper, RecorderContent } from '../../ui/styles';
import { useRecording } from '../../features/recording';
import { RecordingControls } from '../../features/recording/components';

export default function App() {
  const { isRecordingInProgress, toggleRecording } = useRecording();

  const handleToggleRecording = useCallback(() => {
    toggleRecording();
  }, [toggleRecording]);

  return (
    <AppWrapper>
      <RecorderContent>
        <RecordingControls
          isRecordingInProgress={isRecordingInProgress}
          onToggleRecording={handleToggleRecording}
        />
      </RecorderContent>
    </AppWrapper>
  );
}
