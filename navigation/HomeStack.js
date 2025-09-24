// src/navigation/HomeStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen'; // Adjust path if needed
import RestaurantDetails from '../screens/RestaurantDetails'; // New details screen (see Step 3)
import ProfileScreen from '../screens/ProfileScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ff6b35',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'Home',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="RestaurantDetails" 
        component={RestaurantDetails} 
        options={({ route }) => ({
          title: route.params?.restaurant?.name || 'Restaurant Details',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        })}
      />
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Shopping Cart' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;