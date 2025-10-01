import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = ({ searchQuery, onSearchChange, onClearSearch }) => {
  return (
    <View style={styles.container}>
      {/* Simple Header */}
      <View style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.headerText}>Don't wait, order your food!</Text>
        </View>
      </View>

      {/* Simple Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchContent}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants, dishes, or cuisines..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          
          {searchQuery ? (
            <TouchableOpacity onPress={onClearSearch} style={styles.clearButton}>
              <Ionicons name="close" size={18} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  textContainer: {
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  searchContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: { 
    flex: 1, 
    fontSize: 16,
    color: "#000",
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchBar;