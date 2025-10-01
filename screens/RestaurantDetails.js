import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useCart } from "../contexts/CartContext";
import { scale, verticalScale, moderateScale, getDeviceHeightType } from "./HomeScreen";

const RestaurantMenu = () => {
  const route = useRoute();
  const { restaurant } = route.params;
  const { addItem, removeItem,decrementItem, getItemQuantity, currentRestaurant } = useCart();

  const deviceHeightType = getDeviceHeightType();

  // Sample menu data
  const sampleMenuItems = [
    {
      id: "1",
      name: "Butter Chicken",
      description: "Creamy tomato-based curry with tender chicken.",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop",
      category: "Main Course",
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    },
    {
      id: "2",
      name: "Naan Bread",
      description: "Soft and fluffy Indian flatbread.",
      price: 3.99,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop",
      category: "Sides",
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    },
    {
      id: "3",
      name: "Vegetable Biryani",
      description: "Fragrant rice dish with mixed vegetables and spices.",
      price: 10.99,
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop",
      category: "Main Course",
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    },
    {
      id: "4",
      name: "Samosas",
      description: "Crispy pastries filled with spiced potatoes and peas.",
      price: 5.99,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop",
      category: "Appetizers",
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    },
    {
      id: "5",
      name: "Mango Lassi",
      description: "Refreshing yogurt-based drink with mango.",
      price: 4.50,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop",
      category: "Drinks",
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    },
  ];

  // Responsive spacing
  const getSpacing = () => {
    switch (deviceHeightType) {
      case 'small': return verticalScale(6);
      case 'medium': return verticalScale(8);
      case 'large': return verticalScale(10);
      case 'xlarge': return verticalScale(12);
      default: return verticalScale(8);
    }
  };

  // Responsive font sizes
  const getTitleSize = () => {
    switch (deviceHeightType) {
      case 'small': return moderateScale(14);
      case 'medium': return moderateScale(16);
      case 'large': return moderateScale(18);
      case 'xlarge': return moderateScale(20);
      default: return moderateScale(16);
    }
  };

  const getSubtitleSize = () => {
    switch (deviceHeightType) {
      case 'small': return moderateScale(10);
      case 'medium': return moderateScale(12);
      case 'large': return moderateScale(14);
      case 'xlarge': return moderateScale(14);
      default: return moderateScale(12);
    }
  };

  const getBodySize = () => {
    switch (deviceHeightType) {
      case 'small': return moderateScale(9);
      case 'medium': return moderateScale(11);
      case 'large': return moderateScale(12);
      case 'xlarge': return moderateScale(13);
      default: return moderateScale(11);
    }
  };

  // Handle adding item to cart
  const handleAddToCart = (item) => {
    const success = addItem(item, { showAlert: true });
    if (success) {
      console.log(`Added ${item.name} to cart`);
    }
  };

  // Handle removing item from cart
  const handleRemoveFromCart = (itemId) => {
    decrementItem(itemId);
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
        marginBottom: getSpacing(),
        borderRadius: moderateScale(12),
        padding: moderateScale(12),
      }]}>
        <Image 
          source={{ uri: item.image }} 
          style={[styles.menuItemImage, { 
            width: moderateScale(70),
            height: moderateScale(70),
            borderRadius: moderateScale(8),
            marginRight: moderateScale(10),
          }]} 
          resizeMode="cover" 
        />
        <View style={[styles.menuItemInfo, { flex: 1 }]}>
          <Text style={[styles.menuItemName, { fontSize: getSubtitleSize() }]}>
            {item.name}
          </Text>
          {item.description ? (
            <Text style={[styles.menuItemDescription, { fontSize: getBodySize() }]}>
              {item.description}
            </Text>
          ) : null}
          <Text style={[styles.menuItemPrice, { fontSize: getSubtitleSize() }]}>
            ₹{item.price.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.quantityControls}>
          {quantityInCart > 0 ? (
            <View style={[styles.quantityContainer, {
              borderRadius: moderateScale(20),
              padding: moderateScale(2),
            }]}>
              <TouchableOpacity 
                style={[styles.quantityButton, {
                  borderRadius: moderateScale(16),
                  width: moderateScale(28),
                  height: moderateScale(28),
                }]}
                onPress={() => handleRemoveFromCart(item.id)}
              >
                <Text style={[styles.quantityButtonText, { fontSize: moderateScale(16) }]}>
                  -
                </Text>
              </TouchableOpacity>
              <Text style={[styles.quantityText, { fontSize: moderateScale(14) }]}>
                {quantityInCart}
              </Text>
              <TouchableOpacity 
                style={[styles.quantityButton, {
                  borderRadius: moderateScale(16),
                  width: moderateScale(28),
                  height: moderateScale(28),
                }]}
                onPress={() => handleAddToCart(item)}
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
                paddingHorizontal: moderateScale(16),
                paddingVertical: moderateScale(8),
                minWidth: moderateScale(60),
              }]}
              onPress={() => handleAddToCart(item)}
            >
              <Text style={[styles.addButtonText, { fontSize: moderateScale(12) }]}>
                ADD
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderCategory = (category, index) => (
    <View key={index} style={[styles.categorySection, { marginBottom: verticalScale(20) }]}>
      <Text style={[styles.categoryTitle, { fontSize: getTitleSize() }]}>
        {category}
      </Text>
      <FlatList
        data={groupedMenu[category]}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  // Get header image height based on device
  const getHeaderImageHeight = () => {
    switch (deviceHeightType) {
      case 'small': return verticalScale(150);
      case 'medium': return verticalScale(180);
      case 'large': return verticalScale(200);
      case 'xlarge': return verticalScale(220);
      default: return verticalScale(180);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Restaurant Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: restaurant.image }} 
            style={[styles.headerImage, { 
              height: getHeaderImageHeight() 
            }]} 
            resizeMode="cover" 
          />
          <View style={[styles.headerOverlay, { 
            padding: moderateScale(16),
            paddingTop: verticalScale(30),
          }]}>
            <Text style={[styles.restaurantName, { fontSize: getTitleSize() }]}>
              {restaurant.name}
            </Text>
            <View style={[styles.headerDetails, { marginBottom: verticalScale(6) }]}>
              <Text style={[styles.restaurantCuisine, { fontSize: getSubtitleSize() }]}>
                {restaurant.tags?.join(', ') || 'Indian, Asian'}
              </Text>
              <Text style={[styles.restaurantPrice, { fontSize: getSubtitleSize() }]}>
                • {restaurant.deliveryFee || '₹40'}
              </Text>
            </View>
            <View style={styles.deliveryInfo}>
              <Ionicons name="time-outline" size={moderateScale(12)} color="#fff" />
              <Text style={[styles.deliveryText, { fontSize: getBodySize() }]}>
                {restaurant.time || '25-35 min'}
              </Text>
              <Text style={[styles.distance, { fontSize: getBodySize() }]}>
                • {restaurant.distance || '2.5 km'}
              </Text>
            </View>
          </View>
        </View>

        {/* Cart Warning Banner */}
        {currentRestaurant && currentRestaurant !== restaurant.id && (
          <View style={[styles.warningBanner, {
            padding: moderateScale(10),
            marginHorizontal: moderateScale(16),
            marginTop: verticalScale(12),
            borderRadius: moderateScale(8),
          }]}>
            <Ionicons name="warning-outline" size={moderateScale(14)} color="#fff" />
            <Text style={[styles.warningText, { fontSize: moderateScale(12) }]}>
              Your cart contains items from another restaurant
            </Text>
          </View>
        )}

        {/* Menu Sections */}
        <View style={[styles.menuContainer, { 
          padding: moderateScale(16),
          paddingBottom: verticalScale(100), // Extra padding for bottom space
        }]}>
          <Text style={[styles.menuTitle, { 
            fontSize: getTitleSize(),
            marginBottom: verticalScale(16),
          }]}>
            Menu
          </Text>
          {Object.keys(groupedMenu).map((category, index) => 
            renderCategory(category, index)
          )}
        </View>
      </ScrollView>
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
  scrollViewContent: {
    flexGrow: 1,
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  restaurantName: {
    fontWeight: "bold",
    color: "#fff",
    marginBottom: verticalScale(4),
  },
  headerDetails: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: 'wrap',
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
    marginLeft: moderateScale(6),
    fontWeight: '500',
    flex: 1,
  },
  menuContainer: {
    // padding handled inline
  },
  menuTitle: {
    fontWeight: "bold",
    color: "#333",
  },
  categorySection: {
    // marginBottom handled inline
  },
  categoryTitle: {
    fontWeight: "600",
    color: "#333",
    marginBottom: verticalScale(8),
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    alignItems: 'center',
  },
  menuItemInfo: {
    justifyContent: "space-between",
  },
  menuItemName: {
    fontWeight: "600",
    color: "#333",
    marginBottom: verticalScale(2),
  },
  menuItemDescription: {
    color: "#666",
    marginBottom: verticalScale(4),
    lineHeight: moderateScale(16),
  },
  menuItemPrice: {
    fontWeight: "bold",
    color: "#333",
  },
  quantityControls: {
    alignSelf: 'flex-start',
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
    backgroundColor: '#ff6b35',
    alignSelf: 'center',
  },
  quantityButton: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#ff6b35',
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: moderateScale(8),
    fontWeight: '600',
    color: '#fff',
    minWidth: moderateScale(20),
    textAlign: 'center',
  },
});

export default RestaurantMenu;