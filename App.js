// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { CartProvider, useCart } from "./contexts/CartContext";
import HomeStack from "./navigation/HomeStack";
import ExploreScreen from "./screens/ExploreScreen";
import AlertsScreen from "./screens/AlertsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CartStack from "./navigation/CartStack"; // Import the CartStack

const Tab = createBottomTabNavigator();

// Floating Cart Button Component
const FloatingCartButton = () => {
  const { totalItems } = useCart();
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.floatingButton}
      onPress={() => navigation.navigate('Cart')} // This should navigate to your Cart stack
    >
      <Ionicons name="cart" size={24} color="white" />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems > 99 ? '99+' : totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === "Home") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Explore") iconName = focused ? "search" : "search-outline";
          else if (route.name === "Alerts") iconName = focused ? "notifications" : "notifications-outline";
          else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";
          else if (route.name === "CartStack") iconName = focused ? "cart" : "cart-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: { 
          height: 70, 
          paddingBottom: 10, 
          paddingTop: 5 
        },
        tabBarLabelStyle: { 
          fontSize: 12, 
          fontWeight: "500" 
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {/* Remove the Cart tab if you're using floating button */}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <MyTabs />
        {/* Add floating cart button */}
        <FloatingCartButton />
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#ff6b35',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 1000,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});