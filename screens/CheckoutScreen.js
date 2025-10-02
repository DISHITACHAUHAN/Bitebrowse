// src/screens/CheckoutScreen.js
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const CheckoutScreen = ({ route, navigation }) => {
  const { clearCart } = useCart();
  const { cartItems, subtotal, deliveryFee, tax, grandTotal } = route.params;
  const insets = useSafeAreaInsets();
  
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Calculate top padding for header
  const getTopPadding = () => {
    return insets.top + 8;
  };

  // Calculate bottom padding
  const getBottomPadding = () => {
    return insets.bottom + 20;
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
        paymentMethod === method && styles.paymentOptionSelected
      ]}
      onPress={() => setPaymentMethod(method)}
    >
      <View style={styles.paymentLeft}>
        <View style={[
          styles.paymentIconContainer,
          paymentMethod === method && styles.paymentIconContainerSelected
        ]}>
          <Ionicons 
            name={icon} 
            size={20} 
            color={paymentMethod === method ? '#ff6b35' : '#666'} 
          />
        </View>
        <View style={styles.paymentTextContainer}>
          <Text style={styles.paymentTitle}>{title}</Text>
          <Text style={styles.paymentDescription}>{description}</Text>
        </View>
      </View>
      <View style={[
        styles.radioOuter,
        paymentMethod === method && styles.radioOuterSelected
      ]}>
        {paymentMethod === method && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: getBottomPadding() }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: getTopPadding() }]}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
            <Text style={styles.backButtonText}>Cart</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Pickup Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="storefront" size={20} color="#ff6b35" />
            <Text style={styles.sectionTitle}>Pickup Information</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your full name"
              value={customerName}
              onChangeText={setCustomerName}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Special Instructions (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Any special instructions for your order..."
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt" size={20} color="#ff6b35" />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>
          
          {cartItems.map((item, index) => (
            <View key={item.id} style={[
              styles.orderItem,
              index === cartItems.length - 1 && styles.lastOrderItem
            ]}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                ₹{(parseFloat(item.price?.replace('₹', '') || item.price || 0) * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card" size={20} color="#ff6b35" />
            <Text style={styles.sectionTitle}>Payment Method</Text>
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
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pricetag" size={20} color="#ff6b35" />
            <Text style={styles.sectionTitle}>Price Details</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal ({cartItems.length} items)</Text>
            <Text style={styles.priceValue}>₹{subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Pickup Fee</Text>
            <Text style={styles.priceValue}>₹{deliveryFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax (5%)</Text>
            <Text style={styles.priceValue}>₹{tax.toFixed(2)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={[styles.priceRow, styles.grandTotal]}>
            <Text style={styles.grandTotalLabel}>Total Amount</Text>
            <Text style={styles.grandTotalValue}>₹{grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.infoText}>Ready in 15-20 mins</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="storefront" size={16} color="#666" />
            <Text style={styles.infoText}>Store Pickup</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={16} color="#666" />
            <Text style={styles.infoText}>Secure payment</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Place Order Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity 
          style={[
            styles.placeOrderButton, 
            isPlacingOrder && styles.placeOrderButtonDisabled
          ]}
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder}
        >
          <View style={styles.orderButtonContent}>
            <View>
              <Text style={styles.placeOrderText}>
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </Text>
              <Text style={styles.orderSubtext}>
                {!isPlacingOrder && `₹${grandTotal.toFixed(2)} • Pay with UPI`}
              </Text>
            </View>
            {!isPlacingOrder && (
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            )}
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
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 32,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f8f8f8',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  textArea: {
    minHeight: 80,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  lastOrderItem: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 13,
    color: '#666',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  paymentOptions: {
    marginTop: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  paymentOptionSelected: {
    borderColor: '#ff6b35',
    backgroundColor: '#fff5f2',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentIconContainerSelected: {
    backgroundColor: '#ffeae5',
  },
  paymentTextContainer: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  paymentDescription: {
    fontSize: 13,
    color: '#666',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#ff6b35',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff6b35',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 15,
    color: '#666',
  },
  priceValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  grandTotal: {
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotalValue: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  placeOrderButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 14,
    paddingVertical: 18,
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#ccc',
  },
  orderButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  orderSubtext: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default CheckoutScreen;