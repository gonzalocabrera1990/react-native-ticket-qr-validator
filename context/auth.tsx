import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';

type AuthContextType = {
  userToken: string | null;
  username: string | null;
  isLoading: boolean;
  signIn: (token: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useSession() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Cargar el token y username al iniciar la app
    const loadSession = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const storedUsername = await SecureStore.getItemAsync('username');
        setUserToken(token);
        setUsername(storedUsername);
      } catch (e) {
        console.error('Error loading session', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!userToken && !inAuthGroup) {
      // Redirigir al login si no hay token
      router.replace('/(auth)/login');
    } else if (userToken && inAuthGroup) {
      // Redirigir al dashboard si ya hay token
      router.replace('/');
    }
  }, [userToken, segments, isLoading]);

  const signIn = async (token: string, name: string) => {
    try {
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('username', name);
      setUserToken(token);
      setUsername(name);
    } catch (e) {
      console.error('Error saving session', e);
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('username');
      setUserToken(null);
      setUsername(null);
    } catch (e) {
      console.error('Error deleting session', e);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, username, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
