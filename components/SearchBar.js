import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AnimatedText = Animated.Text;

const SearchBar = ({ searchQuery, onSearchChange, onClearSearch }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-30)).current;
  const [displayText, setDisplayText] = React.useState("");
  const [cursorVisible, setCursorVisible] = React.useState(true);

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
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
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
    <View style={styles.container}>
      {/* Animated Header with Typing Effect */}
      <Animated.View 
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.textContainer}>
          <AnimatedText style={styles.headerText}>
            {displayText}
            {cursorVisible && displayText.length < 27 ? (
              <Animated.Text style={styles.cursor}>|</Animated.Text>
            ) : null}
          </AnimatedText>
        </View>
        <View style={styles.underline} />
      </Animated.View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants, dishes, or cuisines..."
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={onClearSearch}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
    marginTop: 15,
    marginBottom: 25,
    paddingVertical: 10,
  },
  textContainer: {
    minHeight: 40,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FF6B6B",
    textAlign: "center",
    textShadowColor: "rgba(255, 107, 107, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  cursor: {
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  underline: {
    height: 3,
    width: 140,
    backgroundColor: "#FF6B6B",
    borderRadius: 2,
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: { 
    flex: 1, 
    fontSize: 16,
    color: "#333",
  },
});

export default SearchBar;