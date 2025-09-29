import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const navigation = useNavigation();
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

  const renderCartItem = ({ item, index }) => (
    <Animated.View 
      style={[
        styles.cartItem,
        {
          opacity: 1,
          transform: [{ translateY: 0 }]
        }
      ]}
    >
      <View style={styles.cartItemContent}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.cartItemImage} />
        ) : (
          <View style={styles.cartItemImagePlaceholder}>
            <Ionicons name="fast-food" size={24} color="#999" />
          </View>
        )}
        
        <View style={styles.cartItemDetails}>
          <View style={styles.itemHeader}>
            <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
            <TouchableOpacity 
              onPress={() => removeItem(item.id)} 
              style={styles.removeButton}
            >
              <Ionicons name="close" size={20} color="#999" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.cartItemRestaurant} numberOfLines={1}>
            {item.restaurantName}
          </Text>
          
          <Text style={styles.cartItemDescription} numberOfLines={2}>
            {item.description || "Delicious food item"}
          </Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.cartItemPrice}>{item.price}</Text>
            <Text style={styles.itemTotal}>
              ₹{(parseInt(item.price.replace('₹', '')) * item.quantity).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => decrementItem(item.id)}
          disabled={item.quantity <= 1}
        >
          <Ionicons 
            name="remove" 
            size={20} 
            color={item.quantity <= 1 ? "#ccc" : "#ff6b35"} 
          />
        </TouchableOpacity>
        
        <View style={styles.quantityDisplay}>
          <Text style={styles.quantityText}>{item.quantity}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => incrementItem(item.id)}
        >
          <Ionicons name="add" size={20} color="#ff6b35" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

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
      // Go back to the current restaurant
      navigation.goBack();
    } else {
      // Go to home screen
      navigation.navigate('Home');
    }
  };

  if (totalItems === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIllustration}>
          <Ionicons name="cart-outline" size={120} color="#e0e0e0" />
        </View>
        <Text style={styles.emptyTitle}>Your cart feels lonely</Text>
        <Text style={styles.emptySubtitle}>
          Add some delicious food from our restaurants
        </Text>
        <TouchableOpacity 
          style={styles.shoppingButton}
          onPress={handleContinueShopping}
        >
          <Ionicons name="restaurant" size={20} color="#fff" />
          <Text style={styles.shoppingButtonText}>Start Ordering</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClearCart}
          disabled={isClearing}
        >
          <Ionicons name="trash-outline" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.restaurantHeader}>
            <Ionicons name="restaurant" size={16} color="#666" />
            <Text style={styles.restaurantName} numberOfLines={1}>
              Ordering from: {cart[0]?.restaurantName || 'Restaurant'}
            </Text>
          </View>
        }
      />

      {/* Order Summary */}
      <View style={styles.footer}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({totalItems} items)</Text>
            <Text style={styles.summaryValue}>{formattedSubtotal}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{formattedDeliveryFee}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (5%)</Text>
            <Text style={styles.summaryValue}>{formattedTax}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{formattedTotal}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <View style={styles.checkoutContent}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            <View style={styles.checkoutTotal}>
              <Text style={styles.checkoutTotalText}>{formattedTotal}</Text>
              <Ionicons name="chevron-forward" size={16} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    padding: 8,
    opacity: 0.8,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  emptyIllustration: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  shoppingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b35',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  shoppingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartItemContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cartItemImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  cartItemRestaurant: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  cartItemDescription: {
    fontSize: 12,
    color: '#999',
    lineHeight: 16,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    padding: 4,
    alignSelf: 'center',
  },
  quantityButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityDisplay: {
    minWidth: 40,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  checkoutButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    paddingVertical: 16,
  },
  checkoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  checkoutTotalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;