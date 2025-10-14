import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

export default function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  onClearSearch,
  onFilterPress,
  compact = false,
  placeholder = "Search Restaurants",
  autoFocus = false,
  onSubmitEditing,
  style,
  showTagline = false,
  ...props 
}) {
  const { width } = useWindowDimensions();
  const { colors, isDark } = useTheme();

  const getResponsiveSize = () => {
    if (compact) {
      return {
        height: 44,
        iconSize: 20,
        fontSize: 15,
        paddingHorizontal: 16,
        borderRadius: 12,
      };
    }
    
    if (width < 375) { // Small phones
      return {
        height: 48,
        iconSize: 20,
        fontSize: 15,
        paddingHorizontal: 16,
        borderRadius: 14,
      };
    }
    
    return { 
      height: 52, 
      iconSize: 22, 
      fontSize: 16, 
      paddingHorizontal: 20,
      borderRadius: 16,
    };
  };

  const handleClearSearch = () => {
    onClearSearch?.();
    Keyboard.dismiss();
  };

  const handleFilterPress = () => {
    onFilterPress?.();
  };

  const responsiveSize = getResponsiveSize();

  return (
    <View style={[styles.wrapper, style]}>
      {/* Tagline */}
      {showTagline && (
        <View style={styles.taglineContainer}>
          <Text style={[styles.tagline, { color: colors.text }]}>
            Don't wait, order your food!
          </Text>
        </View>
      )}
      
      <View style={[
        styles.container, 
        { 
          backgroundColor: colors.searchBackground || (isDark ? '#2a2a2a' : '#f8f9fa'),
          height: responsiveSize.height,
          paddingHorizontal: responsiveSize.paddingHorizontal,
          borderRadius: responsiveSize.borderRadius,
          borderColor: colors.border || (isDark ? '#444' : '#e9ecef'),
          borderWidth: StyleSheet.hairlineWidth,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.1 : 0.05,
          shadowRadius: 8,
          elevation: 2,
        }
      ]}>
        <Ionicons 
          name="search" 
          size={responsiveSize.iconSize} 
          color={colors.textSecondary} 
          style={styles.searchIcon}
        />
        
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              fontSize: responsiveSize.fontSize,
              height: responsiveSize.height - 16,
              lineHeight: responsiveSize.fontSize,
            }
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
          clearButtonMode="never"
          autoFocus={autoFocus}
          onSubmitEditing={onSubmitEditing}
          autoCorrect={false}
          autoCapitalize="none"
          {...props}
        />
        
        {searchQuery ? (
          <TouchableOpacity 
            onPress={handleClearSearch} 
            style={styles.clearButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons 
              name="close-circle" 
              size={responsiveSize.iconSize} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={handleFilterPress}
            style={styles.filterButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons 
              name="options-outline" 
              size={responsiveSize.iconSize} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontWeight: "400",
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
    margin: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  clearButton: {
    padding: 2,
    marginLeft: 8,
  },
  filterButton: {
    padding: 2,
    marginLeft: 8,
  },
});