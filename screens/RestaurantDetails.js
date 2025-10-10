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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useCart } from "../contexts/CartContext";
import { useTheme } from "../contexts/ThemeContext"; // Import theme hook

const RestaurantDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { restaurant } = route.params;
  const { addItem, removeItem, incrementItem, decrementItem, cart } = useCart();
  const { colors } = useTheme(); // Get theme colors
  const scrollY = useRef(new Animated.Value(0)).current;

  // Sample menu data
  const sampleMenuItems = [
    {
      id: "1",
      name: "Butter Chicken",
      description:
        "Creamy tomato-based curry with tender chicken pieces, cooked in rich spices.",
      price: "₹250",
      image:
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
      category: "Main Course",
      isVeg: false,
      bestseller: true,
    },
    {
      id: "2",
      name: "Garlic Naan",
      description:
        "Soft and fluffy Indian flatbread with fresh garlic and herbs.",
      price: "₹80",
      image:
        "https://images.unsplash.com/photo-1563379091339-03246963d9fb?w=400",
      category: "Breads",
      isVeg: true,
    },
    {
      id: "3",
      name: "Vegetable Biryani",
      description:
        "Fragrant basmati rice cooked with fresh vegetables and aromatic spices.",
      price: "₹180",
      image:
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400",
      category: "Main Course",
      isVeg: true,
      bestseller: true,
    },
    {
      id: "4",
      name: "Mango Lassi",
      description: "Refreshing yogurt drink with sweet mango pulp.",
      price: "₹120",
      image:
        "https://images.unsplash.com/photo-1568724001336-2101ca2a0f8e?w=400",
      category: "Beverages",
      isVeg: true,
    },
    {
      id: "5",
      name: "Paneer Tikka",
      description: "Grilled cottage cheese cubes marinated in spices.",
      price: "₹220",
      image:
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
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

  const handleQuantityChange = (itemId, delta) => {
    const existing = cart.find((item) => item.id === itemId);
    if (existing) {
      if (delta > 0) {
        // Increment
        incrementItem(itemId);
      } else if (delta < 0) {
        // Decrement
        const newQty = existing.quantity - 1;
        if (newQty === 0) {
          removeItem(itemId);
        } else {
          decrementItem(itemId);
        }
      }
    }
  };

  // Simplified version - you can also use this approach:
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

  // Animated header background
  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const renderMenuItem = ({ item }) => {
    const existingItem = cart.find((cItem) => cItem.id === item.id);
    const quantity = existingItem ? existingItem.quantity : 0;

    return (
      <View style={[styles.menuItem, { 
        backgroundColor: colors.card,
        borderColor: colors.border 
      }]}>
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemInfo}>
            {item.bestseller && (
              <View style={[styles.bestsellerTag, { backgroundColor: colors.isDark ? '#2a2000' : '#FFF8E1' }]}>
                <Ionicons name="trophy" size={12} color="#FFD700" />
                <Text style={[styles.bestsellerText, { color: colors.isDark ? '#FFD700' : '#FF8F00' }]}>
                  Bestseller
                </Text>
              </View>
            )}

            <View style={styles.vegNonVegIndicator}>
              <View
                style={[
                  styles.indicator,
                  item.isVeg ? styles.vegIndicator : styles.nonVegIndicator,
                ]}
              />
            </View>

            <Text style={[styles.menuItemName, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.menuItemPrice, { color: colors.text }]}>
              {item.price}
            </Text>
            {item.description ? (
              <Text style={[styles.menuItemDescription, { color: colors.textSecondary }]}>
                {item.description}
              </Text>
            ) : null}

            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.menuItemImage}
                resizeMode="cover"
              />
            ) : null}
          </View>

          <View style={styles.menuItemAction}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.menuItemImageSmall}
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
                    <Ionicons name="remove" size={20} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleIncrement(item.id)}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: colors.primary }]}
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
      <View style={styles.categoryHeader}>
        <Text style={[styles.categoryTitle, { color: colors.text }]}>
          {category}
        </Text>
        <Text style={[styles.categoryItemCount, { color: colors.textSecondary }]}>
          ({groupedMenu[category].length} items)
        </Text>
      </View>
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
        <View style={[styles.emojiContainer, { backgroundColor: colors.card }]}>
          <Text style={styles.emojiImage}>{restaurant.image}</Text>
        </View>
      );
    }
    return (
      <Image
        source={{
          uri:
            restaurant.image ||
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
        }}
        style={styles.headerImage}
        resizeMode="cover"
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        backgroundColor="transparent" 
        translucent 
        barStyle={colors.isDark ? 'light-content' : 'dark-content'}
      />

      {/* Animated Header Background */}
      <Animated.View
        style={[styles.animatedHeader, { 
          opacity: headerBackgroundOpacity,
          backgroundColor: colors.card 
        }]}
      />


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
            <View style={styles.headerContent}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>

              <View style={styles.ratingContainer}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="#fff" />
                  <Text style={styles.rating}>{restaurant.rating}</Text>
                </View>
                <Text style={styles.ratingCount}>
                  ({restaurant.reviewsCount})
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Safety Info Banner */}
        <View style={[styles.safetyBanner, { backgroundColor: colors.isDark ? '#1b2a1b' : '#F1F8E9' }]}>
          <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
          <Text style={[styles.safetyText, { color: colors.isDark ? '#a5d6a7' : '#4CAF50' }]}>
            Follows all safety measures for a safe dining experience
          </Text>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuContainer}>
          <View style={[styles.menuHeader, { 
            borderBottomColor: colors.border 
          }]}>
            <Text style={[styles.menuTitle, { color: colors.text }]}>
              Menu
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
      </Animated.ScrollView>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <TouchableOpacity
          style={[styles.floatingCart, { 
            backgroundColor: colors.card,
            shadowColor: colors.text 
          }]}
          onPress={() => navigation.navigate("Cart")}
        >
          <View style={styles.cartContent}>
            <View style={[styles.cartBadgeFloating, { backgroundColor: colors.primary }]}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
            <View style={styles.cartInfo}>
              <Text style={[styles.cartCount, { color: colors.text }]}>
                View Cart • {totalItems} items
              </Text>
              <Text style={[styles.cartTotal, { color: colors.text }]}>
                ₹{totalAmount}
              </Text>
            </View>
            <View style={[styles.viewCartButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.viewCartText}>PROCEED</Text>
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
  },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: "relative",
    height: 320,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  emojiContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  emojiImage: {
    fontSize: 100,
    textAlign: "center",
    textAlignVertical: "center",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingTop: StatusBar.currentHeight,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  headerContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
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
  },
  safetyBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  safetyText: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: "500",
  },
  menuContainer: {
    padding: 16,
    paddingTop: 24,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  cartBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  categoryItemCount: {
    fontSize: 14,
  },
  menuItem: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  menuItemContent: {
    flexDirection: "row",
    padding: 16,
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  bestsellerTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  bestsellerText: {
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 4,
  },
  vegNonVegIndicator: {
    marginBottom: 8,
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
  menuItemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  menuItemDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  menuItemImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginTop: 12,
  },
  menuItemAction: {
    alignItems: "center",
  },
  menuItemImageSmall: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityContainer: {
    alignItems: "center",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 4,
  },
  quantityButton: {
    padding: 4,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
  addButton: {
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  noMenuContainer: {
    alignItems: "center",
    padding: 40,
  },
  noMenuText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 12,
  },
  spacer: {
    height: 100,
  },
  floatingCart: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    padding: 16,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cartContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartBadgeFloating: {
    borderRadius: 10,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cartInfo: {
    flex: 1,
  },
  cartCount: {
    fontSize: 14,
    opacity: 0.9,
  },
  cartTotal: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
  viewCartButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  viewCartText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 4,
  },
});

export default RestaurantDetails;