import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const RestaurantMenu = () => {
  const route = useRoute();
  const { restaurant } = route.params;

  // Sample menu data (in a real app, fetch this from an API using restaurant.id)
  // Assuming menu items have: id, name, description, price, image (optional)
  const sampleMenuItems = [
    {
      id: "1",
      name: "Butter Chicken",
      description: "Creamy tomato-based curry with tender chicken.",
      price: "$12.99",
      image: "https://example.com/butter-chicken.jpg",
      category: "Main Course",
    },
    {
      id: "2",
      name: "Naan Bread",
      description: "Soft and fluffy Indian flatbread.",
      price: "$3.99",
      image: "https://example.com/naan.jpg",
      category: "Sides",
    },
    {
      id: "3",
      name: "Vegetable Biryani",
      description: "Fragrant rice dish with mixed vegetables and spices.",
      price: "$10.99",
      image: "https://example.com/biryani.jpg",
      category: "Main Course",
    },
    {
      id: "4",
      name: "Samosas",
      description: "Crispy pastries filled with spiced potatoes and peas.",
      price: "$5.99",
      image: "https://example.com/samosas.jpg",
      category: "Appetizers",
    },
    {
      id: "5",
      name: "Mango Lassi",
      description: "Refreshing yogurt-based drink with mango.",
      price: "$4.50",
      image: "https://example.com/lassi.jpg",
      category: "Drinks",
    },
  ];

  // Group menu items by category for better organization
  const groupedMenu = sampleMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.menuItemImage} resizeMode="cover" />
      ) : null}
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.menuItemDescription}>{item.description}</Text>
        ) : null}
        <Text style={styles.menuItemPrice}>{item.price}</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategory = (category, index) => (
    <View key={index} style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{category}</Text>
      <FlatList
        data={groupedMenu[category]}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false} // Disable inner scroll to let outer ScrollView handle it
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Restaurant Header */}
      <View style={styles.header}>
        <Image source={{ uri: restaurant.image }} style={styles.headerImage} resizeMode="cover" />
        <View style={styles.headerOverlay}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <View style={styles.headerDetails}>
            <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
            <Text style={styles.restaurantPrice}> • {restaurant.price}</Text>
          </View>
          <View style={styles.deliveryInfo}>
            <Ionicons name="time-outline" size={14} color="#fff" />
            <Text style={styles.deliveryText}>{restaurant.time}</Text>
            <Text style={styles.distance}> • {restaurant.distance}</Text>
          </View>
        </View>
      </View>

      {/* Menu Sections */}
      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Menu</Text>
        {Object.keys(groupedMenu).map((category, index) => renderCategory(category, index))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: 200,
  },
  headerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    paddingTop: 40,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  restaurantCuisine: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  restaurantPrice: {
    fontSize: 16,
    color: "#fff",
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 4,
  },
  distance: {
    fontSize: 14,
    color: "#fff",
  },
  menuContainer: {
    padding: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#ff6b35",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

// Example of how to set up in your navigator (e.g., in App.js or your stack navigator):
// <Stack.Screen name="RestaurantMenu" component={RestaurantMenu} />

export default RestaurantMenu;