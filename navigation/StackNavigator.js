import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen'; // Adjust path if needed
import RestaurantMenu from '../screens/RestaurantMenu'; // Adjust path if needed

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ff6b35', // Optional: Custom header color
        },
        headerTintColor: '#fff', // Header text color
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Restaurants' }} 
      />
      <Stack.Screen 
        name="RestaurantMenu" 
        component={RestaurantMenu} 
        options={({ route }) => ({
          title: route.params?.restaurant?.name || 'Menu',
          headerBackTitle: 'Back', // Optional: Customize back button
        })}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;