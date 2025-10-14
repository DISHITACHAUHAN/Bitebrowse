import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const CheckoutScreen = ({ route, navigation }) => {
  const { clearCart } = useCart();
  const { cartItems, subtotal, deliveryFee, tax, grandTotal } = route.params;
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Animation values
  const scrollY = new Animated.Value(0);
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 100],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp',
  });

  // Calculate top padding for header
  const getTopPadding = () => {
    return insets.top + 12;
  };

  // Calculate bottom padding
  const getBottomPadding = () => {
    return insets.bottom + 120;
  };

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      Alert.alert('Name Required', 'Please enter your name to continue.');
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Phone Number Required', 'Please enter your phone number to continue.');
      return;
    }

    setIsPlacingOrder(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsPlacingOrder(false);
      clearCart();
      Alert.alert(
        'Order Successful! 🎉',
        `Your order of ₹${grandTotal.toFixed(2)} has been placed successfully.\n\nReady for pickup in: 15-20 minutes`,
        [
          {
            text: 'Track Order',
            onPress: () => navigation.navigate('OrderTracking')
          },
          {
            text: 'Back to Home',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    }, 2000);
  };

  const PaymentMethodOption = ({ method, icon, title, description }) => (
    <TouchableOpacity 
      style={[
        styles.paymentOption, 
        paymentMethod === method && styles.paymentOptionSelected,
        { 
          backgroundColor: colors.card,
          borderColor: paymentMethod === method ? colors.primary : colors.border,
        }
      ]}
      onPress={() => setPaymentMethod(method)}
    >
      <LinearGradient
        colors={paymentMethod === method ? 
          ['rgba(139, 51, 88, 0.1)', 'rgba(103, 13, 47, 0.05)'] : 
          ['transparent', 'transparent']
        }
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.paymentLeft}>
        <View style={[
          styles.paymentIconContainer,
          paymentMethod === method && styles.paymentIconContainerSelected,
          { 
            backgroundColor: paymentMethod === method ? 
              colors.primary : colors.background 
          }
        ]}>
          <Ionicons 
            name={icon} 
            size={20} 
            color={paymentMethod === method ? '#fff' : colors.textSecondary} 
          />
        </View>
        <View style={styles.paymentTextContainer}>
          <Text style={[styles.paymentTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.paymentDescription, { color: colors.textSecondary }]}>{description}</Text>
        </View>
      </View>
      <View style={[
        styles.radioOuter,
        paymentMethod === method && styles.radioOuterSelected,
        { borderColor: paymentMethod === method ? colors.primary : colors.border }
      ]}>
        {paymentMethod === method && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
      </View>
    </TouchableOpacity>
  );

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
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <LinearGradient
            colors={["rgba(139, 51, 88, 0.2)", "rgba(103, 13, 47, 0.1)"]}
            style={styles.backButtonGradient}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </LinearGradient>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Checkout</Text>
        <View style={styles.headerRight} />
      </View>

      <Animated.ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: getBottomPadding() }}
      >
        {/* Pickup Information */}
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <LinearGradient
            colors={['transparent', 'rgba(139, 51, 88, 0.03)']}
            style={StyleSheet.absoluteFill}
          />
          
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: 'rgba(139, 51, 88, 0.1)' }]}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Pickup Information</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name *</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text,
              }]}
              placeholder="Enter your full name"
              value={customerName}
              onChangeText={setCustomerName}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Phone Number *</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text,
              }]}
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Special Instructions (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea, { 
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text,
              }]}
              placeholder="Any special instructions for your order..."
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        {/* Order Summary */}
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <LinearGradient
            colors={['transparent', 'rgba(139, 51, 88, 0.03)']}
            style={StyleSheet.absoluteFill}
          />
          
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: 'rgba(139, 51, 88, 0.1)' }]}>
              <Ionicons name="receipt" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Summary</Text>
          </View>
          
          {cartItems.map((item, index) => (
            <View key={item.id} style={[
              styles.orderItem,
              index === cartItems.length - 1 && styles.lastOrderItem,
              { borderBottomColor: colors.border }
            ]}>
              <View style={styles.itemLeft}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                  <View style={styles.vegNonVegIndicator}>
                    <View
                      style={[
                        styles.indicator,
                        item.isVeg ? styles.vegIndicator : styles.nonVegIndicator,
                      ]}
                    />
                  </View>
                </View>
                <Text style={[styles.itemQuantity, { color: colors.textSecondary }]}>Qty: {item.quantity}</Text>
              </View>
              <Text style={[styles.itemPrice, { color: colors.primary }]}>
                ₹{(parseFloat(item.price?.replace('₹', '') || item.price || 0) * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <LinearGradient
            colors={['transparent', 'rgba(139, 51, 88, 0.03)']}
            style={StyleSheet.absoluteFill}
          />
          
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: 'rgba(139, 51, 88, 0.1)' }]}>
              <Ionicons name="card" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>
          </View>
          
          <View style={styles.paymentOptions}>
            <PaymentMethodOption
              method="upi"
              icon="phone-portrait"
              title="UPI Payment"
              description="Fast and secure UPI payment"
            />
            
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <LinearGradient
            colors={['transparent', 'rgba(139, 51, 88, 0.03)']}
            style={StyleSheet.absoluteFill}
          />
          
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: 'rgba(139, 51, 88, 0.1)' }]}>
              <Ionicons name="pricetag" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Price Details</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
              Subtotal ({cartItems.length} items)
            </Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>
              ₹{subtotal.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
              Pickup Fee
            </Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>
              ₹{deliveryFee.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
              Tax (5%)
            </Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>
              ₹{tax.toFixed(2)}
            </Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={[styles.priceRow, styles.grandTotal]}>
            <Text style={[styles.grandTotalLabel, { color: colors.text }]}>
              Total Amount
            </Text>
            <Text style={[styles.grandTotalValue, { color: colors.primary }]}>
              ₹{grandTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Additional Info */}
        <View style={[styles.infoSection, { 
          backgroundColor: colors.card,
        }]}>
          <LinearGradient
            colors={['rgba(139, 51, 88, 0.05)', 'rgba(103, 13, 47, 0.02)']}
            style={StyleSheet.absoluteFill}
          />
          
          <View style={styles.infoItem}>
            <View style={[styles.infoIconContainer, { backgroundColor: 'rgba(139, 51, 88, 0.1)' }]}>
              <Ionicons name="time" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.infoText, { color: colors.text }]}>Ready in 15-20 mins</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={[styles.infoIconContainer, { backgroundColor: 'rgba(139, 51, 88, 0.1)' }]}>
              <Ionicons name="storefront" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.infoText, { color: colors.text }]}>Store Pickup</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={[styles.infoIconContainer, { backgroundColor: 'rgba(139, 51, 88, 0.1)' }]}>
              <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.infoText, { color: colors.text }]}>Secure payment</Text>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Fixed Place Order Button */}
      <View style={[styles.footer, { 
        backgroundColor: colors.card,
        borderTopColor: colors.border,
        paddingBottom: insets.bottom + 10,
      }]}>
        <LinearGradient
          colors={['rgba(139, 51, 88, 0.02)', 'rgba(103, 13, 47, 0.01)']}
          style={StyleSheet.absoluteFill}
        />
        
        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder}
        >
          <LinearGradient
            colors={isPlacingOrder ? 
              ["rgba(139, 51, 88, 0.6)", "rgba(103, 13, 47, 0.4)"] : 
              ["#8B3358", "#670D2F"]
            }
            style={styles.placeOrderGradient}
          >
            <View style={styles.orderButtonContent}>
              <View>
                <Text style={styles.placeOrderText}>
                  {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                </Text>
                <Text style={styles.orderSubtext}>
                  {!isPlacingOrder && `₹${grandTotal.toFixed(2)} • Pay with ${paymentMethod.toUpperCase()}`}
                </Text>
              </View>
              {!isPlacingOrder && (
                <View style={styles.arrowContainer}>
                  <Ionicons name="chevron-forward" size={20} color="#fff" />
                </View>
              )}
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
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  section: {
    margin: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  textArea: {
    minHeight: 100,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  lastOrderItem: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  vegNonVegIndicator: {
    // Position handled inline
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
  itemQuantity: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentOptions: {
    marginTop: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  paymentOptionSelected: {
    // Styles handled inline
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  paymentIconContainerSelected: {
    // Styles handled inline
  },
  paymentTextContainer: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    // Styles handled inline
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  priceLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  grandTotal: {
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
    overflow: 'hidden',
  },
  placeOrderButton: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  placeOrderGradient: {
    paddingVertical: 20,
    borderRadius: 18,
  },
  orderButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderSubtext: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  arrowContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckoutScreen;