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

const RestaurantDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { restaurant } = route.params;
  const { addItem, removeItem, updateQuantity, cart } = useCart();
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
      const newQty = Math.max(0, existing.quantity + delta);
      if (newQty === 0) {
        removeItem(itemId);
      } else {
        updateQuantity(itemId, newQty);
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
      <View style={styles.menuItem}>
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemInfo}>
            {item.bestseller && (
              <View style={styles.bestsellerTag}>
                <Ionicons name="trophy" size={12} color="#FFD700" />
                <Text style={styles.bestsellerText}>Bestseller</Text>
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

            <Text style={styles.menuItemName}>{item.name}</Text>
            <Text style={styles.menuItemPrice}>{item.price}</Text>
            {item.description ? (
              <Text style={styles.menuItemDescription}>
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
              <View style={styles.menuItemImagePlaceholder}>
                <Ionicons name="fast-food" size={24} color="#999" />
              </View>
            )}

            <View style={styles.quantityContainer}>
              {quantity > 0 ? (
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item.id, -1)}
                  >
                    <Ionicons name="remove" size={20} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item.id, 1)}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
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

  const renderCategory = (category, index) => (
    <View key={index} style={styles.categorySection}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <Text style={styles.categoryItemCount}>
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
      return <Text style={styles.emojiImage}>{restaurant.image}</Text>;
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
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent />

      {/* Animated Header Background */}
      <Animated.View
        style={[styles.animatedHeader, { opacity: headerBackgroundOpacity }]}
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>

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

              <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>

              <View style={styles.deliveryInfo}>
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={16} color="#fff" />
                  <Text style={styles.infoText}>{restaurant.time}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="navigate-outline" size={16} color="#fff" />
                  <Text style={styles.infoText}>{restaurant.distance}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="cash-outline" size={16} color="#fff" />
                  <Text style={styles.infoText}>{restaurant.price}</Text>
                </View>
              </View>

              <View style={styles.tagContainer}>
                {restaurant.discount && (
                  <View style={styles.discountTag}>
                    <Ionicons name="pricetag" size={12} color="#fff" />
                    <Text style={styles.discountText}>
                      {restaurant.discount}
                    </Text>
                  </View>
                )}
                {restaurant.isPureVeg && (
                  <View style={styles.vegTag}>
                    <Ionicons name="leaf" size={12} color="#fff" />
                    <Text style={styles.vegText}>Pure Veg</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Safety Info Banner */}
        <View style={styles.safetyBanner}>
          <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
          <Text style={styles.safetyText}>
            Follows all safety measures for a safe dining experience
          </Text>
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
              <Ionicons name="restaurant" size={64} color="#ddd" />
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
        >
          <View style={styles.cartContent}>
            <View style={styles.cartBadgeFloating}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
            <View style={styles.cartInfo}>
              <Text style={styles.cartCount}>
                View Cart • {totalItems} items
              </Text>
              <Text style={styles.cartTotal}>₹{totalAmount}</Text>
            </View>
            <View style={styles.viewCartButton}>
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
    backgroundColor: "#fff",
  },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#fff",
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
  emojiImage: {
    width: "100%",
    height: "100%",
    fontSize: 100,
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: "#f8f8f8",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  restaurantCuisine: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 12,
    opacity: 0.9,
  },
  deliveryInfo: {
    flexDirection: "row",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 4,
    opacity: 0.9,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  discountTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 87, 34, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  discountText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 4,
  },
  vegTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.9)",
    paddingHorizontal: 10,
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
  safetyBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F8E9",
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
    color: "#4CAF50",
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
    borderBottomColor: "#f0f0f0",
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  cartBadge: {
    backgroundColor: "#E23E3E",
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
    color: "#333",
  },
  categoryItemCount: {
    fontSize: 14,
    color: "#666",
  },
  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
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
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  bestsellerText: {
    fontSize: 10,
    color: "#FF8F00",
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
    color: "#333",
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  menuItemDescription: {
    fontSize: 13,
    color: "#666",
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
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityContainer: {
    alignItems: "center",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E23E3E",
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
    backgroundColor: "#E23E3E",
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
    color: "#666",
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
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cartContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartBadgeFloating: {
    backgroundColor: "#E23E3E",
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
    color: "#fff",
    opacity: 0.9,
  },
  cartTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 2,
  },
  viewCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E23E3E",
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