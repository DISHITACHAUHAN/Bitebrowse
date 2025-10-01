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
import CartStack from '../navigation/CartStack';

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

  // Calculate bottom padding to avoid navbar overlap
  const getBottomPadding = () => {
    const baseTabBarHeight = verticalScale(80);
    const floatingButtonHeight = verticalScale(64);
    const safeAreaBottom = insets.bottom;
    
    return baseTabBarHeight + floatingButtonHeight + safeAreaBottom + verticalScale(30);
  };

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
      case 'small': return moderateScale(16);
      case 'medium': return moderateScale(17);
      case 'large': return moderateScale(18);
      case 'xlarge': return moderateScale(19);
      default: return moderateScale(17);
    }
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
        padding: moderateScale(14),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(10),
      }]}>
        <View style={styles.cartItemContent}>
          {item.image ? (
            <Image 
              source={{ uri: item.image }} 
              style={[styles.cartItemImage, { 
                width: moderateScale(70),
                height: moderateScale(70),
                borderRadius: moderateScale(8),
              }]} 
            />
          ) : (
            <View style={[styles.cartItemImagePlaceholder, {
              width: moderateScale(70),
              height: moderateScale(70),
              borderRadius: moderateScale(8),
            }]}>
              <Ionicons name="fast-food" size={moderateScale(20)} color="#999" />
            </View>
          )}
          
          <View style={[styles.cartItemDetails, { marginLeft: moderateScale(12) }]}>
            <View style={styles.itemHeader}>
              <Text style={[styles.cartItemName, { fontSize: moderateScale(15) }]} numberOfLines={1}>
                {item.name}
              </Text>
              <TouchableOpacity 
                onPress={() => removeItem(item.id)} 
                style={styles.removeButton}
              >
                <Ionicons name="close" size={moderateScale(18)} color="#999" />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.cartItemRestaurant, { fontSize: moderateScale(12) }]} numberOfLines={1}>
              {item.restaurantName}
            </Text>
            
            <Text style={[styles.cartItemDescription, { fontSize: moderateScale(11) }]} numberOfLines={2}>
              {item.description || "Delicious food item"}
            </Text>
            
            <View style={styles.priceContainer}>
              <Text style={[styles.cartItemPrice, { fontSize: moderateScale(14) }]}>
                {formatPriceDisplay(item.price)}
              </Text>
              <Text style={[styles.itemTotal, { fontSize: moderateScale(14) }]}>
                ₹{itemTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.quantityContainer, {
          borderRadius: moderateScale(20),
          padding: moderateScale(2),
        }]}>
          <TouchableOpacity 
            style={[
              styles.quantityButton, 
              { 
                borderRadius: moderateScale(15),
                minWidth: moderateScale(30),
              },
              item.quantity <= 1 && styles.quantityButtonDisabled
            ]}
            onPress={() => decrementItem(item.id)}
            disabled={item.quantity <= 1}
          >
            <Ionicons 
              name="remove" 
              size={moderateScale(16)} 
              color={item.quantity <= 1 ? "#ccc" : "#ff6b35"} 
            />
          </TouchableOpacity>
          
          <View style={[styles.quantityDisplay, { minWidth: moderateScale(35) }]}>
            <Text style={[styles.quantityText, { fontSize: moderateScale(15) }]}>
              {item.quantity}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.quantityButton,
              { 
                borderRadius: moderateScale(15),
                minWidth: moderateScale(30),
              }
            ]}
            onPress={() => incrementItem(item.id)}
          >
            <Ionicons name="add" size={moderateScale(16)} color="#ff6b35" />
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
        case 'small': return moderateScale(70);
        case 'medium': return moderateScale(80);
        case 'large': return moderateScale(90);
        case 'xlarge': return moderateScale(100);
        default: return moderateScale(80);
      }
    };

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.emptyContainer, { paddingBottom: getBottomPadding() }]}>
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
          <Text style={[styles.emptySubtitle, { fontSize: moderateScale(14) }]}>
            Add some delicious food from our restaurants
          </Text>
          <TouchableOpacity 
            style={[styles.shoppingButton, {
              paddingVertical: verticalScale(14),
              paddingHorizontal: moderateScale(24),
              borderRadius: moderateScale(12),
            }]}
            onPress={handleContinueShopping}
          >
            <Ionicons name="restaurant" size={moderateScale(18)} color="#fff" />
            <Text style={[styles.shoppingButtonText, { fontSize: moderateScale(15) }]}>
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
        paddingTop: verticalScale(16),
        paddingBottom: verticalScale(12),
      }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={moderateScale(24)} color="#333" />
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
            size={moderateScale(20)} 
            color={isClearing ? "#ccc" : "#ff4444"} 
          />
        </TouchableOpacity>
      </View>

      {/* Restaurant Info */}
      {cart.length > 0 && (
        <View style={[styles.restaurantHeader, {
          padding: moderateScale(12),
          borderRadius: moderateScale(10),
          marginTop: verticalScale(12),
        }]}>
          <Ionicons name="restaurant" size={moderateScale(16)} color="#666" />
          <Text style={[styles.restaurantName, { fontSize: moderateScale(13) }]} numberOfLines={1}>
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
          { paddingBottom: getBottomPadding() }
        ]}
        style={styles.list}
      />

      {/* Order Summary */}
      <View style={[styles.footer, {
        padding: moderateScale(16),
      }]}>
        <View style={[styles.summaryContainer, { marginBottom: verticalScale(16) }]}>
          <Text style={[styles.summaryTitle, { fontSize: moderateScale(17) }]}>
            Order Summary
          </Text>
          
          <View style={[styles.summaryRow, { marginBottom: verticalScale(6) }]}>
            <Text style={[styles.summaryLabel, { fontSize: moderateScale(13) }]}>
              Subtotal ({totalItems} items)
            </Text>
            <Text style={[styles.summaryValue, { fontSize: moderateScale(13) }]}>
              {formattedSubtotal}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, { marginBottom: verticalScale(6) }]}>
            <Text style={[styles.summaryLabel, { fontSize: moderateScale(13) }]}>
              Delivery Fee
            </Text>
            <Text style={[styles.summaryValue, { fontSize: moderateScale(13) }]}>
              {formattedDeliveryFee}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, { marginBottom: verticalScale(6) }]}>
            <Text style={[styles.summaryLabel, { fontSize: moderateScale(13) }]}>
              Tax (5%)
            </Text>
            <Text style={[styles.summaryValue, { fontSize: moderateScale(13) }]}>
              {formattedTax}
            </Text>
          </View>
          
          <View style={[styles.divider, { marginVertical: verticalScale(10) }]} />
          
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontSize: moderateScale(15) }]}>
              Total Amount
            </Text>
            <Text style={[styles.totalValue, { fontSize: moderateScale(17) }]}>
              {formattedTotal}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.checkoutButton, {
            borderRadius: moderateScale(12),
            paddingVertical: verticalScale(16),
          }]}
          onPress={handleCheckout}
        >
          <View style={styles.checkoutContent}>
            <Text style={[styles.checkoutText, { fontSize: moderateScale(15) }]}>
              Proceed to Checkout
            </Text>
            <View style={styles.checkoutTotal}>
              <Text style={[styles.checkoutTotalText, { fontSize: moderateScale(15) }]}>
                {formattedTotal}
              </Text>
              <Ionicons name="chevron-forward" size={moderateScale(16)} color="#fff" />
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
    paddingHorizontal: moderateScale(16),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: moderateScale(6),
    marginLeft: moderateScale(-6),
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  clearButton: {
    padding: moderateScale(6),
    marginRight: moderateScale(-6),
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8f6',
    marginHorizontal: moderateScale(16),
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
    marginLeft: moderateScale(8),
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: verticalScale(8),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(32),
    backgroundColor: '#f8f9fa',
  },
  emptyIllustration: {
    marginBottom: verticalScale(20),
  },
  emptyTitle: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  emptySubtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: verticalScale(30),
    lineHeight: verticalScale(20),
    paddingHorizontal: moderateScale(20),
  },
  shoppingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b35',
    gap: moderateScale(6),
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
    marginHorizontal: moderateScale(16),
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
    marginBottom: verticalScale(12),
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
    marginBottom: verticalScale(4),
  },
  cartItemName: {
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: moderateScale(8),
  },
  removeButton: {
    padding: moderateScale(2),
    marginTop: moderateScale(-2),
  },
  cartItemRestaurant: {
    color: '#666',
    marginBottom: verticalScale(4),
  },
  cartItemDescription: {
    color: '#999',
    lineHeight: verticalScale(14),
    marginBottom: verticalScale(8),
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
    padding: moderateScale(6),
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
    paddingHorizontal: moderateScale(8),
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
    marginBottom: verticalScale(14),
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
    paddingHorizontal: moderateScale(16),
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkoutTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  checkoutTotalText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CartScreen;