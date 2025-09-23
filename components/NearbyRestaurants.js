import React from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RestaurantCard from "./RestaurantCard";

const NearbyRestaurants = ({ restaurants, loading, onRestaurantPress }) => {
  if (loading) {
    return (
      <ActivityIndicator size="large" color="#FF6B6B" style={{ marginVertical: 50 }} />
    );
  }

  if (restaurants.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No restaurants found</Text>
        <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={restaurants}
      renderItem={({ item }) => (
        <RestaurantCard 
          restaurant={item} 
          onPress={() => onRestaurantPress?.(item)}
        />
      )}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center", 
    paddingVertical: 50 
  },
  emptyTitle: { 
    fontSize: 18, 
    color: "#666", 
    marginTop: 10 
  },
  emptySubtitle: { 
    fontSize: 14, 
    color: "#999", 
    marginTop: 5 
  },
});

export default NearbyRestaurants;