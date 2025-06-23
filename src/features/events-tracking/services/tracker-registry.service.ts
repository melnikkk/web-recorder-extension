import type { EventTracker } from '../types';

class TrackerRegistry {
  private trackers = new Map<string, EventTracker>();

  register(tracker: EventTracker) {
    this.trackers.set(tracker.type, tracker);
  }

  initialize() {
    this.trackers.forEach((tracker) => tracker.initialize());
  }

  destroy() {
    this.trackers.forEach((tracker) => tracker.destroy());
  }
}

export const trackerRegistry = new TrackerRegistry();
