export const getActiveTab = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tabs.length === 0) {
    throw new Error('No active tab found');
  }

  return tabs[0];
};

export const getActiveTabDimensions = async (): Promise<{
  width: number;
  height: number;
}> => {
  try {
    const defaultDimensions = { width: 1920, height: 1080 };
    const activeTab = await getActiveTab();

    if (!activeTab.id) {
      return defaultDimensions;
    }

    const [result] = await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: () => ({ width: window.innerWidth, height: window.innerHeight }),
    });

    if (result?.result) {
      return result.result;
    }

    return defaultDimensions;
  } catch (error) {
    console.error('Failed to get tab dimensions:', error);

    return { width: 1920, height: 1080 };
  }
};
