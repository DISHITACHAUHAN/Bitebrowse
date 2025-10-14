import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const RestaurantCard = ({ restaurant }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const handlePress = () => {
    navigation.navigate('RestaurantDetails', { restaurant });
  };

  const renderRatingBadge = () => (
    <View style={[styles.ratingBadge, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
      <Ionicons name="star" size={12} color="#FFF" />
      <Text style={styles.ratingText}>{restaurant.rating}</Text>
    </View>
  );

  const renderImage = () => {
    if (restaurant.image && typeof restaurant.image === 'string' && !restaurant.image.startsWith('http')) {
      return (
        <View style={styles.imageContainer}>
          <View style={[styles.emojiContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            <Text style={styles.emojiText}>{restaurant.image}</Text>
          </View>
          {renderRatingBadge()}
        </View>
      );
    }
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' }}
          style={styles.restaurantImage}
          resizeMode="cover"
        />
        {renderRatingBadge()}
      </View>
    );
  };

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={handlePress}>
      {renderImage()}
      
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.restaurantName, { color: colors.text }]} numberOfLines={1}>
            {restaurant.name}
          </Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.rating, { color: colors.text }]}>{restaurant.rating}</Text>
            <Text style={[styles.reviewsCount, { color: colors.textSecondary }]}>
              ({restaurant.reviewsCount})
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 160,
  },
  emojiContainer: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  emojiText: {
    fontSize: 80,
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 2,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewsCount: {
    fontSize: 12,
  },
});

export default RestaurantCard;