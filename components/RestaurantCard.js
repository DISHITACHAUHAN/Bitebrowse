import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Use hook for navigation

const RestaurantCard = ({ restaurant }) => {
  const navigation = useNavigation(); // Gets navigation from context (works in nested stack)

  const handlePress = () => {
    // Updated to match stack screen name
    navigation.navigate('RestaurantDetails', { restaurant });
  };

  // Fallback for emoji images (if image is not a URL)
  const renderImage = () => {
    if (restaurant.image && typeof restaurant.image === 'string' && !restaurant.image.startsWith('http')) {
      return (
        <View style={styles.emojiContainer}>
          <Text style={styles.emojiText}>{restaurant.image}</Text>
        </View>
      );
    }
    return (
      <Image
        source={{ uri: restaurant.image || 'https://example.com/default.jpg' }}
        style={styles.restaurantImage}
        resizeMode="cover"
      />
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {renderImage()}
      <View style={styles.infoContainer}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{restaurant.rating}</Text>
          <Text style={styles.reviewsCount}> • {restaurant.reviewsCount}</Text>
        </View>
        <View style={styles.deliveryInfo}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.deliveryTime}>{restaurant.time}</Text>
          <Text style={styles.distance}> • {restaurant.distance}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{restaurant.price}</Text>
          {restaurant.discount && <Text style={styles.discount}>{restaurant.discount}</Text>}
        </View>
        {restaurant.isPureVeg && <Text style={styles.vegTag}>Pure Veg</Text>}
        {restaurant.noPackagingCharges && <Text style={styles.noChargeTag}>No Delivery Charges</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 160,
  },
  emojiContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 80,
  },
  infoContainer: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  reviewsCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  discount: {
    fontSize: 12,
    color: '#ff6b35',
    fontWeight: '600',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vegTag: {
    fontSize: 12,
    color: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  noChargeTag: {
    fontSize: 12,
    color: '#2196F3',
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
});

export default RestaurantCard;