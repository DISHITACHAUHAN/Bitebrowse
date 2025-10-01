// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator, 
  StatusBar,
  Platform 
} from "react-native";
import SignupScreen from './screens/SignupScreen'
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CartProvider, useCart } from "./contexts/CartContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import HomeStack from "./navigation/HomeStack";
import AlertsScreen from "./screens/AlertsScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import { DataProvider } from "./contexts/DataContext";
import ProfileScreen from "./screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Simple Color Scheme
const COLORS = {
  primary: '#00a850',
  background: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e6e6e6',
  error: '#dc2626',
  white: '#ffffff',
};

const { width, height } = Dimensions.get('window');

// Responsive scaling
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;

// Device detection
const isTablet = width >= 768;

// Simple Cart Button - FIXED POSITIONING
const FloatingCartButton = () => {
  const { totalItems } = useCart();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  if (totalItems === 0) return null;

  // Calculate safe position above tab bar
  const getButtonPosition = () => {
    const tabBarHeight = isTablet ? 75 : 60;
    const buttonHeight = isTablet ? 64 : 56;
    
    // Position the button well above the tab bar with proper spacing
    const bottomPosition = insets.bottom + tabBarHeight + 20;
    
    return {
      bottom: bottomPosition,
      right: isTablet ? 25 : 20,
    };
  };

  return (
    <TouchableOpacity
      style={[
        styles.floatingButton,
        getButtonPosition()
      ]}
      onPress={() => navigation.navigate("Cart")}
      activeOpacity={0.8}
    >
      <View style={[
        styles.cartButton,
        {
          width: isTablet ? 64 : 56,
          height: isTablet ? 64 : 56,
          borderRadius: isTablet ? 32 : 28,
        }
      ]}>
        <Ionicons name="cart" size={isTablet ? 28 : 24} color="white" />
        {totalItems > 0 && (
          <View style={[
            styles.badge,
            {
              minWidth: isTablet ? 24 : 20,
              height: isTablet ? 24 : 20,
              borderRadius: isTablet ? 12 : 10,
            }
          ]}>
            <Text style={styles.badgeText}>
              {totalItems > 99 ? "99+" : totalItems}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Main Tabs with Safe Area
function MainTabs() {
  const insets = useSafeAreaInsets();
  
  const getTabBarStyle = () => ({
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: (isTablet ? 75 : 60) + insets.bottom,
    paddingBottom: insets.bottom + (isTablet ? 12 : 8),
    paddingTop: isTablet ? 12 : 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
        borderTopWidth: 0,
      },
    }),
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Alerts") {
              iconName = focused ? "notifications" : "notifications-outline";
            } else if (route.name === "Account") {
              iconName = focused ? "person" : "person-outline";
            }
            return (
              <Ionicons 
                name={iconName} 
                size={isTablet ? 26 : 22} 
                color={color} 
              />
            );
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarStyle: getTabBarStyle(),
          tabBarLabelStyle: {
            fontSize: isTablet ? 12 : 10,
            marginBottom: 2,
            fontWeight: '500',
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Alerts" component={AlertsScreen} />
        <Tab.Screen name="Account" component={ProfileScreen} />
      </Tab.Navigator>
      
      {/* Floating cart button */}
      {/* <FloatingCartButton /> */}
    </View>
  );
}

// Rest of the code remains the same...
function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
}

const AppContainer = ({ children }) => {
  return (
    <View style={styles.appContainer}>
      {children}
    </View>
  );
};

// Loading Component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.appLogoText}>BiteNest</Text>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

export default function App() {
  return (
    <AppContainer>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  appLogoText: {
    fontSize: scale(32),
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: verticalScale(20),
  },
  loadingText: {
    marginTop: verticalScale(16),
    fontSize: scale(16),
    color: COLORS.textSecondary,
  },
  floatingButton: {
    position: "absolute",
    zIndex: 1000,
  },
  cartButton: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  badge: {
    position: "absolute",
    backgroundColor: COLORS.error,
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    right: 0,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "bold",
  },
});