import { trackerRegistry } from '../../features/events-tracking/services';
import { ClickTracker } from '../../features/events-tracking/trackers';

const clickTracker = new ClickTracker();
trackerRegistry.register(clickTracker);

trackerRegistry.initialize();

window.addEventListener('beforeunload', () => {
  trackerRegistry.destroy();
});
