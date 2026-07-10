import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, getProfile } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on application startup
  const restoreSession = async () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        // Verify token by fetching the latest profile from the backend
        const response = await getProfile();
        if (response.success && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          clearSession();
        }
      } catch (error) {
        // If the API returns a 401 or falls over, clear session
        clearSession();
      }
    } else {
      clearSession();
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      if (response.success && response.data) {
        const { user: loggedInUser, token: loggedInToken } = response.data;
        setUser(loggedInUser);
        setToken(loggedInToken);
        localStorage.setItem('token', loggedInToken);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        return response.data;
      }
      throw new Error(response.message || 'Login failed.');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearSession();
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
