import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  Dimensions,
  useSafeAreaInsets
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useCart } from "../contexts/CartContext";

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const GUIDELINE_WIDTH = 375;
const GUIDELINE_HEIGHT = 812;

const scale = (size) => (width / GUIDELINE_WIDTH) * size;
const verticalScale = (size) => (height / GUIDELINE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Device height classification
const getDeviceHeightType = () => {
  if (height < 600) return 'small';
  if (height < 700) return 'medium';
  if (height < 800) return 'large';
  return 'xlarge';
};

const RestaurantMenu = () => {
  const route = useRoute();
  const { restaurant } = route.params;
  const insets = useSafeAreaInsets();
  const { 
    addItem, 
    getItemQuantity, 
    currentRestaurant, 
    updateQuantity,
    showRestaurantWarning,
    confirmRestaurantChange,
    dismissWarning
  } = useCart();

  const deviceHeightType = getDeviceHeightType();

  // Calculate bottom padding to avoid navbar overlap
  const getBottomPadding = () => {
    const baseTabBarHeight = verticalScale(80);
    const floatingButtonHeight = verticalScale(64);
    const safeAreaBottom = insets.bottom;
    
    return baseTabBarHeight + floatingButtonHeight + safeAreaBottom + verticalScale(20);
  };

  // Responsive spacing
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
      case 'small': return moderateScale(18);
      case 'medium': return moderateScale(20);
      case 'large': return moderateScale(22);
      case 'xlarge': return moderateScale(24);
      default: return moderateScale(20);
    }
  };

  // Sample menu data
  const sampleMenuItems = [
    {
      id: "1",
      name: "Butter Chicken",
      description: "Creamy tomato-based curry with tender chicken.",
      price: 12.99,
      image: "https://via.placeholder.com/80",
      category: "Main Course",
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    },
    {
      id: "2",
      name: "Naan Bread",
      description: "Soft and fluffy Indian flatbread.",
      price: 3.99,
      image: "https://via.placeholder.com/80",
      category: "Sides",
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    },
    {
      id: "3",
      name: "Vegetable Biryani",
      description: "Fragrant rice dish with mixed vegetables and spices.",
      price: 10.99,
      image: "https://via.placeholder.com/80",
      category: "Main Course",
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    },
    {
      id: "4",
      name: "Samosas",
      description: "Crispy pastries filled with spiced potatoes and peas.",
      price: 5.99,
      image: "https://via.placeholder.com/80",
      category: "Appetizers",
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    },
    {
      id: "5",
      name: "Mango Lassi",
      description: "Refreshing yogurt-based drink with mango.",
      price: 4.50,
      image: "https://via.placeholder.com/80",
      category: "Drinks",
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    },
  ];

  // Handle adding item to cart
  const handleAddToCart = (item) => {
    console.log('Adding item:', item);
    const success = addItem(item);
    
    if (success) {
      console.log(`Added ${item.name} to cart`);
    }
  };

  // Handle quantity updates
  const handleQuantityUpdate = (itemId, change) => {
    updateQuantity(itemId, change);
  };

  // Handle restaurant change confirmation
  const handleConfirmRestaurantChange = () => {
    confirmRestaurantChange();
  };

  // Handle cancel restaurant change
  const handleCancelRestaurantChange = () => {
    dismissWarning();
  };

  // Group menu items by category
  const groupedMenu = sampleMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const renderMenuItem = ({ item }) => {
    const quantityInCart = getItemQuantity(item.id);
    
    return (
      <View style={[styles.menuItem, {
        padding: moderateScale(12),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(12),
      }]}>
        <Image 
          source={{ uri: item.image }} 
          style={[styles.menuItemImage, {
            width: moderateScale(80),
            height: moderateScale(80),
            borderRadius: moderateScale(8),
            marginRight: moderateScale(12),
          }]} 
          resizeMode="cover" 
        />
        <View style={styles.menuItemInfo}>
          <Text style={[styles.menuItemName, { fontSize: moderateScale(16) }]}>
            {item.name}
          </Text>
          {item.description ? (
            <Text style={[styles.menuItemDescription, { fontSize: moderateScale(14) }]}>
              {item.description}
            </Text>
          ) : null}
          <Text style={[styles.menuItemPrice, { fontSize: moderateScale(16) }]}>
            ${item.price.toFixed(2)}
          </Text>
        </View>
        
        {quantityInCart > 0 ? (
          <View style={[styles.quantityContainer, {
            borderRadius: moderateScale(8),
            padding: moderateScale(4),
          }]}>
            <TouchableOpacity 
              style={[styles.quantityButton, {
                borderRadius: moderateScale(6),
                width: moderateScale(30),
                height: moderateScale(30),
              }]}
              onPress={() => handleQuantityUpdate(item.id, -1)}
            >
              <Text style={[styles.quantityButtonText, { fontSize: moderateScale(16) }]}>
                -
              </Text>
            </TouchableOpacity>
            <Text style={[styles.quantityText, { fontSize: moderateScale(16) }]}>
              {quantityInCart}
            </Text>
            <TouchableOpacity 
              style={[styles.quantityButton, {
                borderRadius: moderateScale(6),
                width: moderateScale(30),
                height: moderateScale(30),
              }]}
              onPress={() => handleQuantityUpdate(item.id, 1)}
            >
              <Text style={[styles.quantityButtonText, { fontSize: moderateScale(16) }]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.addButton, {
              borderRadius: moderateScale(8),
              paddingHorizontal: moderateScale(12),
              paddingVertical: moderateScale(8),
              minWidth: moderateScale(60),
              height: moderateScale(40),
            }]}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={[styles.addButtonText, { fontSize: moderateScale(14) }]}>
              Add
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderCategory = (category, index) => (
    <View key={index} style={[styles.categorySection, { marginBottom: verticalScale(24) }]}>
      <Text style={[styles.categoryTitle, { fontSize: moderateScale(18) }]}>
        {category}
      </Text>
      <FlatList
        data={groupedMenu[category]}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  const getHeaderImageHeight = () => {
    switch (deviceHeightType) {
      case 'small': return verticalScale(160);
      case 'medium': return verticalScale(180);
      case 'large': return verticalScale(200);
      case 'xlarge': return verticalScale(220);
      default: return verticalScale(200);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: getBottomPadding() }}
      >
        {/* Restaurant Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: restaurant.image }} 
            style={[styles.headerImage, { height: getHeaderImageHeight() }]} 
            resizeMode="cover" 
          />
          <View style={[styles.headerOverlay, { padding: moderateScale(20) }]}>
            <Text style={[styles.restaurantName, { fontSize: getTitleSize() }]}>
              {restaurant.name}
            </Text>
            <View style={[styles.headerDetails, { marginBottom: verticalScale(8) }]}>
              <Text style={[styles.restaurantCuisine, { fontSize: moderateScale(16) }]}>
                {restaurant.cuisine}
              </Text>
              <Text style={[styles.restaurantPrice, { fontSize: moderateScale(16) }]}>
                • {restaurant.price}
              </Text>
            </View>
            <View style={styles.deliveryInfo}>
              <Ionicons name="time-outline" size={moderateScale(14)} color="#fff" />
              <Text style={[styles.deliveryText, { fontSize: moderateScale(14) }]}>
                {restaurant.time}
              </Text>
              <Text style={[styles.distance, { fontSize: moderateScale(14) }]}>
                • {restaurant.distance}
              </Text>
            </View>
          </View>
        </View>

        {/* Cart Warning Banner */}
        {currentRestaurant && currentRestaurant !== restaurant.id && (
          <View style={[styles.warningBanner, {
            padding: moderateScale(12),
            marginHorizontal: moderateScale(16),
            marginTop: verticalScale(16),
            borderRadius: moderateScale(8),
          }]}>
            <Ionicons name="warning-outline" size={moderateScale(16)} color="#fff" />
            <Text style={[styles.warningText, { fontSize: moderateScale(14) }]}>
              Your cart contains items from another restaurant
            </Text>
          </View>
        )}

        {/* Menu Sections */}
        <View style={[styles.menuContainer, { padding: moderateScale(16) }]}>
          <Text style={[styles.menuTitle, { fontSize: getTitleSize() }]}>
            Menu
          </Text>
          {Object.keys(groupedMenu).map((category, index) => 
            renderCategory(category, index)
          )}
        </View>
      </ScrollView>

      {/* Restaurant Change Confirmation Modal */}
      <Modal
        visible={showRestaurantWarning}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {
            borderRadius: moderateScale(16),
            padding: moderateScale(24),
          }]}>
            <Ionicons name="warning" size={moderateScale(48)} color="#ff6b35" />
            <Text style={[styles.modalTitle, { fontSize: moderateScale(20) }]}>
              Clear Cart?
            </Text>
            <Text style={[styles.modalMessage, { fontSize: moderateScale(16) }]}>
              Your cart contains items from another restaurant. Adding items from {restaurant.name} will clear your current cart.
            </Text>
            <View style={[styles.modalButtons, { gap: moderateScale(12) }]}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, {
                  paddingVertical: verticalScale(12),
                  borderRadius: moderateScale(8),
                }]}
                onPress={handleCancelRestaurantChange}
              >
                <Text style={[styles.cancelButtonText, { fontSize: moderateScale(16) }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, {
                  paddingVertical: verticalScale(12),
                  borderRadius: moderateScale(8),
                }]}
                onPress={handleConfirmRestaurantChange}
              >
                <Text style={[styles.confirmButtonText, { fontSize: moderateScale(16) }]}>
                  Clear & Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: "relative",
  },
  headerImage: {
    width: "100%",
  },
  headerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingTop: verticalScale(40),
  },
  restaurantName: {
    fontWeight: "bold",
    color: "#fff",
    marginBottom: verticalScale(8),
  },
  headerDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  restaurantCuisine: {
    color: "#fff",
    fontWeight: "500",
  },
  restaurantPrice: {
    color: "#fff",
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryText: {
    color: "#fff",
    marginLeft: moderateScale(4),
  },
  distance: {
    color: "#fff",
  },
  warningBanner: {
    backgroundColor: "#ff6b35",
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    color: '#fff',
    marginLeft: moderateScale(8),
    fontWeight: '500',
  },
  menuContainer: {
    // padding handled inline
  },
  menuTitle: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: verticalScale(16),
  },
  categorySection: {
    // marginBottom handled inline
  },
  categoryTitle: {
    fontWeight: "600",
    color: "#333",
    marginBottom: verticalScale(12),
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItemImage: {
    // Styles handled inline
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  menuItemName: {
    fontWeight: "600",
    color: "#333",
    marginBottom: verticalScale(4),
  },
  menuItemDescription: {
    color: "#666",
    marginBottom: verticalScale(8),
    lineHeight: verticalScale(20),
  },
  menuItemPrice: {
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#ff6b35",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    alignSelf: 'center',
  },
  quantityButton: {
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: moderateScale(12),
    fontWeight: '600',
    minWidth: moderateScale(20),
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  modalContent: {
    backgroundColor: 'white',
    alignItems: 'center',
    width: '100%',
    maxWidth: moderateScale(400),
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  modalMessage: {
    color: '#666',
    textAlign: 'center',
    lineHeight: verticalScale(22),
    marginBottom: verticalScale(24),
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  confirmButton: {
    backgroundColor: '#ff6b35',
  },
  cancelButtonText: {
    color: '#64748b',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default RestaurantMenu;