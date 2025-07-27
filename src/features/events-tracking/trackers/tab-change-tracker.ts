import { v4 } from 'uuid';
import { UserEventType } from '../../../core';
import type { UserEvent } from '../../storage';
import { EventStorageService } from '../services';
import type { EventTracker } from '../types';

export class TabChangeTracker implements EventTracker {
  type = UserEventType.URL_CHANGE;

  private eventStorageService = EventStorageService.getInstance();
  private currentURL: string | null = null;

  initialize() {
    chrome.tabs.onActivated.addListener(this.onTabActivated);
    chrome.tabs.onUpdated.addListener(this.onTabUpdated);
  }

  destroy() {
    chrome.tabs.onActivated.removeListener(this.onTabActivated);
    chrome.tabs.onUpdated.removeListener(this.onTabUpdated);
  }

  private generateUrlChangeRecordingEventTitle(newUrl: string): string {
    const url = new URL(newUrl);
    const domain = url.hostname.replace('www.', '');

    return `Navigate to ${domain}`;
  }

  private onTabUpdated = async (
    _tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab,
  ) => {
    if (tab.url && this.isDomainChange(tab.url) && changeInfo.status === 'complete') {
      const userEvent: UserEvent = {
        id: v4(),
        type: this.type,
        title: this.generateUrlChangeRecordingEventTitle(tab.url),
        timestamp: Date.now(),
        data: {
          newUrl: tab.url,
          previousUrl: this.currentURL,
        },
      };

      await this.eventStorageService.storeEvent(userEvent);

      this.currentURL = tab.url;
    }
  };

  private onTabActivated = async (activeInfo: chrome.tabs.TabActiveInfo) => {
    const toTabId = activeInfo.tabId;

    try {
      const tab = await chrome.tabs.get(toTabId);

      if (tab.url && this.isDomainChange(tab.url)) {
        const urlChangeEvent: UserEvent = {
          id: v4(),
          type: UserEventType.URL_CHANGE,
          title: this.generateUrlChangeRecordingEventTitle(tab.url),
          timestamp: Date.now(),
          data: {
            newUrl: tab.url,
            previousUrl: this.currentURL,
          },
        };

        await this.eventStorageService.storeEvent(urlChangeEvent);

        this.currentURL = tab.url;
      }
    } catch (error) {
      console.error('TabChangeTracker: Error getting tab information', error);
    }
  };

  private isDomainChange(url: string): boolean {
    if (!url) {
      return false;
    }

    const currentDomain = this.currentURL ? new URL(this.currentURL).hostname : null;
    const newDomain = new URL(url).hostname;

    return currentDomain !== newDomain;
  }
}
