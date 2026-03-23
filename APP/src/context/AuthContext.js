import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading while checking stored auth

  // On mount, check secure store for existing session
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('token');
      const storedUser = await SecureStore.getItemAsync('user');
      if (storedToken && storedUser) {
        setUserState(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.log('Error loading stored auth:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token, userData) => {
    try {
      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      setUserState(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.log('Error saving auth data:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
    } catch (err) {
      console.log('Error clearing auth data:', err);
    }
    setUserState(null);
    setIsAuthenticated(false);
  };

  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
