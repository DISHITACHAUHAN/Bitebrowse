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
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

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
  const { colors } = useTheme();
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
  const scrollY = new Animated.Value(0);
  const deviceHeightType = getDeviceHeightType();

  // Header animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 100],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp',
  });

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
      case 'small': return 18;
      case 'medium': return 20;
      case 'large': return 22;
      case 'xlarge': return 24;
      default: return 20;
    }
  };

  const getSubtitleSize = () => {
    switch (deviceHeightType) {
      case 'small': return 14;
      case 'medium': return 15;
      case 'large': return 16;
      case 'xlarge': return 17;
      default: return 15;
    }
  };

  const getBodySize = () => {
    switch (deviceHeightType) {
      case 'small': return 12;
      case 'medium': return 13;
      case 'large': return 14;
      case 'xlarge': return 15;
      default: return 13;
    }
  };

  // Calculate top padding for header
  const getTopPadding = () => {
    return insets.top + 12;
  };

  // Calculate bottom padding
  const getBottomPadding = () => {
    return insets.bottom + 120;
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
        backgroundColor: colors.card,
        shadowColor: colors.text,
      }]}>
        <LinearGradient
          colors={['transparent', 'rgba(139, 51, 88, 0.03)']}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.cartItemContent}>
          {item.image ? (
            <Image 
              source={{ uri: item.image }} 
              style={styles.cartItemImage}
            />
          ) : (
            <View style={[styles.cartItemImagePlaceholder, {
              backgroundColor: colors.background,
            }]}>
              <Ionicons name="fast-food" size={24} color={colors.textSecondary} />
            </View>
          )}
          
          <View style={styles.cartItemDetails}>
            <View style={styles.itemHeader}>
              <View style={styles.itemTitleContainer}>
                <View style={styles.vegNonVegIndicator}>
                  <View
                    style={[
                      styles.indicator,
                      item.isVeg ? styles.vegIndicator : styles.nonVegIndicator,
                    ]}
                  />
                </View>
                <Text style={[styles.cartItemName, { 
                  color: colors.text 
                }]} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => removeItem(item.id)} 
                style={styles.removeButton}
              >
                <Ionicons name="close-circle" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.cartItemRestaurant, { 
              color: colors.primary 
            }]} numberOfLines={1}>
              {item.restaurantName}
            </Text>
            
            {item.description && (
              <Text style={[styles.cartItemDescription, { 
                color: colors.textSecondary 
              }]} numberOfLines={2}>
                {item.description}
              </Text>
            )}
            
            <View style={styles.priceContainer}>
              <Text style={[styles.cartItemPrice, { 
                color: colors.text 
              }]}>
                {formatPriceDisplay(item.price)}
              </Text>
              <Text style={[styles.itemTotal, { 
                color: colors.primary 
              }]}>
                ₹{itemTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.quantityContainer, {
          backgroundColor: colors.background,
          borderColor: colors.border,
        }]}>
          <TouchableOpacity 
            style={[
              styles.quantityButton, 
              { backgroundColor: colors.card },
              item.quantity <= 1 && styles.quantityButtonDisabled
            ]}
            onPress={() => decrementItem(item.id)}
            disabled={item.quantity <= 1}
          >
            <Ionicons 
              name="remove" 
              size={18} 
              color={item.quantity <= 1 ? colors.textSecondary : colors.primary} 
            />
          </TouchableOpacity>
          
          <View style={styles.quantityDisplay}>
            <Text style={[styles.quantityText, { 
              color: colors.text 
            }]}>
              {item.quantity}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.quantityButton, { backgroundColor: colors.card }]}
            onPress={() => incrementItem(item.id)}
          >
            <Ionicons name="add" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleCheckout = () => {
    if (totalItems === 0) {
      Alert.alert('Cart Empty', 'Add some delicious items to checkout!');
      return;
    }
    
    navigation.navigate('Checkout', {
      cartItems: cart,
      restaurantId: currentRestaurant,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      tax: tax,
      grandTotal: total
    });
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
        case 'small': return 80;
        case 'medium': return 90;
        case 'large': return 100;
        case 'xlarge': return 110;
        default: return 90;
      }
    };

    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={["#8B3358", "#670D2F", "#3A081C"]}
          style={styles.gradientBackground}
        />
        
        <View style={[styles.emptyContainer, { 
          paddingTop: getTopPadding() + 40,
          paddingBottom: getBottomPadding(),
        }]}>
          <View style={styles.emptyIllustration}>
            <LinearGradient
              colors={['rgba(139, 51, 88, 0.1)', 'rgba(103, 13, 47, 0.05)']}
              style={styles.emptyIconBackground}
            />
            <Ionicons 
              name="cart-outline" 
              size={getEmptyIconSize()} 
              color={colors.primary} 
            />
          </View>
          <Text style={[styles.emptyTitle, { 
            color: colors.text 
          }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptySubtitle, { 
            color: colors.textSecondary 
          }]}>
            Explore our delicious menu and add some items to get started
          </Text>
          <TouchableOpacity 
            style={styles.shoppingButton}
            onPress={handleContinueShopping}
          >
            <LinearGradient
              colors={["#8B3358", "#670D2F"]}
              style={styles.shoppingButtonGradient}
            >
              <Ionicons name="restaurant" size={20} color="#fff" />
              <Text style={styles.shoppingButtonText}>
                Browse Restaurants
              </Text>
            </LinearGradient>
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
      
      {/* Animated Header Background */}
      <Animated.View style={[styles.headerBackground, {
        opacity: headerOpacity,
        backgroundColor: colors.card,
      }]} />

      {/* Header */}
      <View style={[styles.header, {
        paddingTop: getTopPadding(),
        backgroundColor: 'transparent',
      }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <LinearGradient
            colors={["rgba(139, 51, 88, 0.2)", "rgba(103, 13, 47, 0.1)"]}
            style={styles.backButtonGradient}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </LinearGradient>
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { 
          color: colors.text 
        }]}>
          My Cart ({totalItems})
        </Text>
        
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClearCart}
          disabled={isClearing}
        >
          <LinearGradient
            colors={isClearing ? 
              ["rgba(211, 47, 47, 0.3)", "rgba(198, 40, 40, 0.2)"] : 
              ["rgba(211, 47, 47, 0.8)", "rgba(198, 40, 40, 0.6)"]
            }
            style={styles.clearButtonGradient}
          >
            <Ionicons 
              name="trash-outline" 
              size={18} 
              color={isClearing ? colors.textSecondary : "#fff"} 
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Restaurant Info */}
    

      {/* Cart Items */}
      <Animated.FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.listContent,
          { 
            paddingBottom: getBottomPadding(),
          }
        ]}
        style={styles.list}
      />

      {/* Order Summary */}
      <View style={[styles.footer, {
        backgroundColor: colors.card,
        borderTopColor: colors.border,
      }]}>
        <LinearGradient
          colors={['rgba(139, 51, 88, 0.02)', 'rgba(103, 13, 47, 0.01)']}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.summaryContainer}>
          <Text style={[styles.summaryTitle, { 
            color: colors.text 
          }]}>
            Order Summary
          </Text>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { 
              color: colors.textSecondary 
            }]}>
              Subtotal ({totalItems} items)
            </Text>
            <Text style={[styles.summaryValue, { 
              color: colors.text 
            }]}>
              {formattedSubtotal}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { 
              color: colors.textSecondary 
            }]}>
              Delivery Fee
            </Text>
            <Text style={[styles.summaryValue, { 
              color: colors.text 
            }]}>
              {formattedDeliveryFee}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { 
              color: colors.textSecondary 
            }]}>
              Tax (5%)
            </Text>
            <Text style={[styles.summaryValue, { 
              color: colors.text 
            }]}>
              {formattedTax}
            </Text>
          </View>
          
          <View style={[styles.divider, { 
            backgroundColor: colors.border 
          }]} />
          
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { 
              color: colors.text 
            }]}>
              Total Amount
            </Text>
            <Text style={[styles.totalValue, { 
              color: colors.primary 
            }]}>
              {formattedTotal}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <LinearGradient
            colors={["#8B3358", "#670D2F"]}
            style={styles.checkoutGradient}
          >
            <View style={styles.checkoutContent}>
              <Text style={styles.checkoutText}>
                Proceed to Checkout
              </Text>
              <View style={styles.checkoutTotal}>
                <Text style={styles.checkoutTotalText}>
                  {formattedTotal}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#fff" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    opacity: 0.1,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 999,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    zIndex: 1000,
  },
  backButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  backButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  clearButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  clearButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantHeader: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  restaurantHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  restaurantLabel: {
    marginLeft: 8,
    marginRight: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  restaurantName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIllustration: {
    marginBottom: 30,
    position: 'relative',
  },
  emptyIconBackground: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    top: -20,
    left: -20,
  },
  emptyTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 22,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    fontSize: 15,
    paddingHorizontal: 10,
  },
  shoppingButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  shoppingButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 16,
    gap: 8,
  },
  shoppingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cartItem: {
    marginHorizontal: 10,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  cartItemContent: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  cartItemImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  itemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  vegNonVegIndicator: {
    marginRight: 8,
  },
  indicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
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
  cartItemName: {
    fontWeight: '600',
    flex: 1,
    fontSize: 16,
  },
  removeButton: {
    padding: 4,
    marginTop: -4,
  },
  cartItemRestaurant: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  cartItemDescription: {
    lineHeight: 16,
    marginBottom: 10,
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemPrice: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  itemTotal: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 25,
    borderWidth: 1,
    padding: 4,
  },
  quantityButton: {
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
    minWidth: 36,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityDisplay: {
    alignItems: 'center',
    paddingHorizontal: 12,
    minWidth: 40,
  },
  quantityText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    borderTopWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden',
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    fontSize: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontWeight: '500',
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  checkoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkoutGradient: {
    paddingVertical: 18,
    borderRadius: 16,
  },
  checkoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkoutTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkoutTotalText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CartScreen;