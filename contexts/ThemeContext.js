// contexts/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [theme, setTheme] = useState({});

  // Color schemes
  const lightColors = {
    // Primary colors
    primary: '#00a850',
    primaryGradient: ['#8B3358', '#670D2F', '#3A081C'], // Burgundy gradient for navbars
    
    // Background colors - Warm off-white that complements burgundy
    background: '#f4f4f4',
    card: '#ffffff',
    tabBar: '#ffffff',
    
    // Text colors
    text: '#2d1a1f',
    textSecondary: '#7a5c6c',
    
    // UI colors
    border: '#f0e6e9',
    error: '#dc2626',
    white: '#ffffff',
    black: '#000000',
    
    // Semantic colors
    success: '#00a850',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // Theme-specific
    isDark: false,
  };

  const darkColors = {
    // Primary colors
    primary: '#00a850',
    primaryGradient: ['#8B3358', '#670D2F', '#3A081C'], // Same gradient for dark mode
    
    // Background colors - Deep plum that complements burgundy
    background: '#1a0f14',
    card: '#25171f',
    tabBar: '#25171f',
    
    // Text colors
    text: '#f8f1f3',
    textSecondary: '#b8a4af',
    
    // UI colors
    border: '#3a2830',
    error: '#ef4444',
    white: '#ffffff',
    black: '#000000',
    
    // Semantic colors
    success: '#00a850',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // Theme-specific
    isDark: true,
  };

  useEffect(() => {
    setTheme(isDark ? darkColors : lightColors);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const value = {
    isDark,
    theme,
    toggleTheme,
    colors: theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};