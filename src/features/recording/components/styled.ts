import styled from 'styled-components';

export const RecordButton = styled.button<{ isRecordingInProgress: boolean }>`
  height: 100px;
  width: 100px;
  background-color: #ff0000ff;
  border-radius: ${({ isRecordingInProgress }) =>
    isRecordingInProgress ? '10px' : '50%'};
  transition: filter 400ms;
  will-change: filter;
  cursor: pointer;
  margin-bottom: 40px;

  &:hover {
    filter: drop-shadow(0 0 20px #c61515);
  }
`;

export const RecorderStatus = styled.p`
  color: #ffffff;
  font-size: 24px;
`;
