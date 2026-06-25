import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getProfile, login as apiLogin, register as apiRegister, logout as apiLogout, updateProfile } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // On mount — verify stored token and load user
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getProfile();
        setUser(data.user || data);
        setIsAuthenticated(true);
      } catch (err) {
        // Token invalid — clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await apiLogin(credentials);
    const { token: newToken, user: newUser } = data;
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
    
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await apiRegister(userData);
    const { token: newToken, user: newUser } = data;
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
    
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (err) {
      // Ignore logout errors — still clear local state
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const updateUser = useCallback(async (userData) => {
    const data = await updateProfile(userData);
    const updated = data.user || data;
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
