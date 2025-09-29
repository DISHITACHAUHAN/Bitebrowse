import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput, // <-- ADD THIS IMPORT
  Image, // <-- ADD THIS IMPORT
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import SearchBar from "../components/SearchBar";
import PromoCarousel from '../components/PromoCarousel'
// Mock Data (simplified without removed fields)
const MOCK_RESTAURANTS = [
  {
    id: "1",
    name: "Cake O Queen",
    rating: 4.2,
    noPackagingCharges: true,
    isPureVeg: false,
    reviewsCount: "50+",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=200&fit=crop",
    deliveryFee: "₹40",
    minOrder: "₹150",
    tags: ["Bakery", "Desserts", "Cakes"]
  },
  {
    id: "2",
    name: "Spice Haven",
    rating: 4.5,
    noPackagingCharges: false,
    isPureVeg: true,
    reviewsCount: "120+",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
    deliveryFee: "₹30",
    minOrder: "₹200",
    tags: ["Dosa", "Idli", "Vegetarian"]
  },
  {
    id: "3",
    name: "Dragon Palace",
    rating: 4.3,
    noPackagingCharges: true,
    isPureVeg: false,
    reviewsCount: "80+",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&h=200&fit=crop",
    deliveryFee: "₹50",
    minOrder: "₹300",
    tags: ["Noodles", "Manchurian", "Soups"]
  },
  {
    id: "4",
    name: "Pizza Paradise",
    rating: 4.6,
    noPackagingCharges: false,
    isPureVeg: false,
    reviewsCount: "200+",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
    deliveryFee: "₹25",
    minOrder: "₹250",
    tags: ["Pizza", "Pasta", "Garlic Bread"]
  }
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState(MOCK_RESTAURANTS);
  const [filteredRestaurants, setFilteredRestaurants] = useState(MOCK_RESTAURANTS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    filterRestaurants();
  }, [searchQuery, selectedCategory, restaurants]);

  const filterRestaurants = () => {
    setLoading(true);
    let filtered = restaurants;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(r => 
        r.tags.some(tag => tag.toLowerCase().includes(selectedCategory))
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredRestaurants(filtered);
    setLoading(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate("RestaurantDetails", { restaurant });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Simple TopNavbar Component
  const TopNavbar = () => (
    <View style={styles.topNavbar}>
      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={20} color="#FF6B6B" />
        <Text style={styles.locationText}>
          {user?.name ? `Hello, ${user.name}` : "Hello, Guest"}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="person-circle-outline" size={28} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  // Simple SearchBar Component
  const SearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInput}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchTextInput}
          placeholder="Search restaurants or dishes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  // Simple CategoriesList Component
  const CategoriesList = () => (
    <View style={styles.categoriesSection}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
      </ScrollView>
    </View>
  );

  // Simple NearbyRestaurants Component
  const NearbyRestaurants = () => (
    <View style={styles.restaurantsList}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B6B" style={styles.loader} />
      ) : filteredRestaurants.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="restaurant-outline" size={64} color="#CCC" />
          <Text style={styles.emptyStateText}>No restaurants found</Text>
          <Text style={styles.emptyStateSubtext}>
            Try adjusting your search or filter
          </Text>
        </View>
      ) : (
        filteredRestaurants.map((restaurant) => (
          <TouchableOpacity
            key={restaurant.id}
            style={styles.restaurantCard}
            onPress={() => handleRestaurantPress(restaurant)}
          >
            <Image 
              source={{ uri: restaurant.image }} 
              style={styles.restaurantImage}
            />
            <View style={styles.restaurantInfo}>
              <View style={styles.restaurantHeader}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.rating}>{restaurant.rating}</Text>
                  <Text style={styles.reviewsCount}>({restaurant.reviewsCount})</Text>
                </View>
              </View>
              
              <View style={styles.tagsContainer}>
                {restaurant.tags.slice(0, 3).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.restaurantFooter}>
                <View style={styles.features}>
                  {restaurant.noPackagingCharges && (
                    <Text style={styles.featureText}>♻️ No Packaging</Text>
                  )}
                  {restaurant.isPureVeg && (
                    <Text style={styles.featureText}>🌱 Pure Veg</Text>
                  )}
                </View>
                <View style={styles.deliveryInfo}>
                  <Text style={styles.deliveryFee}>{restaurant.deliveryFee}</Text>
                  <Text style={styles.minOrder}>Min: {restaurant.minOrder}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  // Simple PromoCarousel Component
  

  return (
    <View style={styles.container}>
      <TopNavbar />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <SearchBar />

        {/* Promo Carousel */}
        <PromoCarousel />
        {/* Categories */}

        {/* Restaurants Section */}
        <View style={styles.restaurantsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Restaurants</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <NearbyRestaurants />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topNavbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
  },
  profileButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchTextInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#1F2937",
  },
  promoSection: {
    marginVertical: 10,
  },
  promoContainer: {
    paddingHorizontal: 20,
  },
  promoCard: {
    width: 280,
    height: 120,
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
    justifyContent: "center",
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  categoriesSection: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    minWidth: 70,
  },
  categoryItemSelected: {
    backgroundColor: "#FF6B6B",
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },
  categoryNameSelected: {
    color: "#FFFFFF",
  },
  restaurantsSection: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  seeAllText: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
  restaurantsList: {
    paddingHorizontal: 20,
  },
  restaurantCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  restaurantImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEFCE8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
    marginLeft: 4,
  },
  reviewsCount: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 2,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "500",
  },
  restaurantFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  features: {
    flexDirection: "row",
  },
  featureText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "500",
    marginRight: 12,
  },
  deliveryInfo: {
    alignItems: "flex-end",
  },
  deliveryFee: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  minOrder: {
    fontSize: 11,
    color: "#94A3B8",
  },
  loader: {
    marginVertical: 40,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#64748B",
    fontWeight: "600",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
});
