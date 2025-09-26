// src/contexts/CartContext.js
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native'; // <-- To show warning popup

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return action.payload;
    case 'ADD_ITEM':
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload);
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
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

  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'SET_CART', payload: parsedCart });
        }
      } catch (error) {
        console.error('Failed to load cart from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const saveCart = async () => {
      if (!isLoading) {
        try {
          await AsyncStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
          console.error('Failed to save cart to storage:', error);
        }
      }
    };

    saveCart();
  }, [cart, isLoading]);

  // ---- Custom Logic: Only one restaurant ----
  const addItem = (item) => {
    if (cart.length > 0) {
      const currentRestaurant = cart[0].restaurantId; // Assume each item has restaurantId
      if (item.restaurantId !== currentRestaurant) {
        Alert.alert(
          "Multiple Restaurants Not Allowed",
          "You can only order from one restaurant at a time."
        );
        return; // ❌ Block adding
        // OR 👉 if you prefer clearing cart instead, do:
        // dispatch({ type: 'CLEAR_CART' });
        // dispatch({ type: 'ADD_ITEM', payload: item });
        // return;
      }
    }
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const cartItems = Array.isArray(cart) ? cart : [];
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const subtotal = cartItems.reduce((sum, item) => {
    let priceValue = 0;
    if (typeof item.price === 'string') {
      priceValue = parseFloat(item.price.replace('₹', '')) || 0;
    } else if (typeof item.price === 'number') {
      priceValue = item.price;
    }
    const quantity = item.quantity || 0;
    return sum + (priceValue * quantity);
  }, 0);

  const formattedSubtotal = `₹${subtotal.toFixed(2)}`;

  const value = {
    cart: cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    formattedSubtotal,
    isLoading
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
