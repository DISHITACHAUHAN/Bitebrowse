import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RestaurantCard = ({ restaurant, onPress }) => {
  return (
    <TouchableOpacity style={styles.restaurantCard} onPress={onPress}>
      {/* Restaurant Image - Full Width */}
      <Image 
        source={{ uri: restaurant.image }} 
        style={styles.restaurantImage}
        resizeMode="cover"
      />
      
      {/* Restaurant Info */}
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.cuisineContainer}>
            <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
            <Text style={styles.restaurantPrice}> • {restaurant.price}</Text>
          </View>
          
          <View style={styles.deliveryInfo}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.deliveryText}>{restaurant.time}</Text>
            <Text style={styles.distance}> • {restaurant.distance}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  restaurantCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: "hidden",
  },
  restaurantImage: {
    width: "100%",
    height: 160,
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cuisineContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  restaurantPrice: {
    fontSize: 14,
    color: "#666",
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  distance: {
    fontSize: 13,
    color: "#666",
  },
});

// Example usage:
// <RestaurantCard 
//   restaurant={{
//     image: "https://example.com/restaurant-image.jpg",
//     name: "Mogli The Family Restaurant",
//     cuisine: "North Indian",
//     price: "200 for one",
//     time: "40-45 mins",
//     distance: "6.1 km"
//   }}
//   onPress={() => console.log("Card pressed")}
// />

export default RestaurantCard;