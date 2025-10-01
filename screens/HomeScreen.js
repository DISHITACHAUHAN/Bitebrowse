import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import PromoCarousel from '../components/PromoCarousel';
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Responsive scaling functions
const { width, height } = Dimensions.get('window');

// Guideline sizes based on standard ~5.5 inch screen
const GUIDELINE_WIDTH = 375;
const GUIDELINE_HEIGHT = 812;

const scale = (size) => (width / GUIDELINE_WIDTH) * size;
const verticalScale = (size) => (height / GUIDELINE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Device height classification
const getDeviceHeightType = () => {
  if (height < 600) return 'small';      // Small phones
  if (height < 700) return 'medium';     // Medium phones
  if (height < 800) return 'large';      // Large phones
  return 'xlarge';                       // Extra large phones/tablets
};

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
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&h=200&fit=crop",
    deliveryFee: "₹25",
    minOrder: "₹250",
    tags: ["Pizza", "Pasta", "Garlic Bread"]
  }
];

// Categories data
const CATEGORIES = [
  { id: "all", name: "All", icon: "fast-food" },
  { id: "pizza", name: "Pizza", icon: "pizza" },
  { id: "burger", name: "Burger", icon: "fast-food" },
  { id: "asian", name: "Asian", icon: "restaurant" },
  { id: "dessert", name: "Dessert", icon: "ice-cream" },
  { id: "vegetarian", name: "Vegetarian", icon: "leaf" },
  { id: "indian", name: "Indian", icon: "flag" },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState(MOCK_RESTAURANTS);
  const [filteredRestaurants, setFilteredRestaurants] = useState(MOCK_RESTAURANTS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const deviceHeightType = getDeviceHeightType();
  const insets = useSafeAreaInsets();

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

  // Calculate bottom padding based on navbar height and safe area
  const getBottomPadding = () => {
    const baseTabBarHeight = verticalScale(80); // Approximate tab bar height
    const floatingButtonHeight = verticalScale(64); // Floating cart button height
    const safeAreaBottom = insets.bottom;
    
    return baseTabBarHeight + floatingButtonHeight + safeAreaBottom + verticalScale(20);
  };

  // Responsive spacing based on device height
  const getSpacing = () => {
    switch (deviceHeightType) {
      case 'small': return verticalScale(8);
      case 'medium': return verticalScale(12);
      case 'large': return verticalScale(16);
      case 'xlarge': return verticalScale(20);
      default: return verticalScale(12);
    }
  };

  // Responsive font sizes
  const getTitleSize = () => {
    switch (deviceHeightType) {
      case 'small': return moderateScale(16);
      case 'medium': return moderateScale(18);
      case 'large': return moderateScale(20);
      case 'xlarge': return moderateScale(22);
      default: return moderateScale(18);
    }
  };

  // Simple TopNavbar Component
  const TopNavbar = () => (
    <View style={[styles.topNavbar, { 
      paddingTop: verticalScale(50),
      paddingBottom: getSpacing(),
    }]}>
      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={moderateScale(20)} color="#FF6B6B" />
        <Text style={[styles.locationText, { fontSize: getTitleSize() }]}>
          {user?.name ? `Hello, ${user.name}` : "Hello, Guest"}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="person-circle-outline" size={moderateScale(28)} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  // Simple SearchBar Component
  const SearchBar = () => (
    <View style={[styles.searchContainer, { paddingVertical: getSpacing() }]}>
      <View style={[styles.searchInput, { 
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(12),
      }]}>
        <Ionicons name="search" size={moderateScale(20)} color="#666" />
        <TextInput
          style={[styles.searchTextInput, { fontSize: moderateScale(16) }]}
          placeholder="Search restaurants or dishes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons name="close-circle" size={moderateScale(20)} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  // Simple CategoriesList Component
  const CategoriesList = () => (
    <View style={[styles.categoriesSection, { marginVertical: getSpacing() }]}>
      <Text style={[styles.sectionTitle, { fontSize: getTitleSize() }]}>Categories</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              selectedCategory === category.id && styles.categoryItemSelected,
              { 
                padding: moderateScale(12),
                borderRadius: moderateScale(12),
                minWidth: moderateScale(70),
                marginRight: moderateScale(16),
              }
            ]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <Ionicons 
              name={category.icon} 
              size={moderateScale(24)} 
              color={selectedCategory === category.id ? "#FFFFFF" : "#64748B"} 
            />
            <Text style={[
              styles.categoryName,
              selectedCategory === category.id && styles.categoryNameSelected,
              { fontSize: moderateScale(12) }
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Simple NearbyRestaurants Component
  const NearbyRestaurants = () => {
    const getRestaurantImageHeight = () => {
      switch (deviceHeightType) {
        case 'small': return verticalScale(120);
        case 'medium': return verticalScale(140);
        case 'large': return verticalScale(160);
        case 'xlarge': return verticalScale(180);
        default: return verticalScale(160);
      }
    };

    return (
      <View style={[styles.restaurantsList, { paddingBottom: getBottomPadding() }]}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6B6B" style={styles.loader} />
        ) : filteredRestaurants.length === 0 ? (
          <View style={[styles.emptyState, { paddingVertical: verticalScale(60) }]}>
            <Ionicons name="restaurant-outline" size={moderateScale(64)} color="#CCC" />
            <Text style={[styles.emptyStateText, { fontSize: moderateScale(18) }]}>
              No restaurants found
            </Text>
            <Text style={[styles.emptyStateSubtext, { fontSize: moderateScale(14) }]}>
              Try adjusting your search or filter
            </Text>
          </View>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={[styles.restaurantCard, { 
                marginBottom: verticalScale(16),
                borderRadius: moderateScale(16),
              }]}
              onPress={() => handleRestaurantPress(restaurant)}
            >
              <Image 
                source={{ uri: restaurant.image }} 
                style={[styles.restaurantImage, { 
                  height: getRestaurantImageHeight(),
                  borderTopLeftRadius: moderateScale(16),
                  borderTopRightRadius: moderateScale(16),
                }]}
              />
              <View style={[styles.restaurantInfo, { padding: moderateScale(16) }]}>
                <View style={styles.restaurantHeader}>
                  <Text style={[styles.restaurantName, { fontSize: moderateScale(18) }]}>
                    {restaurant.name}
                  </Text>
                  <View style={[styles.ratingContainer, { 
                    paddingHorizontal: moderateScale(8),
                    paddingVertical: moderateScale(4),
                    borderRadius: moderateScale(8),
                  }]}>
                    <Ionicons name="star" size={moderateScale(14)} color="#FFD700" />
                    <Text style={[styles.rating, { fontSize: moderateScale(12) }]}>
                      {restaurant.rating}
                    </Text>
                    <Text style={[styles.reviewsCount, { fontSize: moderateScale(12) }]}>
                      ({restaurant.reviewsCount})
                    </Text>
                  </View>
                </View>
                
                <View style={styles.tagsContainer}>
                  {restaurant.tags.slice(0, 3).map((tag, index) => (
                    <View key={index} style={[styles.tag, { 
                      paddingHorizontal: moderateScale(8),
                      paddingVertical: moderateScale(4),
                      borderRadius: moderateScale(6),
                      marginRight: moderateScale(6),
                      marginBottom: moderateScale(4),
                    }]}>
                      <Text style={[styles.tagText, { fontSize: moderateScale(11) }]}>
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.restaurantFooter}>
                  <View style={styles.features}>
                    {restaurant.noPackagingCharges && (
                      <Text style={[styles.featureText, { fontSize: moderateScale(12) }]}>
                        ♻️ No Packaging
                      </Text>
                    )}
                    {restaurant.isPureVeg && (
                      <Text style={[styles.featureText, { fontSize: moderateScale(12) }]}>
                        🌱 Pure Veg
                      </Text>
                    )}
                  </View>
                  <View style={styles.deliveryInfo}>
                    <Text style={[styles.deliveryFee, { fontSize: moderateScale(12) }]}>
                      {restaurant.deliveryFee}
                    </Text>
                    <Text style={[styles.minOrder, { fontSize: moderateScale(11) }]}>
                      Min: {restaurant.minOrder}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TopNavbar />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
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
        <CategoriesList />

        {/* Restaurants Section */}
        <View style={[styles.restaurantsSection, { marginTop: getSpacing() }]}>
          <View style={[styles.sectionHeader, { 
            marginBottom: verticalScale(15),
          }]}>
            <Text style={[styles.sectionTitle, { fontSize: getTitleSize() }]}>
              Popular Restaurants
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { fontSize: moderateScale(14) }]}>
                See All
              </Text>
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
    paddingHorizontal: moderateScale(20),
    backgroundColor: "#FFFFFF",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: moderateScale(8),
  },
  profileButton: {
    padding: moderateScale(4),
  },
  searchContainer: {
    paddingHorizontal: moderateScale(20),
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: moderateScale(16),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchTextInput: {
    flex: 1,
    marginLeft: moderateScale(8),
    color: "#1F2937",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  promoSection: {
    marginVertical: verticalScale(10),
  },
  promoContainer: {
    paddingHorizontal: moderateScale(20),
  },
  promoCard: {
    width: moderateScale(280),
    height: verticalScale(120),
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginRight: moderateScale(12),
    justifyContent: "center",
  },
  promoTitle: {
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: verticalScale(4),
  },
  promoSubtitle: {
    color: "#FFFFFF",
    opacity: 0.9,
  },
  categoriesSection: {
    // marginVertical handled inline
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#1F2937",
    paddingHorizontal: moderateScale(20),
  },
  categoriesContainer: {
    paddingHorizontal: moderateScale(20),
  },
  categoryItem: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  categoryItemSelected: {
    backgroundColor: "#FF6B6B",
  },
  categoryName: {
    fontWeight: "500",
    color: "#64748B",
    marginTop: verticalScale(6),
  },
  categoryNameSelected: {
    color: "#FFFFFF",
  },
  restaurantsSection: {
    // marginTop handled inline
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
  },
  seeAllText: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
  restaurantsList: {
    paddingHorizontal: moderateScale(20),
    // paddingBottom handled inline
  },
  restaurantCard: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(8),
    elevation: 3,
  },
  restaurantImage: {
    width: "100%",
  },
  restaurantInfo: {
    // padding handled inline
  },
  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: verticalScale(8),
  },
  restaurantName: {
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEFCE8",
  },
  rating: {
    fontWeight: "600",
    color: "#92400E",
    marginLeft: moderateScale(4),
  },
  reviewsCount: {
    color: "#64748B",
    marginLeft: moderateScale(2),
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: verticalScale(12),
  },
  tag: {
    backgroundColor: "#F1F5F9",
  },
  tagText: {
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
    color: "#059669",
    fontWeight: "500",
    marginRight: moderateScale(12),
  },
  deliveryInfo: {
    alignItems: "flex-end",
  },
  deliveryFee: {
    color: "#475569",
    fontWeight: "500",
  },
  minOrder: {
    color: "#94A3B8",
  },
  loader: {
    marginVertical: verticalScale(40),
  },
  emptyState: {
    alignItems: "center",
  },
  emptyStateText: {
    color: "#64748B",
    fontWeight: "600",
    marginTop: verticalScale(16),
  },
  emptyStateSubtext: {
    color: "#94A3B8",
    marginTop: verticalScale(8),
  },
});

// Export scaling functions for use in other components
export { scale, verticalScale, moderateScale, getDeviceHeightType };