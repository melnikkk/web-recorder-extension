import { ClickTracker, trackerRegistry } from '../../features/events-tracking';
import { initContentErrorHandler } from './content-error-handler';

initContentErrorHandler();

const clickTracker = new ClickTracker();

trackerRegistry.register(clickTracker);

trackerRegistry.initialize();

window.addEventListener('beforeunload', () => {
  trackerRegistry.destroy();
});
