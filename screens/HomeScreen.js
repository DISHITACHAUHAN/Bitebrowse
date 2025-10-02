import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform
} from "react-native";
import PromoCarousel from '../components/PromoCarousel'
import TopNavbar from "../components/TopNavbar";
import SearchBar from "../components/SearchBar";
import CategoriesList from "../components/CategoriesList";
import NearbyRestaurants from "../components/NearbyRestaurants";

// Add the missing responsive functions
const { width, height } = Dimensions.get('window');

// Guideline sizes based on standard ~5.5 inch screen
const GUIDELINE_WIDTH = 375;
const GUIDELINE_HEIGHT = 812;

const scale = (size) => (width / GUIDELINE_WIDTH) * size;
const verticalScale = (size) => (height / GUIDELINE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Simple responsive object
const responsive = {
  spacing: {
    xs: verticalScale(4),
    sm: verticalScale(8),
    md: verticalScale(12),
    lg: verticalScale(16),
    xl: verticalScale(20),
  },
  font: {
    sm: moderateScale(12),
    md: moderateScale(14),
    lg: moderateScale(16),
    xl: moderateScale(18),
    xxl: moderateScale(20),
  }
};

// Mock Data (expanded slightly for completeness)
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
    image: "https://example.com/cake-queen.jpg"
  },
  {
    id: "2",
    name: "Spice Haven",
    cuisine: "South Indian",
    rating: 4.5,
    distance: "2.3 km",
    time: "25-30 mins",
    price: "₹150 for one",
    discount: "50% OFF up to ₹100",
    noPackagingCharges: false,
    isPureVeg: true,
    reviewsCount: "120+",
    image: "https://example.com/spice-haven.jpg"
  },
];

const CUISINE_CATEGORIES = [
  { id: "all", name: "All", icon: "🍽️" },
  { id: "indian", name: "Indian", icon: "🍛" },
  { id: "chinese", name: "Chinese", icon: "🍜" },
  { id: "italian", name: "Italian", icon: "🍕" },
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
    navigation.navigate("RestaurantDetails", { restaurant });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <View style={{ flex: 1 }}>
      <TopNavbar />
      
      {/* Main Scrollable Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: responsive.spacing.xl }}>
        {/* Location Header */}
        

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={handleClearSearch}
        />
        
        <PromoCarousel />


        {/* Restaurants */}
        <View style={[styles.restaurantsSection, { marginTop: responsive.spacing.lg }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontSize: responsive.font.xxl }]}>
              Food Court
            </Text>
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
    paddingHorizontal: responsive.spacing.lg,
    paddingBottom: responsive.spacing.xs
  },
  locationText: {
    color: "#666",
    fontWeight: "500"
  },
  restaurantsSection: { 
    paddingHorizontal: responsive.spacing.lg 
  },
  sectionHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: responsive.spacing.lg 
  },
  sectionTitle: { 
    fontWeight: "bold" 
  },
});

// Export the responsive functions for use in other components
export { scale, verticalScale, moderateScale, responsive };