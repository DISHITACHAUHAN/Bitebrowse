import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet
} from "react-native";
import TopNavbar from "../components/TopNavbar";
import SearchBar from "../components/SearchBar";
import CategoriesList from "../components/CategoriesList";
import NearbyRestaurants from "../components/NearbyRestaurants";

// Mock Data (same as before)
const MOCK_RESTAURANTS = [
  {
    id: "1",
    name: "Cake O Queen",
    cuisine: "North Indian",
    rating: 4.2,
    distance: "6.1 km",
    time: "40-45 mins",
    price: "₹200 for one",
    discount: "60% OFF up to ₹120",
    noPackagingCharges: true,
    isPureVeg: false,
    reviewsCount: "50+",
    image: "🍰"
  },
  // ... other restaurant data
];

const CUISINE_CATEGORIES = [
  { id: "all", name: "All", icon: "🍽️" },
  { id: "indian", name: "Indian", icon: "🍛" },
  // ... other categories
];

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState(MOCK_RESTAURANTS);
  const [filteredRestaurants, setFilteredRestaurants] = useState(MOCK_RESTAURANTS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let filtered = restaurants;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(r => r.cuisine.toLowerCase().includes(selectedCategory));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.cuisine.toLowerCase().includes(query)
      );
    }

    setFilteredRestaurants(filtered);
    setLoading(false);
  }, [searchQuery, selectedCategory, restaurants]);

  const handleRestaurantPress = (restaurant) => {
    // Navigate to restaurant details screen
    navigation.navigate("RestaurantDetails", { restaurant });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <View style={{ flex: 1 }}>
      <TopNavbar />
      
      {/* Main Scrollable Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Location Header */}
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>New Delhi, India</Text>
        </View>

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={handleClearSearch}
        />

        {/* Categories */}
        <CategoriesList
          categories={CUISINE_CATEGORIES}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Restaurants */}
        <View style={styles.restaurantsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Restaurants</Text>
          </View>

          <NearbyRestaurants
            restaurants={filteredRestaurants}
            loading={loading}
            onRestaurantPress={handleRestaurantPress}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  locationContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5
  },
  locationText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500"
  },
  restaurantsSection: { 
    paddingHorizontal: 15 
  },
  sectionHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 15 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "bold" 
  },
});