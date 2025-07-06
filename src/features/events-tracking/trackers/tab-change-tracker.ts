import { v4 } from 'uuid';
import { UserEventType } from '../../../core';
import type { EventTracker } from '../types';
import type { UserEvent } from '../../storage';
import { EventStorageService } from '../services';

export class TabChangeTracker implements EventTracker {
  type = UserEventType.URL_CHANGE;

  private tabUrls = new Map<number, string>();
  private eventStorageService = EventStorageService.getInstance();

  initialize() {
    chrome.tabs.onActivated.addListener(this.onTabActivated);
    chrome.tabs.onUpdated.addListener(this.onTabUpdated);
  }

  destroy() {
    chrome.tabs.onActivated.removeListener(this.onTabActivated);
    chrome.tabs.onUpdated.removeListener(this.onTabUpdated);
  }

  private onTabUpdated = async (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab,
  ) => {
    if (changeInfo.status === 'complete' && tab.url) {
      this.tabUrls.set(tabId, tab.url);

      const userEvent: UserEvent = {
        id: v4(),
        type: this.type,
        timestamp: Date.now(),
        data: {
          newUrl: tab.url,
        },
      };

      await this.eventStorageService.storeEvent(userEvent);
    }
  };

  private onTabActivated = async (activeInfo: chrome.tabs.TabActiveInfo) => {
    const toTabId = activeInfo.tabId;

    try {
      const tab = await chrome.tabs.get(toTabId);

      if (tab.url) {
        this.tabUrls.set(toTabId, tab.url);

        const urlChangeEvent: UserEvent = {
          id: v4(),
          type: UserEventType.URL_CHANGE,
          timestamp: Date.now(),
          data: {
            newUrl: tab.url,
          },
        };

        await this.eventStorageService.storeEvent(urlChangeEvent);
      }
    } catch (error) {
      console.error('TabChangeTracker: Error getting tab information', error);
    }
  };
}
