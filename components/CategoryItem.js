import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CategoryItem = ({ category, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        isSelected && styles.categoryItemSelected
      ]}
      onPress={onPress}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={[
        styles.categoryName,
        isSelected && styles.categoryNameSelected
      ]}>{category.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginRight: 10,
    minWidth: 80,
    elevation: 1,
  },
  categoryItemSelected: { 
    backgroundColor: "#FF6B6B" 
  },
  categoryIcon: { 
    fontSize: 24, 
    marginBottom: 5 
  },
  categoryName: { 
    fontSize: 12, 
    fontWeight: "600", 
    color: "#666" 
  },
  categoryNameSelected: { 
    color: "#fff" 
  },
});

export default CategoryItem;