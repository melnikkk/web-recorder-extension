import styled from 'styled-components';

export const AppWrapper = styled.div`
  width: 250px;
  height: 350px;
  background-color: #242424;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const RecorderContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

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
