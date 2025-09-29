import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Animated,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useCart } from "../contexts/CartContext";

const { width } = Dimensions.get("window");

const RestaurantDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { restaurant } = route.params;
  const { addItem, cart, getItemQuantity, incrementItem, decrementItem } = useCart();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [expandedCategories, setExpandedCategories] = useState({});
  const [favorite, setFavorite] = useState(false);

  // Enhanced sample menu data with categories
  const sampleMenuItems = [
    {
      id: "1",
      name: "Butter Chicken",
      description: "Creamy tomato-based curry with tender chicken pieces, cooked in rich spices.",
      price: "₹250",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
      category: "Main Course",
      isVeg: false,
      bestseller: true,
      preparationTime: "20-25 mins",
      spiceLevel: "Medium",
      calories: "320 cal",
    },
    {
      id: "2",
      name: "Garlic Naan",
      description: "Soft and fluffy Indian flatbread with fresh garlic and herbs.",
      price: "₹80",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d9fb?w=400",
      category: "Breads",
      isVeg: true,
      preparationTime: "10-15 mins",
      calories: "180 cal",
    },
    {
      id: "3",
      name: "Vegetable Biryani",
      description: "Fragrant basmati rice cooked with fresh vegetables and aromatic spices.",
      price: "₹180",
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400",
      category: "Main Course",
      isVeg: true,
      bestseller: true,
      preparationTime: "25-30 mins",
      spiceLevel: "Mild",
      calories: "280 cal",
    },
    {
      id: "4",
      name: "Mango Lassi",
      description: "Refreshing yogurt drink with sweet mango pulp.",
      price: "₹120",
      image: "https://images.unsplash.com/photo-1568724001336-2101ca2a0f8e?w=400",
      category: "Beverages",
      isVeg: true,
      preparationTime: "5 mins",
      calories: "150 cal",
    },
    {
      id: "5",
      name: "Paneer Tikka",
      description: "Grilled cottage cheese cubes marinated in spices.",
      price: "₹220",
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400",
      category: "Starters",
      isVeg: true,
      bestseller: true,
      preparationTime: "15-20 mins",
      spiceLevel: "Medium",
      calories: "240 cal",
    },
    {
      id: "6",
      name: "Chocolate Brownie",
      description: "Decadent chocolate brownie with vanilla ice cream.",
      price: "₹150",
      image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400",
      category: "Desserts",
      isVeg: true,
      preparationTime: "10 mins",
      calories: "380 cal",
    },
  ];

  // Group menu by category
  const groupedMenu = sampleMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleAdd = (item) => {
    const cartItem = {
      ...item,
      restaurantName: restaurant.name,
      restaurantId: restaurant.id,
    };
    
    const success = addItem(cartItem);
    if (success) {
      // Show success feedback with haptic feedback
      Alert.alert("🎉 Added to cart!", `${item.name} has been added to your cart.`);
    }
  };

  const handleIncrement = (itemId) => {
    incrementItem(itemId);
  };

  const handleDecrement = (itemId) => {
    decrementItem(itemId);
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleFavorite = () => {
    setFavorite(!favorite);
  };

  // Animated values
  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [100, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolate: "extend",
  });

  const renderMenuItem = ({ item }) => {
    const quantity = getItemQuantity(item.id);

    return (
      <View style={styles.menuItem}>
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemInfo}>
            <View style={styles.menuItemHeader}>
              <View style={styles.vegNonVegContainer}>
                <View
                  style={[
                    styles.vegNonVegIndicator,
                    item.isVeg ? styles.vegIndicator : styles.nonVegIndicator,
                  ]}
                />
              </View>
              
              {item.bestseller && (
                <View style={styles.bestsellerTag}>
                  <Ionicons name="trophy" size={12} color="#FFD700" />
                  <Text style={styles.bestsellerText}>Bestseller</Text>
                </View>
              )}
            </View>

            <Text style={styles.menuItemName}>{item.name}</Text>
            <Text style={styles.menuItemPrice}>{item.price}</Text>
            
            <Text style={styles.menuItemDescription}>
              {item.description}
            </Text>

            <View style={styles.itemDetails}>
              {item.preparationTime && (
                <View style={styles.detailTag}>
                  <Ionicons name="time-outline" size={12} color="#666" />
                  <Text style={styles.detailText}>{item.preparationTime}</Text>
                </View>
              )}
              
              {item.spiceLevel && (
                <View style={styles.detailTag}>
                  <Ionicons name="flame-outline" size={12} color="#666" />
                  <Text style={styles.detailText}>{item.spiceLevel}</Text>
                </View>
              )}
              
              {item.calories && (
                <View style={styles.detailTag}>
                  <Ionicons name="nutrition-outline" size={12} color="#666" />
                  <Text style={styles.detailText}>{item.calories}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.menuItemAction}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.menuItemImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.menuItemImagePlaceholder}>
                <Ionicons name="fast-food" size={24} color="#999" />
              </View>
            )}

            <View style={styles.quantityContainer}>
              {quantity > 0 ? (
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleDecrement(item.id)}
                  >
                    <Ionicons name="remove" size={16} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleIncrement(item.id)}
                  >
                    <Ionicons name="add" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAdd(item)}
                >
                  <Text style={styles.addButtonText}>ADD</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderCategory = (category, index) => {
    const isExpanded = expandedCategories[category] !== false;
    
    return (
      <View key={index} style={styles.categorySection}>
        <TouchableOpacity 
          style={styles.categoryHeader}
          onPress={() => toggleCategory(category)}
          activeOpacity={0.7}
        >
          <View style={styles.categoryTitleContainer}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <Text style={styles.categoryItemCount}>
              {groupedMenu[category].length} items
            </Text>
          </View>
          <View style={styles.categoryIconContainer}>
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#8B5CF6" 
            />
          </View>
        </TouchableOpacity>
        
        {isExpanded && (
          <FlatList
            data={groupedMenu[category]}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    );
  };

  // Calculate cart totals
  const restaurantCartItems = cart.filter(
    (item) => item.restaurantId === restaurant.id
  );
  const totalItems = restaurantCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalAmount = restaurantCartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace("₹", "")) || 0;
    return sum + price * item.quantity;
  }, 0);

  const renderImage = () => {
    if (
      restaurant.image &&
      typeof restaurant.image === "string" &&
      !restaurant.image.startsWith("http")
    ) {
      return <Text style={styles.emojiImage}>{restaurant.image}</Text>;
    }
    return (
      <Animated.Image
        source={{
          uri:
            restaurant.image ||
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        }}
        style={[styles.headerImage, { transform: [{ scale: imageScale }] }]}
        resizeMode="cover"
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent />

      {/* Animated Header */}
      <Animated.View
        style={[styles.animatedHeader, { opacity: headerBackgroundOpacity }]}
      >
        <TouchableOpacity 
          style={styles.animatedBackButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Animated.Text 
          style={[styles.animatedTitle, { opacity: headerTitleOpacity }]}
          numberOfLines={1}
        >
          {restaurant.name}
        </Animated.Text>
        
        <TouchableOpacity 
          style={styles.animatedFavoriteButton}
          onPress={toggleFavorite}
        >
          <Ionicons 
            name={favorite ? "heart" : "heart-outline"} 
            size={22} 
            color={favorite ? "#EF4444" : "#333"} 
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Restaurant Header */}
        <View style={styles.header}>
          {renderImage()}
          <View style={styles.headerOverlay}>
            <View style={styles.headerTopActions}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={toggleFavorite}
              >
                <Ionicons 
                  name={favorite ? "heart" : "heart-outline"} 
                  size={22} 
                  color={favorite ? "#EF4444" : "#fff"} 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.headerContent}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.restaurantCuisine}>{restaurant.cuisine || "North Indian, Chinese"}</Text>

              <View style={styles.ratingContainer}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="#fff" />
                  <Text style={styles.rating}>{restaurant.rating || "4.2"}</Text>
                </View>
                <Text style={styles.ratingCount}>
                  ({restaurant.reviewsCount || "1.2k"}) • {restaurant.deliveryTime || "25-30 mins"}
                </Text>
              </View>

              <View style={styles.tagContainer}>
                {restaurant.isPureVeg && (
                  <View style={styles.vegTag}>
                    <Ionicons name="leaf" size={12} color="#fff" />
                    <Text style={styles.vegText}>Pure Veg</Text>
                  </View>
                )}
                {restaurant.noPackagingCharges && (
                  <View style={styles.ecoTag}>
                    <Ionicons name="earth" size={12} color="#fff" />
                    <Text style={styles.ecoText}>Eco Packaging</Text>
                  </View>
                )}
                <View style={styles.deliveryTag}>
                  <Ionicons name="bicycle" size={12} color="#fff" />
                  <Text style={styles.deliveryText}>Free Delivery</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Ionicons name="location" size={20} color="#8B5CF6" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Address</Text>
              <Text style={styles.infoSubtitle}>{restaurant.address || "Connaught Place, New Delhi"}</Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="time" size={20} color="#10B981" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Open Now</Text>
              <Text style={styles.infoSubtitle}>10:00 AM - 11:00 PM</Text>
            </View>
          </View>
        </View>

        {/* Safety Info Banner */}
        <View style={styles.safetyBanner}>
          <View style={styles.safetyIcon}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
          </View>
          <View style={styles.safetyTextContainer}>
            <Text style={styles.safetyTitle}>Safety Measures</Text>
            <Text style={styles.safetySubtitle}>
              Contactless delivery • Temperature checks • Masked staff
            </Text>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuContainer}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Menu</Text>
            {totalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems}</Text>
              </View>
            )}
          </View>

          {Object.keys(groupedMenu).length > 0 ? (
            Object.keys(groupedMenu).map((category, index) =>
              renderCategory(category, index)
            )
          ) : (
            <View style={styles.noMenuContainer}>
              <Ionicons name="restaurant" size={64} color="#E5E7EB" />
              <Text style={styles.noMenuText}>Menu items loading...</Text>
            </View>
          )}
        </View>

        <View style={styles.spacer} />
      </Animated.ScrollView>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <TouchableOpacity
          style={styles.floatingCart}
          onPress={() => navigation.navigate("Cart")}
          activeOpacity={0.9}
        >
          <View style={styles.cartContent}>
            <View style={styles.cartBadgeFloating}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
            <View style={styles.cartInfo}>
              <Text style={styles.cartCount}>
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
              </Text>
              <Text style={styles.cartTotal}>₹{totalAmount}</Text>
            </View>
            <View style={styles.viewCartButton}>
              <Text style={styles.viewCartText}>VIEW CART</Text>
              <Ionicons name="chevron-forward" size={16} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  // Animated Header
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#fff",
    zIndex: 1000,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: StatusBar.currentHeight,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingHorizontal: 16,
  },
  animatedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    flex: 1,
  },
  animatedBackButton: {
    padding: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  animatedFavoriteButton: {
    padding: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  // Header Section
  header: {
    height: 320,
    overflow: "hidden",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "space-between",
  },
  headerTopActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: StatusBar.currentHeight + 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    padding: 24,
    paddingBottom: 32,
  },
  restaurantName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
  },
  restaurantCuisine: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 16,
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  vegTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  ecoTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  deliveryTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(168, 85, 247, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  vegText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 4,
  },
  ecoText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 4,
  },
  deliveryText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 4,
  },
  // Info Cards
  infoCards: {
    padding: 16,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  infoSubtitle: {
    fontSize: 14,
    color: "#64748B",
  },
  // Safety Banner
  safetyBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3be2abff",
  },
  safetyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  safetyTextContainer: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#065F46",
    marginBottom: 2,
  },
  safetySubtitle: {
    fontSize: 14,
    color: "#047857",
  },
  // Menu Container
  menuContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  cartBadge: {
    backgroundColor: "#EF4444",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  // Category Sections
  categorySection: {
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#F8FAFC",
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  categoryItemCount: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  // Menu Items
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemContent: {
    flexDirection: "row",
    padding: 16,
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  vegNonVegContainer: {
    marginRight: 8,
  },
  vegNonVegIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  vegIndicator: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  nonVegIndicator: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  bestsellerTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bestsellerText: {
    fontSize: 11,
    color: "#D97706",
    fontWeight: "600",
    marginLeft: 4,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8B5CF6",
    marginBottom: 8,
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  itemDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
    marginLeft: 4,
  },
  menuItemAction: {
    alignItems: "center",
  },
  menuItemImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quantityContainer: {
    width: 100,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    padding: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    minWidth: 20,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  // Floating Cart
  floatingCart: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: "#1F2937",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cartContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartBadgeFloating: {
    backgroundColor: "#EF4444",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cartInfo: {
    flex: 1,
  },
  cartCount: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  viewCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  viewCartText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginRight: 4,
  },
  // Utility
  spacer: {
    height: 100,
  },
  noMenuContainer: {
    alignItems: "center",
    padding: 40,
  },
  noMenuText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 12,
  },
});

export default RestaurantDetails;