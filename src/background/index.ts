import { eventListener } from './eventListener';
import { BackgroundMessage } from '../types';

chrome.runtime.onMessage.addListener((message: BackgroundMessage, _sender, sendResponse) => {
  (async () => {
    try {
      await eventListener(message);
      
      sendResponse({ success: true });
    } catch (error) {
      console.error('Error processing message:', error);
      sendResponse({ success: false, error });
    }
  })();
  
  return true;
});
