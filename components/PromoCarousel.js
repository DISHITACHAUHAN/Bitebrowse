import React, { useRef, useState, useEffect } from "react";
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  TouchableOpacity,
  Image
} from "react-native";
import { useTheme } from "../contexts/ThemeContext"; // Import theme hook
import one from '../assets/1.png';
import two from '../assets/2.png'; // Add your other local images
import three from '../assets/3.png';
import four from '../assets/4.png';

const { width } = Dimensions.get("window");

const data = [
  {
    id: "1",
    image: one
  },
  {
    id: "2",
    image: two
  },
  {
    id: "3",
    image: three
  },
  {
    id: "4",
    image: four
  },
];

export default function ImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();
  const autoScrollTimer = useRef(null);
  const { colors } = useTheme(); // Get theme colors

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
      <Image
        source={item.image}
        style={styles.image}
        resizeMode="cover"
      />
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

      <View style={styles.dotsContainer}>
        {data.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleManualScroll(i)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.dot,
                { 
                  backgroundColor: i === activeIndex ? colors.primary : colors.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                  width: i === activeIndex ? 20 : 8,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 30,
    height: 250,
  },
  card: {
    width: width - 40,
    marginHorizontal: 20,
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    // Add shadow that works in both themes
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
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
    transition: 'all 0.3s ease', // Smooth transition for dot width changes
  },
});