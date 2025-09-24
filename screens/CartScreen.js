// src/screens/CartScreen.js
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '@react-navigation/native';


const CartScreen = ({ navigation }) => {
  const { cart, removeItem, updateQuantity, clearCart, totalItems, subtotal, formattedSubtotal } = useCart();

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      {item.image && <Image source={{ uri: item.image }} style={styles.cartItemImage} />}
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemRestaurant}>Restaurant: {item.restaurantName}</Text>
        <Text style={styles.cartItemPrice}>{item.price} x {item.quantity}</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
          <Ionicons name="remove-circle" size={24} color="#ff6b35" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
          <Ionicons name="add-circle" size={24} color="#ff6b35" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
        <Ionicons name="trash" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  const handleCheckout = () => {
    if (totalItems === 0) {
      Alert.alert('Cart Empty', 'Add some items to checkout!');
      return;
    }
    
    // Calculate grand total (subtotal + delivery fee + tax)
    const deliveryFee = 40; // Fixed delivery fee
    const tax = subtotal * 0.05; // 5% tax
    const grandTotal = subtotal + deliveryFee + tax;
    
    // Navigate to checkout confirmation screen
    navigation.navigate('Checkout', {
      cartItems: cart,
      subtotal: subtotal, // This is now a number
      deliveryFee: deliveryFee,
      tax: tax,
      grandTotal: grandTotal
    });
  };

  if (totalItems === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Text style={styles.emptySubtext}>Add items from restaurant menus</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Subtotal: {formattedSubtotal}</Text>
          <Text style={styles.totalItems}>{totalItems} items</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Proceed to Checkout {formattedSubtotal}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContent: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cartItemRestaurant: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '500',
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 8,
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalItems: {
    fontSize: 14,
    color: '#666',
  },
  checkoutButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;