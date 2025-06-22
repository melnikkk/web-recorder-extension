export interface EventTracker {
  type: string;
  initialize(): void;
  destroy(): void;
}
