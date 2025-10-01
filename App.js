// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, ActivityIndicator, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CartProvider, useCart } from "./contexts/CartContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import HomeStack from "./navigation/HomeStack";
import AlertsScreen from "./screens/AlertsScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import { DataProvider } from "./contexts/DataContext";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Responsive scaling functions
const { width, height } = Dimensions.get('window');

// Guideline sizes based on standard ~5.5 inch screen
const GUIDELINE_WIDTH = 375;
const GUIDELINE_HEIGHT = 812;

const scale = (size) => (width / GUIDELINE_WIDTH) * size;
const verticalScale = (size) => (height / GUIDELINE_HEIGHT) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Device height classification
const getDeviceHeightType = () => {
  if (height < 600) return 'small';      // Small phones
  if (height < 700) return 'medium';     // Medium phones
  if (height < 800) return 'large';      // Large phones
  return 'xlarge';                       // Extra large phones/tablets
};

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
  const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

  const deviceHeightType = getDeviceHeightType();
  
  const getButtonSize = () => {
    switch (deviceHeightType) {
      case 'small': return moderateScale(56);
      case 'medium': return moderateScale(60);
      case 'large': return moderateScale(64);
      case 'xlarge': return moderateScale(68);
      default: return moderateScale(64);
    }
  };

  const getButtonPosition = () => {
    const buttonSize = getButtonSize();
    const tabBarHeight = verticalScale(70);
    const bottomMargin = Platform.OS === 'ios' ? verticalScale(20) : verticalScale(16);
    const bottomInset = insets.bottom > 0 ? insets.bottom + bottomMargin : tabBarHeight + bottomMargin;
    
    return {
      bottom: bottomInset,
      right: Math.max(verticalScale(20), insets.right + verticalScale(10)),
      size: buttonSize,
    };
  };

  const buttonPosition = getButtonPosition();
  const badgeSize = verticalScale(24);

  return (
    <TouchableOpacity
      style={[
        styles.floatingButton,
        {
          bottom: buttonPosition.bottom,
          right: buttonPosition.right,
          width: buttonPosition.size,
          height: buttonPosition.size,
          borderRadius: buttonPosition.size / 2,
        }
      ]}
      onPress={() => navigation.navigate("Cart")}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#ff6b35', '#ff8e35', '#ffa235']}
        style={[styles.floatingButtonGradient, { borderRadius: buttonPosition.size / 2 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="cart" size={moderateScale(24)} color="white" />
        {totalItems > 0 && (
          <View style={[styles.badge, { 
            minWidth: badgeSize, 
            height: badgeSize, 
            borderRadius: badgeSize / 2,
            top: -verticalScale(2),
            right: -verticalScale(2),
          }]}>
            <Text style={[styles.badgeText, { fontSize: moderateScale(11) }]}>
              {totalItems > 99 ? "99+" : totalItems}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Custom Tab Bar Component
const FloatingTabBar = ({ state, descriptors, navigation, insets }) => {
  const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
  const deviceHeightType = getDeviceHeightType();
  
  const getTabBarHeight = () => {
    switch (deviceHeightType) {
      case 'small': return verticalScale(65);
      case 'medium': return verticalScale(70);
      case 'large': return verticalScale(75);
      case 'xlarge': return verticalScale(80);
      default: return verticalScale(75);
    }
  };

  const getTabBarBottom = () => {
    switch (deviceHeightType) {
      case 'small': return Math.max(verticalScale(15), insets.bottom + verticalScale(8));
      case 'medium': return Math.max(verticalScale(18), insets.bottom + verticalScale(10));
      case 'large': return Math.max(verticalScale(20), insets.bottom + verticalScale(12));
      case 'xlarge': return Math.max(verticalScale(22), insets.bottom + verticalScale(14));
      default: return Math.max(verticalScale(20), insets.bottom + verticalScale(10));
    }
  };

  const tabBarHeight = getTabBarHeight();
  const tabBarBottom = getTabBarBottom();
  const tabWidth = (screenWidth - moderateScale(80)) / state.routes.length;

  return (
    <View style={[styles.tabBarContainer, { 
      bottom: tabBarBottom,
      height: tabBarHeight,
      borderRadius: moderateScale(25),
      left: moderateScale(20),
      right: moderateScale(20),
    }]}>
      <BlurView intensity={90} tint="light" style={styles.blurContainer}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
          style={[styles.tabBarGradient, { borderRadius: moderateScale(25) }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          {/* Background Glow Effect */}
          <View style={[styles.glowEffect, { borderRadius: moderateScale(40) }]} />
          
          <View style={[styles.tabBarContent, { paddingHorizontal: moderateScale(10) }]}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label = options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              };

              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={[
                    styles.tabItem,
                    { width: tabWidth },
                    isFocused && styles.tabItemFocused
                  ]}
                  activeOpacity={0.7}
                >
                  <Animated.View style={[
                    styles.tabIconContainer,
                    { 
                      width: moderateScale(44),
                      height: moderateScale(44),
                      borderRadius: moderateScale(22),
                    },
                    isFocused && styles.tabIconContainerFocused
                  ]}>
                    {options.tabBarIcon({
                      focused: isFocused,
                      color: isFocused ? '#ffffff' : '#64748b',
                      size: moderateScale(24),
                    })}
                  </Animated.View>
                  
                  <Animated.Text style={[
                    styles.tabLabel,
                    { fontSize: moderateScale(12) },
                    isFocused && styles.tabLabelFocused
                  ]}>
                    {label}
                  </Animated.Text>

                  {/* Active Indicator */}
                  {isFocused && (
                    <View style={styles.activeIndicator}>
                      <View style={[styles.activeDot, { 
                        width: moderateScale(4), 
                        height: moderateScale(4),
                        borderRadius: moderateScale(2),
                      }]} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
};

// Enhanced Main Tab Navigator
function MainTabs() {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={(props) => <FloatingTabBar {...props} insets={insets} />}
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
          tabBarActiveTintColor: "#ffffff",
          tabBarInactiveTintColor: "#64748b",
          gestureEnabled: true,
          animation: 'shift',
          tabBarHideOnKeyboard: true,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack}
          options={{
            tabBarLabel: "Home",
          }}
        />
        <Tab.Screen 
          name="Alerts" 
          component={AlertsScreen}
          options={{
            tabBarLabel: "Alerts",
          }}
        />
      </Tab.Navigator>

      <FloatingCartButton />
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
    marginTop: verticalScale(10),
    fontSize: moderateScale(16),
    color: '#64748b',
  },
  // Floating Tab Bar Styles
  tabBarContainer: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: verticalScale(10),
    },
    shadowOpacity: 0.15,
    shadowRadius: verticalScale(20),
    elevation: 15,
    overflow: 'hidden',
    zIndex: 1000,
  },
  blurContainer: {
    flex: 1,
    borderRadius: moderateScale(25),
    overflow: 'hidden',
  },
  tabBarGradient: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  glowEffect: {
    position: 'absolute',
    top: verticalScale(-20),
    left: verticalScale(-20),
    right: verticalScale(-20),
    height: verticalScale(60),
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    filter: 'blur(20px)',
  },
  tabBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(20),
    marginHorizontal: moderateScale(4),
    position: 'relative',
  },
  tabItemFocused: {
    transform: [{ translateY: verticalScale(-5) }],
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(4),
    backgroundColor: 'transparent',
  },
  tabIconContainerFocused: {
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.3,
    shadowRadius: verticalScale(12),
    elevation: 8,
  },
  tabLabel: {
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.3,
  },
  tabLabelFocused: {
    color: '#2563eb',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: verticalScale(8),
    alignItems: 'center',
  },
  activeDot: {
    backgroundColor: '#2563eb',
  },
  // Enhanced Floating Cart Button
  floatingButton: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
    zIndex: 1001,
    shadowColor: "#ff6b35",
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.4,
    shadowRadius: verticalScale(16),
  },
  floatingButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: verticalScale(4),
    elevation: 4,
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
  },
});

// Export scaling functions for use in other components
export { scale, verticalScale, moderateScale, getDeviceHeightType };