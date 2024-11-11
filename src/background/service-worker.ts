import { eventListener } from './eventListener';

chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.onMessage.addListener(eventListener);
});
