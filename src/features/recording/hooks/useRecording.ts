import { useCallback, useState, useEffect } from 'react';
import { RecorderService } from '../services';
import type { RecorderOptions } from '../types';
import { getStateFromLocalStorage } from '../../storage';

export const useRecording = () => {
  const [isRecordingInProgress, setIsRecordingInProgress] = useState(false);

  const recorderService = RecorderService.getInstance();

  const startRecording = useCallback(
    async (options?: RecorderOptions) => {
      await recorderService.startRecording(options);

      setIsRecordingInProgress(true);
    },
    [recorderService],
  );

  const stopRecording = useCallback(async () => {
    await recorderService.stopRecording();

    setIsRecordingInProgress(false);
  }, [recorderService]);

  const toggleRecording = useCallback(
    async (options?: RecorderOptions) => {
      if (isRecordingInProgress) {
        await stopRecording();
      } else {
        await startRecording(options);
      }
    },
    [isRecordingInProgress, startRecording, stopRecording],
  );

  useEffect(() => {
    const loadState = async () => {
      const state = await getStateFromLocalStorage();

      if (state) {
        setIsRecordingInProgress(state.isRecordingInProgress || false);
      }
    };

    loadState();

    const storageListener = (changes: Record<string, chrome.storage.StorageChange>) => {
      if (changes.isRecordingInProgress) {
        setIsRecordingInProgress(changes.isRecordingInProgress.newValue || false);
      }
    };

    chrome.storage.onChanged.addListener(storageListener);

    return () => {
      chrome.storage.onChanged.removeListener(storageListener);
    };
  }, []);

  return {
    isRecordingInProgress,
    startRecording,
    stopRecording,
    toggleRecording,
  };
};
