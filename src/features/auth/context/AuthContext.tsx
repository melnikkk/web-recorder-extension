import React, { createContext, useContext, useEffect, useState } from 'react';
import { useClerk, useAuth, useUser } from '@clerk/chrome-extension';

interface Props {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  userId: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<Props | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const clerk = useClerk();

  const { isSignedIn } = useAuth();

  const { user } = useUser();

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn && clerk.session) {
        try {
          const sessionToken = await clerk.session.getToken();

          setToken(sessionToken);

          await chrome.storage.local.set({ authToken: sessionToken });
        } catch (error) {
          console.error('Failed to fetch auth token:', error);

          setToken(null);
        }
      } else {
        setToken(null);

        await chrome.storage.local.remove('authToken');
      }
    };

    fetchToken();
  }, [isSignedIn, clerk.session]);

  const handleSignOut = async () => {
    try {
      await clerk.signOut();

      await chrome.storage.local.remove('authToken');
    } catch (error) {
      console.error('Error during signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!isSignedIn,
        isLoading: !clerk.loaded,
        userId: user?.id || null,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): Props => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};
