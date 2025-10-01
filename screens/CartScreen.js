import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Device height classification
const getDeviceHeightType = () => {
  if (height < 600) return 'small';
  if (height < 700) return 'medium';
  if (height < 800) return 'large';
  return 'xlarge';
};

const CartScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { 
    cart, 
    removeItem, 
    incrementItem, 
    decrementItem, 
    clearCart, 
    totalItems, 
    subtotal,
    deliveryFee,
    tax,
    total,
    formattedSubtotal,
    formattedTotal,
    formattedDeliveryFee,
    formattedTax,
    currentRestaurant 
  } = useCart();

  const [isClearing, setIsClearing] = useState(false);
  const deviceHeightType = getDeviceHeightType();

  // Responsive spacing
  const getSpacing = () => {
    switch (deviceHeightType) {
      case 'small': return 6;
      case 'medium': return 8;
      case 'large': return 10;
      case 'xlarge': return 12;
      default: return 8;
    }
  };

  // Responsive font sizes
  const getTitleSize = () => {
    switch (deviceHeightType) {
      case 'small': return 16;
      case 'medium': return 17;
      case 'large': return 18;
      case 'xlarge': return 19;
      default: return 17;
    }
  };

  const getSubtitleSize = () => {
    switch (deviceHeightType) {
      case 'small': return 12;
      case 'medium': return 13;
      case 'large': return 14;
      case 'xlarge': return 14;
      default: return 13;
    }
  };

  const getBodySize = () => {
    switch (deviceHeightType) {
      case 'small': return 11;
      case 'medium': return 12;
      case 'large': return 13;
      case 'xlarge': return 14;
      default: return 12;
    }
  };

  // Calculate top padding for header
  const getTopPadding = () => {
    return insets.top + 8; // Safe area top + additional padding
  };

  // Calculate bottom padding to avoid navbar overlap
  const getBottomPadding = () => {
    const baseTabBarHeight = 80;
    const floatingButtonHeight = 64;
    const safeAreaBottom = insets.bottom;
    
    return baseTabBarHeight + floatingButtonHeight + safeAreaBottom + 30;
  };

  // Helper function to extract price as number
  const getPriceAsNumber = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      return parseFloat(price.replace(/[₹$,]/g, ''));
    }
    return 0;
  };

  // Helper function to format price display
  const formatPriceDisplay = (price) => {
    if (typeof price === 'number') return `₹${price.toFixed(2)}`;
    if (typeof price === 'string') return price;
    return '₹0.00';
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: () => {
            setIsClearing(true);
            clearCart();
            setTimeout(() => setIsClearing(false), 500);
          }
        }
      ]
    );
  };

  const renderCartItem = ({ item, index }) => {
    const itemPrice = getPriceAsNumber(item.price);
    const itemTotal = itemPrice * item.quantity;

    return (
      <View style={[styles.cartItem, { 
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
      }]}>
        <View style={styles.cartItemContent}>
          {item.image ? (
            <Image 
              source={{ uri: item.image }} 
              style={[styles.cartItemImage, { 
                width: 70,
                height: 70,
                borderRadius: 8,
              }]} 
            />
          ) : (
            <View style={[styles.cartItemImagePlaceholder, {
              width: 70,
              height: 70,
              borderRadius: 8,
            }]}>
              <Ionicons name="fast-food" size={20} color="#999" />
            </View>
          )}
          
          <View style={[styles.cartItemDetails, { marginLeft: 12 }]}>
            <View style={styles.itemHeader}>
              <Text style={[styles.cartItemName, { fontSize: getSubtitleSize() }]} numberOfLines={1}>
                {item.name}
              </Text>
              <TouchableOpacity 
                onPress={() => removeItem(item.id)} 
                style={styles.removeButton}
              >
                <Ionicons name="close" size={18} color="#999" />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.cartItemRestaurant, { fontSize: getBodySize() }]} numberOfLines={1}>
              {item.restaurantName}
            </Text>
            
            <Text style={[styles.cartItemDescription, { fontSize: getBodySize() }]} numberOfLines={2}>
              {item.description || "Delicious food item"}
            </Text>
            
            <View style={styles.priceContainer}>
              <Text style={[styles.cartItemPrice, { fontSize: getSubtitleSize() }]}>
                {formatPriceDisplay(item.price)}
              </Text>
              <Text style={[styles.itemTotal, { fontSize: getSubtitleSize() }]}>
                ₹{itemTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.quantityContainer, {
          borderRadius: 20,
          padding: 2,
        }]}>
          <TouchableOpacity 
            style={[
              styles.quantityButton, 
              { 
                borderRadius: 15,
                minWidth: 30,
              },
              item.quantity <= 1 && styles.quantityButtonDisabled
            ]}
            onPress={() => decrementItem(item.id)}
            disabled={item.quantity <= 1}
          >
            <Ionicons 
              name="remove" 
              size={16} 
              color={item.quantity <= 1 ? "#ccc" : "#ff6b35"} 
            />
          </TouchableOpacity>
          
          <View style={[styles.quantityDisplay, { minWidth: 35 }]}>
            <Text style={[styles.quantityText, { fontSize: getBodySize() }]}>
              {item.quantity}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.quantityButton,
              { 
                borderRadius: 15,
                minWidth: 30,
              }
            ]}
            onPress={() => incrementItem(item.id)}
          >
            <Ionicons name="add" size={16} color="#ff6b35" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleCheckout = () => {
    console.log('Checkout button pressed');
    console.log('Total items:', totalItems);
    console.log('Cart items:', cart.length);
    console.log('Current restaurant:', currentRestaurant);
    
    if (totalItems === 0) {
      Alert.alert('Cart Empty', 'Add some delicious items to checkout!');
      return;
    }
    
    console.log('Navigating to Checkout screen...');
    
    try {
      navigation.navigate('Checkout', {
        cartItems: cart,
        restaurantId: currentRestaurant,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        tax: tax,
        grandTotal: total
      });
      console.log('Navigation successful');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Unable to navigate to checkout. Please try again.');
    }
  };

  const handleContinueShopping = () => {
    if (currentRestaurant) {
      navigation.goBack();
    } else {
      navigation.popToTop();
    }
  };

  if (totalItems === 0) {
    const getEmptyIconSize = () => {
      switch (deviceHeightType) {
        case 'small': return 70;
        case 'medium': return 80;
        case 'large': return 90;
        case 'xlarge': return 100;
        default: return 80;
      }
    };

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.emptyContainer, { 
          paddingTop: getTopPadding() + 20, // Added top padding for empty state
          paddingBottom: getBottomPadding() 
        }]}>
          <View style={styles.emptyIllustration}>
            <Ionicons 
              name="cart-outline" 
              size={getEmptyIconSize()} 
              color="#e0e0e0" 
            />
          </View>
          <Text style={[styles.emptyTitle, { fontSize: getTitleSize() }]}>
            Your cart feels lonely
          </Text>
          <Text style={[styles.emptySubtitle, { fontSize: getBodySize() }]}>
            Add some delicious food from our restaurants
          </Text>
          <TouchableOpacity 
            style={[styles.shoppingButton, {
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 12,
            }]}
            onPress={handleContinueShopping}
          >
            <Ionicons name="restaurant" size={18} color="#fff" />
            <Text style={[styles.shoppingButtonText, { fontSize: getSubtitleSize() }]}>
              Start Ordering
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, {
        paddingTop: getTopPadding(), // Dynamic top padding based on safe area
        paddingBottom: 12,
      }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { fontSize: getTitleSize() }]}>
          My Cart ({totalItems})
        </Text>
        
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClearCart}
          disabled={isClearing}
        >
          <Ionicons 
            name="trash-outline" 
            size={20} 
            color={isClearing ? "#ccc" : "#ff4444"} 
          />
        </TouchableOpacity>
      </View>

      {/* Restaurant Info */}
      {cart.length > 0 && (
        <View style={[styles.restaurantHeader, {
          padding: 12,
          borderRadius: 10,
          marginTop: 12,
          marginHorizontal: 16,
        }]}>
          <Ionicons name="restaurant" size={16} color="#666" />
          <Text style={[styles.restaurantName, { fontSize: getBodySize() }]} numberOfLines={1}>
            Ordering from: {cart[0]?.restaurantName || 'Restaurant'}
          </Text>
        </View>
      )}

      {/* Cart Items */}
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { 
            paddingTop: 8, // Added top padding for the list
            paddingBottom: getBottomPadding() 
          }
        ]}
        style={styles.list}
      />

      {/* Order Summary */}
      <View style={[styles.footer, {
        padding: 16,
      }]}>
        <View style={[styles.summaryContainer, { marginBottom: 16 }]}>
          <Text style={[styles.summaryTitle, { fontSize: getTitleSize() }]}>
            Order Summary
          </Text>
          
          <View style={[styles.summaryRow, { marginBottom: 6 }]}>
            <Text style={[styles.summaryLabel, { fontSize: getBodySize() }]}>
              Subtotal ({totalItems} items)
            </Text>
            <Text style={[styles.summaryValue, { fontSize: getBodySize() }]}>
              {formattedSubtotal}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, { marginBottom: 6 }]}>
            <Text style={[styles.summaryLabel, { fontSize: getBodySize() }]}>
              Delivery Fee
            </Text>
            <Text style={[styles.summaryValue, { fontSize: getBodySize() }]}>
              {formattedDeliveryFee}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, { marginBottom: 6 }]}>
            <Text style={[styles.summaryLabel, { fontSize: getBodySize() }]}>
              Tax (5%)
            </Text>
            <Text style={[styles.summaryValue, { fontSize: getBodySize() }]}>
              {formattedTax}
            </Text>
          </View>
          
          <View style={[styles.divider, { marginVertical: 10 }]} />
          
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontSize: getSubtitleSize() }]}>
              Total Amount
            </Text>
            <Text style={[styles.totalValue, { fontSize: getTitleSize() }]}>
              {formattedTotal}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.checkoutButton, {
            borderRadius: 12,
            paddingVertical: 16,
          }]}
          onPress={handleCheckout}
        >
          <View style={styles.checkoutContent}>
            <Text style={[styles.checkoutText, { fontSize: getSubtitleSize() }]}>
              Proceed to Checkout
            </Text>
            <View style={styles.checkoutTotal}>
              <Text style={[styles.checkoutTotalText, { fontSize: getSubtitleSize() }]}>
                {formattedTotal}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 6,
    marginLeft: -6,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  clearButton: {
    padding: 6,
    marginRight: -6,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8f6',
    borderLeftWidth: 3,
    borderLeftColor: '#ff6b35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  restaurantName: {
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    // paddingTop handled inline
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#f8f9fa',
  },
  emptyIllustration: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  shoppingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b35',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shoppingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cartItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f8f8f8',
  },
  cartItemContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cartItemImage: {
    // Styles handled inline
  },
  cartItemImagePlaceholder: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cartItemName: {
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 2,
    marginTop: -2,
  },
  cartItemRestaurant: {
    color: '#666',
    marginBottom: 4,
  },
  cartItemDescription: {
    color: '#999',
    lineHeight: 14,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemPrice: {
    fontWeight: 'bold',
    color: '#333',
  },
  itemTotal: {
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  quantityButton: {
    padding: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#f9f9f9',
  },
  quantityDisplay: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  quantityText: {
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  summaryContainer: {
    // marginBottom handled inline
  },
  summaryTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#666',
  },
  summaryValue: {
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  checkoutButton: {
    backgroundColor: '#ff6b35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  checkoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkoutTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  checkoutTotalText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CartScreen;