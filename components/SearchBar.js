import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const AnimatedText = Animated.Text;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const SearchBar = ({ searchQuery, onSearchChange, onClearSearch }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const gradientAnim = React.useRef(new Animated.Value(0)).current;
  const [displayText, setDisplayText] = React.useState("");
  const [cursorVisible, setCursorVisible] = React.useState(true);

  // Gradient animation
  React.useEffect(() => {
    Animated.loop(
      Animated.timing(gradientAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const gradientColors = gradientAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      "rgba(147, 51, 234, 0.9)",
      "rgba(192, 38, 211, 0.9)",
      "rgba(147, 51, 234, 0.9)"
    ]
  });

  React.useEffect(() => {
    const fullText = "Don't wait, order your food!";
    let currentIndex = 0;

    // Blinking cursor animation
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);

    // Typing animation
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => clearInterval(cursorInterval), 1000);
      }
    }, 80);

    // Main animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <LinearGradient
      colors={['#4C1D95', '#7E22CE', '#4C1D95']}
      style={styles.backgroundGradient}
    >
      <View style={styles.container}>
        {/* Animated Header with Purple Gradient Background */}
        <Animated.View 
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <AnimatedLinearGradient
            colors={['#8B5CF6', '#A855F7', '#C084FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <View style={styles.textContainer}>
              <AnimatedText style={styles.headerText}>
                {displayText}
                {cursorVisible && displayText.length < 27 ? (
                  <Animated.Text style={styles.cursor}>|</Animated.Text>
                ) : null}
              </AnimatedText>
            </View>
            
            {/* Animated underline */}
            <Animated.View style={styles.underlineContainer}>
              <LinearGradient
                colors={['#C084FC', '#A855F7', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.underline}
              />
            </Animated.View>
          </AnimatedLinearGradient>
        </Animated.View>

        {/* Enhanced Search Bar */}
        <Animated.View 
          style={[
            styles.searchContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC', '#FFFFFF']}
            style={styles.searchGradient}
          >
            <View style={styles.searchContent}>
              <View style={styles.searchIconContainer}>
                <Ionicons name="search" size={22} color="#8B5CF6" />
              </View>
              
              <TextInput
                style={styles.searchInput}
                placeholder="Search restaurants, dishes, or cuisines..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={onSearchChange}
              />
              
              {searchQuery ? (
                <TouchableOpacity 
                  onPress={onClearSearch}
                  style={styles.clearButton}
                >
                  <LinearGradient
                    colors={['#8B5CF6', '#A855F7']}
                    style={styles.clearButtonGradient}
                  >
                    <Ionicons name="close" size={16} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View style={styles.placeholderIcon}>
                  <Ionicons name="fast-food-outline" size={20} color="#D1D5DB" />
                </View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Decorative elements */}
        <View style={styles.floatingOrb1} />
        <View style={styles.floatingOrb2} />
        <View style={styles.floatingOrb3} />
        
        {/* Additional decorative stars */}
        <View style={styles.star1}>
          <Ionicons name="star" size={16} color="#C084FC" />
        </View>
        <View style={styles.star2}>
          <Ionicons name="star" size={12} color="#A855F7" />
        </View>
        <View style={styles.star3}>
          <Ionicons name="star" size={14} color="#8B5CF6" />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundGradient: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    position: "relative",
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 25,
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 25,
    overflow: "hidden",
    elevation: 15,
    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.4,
    shadowRadius: 25,
  },
  gradientBackground: {
    paddingVertical: 25,
    paddingHorizontal: 30,
    alignItems: "center",
    width: width - 50,
    borderRadius: 25,
  },
  textContainer: {
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    letterSpacing: 1,
    marginBottom: 15,
  },
  cursor: {
    color: "#FFFFFF",
    fontWeight: "bold",
    opacity: 0.8,
  },
  underlineContainer: {
    alignItems: "center",
  },
  underline: {
    height: 4,
    width: 180,
    borderRadius: 2,
  },
  searchContainer: {
    marginHorizontal: 25,
    borderRadius: 25,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    overflow: "hidden",
  },
  searchGradient: {
    borderRadius: 25,
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  searchIconContainer: {
    marginRight: 15,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    padding: 10,
    borderRadius: 12,
  },
  searchInput: { 
    flex: 1, 
    fontSize: 17,
    fontWeight: "500",
    color: "#374151",
    paddingVertical: 4,
  },
  clearButton: {
    marginLeft: 12,
  },
  clearButtonGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  placeholderIcon: {
    marginLeft: 12,
    opacity: 0.5,
  },
  floatingOrb1: {
    position: "absolute",
    top: 80,
    right: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(168, 85, 247, 0.15)",
    zIndex: -1,
  },
  floatingOrb2: {
    position: "absolute",
    bottom: 50,
    left: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(192, 132, 252, 0.2)",
    zIndex: -1,
  },
  floatingOrb3: {
    position: "absolute",
    top: 150,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    zIndex: -1,
  },
  star1: {
    position: "absolute",
    top: 120,
    right: 60,
    transform: [{ rotate: '15deg' }],
  },
  star2: {
    position: "absolute",
    bottom: 100,
    right: 30,
    transform: [{ rotate: '-10deg' }],
  },
  star3: {
    position: "absolute",
    top: 200,
    left: 50,
    transform: [{ rotate: '25deg' }],
  },
});

export default SearchBar;