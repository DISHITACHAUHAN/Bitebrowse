import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    checkStoredUser();
  }, []);

  const checkStoredUser = async () => {
    try {
      // Simulate checking for stored user data
      await new Promise(resolve => setTimeout(resolve, 1000));
      // For now, we'll start with no user
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking stored user:', error);
      setIsLoading(false);
    }
  };

  const login = (userData) => {
    console.log('Logging in user:', userData);
    setUser(userData);
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};