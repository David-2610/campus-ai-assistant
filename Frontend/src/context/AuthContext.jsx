import { createContext, useContext, useState } from 'react';
import { setToken, getToken, removeToken, setUser, getUser, removeUser } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    // Initialize user state from localStorage
    const storedUser = getUser();
    const storedToken = getToken();
    return storedUser && storedToken ? storedUser : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize authentication state from localStorage
    const storedUser = getUser();
    const storedToken = getToken();
    return !!(storedUser && storedToken);
  });

  // Login function that stores token and user data
  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    setUserState(userData);
    setIsAuthenticated(true);
  };

  // Logout function that removes token and user data
  const logout = () => {
    removeToken();
    removeUser();
    setUserState(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.displayName = 'AuthProvider';

// Custom hook for consuming context
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
