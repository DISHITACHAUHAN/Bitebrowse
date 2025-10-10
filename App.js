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
  Platform,
  Image 
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
import vit from './assets/Vittles_2.jpg';
import VendorDashboard from "./screens/VendorDashboard";
import ProfileStack from "./navigation/ProfileStack";
import VendorMenu from "./screens/VendorMenu";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext"; // Import theme

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
  const { colors } = useTheme(); // Use theme colors

  if (totalItems === 0) return null;

  const getButtonPosition = () => {
    const tabBarHeight = isTablet ? 75 : 60;
    const buttonHeight = isTablet ? 64 : 56;
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
          backgroundColor: colors.primary,
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
              backgroundColor: colors.error,
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
  const { colors } = useTheme(); // Use theme colors
  
  const getTabBarStyle = () => ({
    backgroundColor: colors.tabBar,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        backgroundColor={colors.background} 
        barStyle={colors.isDark ? 'light-content' : 'dark-content'} 
      />
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
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
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
        <Tab.Screen name="Account" component={ProfileStack} />
        <Tab.Screen name="menu" component={VendorMenu} />
        <Tab.Screen name="vendor" component={VendorDashboard}/>
      </Tab.Navigator>
    </View>
  );
}

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme(); // Use theme colors

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: colors.background }
      }}
    >
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
  const { colors } = useTheme(); // Use theme colors
  
  return (
    <View style={[styles.appContainer, { backgroundColor: colors.background }]}>
      {children}
    </View>
  );
};

// Loading Component with full screen vit image
const LoadingScreen = () => {
  const { colors } = useTheme(); // Use theme colors
  
  return (
    <View style={[styles.fullScreenContainer, { backgroundColor: colors.background }]}>
      <Image 
        source={vit} 
        style={styles.fullScreenImage}
        resizeMode="cover"
      />
    </View>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Update styles to use theme where needed
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  fullScreenContainer: {
    flex: 1,
    position: 'relative',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: verticalScale(16),
    fontSize: scale(16),
    fontWeight: '500',
  },
  floatingButton: {
    position: "absolute",
    zIndex: 1000,
  },
  cartButton: {
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
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    right: 0,
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: "bold",
  },
});