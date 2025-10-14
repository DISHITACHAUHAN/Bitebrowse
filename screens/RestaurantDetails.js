import React, { useRef } from "react";
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
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useCart } from "../contexts/CartContext";
import { useTheme } from "../contexts/ThemeContext";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const RestaurantDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { restaurant } = route.params;
  const { addItem, removeItem, incrementItem, decrementItem, cart } = useCart();
  const { colors } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Sample menu data
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
    },
    {
      id: "2",
      name: "Garlic Naan",
      description: "Soft and fluffy Indian flatbread with fresh garlic and herbs.",
      price: "₹80",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d9fb?w=400",
      category: "Breads",
      isVeg: true,
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
    },
    {
      id: "4",
      name: "Mango Lassi",
      description: "Refreshing yogurt drink with sweet mango pulp.",
      price: "₹120",
      image: "https://images.unsplash.com/photo-1568724001336-2101ca2a0f8e?w=400",
      category: "Beverages",
      isVeg: true,
    },
    {
      id: "5",
      name: "Paneer Tikka",
      description: "Grilled cottage cheese cubes marinated in spices.",
      price: "₹220",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
      category: "Starters",
      isVeg: true,
      bestseller: true,
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
    addItem(cartItem);
  };

  const handleIncrement = (itemId) => {
    incrementItem(itemId);
  };

  const handleDecrement = (itemId) => {
    const existing = cart.find((item) => item.id === itemId);
    if (existing) {
      if (existing.quantity === 1) {
        removeItem(itemId);
      } else {
        decrementItem(itemId);
      }
    }
  };

  // Animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [320, 120],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  const renderMenuItem = ({ item }) => {
    const existingItem = cart.find((cItem) => cItem.id === item.id);
    const quantity = existingItem ? existingItem.quantity : 0;

    return (
      <View style={[styles.menuItem, { 
        backgroundColor: colors.card,
        shadowColor: colors.text 
      }]}>
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemInfo}>
            <View style={styles.menuItemHeader}>
              <View style={styles.vegNonVegIndicator}>
                <View
                  style={[
                    styles.indicator,
                    item.isVeg ? styles.vegIndicator : styles.nonVegIndicator,
                  ]}
                />
              </View>
              {item.bestseller && (
                <View style={[styles.bestsellerTag, { backgroundColor: '#FFF8E1' }]}>
                  <Ionicons name="trophy" size={12} color="#FFD700" />
                  <Text style={[styles.bestsellerText, { color: '#FF8F00' }]}>
                    Bestseller
                  </Text>
                </View>
              )}
            </View>

            <Text style={[styles.menuItemName, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.menuItemDescription, { color: colors.textSecondary }]}>
              {item.description}
            </Text>
            <Text style={[styles.menuItemPrice, { color: colors.primary }]}>
              {item.price}
            </Text>
          </View>

          <View style={styles.menuItemAction}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.menuItemImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.menuItemImagePlaceholder, { backgroundColor: colors.background }]}>
                <Ionicons name="fast-food" size={24} color={colors.textSecondary} />
              </View>
            )}

            <View style={styles.quantityContainer}>
              {quantity > 0 ? (
                <View style={[styles.quantityControls, { backgroundColor: colors.primary }]}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleDecrement(item.id)}
                  >
                    <Ionicons name="remove" size={18} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleIncrement(item.id)}
                  >
                    <Ionicons name="add" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.addButton, { 
                    backgroundColor: colors.primary,
                    shadowColor: colors.primary 
                  }]}
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

  const renderCategory = (category, index) => (
    <View key={index} style={styles.categorySection}>
      <LinearGradient
        colors={['transparent', 'rgba(139, 51, 88, 0.1)', 'transparent']}
        style={styles.categoryHeader}
      >
        <Text style={[styles.categoryTitle, { color: colors.text }]}>
          {category}
        </Text>
        <Text style={[styles.categoryItemCount, { color: colors.textSecondary }]}>
          {groupedMenu[category].length} items
        </Text>
      </LinearGradient>
      <FlatList
        data={groupedMenu[category]}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

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
      return (
        <View style={[styles.emojiContainer, { backgroundColor: '#8B3358' }]}>
          <Text style={styles.emojiImage}>{restaurant.image}</Text>
        </View>
      );
    }
    return (
      <Animated.Image
        source={{
          uri: restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
        }}
        style={[styles.headerImage, { opacity: imageOpacity }]}
        resizeMode="cover"
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        backgroundColor="transparent" 
        translucent 
        barStyle="light-content"
      />

      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={["#8B3358", "#670D2F", "#3A081C"]}
          style={StyleSheet.absoluteFill}
        >
          {renderImage()}
        </LinearGradient>
        
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
            style={styles.backButtonGradient}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Restaurant Info Overlay */}
        <View style={styles.headerOverlay}>
          <Animated.View style={[
            styles.headerContent,
            { 
              transform: [
                { scale: titleScale },
                { translateY: titleTranslateY }
              ]
            }
          ]}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.ratingContainer}>
              <LinearGradient
                colors={["#FFD700", "#FFA000"]}
                style={styles.ratingBadge}
              >
                <Ionicons name="star" size={14} color="#fff" />
                <Text style={styles.rating}>{restaurant.rating}</Text>
              </LinearGradient>
              <Text style={styles.ratingCount}>({restaurant.reviewsCount})</Text>
              <Text style={styles.ratingDivider}>•</Text>
              <Text style={styles.cuisineType}>{restaurant.cuisine || "Indian Cuisine"}</Text>
            </View>
          </Animated.View>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Safety Info Banner */}
        <View style={styles.safetyBanner}>
          <LinearGradient
            colors={["#4CAF50", "#45a049"]}
            style={styles.safetyGradient}
          >
            <Ionicons name="shield-checkmark" size={18} color="#fff" />
            <Text style={styles.safetyText}>
              Follows all safety measures for a safe dining experience
            </Text>
          </LinearGradient>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuContainer}>
          <View style={[styles.menuHeader, { 
            borderBottomColor: colors.border 
          }]}>
            <Text style={[styles.menuTitle, { color: colors.text }]}>
              Featured Menu
            </Text>
            {totalItems > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: colors.primary }]}>
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
              <Ionicons name="restaurant" size={64} color={colors.textSecondary} />
              <Text style={[styles.noMenuText, { color: colors.textSecondary }]}>
                Menu items loading...
              </Text>
            </View>
          )}
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <TouchableOpacity
          style={styles.floatingCart}
          onPress={() => navigation.navigate("Cart")}
        >
          <LinearGradient
            colors={["#8B3358", "#670D2F"]}
            style={styles.cartGradient}
          >
            <View style={styles.cartContent}>
              <View style={styles.cartBadgeFloating}>
                <Text style={styles.cartBadgeText}>{totalItems}</Text>
              </View>
              <View style={styles.cartInfo}>
                <Text style={styles.cartCount}>
                  {totalItems} items in cart
                </Text>
                <Text style={styles.cartTotal}>
                  ₹{totalAmount}
                </Text>
              </View>
              <View style={styles.viewCartButton}>
                <Text style={styles.viewCartText}>VIEW CART</Text>
                <Ionicons name="chevron-forward" size={16} color="#fff" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: "relative",
    overflow: "hidden",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
  emojiContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  emojiImage: {
    fontSize: 80,
    color: '#fff',
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },
  backButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: 'blur(10px)',
  },
  headerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    transformOrigin: 'left bottom',
  },
  restaurantName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: 'wrap',
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  rating: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    marginRight: 8,
  },
  ratingDivider: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.7,
    marginHorizontal: 4,
  },
  cuisineType: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  safetyBanner: {
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  safetyGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  safetyText: {
    fontSize: 13,
    color: "#fff",
    marginLeft: 10,
    fontWeight: "600",
    flex: 1,
  },
  menuContainer: {
    padding: 20,
    paddingTop: 30,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  cartBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 28,
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  categorySection: {
    marginBottom: 40,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  categoryItemCount: {
    fontSize: 14,
    fontWeight: "500",
  },
  menuItem: {
    borderRadius: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  menuItemContent: {
    flexDirection: "row",
    padding: 20,
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  vegNonVegIndicator: {
    marginRight: 10,
  },
  indicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  vegIndicator: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  nonVegIndicator: {
    backgroundColor: "#E23E3E",
    borderColor: "#E23E3E",
  },
  bestsellerTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  bestsellerText: {
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 4,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  menuItemDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  menuItemAction: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  menuItemImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityContainer: {
    marginTop: 12,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    padding: 6,
    minWidth: 100,
    justifyContent: 'space-between',
  },
  quantityButton: {
    padding: 6,
    borderRadius: 20,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: "center",
  },
  addButton: {
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  noMenuContainer: {
    alignItems: "center",
    padding: 60,
  },
  noMenuText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 16,
  },
  spacer: {
    height: 120,
  },
  floatingCart: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  cartGradient: {
    padding: 20,
    borderRadius: 20,
  },
  cartContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartBadgeFloating: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backdropFilter: 'blur(10px)',
  },
  cartInfo: {
    flex: 1,
  },
  cartCount: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 2,
  },
  viewCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backdropFilter: 'blur(10px)',
  },
  viewCartText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 4,
  },
});

export default RestaurantDetails;