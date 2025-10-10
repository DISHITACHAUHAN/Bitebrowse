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
import { useTheme } from '../contexts/ThemeContext'; // Import theme hook

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
  const { colors } = useTheme(); // Get theme colors
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
        backgroundColor: colors.card,
        borderColor: colors.border,
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
              backgroundColor: colors.background,
            }]}>
              <Ionicons name="fast-food" size={20} color={colors.textSecondary} />
            </View>
          )}
          
          <View style={[styles.cartItemDetails, { marginLeft: 12 }]}>
            <View style={styles.itemHeader}>
              <Text style={[styles.cartItemName, { 
                fontSize: getSubtitleSize(),
                color: colors.text 
              }]} numberOfLines={1}>
                {item.name}
              </Text>
              <TouchableOpacity 
                onPress={() => removeItem(item.id)} 
                style={styles.removeButton}
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.cartItemRestaurant, { 
              fontSize: getBodySize(),
              color: colors.textSecondary 
            }]} numberOfLines={1}>
              {item.restaurantName}
            </Text>
            
            <Text style={[styles.cartItemDescription, { 
              fontSize: getBodySize(),
              color: colors.textSecondary 
            }]} numberOfLines={2}>
              {item.description || "Delicious food item"}
            </Text>
            
            <View style={styles.priceContainer}>
              <Text style={[styles.cartItemPrice, { 
                fontSize: getSubtitleSize(),
                color: colors.text 
              }]}>
                {formatPriceDisplay(item.price)}
              </Text>
              <Text style={[styles.itemTotal, { 
                fontSize: getSubtitleSize(),
                color: colors.primary 
              }]}>
                ₹{itemTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.quantityContainer, {
          borderRadius: 20,
          padding: 2,
          backgroundColor: colors.background,
          borderColor: colors.border,
        }]}>
          <TouchableOpacity 
            style={[
              styles.quantityButton, 
              { 
                borderRadius: 15,
                minWidth: 30,
                backgroundColor: colors.card,
              },
              item.quantity <= 1 && styles.quantityButtonDisabled
            ]}
            onPress={() => decrementItem(item.id)}
            disabled={item.quantity <= 1}
          >
            <Ionicons 
              name="remove" 
              size={16} 
              color={item.quantity <= 1 ? colors.textSecondary : colors.primary} 
            />
          </TouchableOpacity>
          
          <View style={[styles.quantityDisplay, { minWidth: 35 }]}>
            <Text style={[styles.quantityText, { 
              fontSize: getBodySize(),
              color: colors.text 
            }]}>
              {item.quantity}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.quantityButton,
              { 
                borderRadius: 15,
                minWidth: 30,
                backgroundColor: colors.card,
              }
            ]}
            onPress={() => incrementItem(item.id)}
          >
            <Ionicons name="add" size={16} color={colors.primary} />
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={[styles.emptyContainer, { 
          paddingTop: getTopPadding() + 20, // Added top padding for empty state
          paddingBottom: getBottomPadding(),
          backgroundColor: colors.background,
        }]}>
          <View style={styles.emptyIllustration}>
            <Ionicons 
              name="cart-outline" 
              size={getEmptyIconSize()} 
              color={colors.textSecondary} 
            />
          </View>
          <Text style={[styles.emptyTitle, { 
            fontSize: getTitleSize(),
            color: colors.text 
          }]}>
            Your cart feels lonely
          </Text>
          <Text style={[styles.emptySubtitle, { 
            fontSize: getBodySize(),
            color: colors.textSecondary 
          }]}>
            Add some delicious food from our restaurants
          </Text>
          <TouchableOpacity 
            style={[styles.shoppingButton, {
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 12,
              backgroundColor: colors.primary,
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar 
        backgroundColor={colors.background} 
        barStyle={colors.isDark ? 'light-content' : 'dark-content'} 
      />
      
      {/* Header */}
      <View style={[styles.header, {
        paddingTop: getTopPadding(), // Dynamic top padding based on safe area
        paddingBottom: 12,
        backgroundColor: colors.card,
        borderBottomColor: colors.border,
      }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { 
          fontSize: getTitleSize(),
          color: colors.text 
        }]}>
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
            color={isClearing ? colors.textSecondary : colors.error} 
          />
        </TouchableOpacity>
      </View>

      {/* Restaurant Info - Fixed for better visibility */}
      {cart.length > 0 && (
        <View style={[styles.restaurantHeader, {
          padding: 12,
          borderRadius: 10,
          marginTop: 12,
          marginHorizontal: 16,
          backgroundColor: colors.isDark ? 'rgba(0, 168, 80, 0.15)' : '#fff8f6',
          borderLeftColor: colors.primary,
        }]}>
          <View style={styles.restaurantHeaderContent}>
            <Ionicons name="restaurant" size={16} color={colors.primary} />
            <Text style={[styles.restaurantLabel, { 
              fontSize: getBodySize(),
              color: colors.textSecondary,
              marginRight: 4,
            }]}>
              Ordering from:
            </Text>
            <Text style={[styles.restaurantName, { 
              fontSize: getBodySize(),
              color: colors.primary,
              fontWeight: '600',
            }]} numberOfLines={1}>
              {cart[0]?.restaurantName || 'Restaurant'}
            </Text>
          </View>
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
            paddingBottom: getBottomPadding(),
            backgroundColor: colors.background,
          }
        ]}
        style={styles.list}
      />

      {/* Order Summary */}
      <View style={[styles.footer, {
        padding: 16,
        backgroundColor: colors.card,
        borderTopColor: colors.border,
      }]}>
        <View style={[styles.summaryContainer, { marginBottom: 16 }]}>
          <Text style={[styles.summaryTitle, { 
            fontSize: getTitleSize(),
            color: colors.text 
          }]}>
            Order Summary
          </Text>
          
          <View style={[styles.summaryRow, { marginBottom: 6 }]}>
            <Text style={[styles.summaryLabel, { 
              fontSize: getBodySize(),
              color: colors.textSecondary 
            }]}>
              Subtotal ({totalItems} items)
            </Text>
            <Text style={[styles.summaryValue, { 
              fontSize: getBodySize(),
              color: colors.text 
            }]}>
              {formattedSubtotal}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, { marginBottom: 6 }]}>
            <Text style={[styles.summaryLabel, { 
              fontSize: getBodySize(),
              color: colors.textSecondary 
            }]}>
              Delivery Fee
            </Text>
            <Text style={[styles.summaryValue, { 
              fontSize: getBodySize(),
              color: colors.text 
            }]}>
              {formattedDeliveryFee}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, { marginBottom: 6 }]}>
            <Text style={[styles.summaryLabel, { 
              fontSize: getBodySize(),
              color: colors.textSecondary 
            }]}>
              Tax (5%)
            </Text>
            <Text style={[styles.summaryValue, { 
              fontSize: getBodySize(),
              color: colors.text 
            }]}>
              {formattedTax}
            </Text>
          </View>
          
          <View style={[styles.divider, { 
            marginVertical: 10,
            backgroundColor: colors.border 
          }]} />
          
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { 
              fontSize: getSubtitleSize(),
              color: colors.text 
            }]}>
              Total Amount
            </Text>
            <Text style={[styles.totalValue, { 
              fontSize: getTitleSize(),
              color: colors.primary 
            }]}>
              {formattedTotal}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.checkoutButton, {
            borderRadius: 12,
            paddingVertical: 16,
            backgroundColor: colors.primary,
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
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
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
    textAlign: 'center',
  },
  clearButton: {
    padding: 6,
    marginRight: -6,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  restaurantHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  restaurantLabel: {
    // Styles handled inline
  },
  restaurantName: {
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
  },
  emptyIllustration: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  shoppingButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
  },
  cartItemContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cartItemImage: {
    // Styles handled inline
  },
  cartItemImagePlaceholder: {
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
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 2,
    marginTop: -2,
  },
  cartItemRestaurant: {
    marginBottom: 4,
  },
  cartItemDescription: {
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
  },
  itemTotal: {
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
  },
  quantityButton: {
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    // Background handled inline
  },
  quantityDisplay: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  quantityText: {
    fontWeight: 'bold',
  },
  footer: {
    borderTopWidth: 1,
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
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    // Color handled inline
  },
  summaryValue: {
    fontWeight: '500',
  },
  divider: {
    height: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalValue: {
    fontWeight: 'bold',
  },
  checkoutButton: {
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