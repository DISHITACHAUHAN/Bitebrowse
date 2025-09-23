import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = ({ searchQuery, onSearchChange, onClearSearch }) => {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search restaurants, dishes, or cuisines..."
        value={searchQuery}
        onChangeText={onSearchChange}
      />
      {searchQuery ? (
        <TouchableOpacity onPress={onClearSearch}>
          <Ionicons name="close-circle" size={20} color="#666" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    elevation: 2,
  },
  searchInput: { 
    flex: 1, 
    fontSize: 16 
  },
});

export default SearchBar;