// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CartProvider, useCart } from "./contexts/CartContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import HomeStack from "./navigation/HomeStack";
import AlertsScreen from "./screens/AlertsScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import { DataProvider } from "./contexts/DataContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Loading Component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#2563eb" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

// Enhanced Floating Cart Button Component
const FloatingCartButton = () => {
  const { totalItems } = useCart();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { height, width } = Dimensions.get("window");

  const getButtonPosition = () => {
    const tabBarHeight = height * 0.09;
    const bottomMargin = Platform.OS === 'ios' ? 20 : 16;
    const bottomInset = insets.bottom > 0 ? insets.bottom + bottomMargin : tabBarHeight + bottomMargin;
    
    return {
      bottom: bottomInset,
      right: Math.max(20, insets.right + 10),
    };
  };

  const buttonPosition = getButtonPosition();

  return (
    <TouchableOpacity
      style={[
        styles.floatingButton,
        {
          bottom: buttonPosition.bottom,
          right: buttonPosition.right,
        }
      ]}
      onPress={() => navigation.navigate("Cart")}
      activeOpacity={0.8}
    >
      <Ionicons name="cart" size={24} color="white" />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {totalItems > 99 ? "99+" : totalItems}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Enhanced Main Tab Navigator
function MainTabs() {
  const insets = useSafeAreaInsets();
  const { height, width } = Dimensions.get("window");
  const { logout } = useAuth();

  const tabBarHeight = height * 0.09;
  const tabBarLabelSize = width * 0.03;

  const getTabBarStyle = () => {
    const baseStyle = {
      height: tabBarHeight + insets.bottom,
      paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
      paddingTop: 5,
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    };

    if (insets.bottom > 0) {
      baseStyle.paddingBottom = insets.bottom + 5;
    }

    return baseStyle;
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Alerts") {
              iconName = focused ? "notifications" : "notifications-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#2563eb",
          tabBarInactiveTintColor: "#64748b",
          tabBarStyle: getTabBarStyle(),
          tabBarLabelStyle: {
            fontSize: tabBarLabelSize,
            fontWeight: "500",
            marginBottom: Platform.OS === 'ios' ? 0 : 2,
          },
          gestureEnabled: true,
          animation: 'shift',
          tabBarHideOnKeyboard: true,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack}
        />
        <Tab.Screen 
          name="Alerts" 
          component={AlertsScreen}
        />
      </Tab.Navigator>

      {/* <FloatingCartButton /> */}
    </View>
  );
}

// Root Navigator to handle authentication flow
function RootNavigator() {
  const { user, isLoading } = useAuth();

  // Show loading screen while checking authentication state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: true,
        animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        fullScreenGestureEnabled: true,
      }}
    >
      {user ? (
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs}
          options={{
            gestureEnabled: false,
          }}
        />
      ) : (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            gestureEnabled: false,
          }}
        />
      )}
      <Stack.Screen 
        name="Cart" 
        component={CartScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
    <DataProvider>

      <CartProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </CartProvider>
    </DataProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  floatingButton: {
    position: "absolute",
    backgroundColor: "#ff6b35",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});