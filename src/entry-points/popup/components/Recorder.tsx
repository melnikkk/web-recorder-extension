import { useCallback } from 'react';
import { useRecording } from '../../../features/recording';
import { RecordingControls } from '../../../features/recording/components';
import { useAuthContext } from '../../../features/auth';
import { RecorderContent } from '../../../ui';
import { UserButton } from '@clerk/chrome-extension';

export const RecordingApp = () => {
  const { isRecordingInProgress, toggleRecording } = useRecording();

  const { isLoading } = useAuthContext();

  const handleToggleRecording = useCallback(() => {
    toggleRecording();
  }, [toggleRecording]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <RecorderContent>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <UserButton />
      </div>
      <RecordingControls
        isRecordingInProgress={isRecordingInProgress}
        onToggleRecording={handleToggleRecording}
      />
    </RecorderContent>
  );
};
