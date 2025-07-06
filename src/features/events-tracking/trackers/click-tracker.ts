import { v4 } from 'uuid';
import {
  BackgroundMessageType,
  MessagingError,
  sendRuntimeMessage,
  UserEventType,
} from '../../../core';
import type { EventTracker } from '../types';
import type { ParentElements, UserEvent, UserInteraction } from '../../storage';

export class ClickTracker implements EventTracker {
  type = UserEventType.CLICK;

  initialize() {
    document.addEventListener('click', this.handleClick);
  }

  destroy() {
    document.removeEventListener('click', this.handleClick);
  }

  private handleClick = async (event: MouseEvent): Promise<void> => {
    const targetElement = event.target as HTMLElement;

    const pageInfo = {
      url: window.location.href,
      title: document.title,
    };

    const parentElements = this.getParentElements(targetElement, 5);

    let userInteraction: UserInteraction = {
      inputValue: 'clicked',
    };

    const additionalContext: Record<string, unknown> = {};

    if (targetElement instanceof HTMLInputElement) {
      userInteraction = {
        ...userInteraction,
        inputValue: targetElement.value,
        isChecked:
          targetElement.type === 'checkbox' || targetElement.type === 'radio'
            ? targetElement.checked
            : undefined,
      };

      additionalContext.inputType = targetElement.type;
    } else if (targetElement instanceof HTMLSelectElement) {
      const selectedOptions = Array.from(targetElement.selectedOptions).map(
        (option) => option.value,
      );

      userInteraction = {
        ...userInteraction,
        selectedOptions,
      };
    } else if (targetElement instanceof HTMLTextAreaElement) {
      userInteraction = {
        ...userInteraction,
        inputValue: targetElement.value,
      };
    }

    const userEvent: UserEvent = {
      id: v4(),
      type: UserEventType.CLICK,
      data: {
        coordinates: {
          x: event.clientX,
          y: event.clientY,
        },
        targetElement: {
          elementType: targetElement.tagName?.toLowerCase() || 'unknown',
          elementId: targetElement.id || undefined,
          elementName: (targetElement as HTMLInputElement).name || undefined,
          elementClass: targetElement.className || undefined,
          textContent: this.getTrimmedText(targetElement),
          placeholder: (targetElement as HTMLInputElement).placeholder || undefined,
          ariaLabel: targetElement.getAttribute('aria-label') || undefined,
        },
        pageContext: {
          url: pageInfo?.url || '',
          title: pageInfo?.title || '',
          parentElements,
        },
        userInteraction,
        additionalContext,
      },
      timestamp: Date.now(),
    };

    try {
      await sendRuntimeMessage({
        type: BackgroundMessageType.USER_ACTION_HAPPENED,
        contextType: chrome.runtime.ContextType.BACKGROUND,
        data: { userEvent },
      });
    } catch (error) {
      throw new MessagingError(
        'Failed to send user event',
        BackgroundMessageType.USER_ACTION_HAPPENED,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  };

  private getParentElements(element: HTMLElement, maxDepth: number): ParentElements {
    const parents: ParentElements = [];
    let currentElement = element.parentElement;
    let depth = 0;

    while (currentElement && depth < maxDepth) {
      parents.push({
        tagName: currentElement.tagName.toLowerCase(),
        id: currentElement.id || undefined,
        className: currentElement.className || undefined,
      });

      currentElement = currentElement.parentElement;
      depth++;
    }

    return parents;
  }

  private getTrimmedText(element: HTMLElement): string | undefined {
    const text = element.textContent;

    if (!text) {
      return undefined;
    }

    const trimmed = text.trim().replace(/\s+/g, ' ');

    return trimmed.length > 100 ? trimmed.substring(0, 97) + '...' : trimmed;
  }
}
