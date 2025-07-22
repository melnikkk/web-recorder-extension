import { SignIn, SignedIn, SignedOut } from '@clerk/chrome-extension';
import { AppWrapper, RecorderContent } from '../../ui/styles';
import { RecordingApp } from './components/Recorder';

export default function App() {
  return (
    <AppWrapper>
      <SignedIn>
        <RecordingApp />
      </SignedIn>
      <SignedOut>
        <RecorderContent>
          <SignIn />
        </RecorderContent>
      </SignedOut>
    </AppWrapper>
  );
}
