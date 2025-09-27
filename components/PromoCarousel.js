import React, { useRef, useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  Animated, 
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");

const data = [
  {
    id: "1",
    label: "Limited Offer",
    title: "Summer Sale — 40% OFF",
    description: "On selected workout gear. Use code SUM40. Ends Jul 31.",
    gradient: ["#FF6B6B", "#FF8E53"],
    accent: "#FF4757",
    icon: "🔥",
    textColor: "#1E293B"
  },
  {
    id: "2",
    label: "New",
    title: "Live Workshop — UI Basics",
    description: "Free, Aug 12 • 6 PM. Seats limited — reserve now.",
    gradient: ["#4ECDC4", "#44A08D"],
    accent: "#26DE81",
    icon: "🚀",
    textColor: "#1E293B"
  },
  {
    id: "3",
    label: "Save",
    title: "Buy 2 Get 1 Free",
    description: "On all accessories. Auto applied at checkout.",
    gradient: ["#A8BFFF", "#884DFF"],
    accent: "#9B59B6",
    icon: "💎",
    textColor: "#1E293B"
  },
];

export default function PromoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const autoScrollTimer = useRef(null);

  // Auto-rotation effect
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollTimer.current = setInterval(() => {
        const nextIndex = (activeIndex + 1) % data.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true
        });
        setActiveIndex(nextIndex);
      }, 4000);
    };

    const stopAutoScroll = () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };

    startAutoScroll();
    return () => stopAutoScroll();
  }, [activeIndex]);

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slide !== activeIndex) {
      setActiveIndex(slide);
    }
  };

  const handleManualScroll = (index) => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
    
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
    
    // Restart auto-scroll
    setTimeout(() => {
      autoScrollTimer.current = setInterval(() => {
        const nextIndex = (activeIndex + 1) % data.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        setActiveIndex(nextIndex);
      }, 4000);
    }, 6000);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <LinearGradient
        colors={item.gradient}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ImageBackground
          source={{ uri: "https://www.transparenttextures.com/patterns/diagmonds-light.png" }}
          style={styles.backgroundPattern}
          imageStyle={styles.patternImage}
        >
          <View style={styles.cardContent}>
            <View style={styles.header}>
              <View style={[styles.labelContainer, { backgroundColor: item.accent }]}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <View style={[styles.discountBadge, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
                <Text style={[styles.discountText, { color: item.accent }]}>HOT</Text>
              </View>
            </View>
            
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: item.textColor }]}>{item.title}</Text>
              <Text style={[styles.desc, { color: item.textColor }]}>{item.description}</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.ctaButton, { backgroundColor: item.accent }]}
              activeOpacity={0.8}
            >
              <Text style={styles.ctaText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        renderItem={renderItem}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Simple Dots indicator */}
      <View style={styles.dotsContainer}>
        {data.map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleManualScroll(i)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.dot,
                { 
                  backgroundColor: i === activeIndex ? item.accent : "rgba(0,0,0,0.2)",
                  width: i === activeIndex ? 20 : 8,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Simple Navigation Arrows */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 30,
    position: "relative",
    height: 250,
  },
  card: {
    width: width - 40,
    marginHorizontal: 20,
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientBackground: {
    flex: 1,
  },
  backgroundPattern: {
    flex: 1,
  },
  patternImage: {
    opacity: 0.1,
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
  },
  icon: {
    fontSize: 14,
    marginLeft: 6,
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  discountText: {
    fontSize: 10,
    fontWeight: "700",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 24,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    opacity: 0.9,
  },
  ctaButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 5,
  },
  ctaText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    transition: 'width 0.3s ease',
  },
  arrow: {
    position: "absolute",
    top: "40%",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  arrowLeft: {
    left: 10,
  },
  arrowRight: {
    right: 10,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
  },
});