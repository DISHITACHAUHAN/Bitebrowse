// src/contexts/CartContext.js
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const CartContext = createContext();

// Cart storage key
const CART_STORAGE_KEY = 'foodDelivery_cart';

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return Array.isArray(action.payload) ? action.payload : [];
    
    case 'ADD_ITEM':
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      }
      return [...state, { 
        ...action.payload, 
        quantity: action.payload.quantity || 1 
      }];
    
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload);
    
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
    
    case 'INCREMENT_ITEM':
      return state.map(item =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    
    case 'DECREMENT_ITEM':
      return state.map(item =>
        item.id === action.payload
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      ).filter(item => item.quantity > 0);
    
    case 'CLEAR_CART':
      return [];
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);

  // Load cart from storage
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'SET_CART', payload: parsedCart });
          
          // Set current restaurant from loaded cart
          if (parsedCart.length > 0) {
            setCurrentRestaurant(parsedCart[0].restaurantId);
          }
        }
      } catch (error) {
        console.error('Failed to load cart from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to storage
  useEffect(() => {
    const saveCart = async () => {
      if (!isLoading) {
        try {
          await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
          console.error('Failed to save cart to storage:', error);
        }
      }
    };

    saveCart();
  }, [cart, isLoading]);

  // Enhanced add item with restaurant validation
  const addItem = (item, options = {}) => {
    const { showAlert = true, quantity = 1 } = options;

    // Validate item structure
    if (!item.id || !item.restaurantId) {
      console.warn('Cart item missing required fields:', item);
      return false;
    }

    // Check if adding from different restaurant
    if (cart.length > 0 && item.restaurantId !== currentRestaurant) {
      if (showAlert) {
        Alert.alert(
          "Start New Order?",
          "Your cart contains items from another restaurant. Would you like to clear the cart and start a new order?",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Clear & Add", 
              style: "destructive",
              onPress: () => {
                clearCart();
                dispatch({ 
                  type: 'ADD_ITEM', 
                  payload: { ...item, quantity } 
                });
                setCurrentRestaurant(item.restaurantId);
              }
            }
          ]
        );
      }
      return false;
    }

    // First item from a restaurant
    if (cart.length === 0) {
      setCurrentRestaurant(item.restaurantId);
    }

    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { ...item, quantity } 
    });
    return true;
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    
    // Update current restaurant if cart becomes empty
    if (cart.length <= 1) {
      setCurrentRestaurant(null);
    }
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const incrementItem = (id) => {
    dispatch({ type: 'INCREMENT_ITEM', payload: id });
  };

  const decrementItem = (id) => {
    dispatch({ type: 'DECREMENT_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    setCurrentRestaurant(null);
  };

  const getItemQuantity = (id) => {
    const item = cart.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  const isItemInCart = (id) => {
    return cart.some(item => item.id === id);
  };

  // Calculations
  const cartItems = Array.isArray(cart) ? cart : [];
  
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const subtotal = cartItems.reduce((sum, item) => {
    const priceValue = parsePrice(item.price);
    const quantity = item.quantity || 0;
    return sum + (priceValue * quantity);
  }, 0);

  const deliveryFee = subtotal > 0 ? 40 : 0; // ₹40 delivery fee
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax;

  const formattedSubtotal = `₹${subtotal.toFixed(2)}`;
  const formattedTotal = `₹${total.toFixed(2)}`;
  const formattedDeliveryFee = `₹${deliveryFee.toFixed(2)}`;
  const formattedTax = `₹${tax.toFixed(2)}`;

  // Helper function to parse price
  const parsePrice = (price) => {
    if (typeof price === 'string') {
      return parseFloat(price.replace(/[₹,]/g, '')) || 0;
    } else if (typeof price === 'number') {
      return price;
    }
    return 0;
  };

  const value = {
    // State
    cart: cartItems,
    isLoading,
    currentRestaurant,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    incrementItem,
    decrementItem,
    clearCart,
    getItemQuantity,
    isItemInCart,
    
    // Calculations
    totalItems,
    subtotal,
    deliveryFee,
    tax,
    total,
    formattedSubtotal,
    formattedTotal,
    formattedDeliveryFee,
    formattedTax,
    
    // Helper
    parsePrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};