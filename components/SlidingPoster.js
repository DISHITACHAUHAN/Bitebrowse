// SlidingPoster.js
import React, { useRef } from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import Carousel from "react-native-snap-carousel";

const { width } = Dimensions.get("window");

const posters = [
  { id: 1, source: require("../assets/Poster1.png") },
  { id: 2, source: require("../assets/icon.png") },
  { id: 3, source: require("../assets/image.png") },
];

export default function SlidingPoster() {
  const carouselRef = useRef(null);

  const renderItem = ({ item, index }) => {
  return (
    <View style={styles.posterContainer} key={index}>
      <Image source={item.source} style={styles.poster} resizeMode="cover" />
    </View>
  );
};


  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={posters}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width * 0.8}
        layout="default"
        loop
        autoplay
        autoplayDelay={1000}
        autoplayInterval={3000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  posterContainer: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  poster: {
    width: "100%",
    height: 200,
  },
});
