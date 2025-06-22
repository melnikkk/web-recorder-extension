import { RecordButton, RecorderStatus } from './styled';

interface Props {
  isRecordingInProgress: boolean;
  onToggleRecording: () => void;
}

export const RecordingControls = ({
  isRecordingInProgress,
  onToggleRecording,
}: Props) => {
  return (
    <>
      <RecordButton
        isRecordingInProgress={isRecordingInProgress}
        onClick={onToggleRecording}
      />
      <RecorderStatus>
        {isRecordingInProgress ? 'Recording' : 'Start Recording'}
      </RecorderStatus>
    </>
  );
};
