export const getAuthToken = async (): Promise<string | null> => {
  try {
    const result = await chrome.storage.local.get('authToken');

    return result.authToken || null;
  } catch (error) {
    console.error('Failed to get auth token:', error);

    return null;
  }
};

export const addAuthTokenToMessage = async <T extends object>(
  message: T,
): Promise<T & { authToken: string | null }> => {
  const authToken = await getAuthToken();

  return {
    ...message,
    authToken,
  };
};
