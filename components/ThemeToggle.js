// src/components/ThemeToggle.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.toggleButton, { backgroundColor: theme.colors.card }]}
      onPress={toggleTheme}
    >
      <Ionicons 
        name={isDark ? "sunny" : "moon"} 
        size={20} 
        color={theme.colors.primary} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    padding: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemeToggle;